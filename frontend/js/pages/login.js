el('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = el('#email').value;
  const password = el('#password').value;

  try {
    const { role } = await authService.login(email, password);
    const redirects = {
      user: '../user/dashboard.html',
      checker: '../checker/queue.html',
      approver: '../approver/queue.html',
      admin: '../admin/dashboard.html',
    };
    window.location.href = redirects[role] || '../user/dashboard.html';
  } catch (err) {
    showError('#error-box', err.message);
  }
});