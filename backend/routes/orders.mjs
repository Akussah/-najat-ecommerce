export const createOrderRoutes = ({ controllers, middlewares }) => [
  {
    method: 'GET',
    path: '/api/orders',
    middlewares: [middlewares.authRequired, middlewares.adminRequired],
    handler: controllers.orders.list
  },
  {
    method: 'POST',
    path: '/api/orders',
    middlewares: [middlewares.authRequired, middlewares.rateLimit.checkout],
    handler: controllers.orders.create
  }
];
