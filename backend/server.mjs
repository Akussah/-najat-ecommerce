import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';
import db, { dbPath } from './db.mjs';
import { config } from './config.mjs';
import { createAuthService } from './services/auth.mjs';
import { createEmailService } from './services/email.mjs';
import { createControllers } from './controllers/index.mjs';
import { createRoutes } from './routes/index.mjs';
import { createRouter } from './lib/router.mjs';
import { createStaticHandler } from './controllers/static.mjs';
import { requireAdmin, requireAuth } from './middleware/auth.mjs';
import { createRateLimiter } from './middleware/rateLimit.mjs';
import { sendJson } from './lib/http.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = config.stripeSecretKey ? new Stripe(config.stripeSecretKey) : null;

const services = {
  auth: createAuthService(db),
  email: createEmailService(config)
};

const middlewares = {
  authRequired: requireAuth(services.auth),
  adminRequired: requireAdmin(),
  rateLimit: {
    auth: createRateLimiter(config.rateLimits.auth),
    checkout: createRateLimiter(config.rateLimits.checkout),
    productWrite: createRateLimiter(config.rateLimits.productWrite),
    consult: createRateLimiter(config.rateLimits.consult)
  }
};

const controllers = createControllers({ db, stripe, config, services });
const routes = createRoutes({ controllers, middlewares });
const router = createRouter(routes);
const staticHandler = createStaticHandler({
  distDir: path.join(__dirname, '../dist'),
  publicDir: path.join(__dirname, '../public')
});

const handler = async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      sendJson(res, 200, { ok: true });
      return;
    }

    const handled = await router(req, res);
    if (res.writableEnded) return;

    if (!handled) {
      const staticHandled = await staticHandler(req, res);
      if (staticHandled || res.writableEnded) return;
    }

    sendJson(res, 404, { ok: false, message: 'Route not found' });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || 'Server error' });
  }
};

createServer(handler).listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API running on http://localhost:${config.port} (SQLite: ${dbPath})`);
});
