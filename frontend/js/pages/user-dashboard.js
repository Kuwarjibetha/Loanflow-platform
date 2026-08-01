requireRole('user');

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.myRequests();
  const list = el('#request-list');

  if (!data.length) {
    list.innerHTML = '<p>No requests yet.</p>';
    return;
  }

  list.innerHTML = data.map((r) => `
    <div class="card">
      <strong>${r.loanType}</strong> - ₹${r.amountRequested}
      <span class="badge badge--${r.status === 'approved' ? 'approved' : r.status === 'returned_to_user' ? 'rejected' : 'progress'}">${r.status}</span>
      <div><a href="request-status.html?id=${r.id}">View status</a></div>
    </div>
  `).join('');
}

render();