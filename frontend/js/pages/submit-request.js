requireRole('user');
loadComponent('#navbar-slot', '../../components/navbar.html')
  .then(() => el('#nav-logout').addEventListener('click', () => authService.logout()));

el('#submit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    loanType: el('#loanType').value,
    amountRequested: Number(el('#amountRequested').value),
  };

  try {
    await requestService.submit(payload);
    window.location.href = 'dashboard.html';
  } catch (err) {
    showError('#error-box', err.message);
  }
});