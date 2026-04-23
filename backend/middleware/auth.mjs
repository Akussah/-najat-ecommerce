import { sendJson } from '../lib/http.mjs';

export const requireAuth = (authService) => (req, res) => {
  const user = authService.getUserByToken(req);
  if (!user) {
    sendJson(res, 401, { ok: false, message: 'Unauthorized. Please sign in.' });
    return false;
  }
  req.user = user;
  return true;
};

export const requireAdmin = () => (req, res) => {
  if (!req.user || !req.user.is_admin) {
    sendJson(res, 403, { ok: false, message: 'Admin access required.' });
    return false;
  }
  return true;
};
