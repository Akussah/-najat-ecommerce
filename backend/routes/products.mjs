export const createProductRoutes = ({ controllers, middlewares }) => [
  {
    method: 'GET',
    path: '/api/products',
    handler: controllers.products.list
  },
  {
    method: 'GET',
    path: '/api/products/:id',
    handler: controllers.products.get
  },
  {
    method: 'POST',
    path: '/api/products',
    middlewares: [middlewares.authRequired, middlewares.adminRequired, middlewares.rateLimit.productWrite],
    handler: controllers.products.create
  },
  {
    method: 'PUT',
    path: '/api/products/:id',
    middlewares: [middlewares.authRequired, middlewares.adminRequired, middlewares.rateLimit.productWrite],
    handler: controllers.products.update
  },
  {
    method: 'DELETE',
    path: '/api/products/:id',
    middlewares: [middlewares.authRequired, middlewares.adminRequired, middlewares.rateLimit.productWrite],
    handler: controllers.products.remove
  }
];
