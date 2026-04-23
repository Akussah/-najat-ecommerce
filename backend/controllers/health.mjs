import { sendJson } from '../lib/http.mjs';

export const createHealthController = () => ({
  get(req, res) {
    sendJson(res, 200, { ok: true, message: 'API running', database: 'sqlite' });
  }
});
