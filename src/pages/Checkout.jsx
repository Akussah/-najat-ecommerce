import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';

const PENDING_KEY = 'bead_bag_pending_order';
const stripePromise = loadStripe('pk_test_51TAcygQcD5q7BU9jzWBNDRFksiGpg9ceybUdJMlSzhLYRYB3TPzs3iuclXTAoKLI0jYYhYoLOIwBYpg35j2ORZuA000vEsBOWp');

const StripeCheckoutForm = ({ total, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/checkout?payment=success'
      },
      redirect: 'if_required'
    });

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess();
    }
  };

  return (
    <form className="checkout-stripe-form" onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="error-msg">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Processing...' : `Finalize order - $${total}`}
      </button>
    </form>
  );
};

const Checkout = ({ currentUser, isAuthLoading }) => {
  const location = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    stateRegion: '',
    zipCode: '',
    country: 'United States',
    shippingProvider: 'FedEx',
    shippingScope: 'state-to-state',
    preferredChannel: ''
  });
  const [emailOffers, setEmailOffers] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [billingSame, setBillingSame] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');

  const total = useMemo(() => Math.round(cartTotal * 100) / 100, [cartTotal]);
  const checkoutDetails = useMemo(
    () => ({
      ...formData,
      fullName: formData.fullName || currentUser?.name || '',
      email: formData.email || currentUser?.email || ''
    }),
    [formData, currentUser]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!checkoutDetails.fullName || !checkoutDetails.email || !checkoutDetails.address || !checkoutDetails.city || !checkoutDetails.country) {
      return 'Please fill in your name, email, street address, city, and country.';
    }

    return '';
  };

  const getFullAddress = () => `${checkoutDetails.address}, ${checkoutDetails.city}, ${checkoutDetails.stateRegion} ${checkoutDetails.zipCode}, ${checkoutDetails.country} | Courier: ${checkoutDetails.shippingProvider} (${checkoutDetails.shippingScope})`;

  const savePendingOrder = (fullAddress, paymentMethod) => {
    const payload = {
      items: cartItems,
      total,
      address: fullAddress,
      paymentMethod,
      email: checkoutDetails.email,
      fullName: checkoutDetails.fullName
    };
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  };

  const createOrder = async (payload) => {
    await apiFetch('/api/orders', {
      method: 'POST',
      auth: true,
      body: {
        items: payload.items,
        total: payload.total,
        address: payload.address,
        paymentMethod: payload.paymentMethod || 'stripe'
      }
    });
  };

  const finalizePaidOrder = async (pending) => {
    if (!pending) return;
    await createOrder(pending);
    setIsPaid(true);
    clearCart();
    sessionStorage.removeItem(PENDING_KEY);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsProcessing(true);

    const fullAddress = getFullAddress();

    try {
      savePendingOrder(fullAddress, 'stripe');

      const data = await apiFetch('/api/payments/create-payment-intent', {
        method: 'POST',
        body: {
          items: cartItems,
          fullName: checkoutDetails.fullName,
          email: checkoutDetails.email,
          address: fullAddress
        }
      });
      setClientSecret(data.clientSecret);
      setIsProcessing(false);
    } catch (err) {
      setError(err.message || 'Unable to start payment.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    const pendingRaw = sessionStorage.getItem(PENDING_KEY);
    const pending = pendingRaw ? JSON.parse(pendingRaw) : null;
    try {
      if (pending) {
        await createOrder(pending);
      }
      setIsPaid(true);
      clearCart();
      sessionStorage.removeItem(PENDING_KEY);
    } catch (err) {
      setError('Payment succeeded, but we could not save the order details. Please contact support.');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const payment = params.get('payment');
    const gateway = params.get('gateway');
    const paymentIntentClientSecret = params.get('payment_intent_client_secret');

    const pendingRaw = sessionStorage.getItem(PENDING_KEY);
    const pending = pendingRaw ? JSON.parse(pendingRaw) : null;

    const verifyStripe = async () => {
      if (!paymentIntentClientSecret || !pending) return;
      setVerifyMessage('Verifying payment...');

      const stripe = await stripePromise;
      const { paymentIntent, error: stripeError } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);

      if (stripeError) {
        setVerifyMessage(stripeError.message);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await finalizePaidOrder(pending);
        setVerifyMessage('');
      } else {
        setVerifyMessage('Payment not completed yet.');
      }
    };

    const verifyPaystack = async () => {
      const reference = params.get('reference');
      if (!reference || !pending) return;
      setVerifyMessage('Verifying Paystack payment...');
      const data = await apiFetch(`/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`);
      if (data.session?.paymentStatus === 'paid') {
        await finalizePaidOrder(pending);
        setVerifyMessage('');
      } else {
        setVerifyMessage('Payment not completed yet.');
      }
    };

    const verifyFlutterwave = async () => {
      const transactionId = params.get('transaction_id');
      const txRef = params.get('tx_ref');
      if (!transactionId || !txRef || !pending) return;
      setVerifyMessage('Verifying Flutterwave payment...');
      const query = `transaction_id=${encodeURIComponent(transactionId)}&tx_ref=${encodeURIComponent(txRef)}`;
      const data = await apiFetch(`/api/payments/flutterwave/verify?${query}`);
      if (data.session?.paymentStatus === 'paid') {
        await finalizePaidOrder(pending);
        setVerifyMessage('');
      } else {
        setVerifyMessage('Payment not completed yet.');
      }
    };

    if (gateway === 'paystack') {
      verifyPaystack().catch((err) => setError(err.message || 'Paystack verification failed.'));
      return;
    }

    if (gateway === 'flutterwave') {
      verifyFlutterwave().catch((err) => setError(err.message || 'Flutterwave verification failed.'));
      return;
    }

    if (payment === 'success' && paymentIntentClientSecret) {
      verifyStripe().catch((err) => setError(err.message || 'Payment verification failed.'));
    }
  }, [location.search, clearCart]);

  if (isAuthLoading) {
    return (
      <main className="page">
        <section className="section">
          <div className="container narrow">
            <p className="muted-text">Checking account...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!currentUser && !isPaid) {
    return (
      <main className="page">
        <section className="section">
          <div className="container narrow">
            <h1 className="section-title">Checkout</h1>
            <div className="empty-box">
              <p>You need an account before payment.</p>
              <div className="stack-actions">
                <Link to="/signin" className="btn btn-primary">Sign In</Link>
                <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0 && !isPaid) {
    return (
      <main className="page">
        <section className="section">
          <div className="container narrow">
            <h1 className="section-title">Checkout</h1>
            <div className="empty-box">
              <p>No goods in cart yet.</p>
              <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-shell">
        <div className="checkout-layout">
          <div className="checkout-main-card">
            <div className="checkout-brand-row">
              <div>
                <p className="eyebrow">Secure Checkout</p>
                <h1>Complete your order</h1>
              </div>
              <Link to="/cart">Return to cart</Link>
            </div>

            {isPaid ? (
              <div className="checkout-success-panel">
                <h3>Payment successful</h3>
                <p>Your order has been placed.</p>
                <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
              </div>
            ) : (
              <>
                <div className="checkout-express">
                  <h2>Express checkout</h2>
                  <button type="button" className="checkout-express-button" disabled>
                    <span>Stripe</span>
                    <small>Express options coming soon</small>
                  </button>
                </div>

                <div className="checkout-divider"><span>OR</span></div>

                <form className="shopify-checkout-form" onSubmit={handleSubmit}>
                  <section className="checkout-step">
                    <div className="checkout-step-head">
                      <h2>Contact</h2>
                      {!currentUser && <Link to="/signin">Sign in</Link>}
                    </div>
                    <label className="checkout-field checkout-field-full">
                      <span>Email or mobile phone number</span>
                      <input
                        name="email"
                        type="email"
                        value={checkoutDetails.email}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                    </label>
                    <label className="checkout-checkbox">
                      <input
                        type="checkbox"
                        checked={emailOffers}
                        onChange={(event) => setEmailOffers(event.target.checked)}
                      />
                      <span>Email me with news and offers</span>
                    </label>
                  </section>

                  <section className="checkout-step">
                    <h2>Delivery</h2>
                    <label className="checkout-field checkout-field-full">
                      <span>Country/Region</span>
                      <select name="country" value={checkoutDetails.country} onChange={handleChange}>
                        <option value="United States">United States</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Nigeria">Nigeria</option>
                      </select>
                    </label>

                    <div className="checkout-two-grid">
                      <label className="checkout-field">
                        <span>First name (optional)</span>
                        <input
                          name="firstName"
                          value={checkoutDetails.firstName || ''}
                          onChange={handleChange}
                          autoComplete="given-name"
                        />
                      </label>
                      <label className="checkout-field">
                        <span>Last name</span>
                        <input
                          name="fullName"
                          value={checkoutDetails.fullName}
                          onChange={handleChange}
                          autoComplete="family-name"
                        />
                      </label>
                    </div>

                    <label className="checkout-field checkout-field-full">
                      <span>Address</span>
                      <input
                        name="address"
                        value={checkoutDetails.address}
                        onChange={handleChange}
                        placeholder="Street address"
                        autoComplete="street-address"
                      />
                    </label>

                    <label className="checkout-field checkout-field-full">
                      <span>Apartment, suite, etc. (optional)</span>
                      <input name="apartment" value={checkoutDetails.apartment || ''} onChange={handleChange} />
                    </label>

                    <div className="checkout-three-grid">
                      <label className="checkout-field">
                        <span>City</span>
                        <input name="city" value={checkoutDetails.city} onChange={handleChange} autoComplete="address-level2" />
                      </label>
                      <label className="checkout-field">
                        <span>State</span>
                        <input name="stateRegion" value={checkoutDetails.stateRegion} onChange={handleChange} autoComplete="address-level1" />
                      </label>
                      <label className="checkout-field">
                        <span>ZIP code</span>
                        <input name="zipCode" value={checkoutDetails.zipCode} onChange={handleChange} autoComplete="postal-code" />
                      </label>
                    </div>

                    <label className="checkout-checkbox">
                      <input
                        type="checkbox"
                        checked={saveInfo}
                        onChange={(event) => setSaveInfo(event.target.checked)}
                      />
                      <span>Save this information for next time</span>
                    </label>
                  </section>

                  <section className="checkout-step">
                    <h2>Shipping method</h2>
                    <div className="checkout-muted-box">
                      Enter your shipping address to view available shipping methods.
                    </div>
                    <div className="checkout-two-grid">
                      <label className="checkout-field">
                        <span>Shipping provider</span>
                        <select name="shippingProvider" value={checkoutDetails.shippingProvider} onChange={handleChange}>
                          <option value="FedEx">FedEx</option>
                          <option value="DHL">DHL</option>
                          <option value="Amazon Logistics">Amazon Logistics</option>
                          <option value="UPS">UPS</option>
                          <option value="Local Courier">Local Courier</option>
                        </select>
                      </label>
                      <label className="checkout-field">
                        <span>Delivery scope</span>
                        <select name="shippingScope" value={checkoutDetails.shippingScope} onChange={handleChange}>
                          <option value="state-to-state">State to State</option>
                          <option value="local">Within Vicinity (Local)</option>
                          <option value="international">International</option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section className="checkout-step">
                    <h2>Payment</h2>
                    <p className="checkout-step-note">All transactions are secure and encrypted.</p>
                    <div className="checkout-payment-option">
                      <div>
                        <span className="checkout-radio-dot" />
                        <strong>Stripe</strong>
                      </div>
                      <small>Card, wallet, and available Stripe payment methods</small>
                    </div>

                    {clientSecret ? (
                      <div className="checkout-stripe-box">
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <StripeCheckoutForm total={total} onPaymentSuccess={handlePaymentSuccess} />
                        </Elements>
                      </div>
                    ) : (
                      <p className="checkout-payment-help">
                        Fill in your contact and delivery details, then finalize the order to open the secure Stripe payment form.
                      </p>
                    )}
                  </section>

                  <section className="checkout-step">
                    <h2>Billing address</h2>
                    <label className="checkout-radio-card">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={billingSame}
                        onChange={() => setBillingSame(true)}
                      />
                      <span>Same as shipping address</span>
                    </label>
                    <label className="checkout-radio-card">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={!billingSame}
                        onChange={() => setBillingSame(false)}
                      />
                      <span>Use a different billing address</span>
                    </label>
                  </section>

                  {verifyMessage && <p className="checkout-message">{verifyMessage}</p>}
                  {error && <p className="checkout-error">{error}</p>}

                  {!clientSecret && (
                    <button className="btn btn-primary checkout-final-button" type="submit" disabled={isProcessing}>
                      {isProcessing ? 'Preparing secure payment...' : 'Finalize order'}
                    </button>
                  )}
                </form>
              </>
            )}
          </div>

          <aside className="checkout-summary-card">
            <h3>Order Summary</h3>
            <div className="checkout-summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <span>{item.name} x{item.quantity}</span>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-summary-total">
              <span>Total</span>
              <strong>${total}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
