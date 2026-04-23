export const createPaymentRoutes = ({ controllers, middlewares }) => [
  {
    method: 'POST',
    path: '/api/payments/create-payment-intent',
    middlewares: [middlewares.rateLimit.checkout],
    handler: controllers.payments.createStripePaymentIntent
  },
  {
    method: 'POST',
    path: '/api/payments/create-paystack-session',
    middlewares: [middlewares.rateLimit.checkout],
    handler: controllers.payments.createPaystackSession
  },
  {
    method: 'POST',
    path: '/api/payments/create-flutterwave-session',
    middlewares: [middlewares.rateLimit.checkout],
    handler: controllers.payments.createFlutterwaveSession
  },
  {
    method: 'GET',
    path: '/api/payments/session',
    handler: controllers.payments.getStripeSession
  },
  {
    method: 'GET',
    path: '/api/payments/paystack/verify',
    handler: controllers.payments.verifyPaystack
  },
  {
    method: 'GET',
    path: '/api/payments/flutterwave/verify',
    handler: controllers.payments.verifyFlutterwave
  }
];
