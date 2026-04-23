import { sendJson } from '../lib/http.mjs';

const getIp = (req) => {
  const forwarded = String(req.headers['x-forwarded-for'] || '');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
};

export const createRateLimiter = ({ windowMs, max, message }) => {
  const hits = new Map();

  return (req, res) => {
    const now = Date.now();
    const key = getIp(req);
    const current = hits.get(key);

    let entry = current;
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
    }

    entry.count += 1;
    hits.set(key, entry);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      sendJson(res, 429, { ok: false, message: message || 'Too many requests. Please try again later.' });
      return false;
    }

    return true;
  };
};
