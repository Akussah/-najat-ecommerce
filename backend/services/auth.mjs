import { createSessionToken, hashToken } from '../lib/security.mjs';

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
};

export const createAuthService = (db) => ({
  async getUserByToken(req) {
    const token = getTokenFromRequest(req);
    if (!token) return null;

    const tokenHash = hashToken(token);
    const { rows } = await db.query(
      `SELECT user_id
       FROM sessions
       WHERE token_hash = $1
         AND revoked_at IS NULL
         AND expires_at > $2`,
      [tokenHash, new Date().toISOString()]
    );
    const session = rows[0];
    if (!session) return null;

    const userRes = await db.query('SELECT id, name, email, is_admin FROM users WHERE id = $1', [session.user_id]);
    const user = userRes.rows[0];
    if (!user) return null;

    return { ...user, token };
  },

  async createSession(userId) {
    const token = createSessionToken();
    const now = new Date();
    const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
    await db.query(
      `INSERT INTO sessions (user_id, token_hash, created_at, expires_at) VALUES ($1, $2, $3, $4)`,
      [userId, hashToken(token), now.toISOString(), expires.toISOString()]
    );
    return token;
  },

  async revokeToken(token) {
    if (!token) return;
    await db.query('UPDATE sessions SET revoked_at = $1 WHERE token_hash = $2', [new Date().toISOString(), hashToken(token)]);
  }
});
