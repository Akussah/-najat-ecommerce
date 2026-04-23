import { createSessionToken, hashToken } from '../lib/security.mjs';

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
};

export const createAuthService = (db) => ({
  getUserByToken(req) {
    const token = getTokenFromRequest(req);
    if (!token) return null;

    const tokenHash = hashToken(token);
    const session = db
      .prepare(
        `SELECT user_id
         FROM sessions
         WHERE token_hash = ?
           AND revoked_at IS NULL
           AND expires_at > ?`
      )
      .get(tokenHash, new Date().toISOString());
    if (!session) return null;

    const user = db.prepare('SELECT id, name, email, is_admin FROM users WHERE id = ?').get(session.user_id);
    if (!user) return null;

    return { ...user, token };
  },

  createSession(userId) {
    const token = createSessionToken();
    const now = new Date();
    const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
    db.prepare(
      `INSERT INTO sessions (user_id, token_hash, created_at, expires_at)
       VALUES (?, ?, ?, ?)`
    ).run(userId, hashToken(token), now.toISOString(), expires.toISOString());
    return token;
  },

  revokeToken(token) {
    if (!token) return;
    db.prepare('UPDATE sessions SET revoked_at = ? WHERE token_hash = ?')
      .run(new Date().toISOString(), hashToken(token));
  }
});
