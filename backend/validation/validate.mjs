export const validateSchema = (schema, data) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  const message = result.error?.errors?.[0]?.message || 'Invalid request body.';
  return { ok: false, message };
};
