import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

const streamFile = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
};

export const createStaticHandler = ({ distDir, publicDir }) => async (req, res) => {
  if (req.method !== 'GET') return false;

  const url = req.context?.url || new URL(req.url || '/', `http://${req.headers.host}`);
  const route = url.pathname;

  if (route.startsWith('/api/')) return false;

  const safeRoute = path
    .normalize(route)
    .replace(/^(\.\.[\/\\])+/, '')
    .replace(/^[/\\]+/, '');
  const possiblePaths = [
    route === '/' ? path.join(distDir, 'index.html') : null,
    path.join(publicDir, safeRoute),
    path.join(distDir, safeRoute)
  ].filter(Boolean);

  for (const candidate of possiblePaths) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      streamFile(res, candidate);
      return true;
    }
  }

  const indexPath = path.join(distDir, 'index.html');
  if (existsSync(indexPath)) {
    streamFile(res, indexPath);
    return true;
  }

  return false;
};
