async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = typeof authService !== 'undefined' ? authService.getToken() : (sessionStorage.getItem(CONFIG.TOKEN_KEY) || localStorage.getItem(CONFIG.TOKEN_KEY));
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

// Separate helper for file uploads - do NOT set Content-Type manually here.
// The browser sets it automatically (multipart/form-data; boundary=...) when
// you pass a FormData body, and overriding it breaks the upload.
async function apiUpload(path, formData) {
  const headers = {};
  const token = typeof authService !== 'undefined' ? authService.getToken() : (sessionStorage.getItem(CONFIG.TOKEN_KEY) || localStorage.getItem(CONFIG.TOKEN_KEY));
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }
  return data;
}