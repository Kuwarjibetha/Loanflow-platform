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

// File uploads ke liye alag helper. Yahan Content Type manually set mat karo. Jab FormData body pass hoti hai, browser ise automatically set karta hai
// multipart form data with boundary ke saath. Override karne se upload break ho jata hai.
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