requireRole('user');

function statusClass(s) {
  if (s === 'approved') return 'approved';
  if (s === 'returned_to_user') return 'rejected';
  return 'progress';
}

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.myRequests();
  const list = el('#request-list');

  if (!data.length) {
    list.innerHTML = `
      <div class="empty">
        <p style="font-size:15px; font-weight:500; margin-bottom:6px;">No requests yet</p>
        <p>Submit your first loan request to get started.</p>
      </div>`;
    return;
  }

  list.innerHTML = data.map((r) => `
    <a href="request-status.html?id=${r.id}" class="req-row">
      <div class="req-row__left">
        <span class="req-row__title">${r.loanType.charAt(0).toUpperCase() + r.loanType.slice(1)} Loan</span>
        <span class="req-row__meta">₹${Number(r.amountRequested).toLocaleString('en-IN')} &middot; ${new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
      </div>
      <span class="badge badge--${statusClass(r.status)}">${r.status.replace(/_/g, ' ')}</span>
    </a>
  `).join('');
}

render();