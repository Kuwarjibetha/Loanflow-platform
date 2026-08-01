el('#register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: el('#name').value,
    email: el('#email').value,
    password: el('#password').value,
  };

  try {
    await authService.register(payload);
    alert('Account created! Please log in.');
    window.location.href = 'login.html';
  } catch (err) {
    showError('#error-box', err.message);
  }
});