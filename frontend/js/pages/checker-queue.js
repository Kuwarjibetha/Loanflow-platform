requireRole('checker');

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.checkerQueue();
  const list = el('#queue-list');

  if (!data.length) {
    list.innerHTML = `
      <div class="empty">
        <p style="font-size:15px; font-weight:500; margin-bottom:6px;">Queue is empty</p>
        <p>No requests waiting for review right now.</p>
      </div>`;
    return;
  }

  list.innerHTML = data.map((stage) => `
    <a href="verify.html?id=${stage.LoanRequest.id}" class="req-row">
      <div class="req-row__left">
        <span class="req-row__title">${stage.LoanRequest.loanType.charAt(0).toUpperCase() + stage.LoanRequest.loanType.slice(1)} Loan</span>
        <span class="req-row__meta">₹${Number(stage.LoanRequest.amountRequested).toLocaleString('en-IN')}</span>
      </div>
      <span class="badge badge--progress">Review</span>
    </a>
  `).join('');
}

render();