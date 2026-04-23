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
    <form className="checkout-form" onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="error-msg">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Processing...' : `Pay $${total}`}
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
    country: '',
    shippingProvider: 'FedEx',
    shippingScope: 'state-to-state',
    preferredChannel: ''
  });
  const [paymentGateway, setPaymentGateway] = useState('stripe');
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

  useEffect(() => {
    if (paymentGateway !== 'stripe' && clientSecret) {
      setClientSecret('');
    }
  }, [paymentGateway, clientSecret]);

  const handleGatewayChange = (event) => {
    setPaymentGateway(event.target.value);
    setError('');
  };

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
      savePendingOrder(fullAddress, paymentGateway);

      if (paymentGateway === 'stripe') {
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
        return;
      }

      const endpoint = paymentGateway === 'paystack'
        ? '/api/payments/create-paystack-session'
        : '/api/payments/create-flutterwave-session';

      const payload = {
        items: cartItems,
        fullName: checkoutDetails.fullName,
        email: checkoutDetails.email,
        address: fullAddress,
        origin: window.location.origin
      };

      if (paymentGateway === 'flutterwave' && checkoutDetails.preferredChannel) {
        payload.preferredChannel = checkoutDetails.preferredChannel;
      }

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: payload
      });

      window.location.href = data.url;
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
    <main className="page">
      <section className="section">
        <div className="container checkout-grid">
          <div>
            <h1 className="section-title">Payment</h1>
            <p className="section-subtitle">Enter your details, then complete payment securely via Stripe, Paystack, or Flutterwave.</p>

            {isPaid ? (
              <div className="success-box">
                <h3>Payment successful</h3>
                <p>Your order has been placed.</p>
                <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
              </div>
            ) : clientSecret && paymentGateway === 'stripe' ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm total={total} onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <form className="checkout-form" onSubmit={handleSubmit}>
                <label>
                  Payment Method
                  <select name="paymentGateway" value={paymentGateway} onChange={handleGatewayChange}>
                    <option value="stripe">Stripe (Card)</option>
                    <option value="paystack">Paystack</option>
                    <option value="flutterwave">Flutterwave</option>
                  </select>
                </label>

                {paymentGateway === 'flutterwave' && (
                  <label>
                    Preferred Channel (optional)
                    <select name="preferredChannel" value={checkoutDetails.preferredChannel} onChange={handleChange}>
                      <option value="">Auto select</option>
                      <option value="card">Card</option>
                      <option value="banktransfer">Bank transfer</option>
                      <option value="ussd">USSD</option>
                      <option value="mobilemoney">Mobile money</option>
                    </select>
                  </label>
                )}

                <label>
                  Full Name
                  <input name="fullName" value={checkoutDetails.fullName} onChange={handleChange} />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={checkoutDetails.email} onChange={handleChange} />
                </label>
                <label>
                  Street Address
                  <input name="address" value={checkoutDetails.address} onChange={handleChange} placeholder="123 Main St, Apt 4" />
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ flex: 1 }}>
                    City
                    <input name="city" value={checkoutDetails.city} onChange={handleChange} />
                  </label>
                  <label style={{ flex: 1 }}>
                    State / Region
                    <input name="stateRegion" value={checkoutDetails.stateRegion} onChange={handleChange} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ flex: 1 }}>
                    Country
                    <input name="country" value={checkoutDetails.country} onChange={handleChange} />
                  </label>
                  <label style={{ flex: 1 }}>
                    Zip / Postal Code
                    <input name="zipCode" value={checkoutDetails.zipCode} onChange={handleChange} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ flex: 1 }}>
                    Shipping Provider
                    <select name="shippingProvider" value={checkoutDetails.shippingProvider} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
                      <option value="FedEx">FedEx</option>
                      <option value="DHL">DHL</option>
                      <option value="Amazon Logistics">Amazon Logistics</option>
                      <option value="UPS">UPS</option>
                      <option value="Local Courier">Local Courier</option>
                    </select>
                  </label>
                  <label style={{ flex: 1 }}>
                    Delivery Scope
                    <select name="shippingScope" value={checkoutDetails.shippingScope} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
                      <option value="state-to-state">State to State</option>
                      <option value="local">Within Vicinity (Local)</option>
                      <option value="international">International</option>
                    </select>
                  </label>
                </div>

                {paymentGateway !== 'stripe' && (
                  <p className="muted-text">You will be redirected to {paymentGateway === 'paystack' ? 'Paystack' : 'Flutterwave'} to complete payment.</p>
                )}

                {verifyMessage && <p className="muted-text">{verifyMessage}</p>}
                {error && <p className="error-msg">{error}</p>}

                <button className="btn btn-primary" type="submit" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            )}
          </div>

          <aside className="summary-box">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="summary-row">
                <span>{item.name} x{item.quantity}</span>
                <strong>${item.price * item.quantity}</strong>
              </div>
            ))}
            <div className="summary-total">
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
