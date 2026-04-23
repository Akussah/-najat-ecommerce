import { parseJsonBody, sendJson } from '../lib/http.mjs';
import { consultSchema } from '../validation/schemas.mjs';
import { validateSchema } from '../validation/validate.mjs';
import { normalizeEmail } from '../lib/security.mjs';

export const createConsultsController = ({ db, emailService }) => ({
  async create(req, res) {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message });
      return;
    }
    const validation = validateSchema(consultSchema, body);
    if (!validation.ok) {
      sendJson(res, 400, { ok: false, message: validation.message });
      return;
    }

    const data = validation.data;
    const name = data.name;
    const email = normalizeEmail(data.email);
    const service = data.service;

    const createdAt = new Date().toISOString();
    const payload = JSON.stringify({ ...body, name, email, service });
    const result = db
      .prepare('INSERT INTO consult_requests (payload_json, created_at) VALUES (?, ?)')
      .run(payload, createdAt);

    sendJson(res, 201, {
      ok: true,
      request: { id: Number(result.lastInsertRowid), ...body, name, email, service, createdAt }
    });

    const consultHtml = `
      <h2>Consultation Request Received</h2>
      <p>Hi ${name},</p>
      <p>We have received your consultation request for: <strong>${service}</strong>.</p>
      <p>Our team will review your request and get back to you shortly.</p>
      <p><strong>Your Message:</strong><br/>${body.message || 'No message provided.'}</p>
    `;
    emailService.sendEmail(email, 'Your Consultation Request - ALHAMD ASHINO', consultHtml);
  }
});
