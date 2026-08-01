const authService = {
  async login(email, password) {
    const { data } = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
    localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
    localStorage.setItem(CONFIG.ROLE_KEY, data.role);
    return data;
  },

  async register(payload) {
    return apiRequest('/auth/register', { method: 'POST', body: payload, auth: false });
  },

  logout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.ROLE_KEY);
    window.location.href = '/pages/auth/login.html';
  },

  getRole() {
    return localStorage.getItem(CONFIG.ROLE_KEY);
  },

  isLoggedIn() {
    return !!localStorage.getItem(CONFIG.TOKEN_KEY);
  },
};