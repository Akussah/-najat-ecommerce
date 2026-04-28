const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4001' : 'https://najat-ecommerce.onrender.com');

export const getToken = () => localStorage.getItem('bead_bag_token') || '';

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('bead_bag_token', token);
  } else {
    localStorage.removeItem('bead_bag_token');
  }
};

const buildHeaders = (includeAuth) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const apiFetch = async (path, { method = 'GET', body, auth = false } = {}) => {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = buildHeaders(auth);
  
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.message || 'Request failed.';
    throw new Error(message);
  }
  return payload;
};
