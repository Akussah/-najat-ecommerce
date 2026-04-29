import db from '../db.mjs';
import { sendJson } from '../lib/http.mjs';

export const createHealthController = () => ({
  async get(req, res) {
    try {
      await db.query('SELECT 1');
      sendJson(res, 200, { ok: true, message: 'API running', database: 'postgres' });
    } catch (error) {
      sendJson(res, 500, { ok: false, message: 'Database connection failed', error: String(error) });
    }
  }
});
