import { createAuthRoutes } from './auth.mjs';
import { createConsultRoutes } from './consults.mjs';
import { createHealthRoutes } from './health.mjs';
import { createOrderRoutes } from './orders.mjs';
import { createPaymentRoutes } from './payments.mjs';
import { createProductRoutes } from './products.mjs';

export const createRoutes = (deps) => [
  ...createHealthRoutes(deps),
  ...createProductRoutes(deps),
  ...createPaymentRoutes(deps),
  ...createAuthRoutes(deps),
  ...createOrderRoutes(deps),
  ...createConsultRoutes(deps)
];
