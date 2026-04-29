import { parseJsonBody, sendJson } from '../lib/http.mjs';
import { orderSchema } from '../validation/schemas.mjs';
import { validateSchema } from '../validation/validate.mjs';

const roundMoney = (value) => Math.round(value * 100) / 100;

export const createOrdersController = ({ db, emailService, config }) => ({
  async list(req, res) {
    const result = await db.query(
      'SELECT id, user_id, user_email, items_json, total, address, payment_method, created_at FROM orders ORDER BY id DESC'
    );
    sendJson(res, 200, { ok: true, orders: result.rows });
  },

  async create(req, res) {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(orderSchema, body);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const data = validation.data;
    const items = data.items;
    const computedTotal = roundMoney(
      items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
    );

    if (computedTotal <= 0) {
      sendJson(res, 400, { ok: false, message: 'Invalid total amount.' });
      return;
    }

    const createdAt = new Date().toISOString();
    const insertResult = await db.query(
      'INSERT INTO orders (user_id, user_email, items_json, total, address, payment_method, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [req.user.id, req.user.email, JSON.stringify(items), computedTotal, data.address, data.paymentMethod, createdAt]
    );

    const orderId = Number(insertResult.rows[0]?.id);
    sendJson(res, 201, {
      ok: true,
      order: {
        id: orderId,
        userId: req.user.id,
        userEmail: req.user.email,
        items,
        total: computedTotal,
        address: data.address,
        paymentMethod: data.paymentMethod,
        createdAt
      }
    });

    const customerEmailHtml = `
      <h2>Order Confirmation (#${orderId})</h2>
      <p>Hi ${req.user.name},</p>
      <p>Thank you for your order from ALHAMD ASHINO!</p>
      <h3>Order Details:</h3>
      <ul>
        ${items.map((item) => `<li>${item.name || 'Item'} (x${item.quantity || 1}) - $${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: $${computedTotal.toFixed(2)}</strong></p>
      <p><strong>Shipping Information:</strong><br/> ${data.address}</p>
      <p>We will notify you once your order ships.</p>
    `;

    const companyEmailHtml = `
      <h2>New Order Received (#${orderId})</h2>
      <p><strong>Customer:</strong> ${req.user.name} (${req.user.email})</p>
      <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
      <p><strong>Order Total:</strong> $${computedTotal.toFixed(2)}</p>
      <h3>Items:</h3>
      <ul>
        ${items.map((item) => `<li>${item.name || 'Item'} (x${item.quantity || 1}) - $${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Shipping Information:</strong><br/> ${data.address}</p>
      <p><strong>Placed at:</strong> ${createdAt}</p>
    `;

    emailService.sendEmail(req.user.email, `Order Confirmation - ALHAMD ASHINO (#${orderId})`, customerEmailHtml);

    const notifyEmail = String(config?.orderNotifyEmail || '').trim();
    if (notifyEmail) {
      emailService.sendEmail(notifyEmail, `New Order - ALHAMD ASHINO (#${orderId})`, companyEmailHtml);
    }
  }
});
