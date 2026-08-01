requireRole('checker');

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.checkerQueue();
  const list = el('#queue-list');

  if (!data.length) {
    list.innerHTML = '<p>No requests waiting for review.</p>';
    return;
  }

  list.innerHTML = data.map((stage) => `
    <div class="card">
      <strong>${stage.LoanRequest.loanType}</strong> - ₹${stage.LoanRequest.amountRequested}
      <div><a href="verify.html?id=${stage.LoanRequest.id}">Review</a></div>
    </div>
  `).join('');
}

render();