export const createConsultRoutes = ({ controllers, middlewares }) => [
  {
    method: 'POST',
    path: '/api/consults',
    middlewares: [middlewares.rateLimit.consult],
    handler: controllers.consults.create
  }
];
