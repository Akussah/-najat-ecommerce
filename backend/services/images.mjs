import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { config } from '../config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = config.uploadsDir || path.join(__dirname, '..');
const targetDir = path.join(baseDir, 'uploads');

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIME_TO_EXT = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif']
]);

const ensureImageSize = (buffer) => {
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error('Image size exceeds 5MB limit.');
  }
};

const writeImage = (buffer, ext) => {
  ensureImageSize(buffer);
  const filename = `product-${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`;
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(path.join(targetDir, filename), buffer);
  return `/uploads/${filename}`;
};

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
  return writeImage(buffer, ext);
};

export const saveUploadedImage = ({ buffer, mimeType, filename }) => {
  if (!buffer || !buffer.length) return '';

  const extFromMime = MIME_TO_EXT.get(String(mimeType || '').toLowerCase());
  let ext = extFromMime;

  if (!ext && filename) {
    const fileExt = path.extname(filename).toLowerCase().replace('.', '');
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fileExt)) {
      ext = fileExt === 'jpeg' ? 'jpg' : fileExt;
    }
  }

  if (!ext) {
    throw new Error('Unsupported image type. Use JPG, PNG, WEBP, or GIF.');
  }

  return writeImage(buffer, ext);
};
