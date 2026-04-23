import { createAuthController } from './auth.mjs';
import { createConsultsController } from './consults.mjs';
import { createHealthController } from './health.mjs';
import { createOrdersController } from './orders.mjs';
import { createPaymentsController } from './payments.mjs';
import { createProductsController } from './products.mjs';

export const createControllers = ({ db, stripe, config, services }) => ({
  health: createHealthController(),
  products: createProductsController({ db }),
  auth: createAuthController({ db, authService: services.auth }),
  orders: createOrdersController({ db, emailService: services.email, config }),
  consults: createConsultsController({ db, emailService: services.email }),
  payments: createPaymentsController({ stripe, config })
});
