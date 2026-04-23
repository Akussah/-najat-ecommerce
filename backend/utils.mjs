import { createHash, randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  });
  res.end(JSON.stringify(payload));
};

export const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 20_000_000) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });

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

// Enhanced Secure Image Handling
export const saveBase64Image = (base64String) => {
  if (!base64String || !base64String.startsWith('data:image/')) return base64String;
  
  const matches = base64String.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,([\s\S]+)$/);
  if (!matches) throw new Error('Invalid image format');
  
  let ext = matches[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (!['jpg', 'png', 'webp', 'gif'].includes(ext)) {
    throw new Error('Unsupported image type. Use JPG, PNG, WEBP, or GIF.');
  }

  const buffer = Buffer.from(matches[2], 'base64');
  if (buffer.length > 5 * 1024 * 1024) throw new Error('Image size exceeds 5MB limit.'); // Hard limit size

  const filename = `product-${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`;
  const pubDir = path.join(__dirname, '../public');
  
  mkdirSync(pubDir, { recursive: true });
  writeFileSync(path.join(pubDir, filename), buffer);
  
  return `/${filename}`;
};