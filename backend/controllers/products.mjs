import { parseJsonBody, parseMultipartBody, sendJson } from '../lib/http.mjs';
import { productSchema } from '../validation/schemas.mjs';
import { validateSchema } from '../validation/validate.mjs';
import { saveBase64Image, saveUploadedImage } from '../services/images.mjs';

const readProductPayload = async (req) => {
  const contentType = String(req.headers['content-type'] || '');
  if (contentType.includes('multipart/form-data')) {
    const { fields, file } = await parseMultipartBody(req);
    return { payload: fields, file };
  }

  const body = await parseJsonBody(req);
  return { payload: body, file: null };
};

const parseId = (req) => {
  const raw = req.context?.params?.id;
  const id = Number(raw);
  if (!Number.isFinite(id)) return null;
  return id;
};

export const createProductsController = ({ db }) => ({
  list(req, res) {
    const products = db
      .prepare('SELECT id, name, price, description, stock, image, bio FROM products ORDER BY id')
      .all();
    sendJson(res, 200, { ok: true, products });
  },

  get(req, res) {
    const id = parseId(req);
    if (!id) {
      sendJson(res, 400, { ok: false, message: 'Invalid product id.' });
      return;
    }
    const product = db
      .prepare('SELECT id, name, price, description, stock, image, bio FROM products WHERE id = ?')
      .get(id);
    if (!product) {
      sendJson(res, 404, { ok: false, message: 'Product not found' });
      return;
    }
    sendJson(res, 200, { ok: true, product });
  },

  async create(req, res) {
    let payload;
    let file;
    try {
      ({ payload, file } = await readProductPayload(req));
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(productSchema, payload);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const data = validation.data;
    let image = data.image || '';
    try {
      if (file?.buffer?.length) {
        image = saveUploadedImage(file);
      } else if (image) {
        image = saveBase64Image(image);
      }
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }

    const result = db
      .prepare('INSERT INTO products (name, price, description, stock, image, bio) VALUES (?, ?, ?, ?, ?, ?)')
      .run(data.name, data.price, data.description, data.stock, image, data.bio || '');

    sendJson(res, 201, {
      ok: true,
      product: {
        id: Number(result.lastInsertRowid),
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        image,
        bio: data.bio || ''
      }
    });
  },

  async update(req, res) {
    const id = parseId(req);
    if (!id) {
      sendJson(res, 400, { ok: false, message: 'Invalid product id.' });
      return;
    }

    const current = db
      .prepare('SELECT id, name, price, description, stock, image, bio FROM products WHERE id = ?')
      .get(id);
    if (!current) {
      sendJson(res, 404, { ok: false, message: 'Product not found' });
      return;
    }

    let payload;
    let file;
    try {
      ({ payload, file } = await readProductPayload(req));
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(productSchema, payload);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const data = validation.data;
    let image = data.image || '';

    try {
      if (file?.buffer?.length) {
        image = saveUploadedImage(file);
      } else if (image) {
        image = saveBase64Image(image);
      } else {
        image = current.image;
      }
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }

    db.prepare('UPDATE products SET name = ?, price = ?, description = ?, stock = ?, image = ?, bio = ? WHERE id = ?')
      .run(data.name, data.price, data.description, data.stock, image, data.bio || '', id);

    sendJson(res, 200, { ok: true, message: 'Product updated successfully.' });
  },

  remove(req, res) {
    const id = parseId(req);
    if (!id) {
      sendJson(res, 400, { ok: false, message: 'Invalid product id.' });
      return;
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    sendJson(res, 200, { ok: true, message: 'Product deleted successfully.' });
  }
});
