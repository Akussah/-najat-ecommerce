import { parseJsonBody, parseMultipartBody, sendJson } from '../lib/http.mjs';
import { productSchema } from '../validation/schemas.mjs';
import { validateSchema } from '../validation/validate.mjs';
import { saveBase64Image, saveUploadedImage } from '../services/images.mjs';

const readProductPayload = async (req) => {
  const contentType = String(req.headers['content-type'] || '');
  if (contentType.includes('multipart/form-data')) {
    const { fields, files } = await parseMultipartBody(req);
    return { payload: fields, files };
  }

  const body = await parseJsonBody(req);
  return { payload: body, files: [] };
};

const parseId = (req) => {
  const raw = req.context?.params?.id;
  const id = Number(raw);
  if (!Number.isFinite(id)) return null;
  return id;
};

export const createProductsController = ({ db }) => ({
  async list(req, res) {
    const result = await db.query('SELECT id, name, price, description, stock, image, images, colors, bio FROM products ORDER BY id');
    sendJson(res, 200, { ok: true, products: result.rows });
  },

  async get(req, res) {
    const id = parseId(req);
    if (!id) {
      sendJson(res, 400, { ok: false, message: 'Invalid product id.' });
      return;
    }
    const result = await db.query(
      'SELECT id, name, price, description, stock, image, images, colors, bio FROM products WHERE id = $1',
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
    let files;
    try {
      ({ payload, files } = await readProductPayload(req));
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
    if (!files || files.length < 2 || files.length > 5) {
      sendJson(res, 400, { ok: false, message: 'Please upload between 2 and 5 images for the product.' });
      return;
    }

    let images = [];
    try {
      images = files.map(f => saveUploadedImage(f));
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }

    let colors = [];
    if (data.colors) {
      try { colors = JSON.parse(data.colors); } 
      catch { colors = String(data.colors).split(',').map(c => c.trim()).filter(Boolean); }
    }

    const mainImage = images[0] || '';

    const insertResult = await db.query(
      'INSERT INTO products (name, price, description, stock, image, images, colors, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [data.name, data.price, data.description, data.stock, mainImage, images, colors, data.bio || '']
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
        image: mainImage,
        images,
        colors,
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
      'SELECT id, name, price, description, stock, image, images, colors, bio FROM products WHERE id = $1',
      [id]
    );
    const current = currentResult.rows[0];
    if (!current) {
      sendJson(res, 404, { ok: false, message: 'Product not found' });
      return;
    }

    let payload;
    let files;
    try {
      ({ payload, files } = await readProductPayload(req));
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
    let images = current.images || (current.image ? [current.image] : []);

    if (files && files.length > 0) {
      if (files.length < 2 || files.length > 5) {
        sendJson(res, 400, { ok: false, message: 'Please upload between 2 and 5 images for the product.' });
        return;
      }
      try {
        images = files.map(f => saveUploadedImage(f));
      } catch (error) {
        sendJson(res, 400, { ok: false, message: error.message });
        return;
      }
    }

    let colors = current.colors || [];
    if (data.colors !== undefined) {
      try { colors = JSON.parse(data.colors); } 
      catch { colors = String(data.colors).split(',').map(c => c.trim()).filter(Boolean); }
    }

    const mainImage = images.length > 0 ? images[0] : (current.image || '');

    await db.query(
      'UPDATE products SET name = $1, price = $2, description = $3, stock = $4, image = $5, images = $6, colors = $7, bio = $8 WHERE id = $9',
      [data.name, data.price, data.description, data.stock, mainImage, images, colors, data.bio || '', id]
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
