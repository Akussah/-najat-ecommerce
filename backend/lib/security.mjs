import { createHash, randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';

export const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

export const isStrongPassword = (password) =>
  password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

export const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export const hashPassword = (password, salt = randomBytes(16).toString('hex')) => {
  const hash = pbkdf2Sync(password, salt, 10_000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  const [salt, digest] = String(storedHash).split(':');
  if (!salt || !digest) return false;
  const calculated = pbkdf2Sync(password, salt, 10_000, 64, 'sha512').toString('hex');
  const left = Buffer.from(digest, 'hex');
  const right = Buffer.from(calculated, 'hex');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
};

export const createSessionToken = () => randomBytes(24).toString('hex');
