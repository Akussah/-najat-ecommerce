import Busboy from 'busboy';

export const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  });
  res.end(JSON.stringify(payload));
};

export const parseJsonBody = (req, { limitBytes = 20_000_000 } = {}) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > limitBytes) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });

export const parseMultipartBody = (req, { maxFileSize = 5 * 1024 * 1024, maxFieldSize = 2_000_000 } = {}) =>
  new Promise((resolve, reject) => {
    const contentType = String(req.headers['content-type'] || '');
    if (!contentType.includes('multipart/form-data')) {
      reject(new Error('Invalid content type. Expected multipart/form-data.'));
      return;
    }

    const fields = {};
    let file = null;
    let fileTooLarge = false;

    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: maxFileSize,
        fieldSize: maxFieldSize,
        files: 1,
        fields: 50
      }
    });

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('file', (name, stream, info) => {
      if (name !== 'image') {
        stream.resume();
        return;
      }
      const chunks = [];
      stream.on('data', (data) => {
        chunks.push(data);
      });
      stream.on('limit', () => {
        fileTooLarge = true;
      });
      stream.on('end', () => {
        file = {
          buffer: Buffer.concat(chunks),
          filename: info.filename,
          mimeType: info.mimeType
        };
      });
    });

    busboy.on('error', reject);
    busboy.on('finish', () => {
      if (fileTooLarge) {
        reject(new Error('Image size exceeds 5MB limit.'));
        return;
      }
      resolve({ fields, file });
    });

    req.pipe(busboy);
  });
