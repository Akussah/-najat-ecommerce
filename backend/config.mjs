import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 4001),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  flutterwaveSecretKey: process.env.FLW_SECRET_KEY || '',
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',
  paystackCurrency: process.env.PAYSTACK_CURRENCY || 'USD',
  flutterwaveCurrency: process.env.FLW_CURRENCY || 'USD',
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || ''
  },
  orderNotifyEmail: process.env.ORDER_NOTIFY_EMAIL || '',
  rateLimits: {
    auth: { windowMs: 15 * 60 * 1000, max: 10 },
    checkout: { windowMs: 60 * 1000, max: 10 },
    productWrite: { windowMs: 5 * 60 * 1000, max: 20 },
    consult: { windowMs: 10 * 60 * 1000, max: 12 }
  }
};
