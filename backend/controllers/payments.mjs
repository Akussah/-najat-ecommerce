import { parseJsonBody, sendJson } from '../lib/http.mjs';
import { normalizeEmail } from '../lib/security.mjs';
import { checkoutSchema } from '../validation/schemas.mjs';
import { validateSchema } from '../validation/validate.mjs';

const sumItems = (items) =>
  items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);

export const createPaymentsController = ({ stripe, config }) => ({
  async createStripePaymentIntent(req, res) {
    if (!stripe) {
      sendJson(res, 500, {
        ok: false,
        message: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your backend environment.'
      });
      return;
    }

    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(checkoutSchema, body);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const data = validation.data;
    const totalAmount = sumItems(data.items);
    const amountInCents = Math.round(totalAmount * 100);

    if (amountInCents <= 0) {
      sendJson(res, 400, { ok: false, message: 'Invalid total amount.' });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      receipt_email: normalizeEmail(data.email),
      description: `Order for ${data.fullName}`,
      metadata: {
        customerName: data.fullName,
        customerAddress: data.address
      }
    });

    sendJson(res, 200, { ok: true, clientSecret: paymentIntent.client_secret });
  },

  async createPaystackSession(req, res) {
    if (!config.paystackSecretKey) {
      sendJson(res, 500, {
        ok: false,
        message: 'Paystack is not configured. Set PAYSTACK_SECRET_KEY in your backend environment.'
      });
      return;
    }

    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(checkoutSchema, body);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const data = validation.data;
    const computedTotal = sumItems(data.items);
    if (computedTotal <= 0) {
      sendJson(res, 400, { ok: false, message: 'Invalid total amount.' });
      return;
    }

    const origin = String(data.origin || req.headers.origin || 'http://localhost:5173').trim();
    const currency = String(config.paystackCurrency || 'USD').toUpperCase();
    const amountSubunit = Math.round(computedTotal * 100);
    const reference = `BBPS-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;

    const initializeResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: normalizeEmail(data.email),
        amount: String(amountSubunit),
        currency,
        reference,
        callback_url: `${origin}/checkout?gateway=paystack`,
        channels: ['card'],
        metadata: {
          fullName: data.fullName,
          address: data.address
        }
      })
    });

    const initializeData = await initializeResponse.json().catch(() => ({}));
    const authUrl = initializeData?.data?.authorization_url;
    if (!initializeResponse.ok || !initializeData?.status || !authUrl) {
      const upstreamMessage =
        initializeData?.message ||
        initializeData?.data?.message ||
        'Unable to start Paystack payment.';
      sendJson(res, 500, {
        ok: false,
        message: `Paystack initialize failed: ${upstreamMessage}`
      });
      return;
    }

    sendJson(res, 200, { ok: true, url: authUrl, reference });
  },

  async createFlutterwaveSession(req, res) {
    if (!config.flutterwaveSecretKey) {
      sendJson(res, 500, {
        ok: false,
        message: 'Flutterwave is not configured. Set FLW_SECRET_KEY in your backend environment.'
      });
      return;
    }

    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(checkoutSchema, body);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const data = validation.data;
    const computedTotal = sumItems(data.items);
    if (computedTotal <= 0) {
      sendJson(res, 400, { ok: false, message: 'Invalid total amount.' });
      return;
    }

    const origin = String(data.origin || req.headers.origin || 'http://localhost:5173').trim();
    const txRef = `BB-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
    const currency = String(config.flutterwaveCurrency || 'USD').toUpperCase();

    const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.flutterwaveSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: Number(computedTotal.toFixed(2)),
        currency,
        redirect_url: `${origin}/checkout?gateway=flutterwave`,
        customer: {
          email: normalizeEmail(data.email),
          name: data.fullName
        },
        customizations: {
          title: 'BeadBag Store',
          description: 'Payment for goods order'
        },
        meta: {
          address: data.address,
          preferredChannel: data.preferredChannel
        }
      })
    });

    const flwData = await flwResponse.json().catch(() => ({}));
    const link = flwData?.data?.link;
    if (!flwResponse.ok || !link) {
      sendJson(res, 500, {
        ok: false,
        message: flwData?.message || 'Unable to start Flutterwave payment.'
      });
      return;
    }

    sendJson(res, 200, { ok: true, url: link, txRef });
  },

  async getStripeSession(req, res) {
    if (!stripe) {
      sendJson(res, 500, {
        ok: false,
        message: 'Stripe is not configured. Set STRIPE_SECRET_KEY in your backend environment.'
      });
      return;
    }

    const sessionId = String(req.context.url.searchParams.get('session_id') || '').trim();
    if (!sessionId) {
      sendJson(res, 400, { ok: false, message: 'session_id is required.' });
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    sendJson(res, 200, {
      ok: true,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email || '',
        metadata: session.metadata || {}
      }
    });
  },

  async verifyPaystack(req, res) {
    if (!config.paystackSecretKey) {
      sendJson(res, 500, {
        ok: false,
        message: 'Paystack is not configured. Set PAYSTACK_SECRET_KEY in your backend environment.'
      });
      return;
    }

    const reference = String(req.context.url.searchParams.get('reference') || '').trim();
    if (!reference) {
      sendJson(res, 400, { ok: false, message: 'reference is required.' });
      return;
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.paystackSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const verifyData = await verifyResponse.json().catch(() => ({}));
    const isPaid =
      verifyResponse.ok &&
      Boolean(verifyData?.status) &&
      String(verifyData?.data?.status || '') === 'success' &&
      String(verifyData?.data?.reference || '') === reference;

    sendJson(res, 200, {
      ok: true,
      session: {
        paymentStatus: isPaid ? 'paid' : 'unpaid',
        reference,
        channel: String(verifyData?.data?.channel || ''),
        currency: String(verifyData?.data?.currency || ''),
        amount: Number(verifyData?.data?.amount || 0) / 100,
        address: String(verifyData?.data?.metadata?.address || '')
      }
    });
  },

  async verifyFlutterwave(req, res) {
    if (!config.flutterwaveSecretKey) {
      sendJson(res, 500, {
        ok: false,
        message: 'Flutterwave is not configured. Set FLW_SECRET_KEY in your backend environment.'
      });
      return;
    }

    const transactionId = String(req.context.url.searchParams.get('transaction_id') || '').trim();
    const txRef = String(req.context.url.searchParams.get('tx_ref') || '').trim();
    if (!transactionId || !txRef) {
      sendJson(res, 400, { ok: false, message: 'transaction_id and tx_ref are required.' });
      return;
    }

    const verifyResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.flutterwaveSecretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const verifyData = await verifyResponse.json().catch(() => ({}));
    const isPaid =
      verifyResponse.ok &&
      verifyData?.status === 'success' &&
      verifyData?.data?.status === 'successful' &&
      String(verifyData?.data?.tx_ref || '') === txRef;

    sendJson(res, 200, {
      ok: true,
      session: {
        paymentStatus: isPaid ? 'paid' : 'unpaid',
        transactionId,
        txRef,
        paymentType: String(verifyData?.data?.payment_type || ''),
        customerEmail: verifyData?.data?.customer?.email || '',
        amount: Number(verifyData?.data?.amount || 0),
        currency: String(verifyData?.data?.currency || ''),
        address: String(verifyData?.data?.meta?.address || '')
      }
    });
  }
});
