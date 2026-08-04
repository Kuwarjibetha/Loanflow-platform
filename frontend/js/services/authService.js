const authService = {
  async login(email, password) {
    const { data } = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });

 
    sessionStorage.setItem(CONFIG.TOKEN_KEY, data.token);
    sessionStorage.setItem(CONFIG.ROLE_KEY, data.role);
    if (data.departmentName) {
      sessionStorage.setItem(CONFIG.DEPT_KEY, data.departmentName);
    } else {
      sessionStorage.removeItem(CONFIG.DEPT_KEY);
    }
    if (data.name) {
      sessionStorage.setItem(CONFIG.NAME_KEY, data.name);
    }

    localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
    localStorage.setItem(CONFIG.ROLE_KEY, data.role);
    if (data.departmentName) {
      localStorage.setItem(CONFIG.DEPT_KEY, data.departmentName);
    } else {
      localStorage.removeItem(CONFIG.DEPT_KEY);
    }
    if (data.name) {
      localStorage.setItem(CONFIG.NAME_KEY, data.name);
    }

    return data;
  },

  async register(payload) {
    return apiRequest('/auth/register', { method: 'POST', body: payload, auth: false });
  },

  logout() {
    sessionStorage.removeItem(CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(CONFIG.ROLE_KEY);
    sessionStorage.removeItem(CONFIG.DEPT_KEY);
    sessionStorage.removeItem(CONFIG.NAME_KEY);

    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.ROLE_KEY);
    localStorage.removeItem(CONFIG.DEPT_KEY);
    localStorage.removeItem(CONFIG.NAME_KEY);

    window.location.href = '/index.html';
  },

  getToken() {
    return sessionStorage.getItem(CONFIG.TOKEN_KEY) || localStorage.getItem(CONFIG.TOKEN_KEY);
  },

  getRole() {
    return sessionStorage.getItem(CONFIG.ROLE_KEY) || localStorage.getItem(CONFIG.ROLE_KEY);
  },

  getDept() {
    return sessionStorage.getItem(CONFIG.DEPT_KEY) || localStorage.getItem(CONFIG.DEPT_KEY);
  },

  getName() {
    return sessionStorage.getItem(CONFIG.NAME_KEY) || localStorage.getItem(CONFIG.NAME_KEY);
  },

  isLoggedIn() {
    return !!this.getToken();
  },
};