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
  async list(req, res) {
    const result = await db.query('SELECT id, name, price, description, stock, image, bio FROM products ORDER BY id');
    sendJson(res, 200, { ok: true, products: result.rows });
  },

  async get(req, res) {
    const id = parseId(req);
    if (!id) {
      sendJson(res, 400, { ok: false, message: 'Invalid product id.' });
      return;
    }
    const result = await db.query(
      'SELECT id, name, price, description, stock, image, bio FROM products WHERE id = $1',
      [id]
    );
    const product = result.rows[0];
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

    const insertResult = await db.query(
      'INSERT INTO products (name, price, description, stock, image, bio) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [data.name, data.price, data.description, data.stock, image, data.bio || '']
    );

    const productId = insertResult.rows[0]?.id;
    sendJson(res, 201, {
      ok: true,
      product: {
        id: Number(productId),
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

    const currentResult = await db.query(
      'SELECT id, name, price, description, stock, image, bio FROM products WHERE id = $1',
      [id]
    );
    const current = currentResult.rows[0];
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

    await db.query(
      'UPDATE products SET name = $1, price = $2, description = $3, stock = $4, image = $5, bio = $6 WHERE id = $7',
      [data.name, data.price, data.description, data.stock, image, data.bio || '', id]
    );

    sendJson(res, 200, { ok: true, message: 'Product updated successfully.' });
  },

  async remove(req, res) {
    const id = parseId(req);
    if (!id) {
      sendJson(res, 400, { ok: false, message: 'Invalid product id.' });
      return;
    }

    await db.query('DELETE FROM products WHERE id = $1', [id]);
    sendJson(res, 200, { ok: true, message: 'Product deleted successfully.' });
  }
});
