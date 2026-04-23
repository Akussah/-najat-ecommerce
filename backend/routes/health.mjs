export const createHealthRoutes = ({ controllers }) => [
  {
    method: 'GET',
    path: '/api/health',
    handler: controllers.health.get
  }
];
