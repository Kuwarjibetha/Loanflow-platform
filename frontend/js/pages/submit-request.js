requireRole('user');
loadComponent('#navbar-slot', '../../components/navbar.html')
  .then(() => el('#nav-logout').addEventListener('click', () => authService.logout()));

el('#submit-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const payload = {
    loanType: el('#loanType').value,
    amountRequested: Number(el('#amountRequested').value),
  };

  try {
    const { data: request } = await requestService.submit(payload);
    const fileInput = el('#documentFile');
    if (fileInput.files.length > 0) {
      await requestService.uploadDocument(request.id, fileInput.files[0], el('#docType').value);
    }
    window.location.href = 'dashboard.html';
  } catch (err) {
    showError('#error-box', err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});