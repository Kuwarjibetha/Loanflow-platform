requireRole('checker');

const requestId = new URLSearchParams(window.location.search).get('id');

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.status(requestId);
  el('#request-detail').innerHTML = `
    <div class="card">
      <p><strong>Loan type:</strong> ${data.loanType}</p>
      <p><strong>Amount:</strong> ₹${data.amountRequested}</p>
      <p><strong>Status:</strong> ${data.status}</p>
    </div>
  `;
}

el('#forward-btn').addEventListener('click', async () => {
  const remarks = el('#remarks').value;
  try {
    await requestService.checkerForward(requestId, remarks);
    window.location.href = 'queue.html';
  } catch (err) {
    alert(err.message);
  }
});

el('#return-btn').addEventListener('click', async () => {
  const remarks = el('#remarks').value;
  if (!remarks) {
    alert('Please provide a reason for returning this request.');
    return;
  }
  try {
    await requestService.checkerReturn(requestId, remarks);
    window.location.href = 'queue.html';
  } catch (err) {
    alert(err.message);
  }
});

render();