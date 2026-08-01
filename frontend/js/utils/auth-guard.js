function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const role = authService.getRole();

  if (!authService.isLoggedIn() || !roles.includes(role)) {
    window.location.href = '/pages/auth/login.html';
  }
}