import { parseJsonBody, sendJson } from '../lib/http.mjs';
import { normalizeEmail, isStrongPassword, hashPassword, verifyPassword } from '../lib/security.mjs';
import { signinSchema, signupSchema } from '../validation/schemas.mjs';
import { validateSchema } from '../validation/validate.mjs';

export const createAuthController = ({ db, authService }) => ({
  async signup(req, res) {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(signupSchema, body);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const name = validation.data.name;
    const email = normalizeEmail(validation.data.email);
    const password = String(validation.data.password || '');

    if (!isStrongPassword(password)) {
      sendJson(res, 400, {
        ok: false,
        message: 'Password must be 8+ chars with uppercase, lowercase, and a number.'
      });
      return;
    }

    const existingResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingResult.rows.length > 0) {
      sendJson(res, 409, { ok: false, message: 'Email already exists.' });
      return;
    }

    const createdAt = new Date().toISOString();
    const passwordHash = hashPassword(password);
    const insertResult = await db.query(
      'INSERT INTO users (name, email, password_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, passwordHash, createdAt]
    );

    const userId = insertResult.rows[0]?.id;
    const user = { id: Number(userId), name, email, is_admin: 0 };
    const token = await authService.createSession(user.id);
    sendJson(res, 201, { ok: true, user, token });
  },

  async signin(req, res) {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(signinSchema, body);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const email = normalizeEmail(validation.data.email);
    const password = String(validation.data.password || '');

    const userResult = await db.query(
      'SELECT id, name, email, password_hash, is_admin FROM users WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      sendJson(res, 401, { ok: false, message: 'Invalid email or password.' });
      return;
    }

    const token = await authService.createSession(user.id);
    sendJson(res, 200, {
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin },
      token
    });
  },

  me(req, res) {
    if (!req.user) {
      sendJson(res, 401, { ok: false, message: 'Unauthorized' });
      return;
    }
    sendJson(res, 200, {
      ok: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        is_admin: req.user.is_admin
      }
    });
  },

  signout(req, res) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
      sendJson(res, 401, { ok: false, message: 'Unauthorized' });
      return;
    }

    authService.revokeToken(token);
    sendJson(res, 200, { ok: true });
  }
});
