export const createAuthRoutes = ({ controllers, middlewares }) => [
  {
    method: 'POST',
    path: '/api/auth/signup',
    middlewares: [middlewares.rateLimit.auth],
    handler: controllers.auth.signup
  },
  {
    method: 'POST',
    path: '/api/auth/signin',
    middlewares: [middlewares.rateLimit.auth],
    handler: controllers.auth.signin
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    middlewares: [middlewares.authRequired],
    handler: controllers.auth.me
  },
  {
    method: 'POST',
    path: '/api/auth/signout',
    middlewares: [middlewares.authRequired],
    handler: controllers.auth.signout
  }
];
