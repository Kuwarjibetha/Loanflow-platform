requireRole('admin');

function badgeClass(status) {
  if (status === 'approved') return 'approved';
  if (status === 'returned_to_user') return 'rejected';
  return 'progress';
}

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.adminAllRequests();

  // Quick summary counts
  const counts = data.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  el('#summary').innerHTML = `
    <div class="card">
      <strong>Total: ${data.length}</strong>
      &nbsp;&nbsp;
      ${Object.entries(counts).map(([status, count]) =>
        `<span class="badge badge--${badgeClass(status)}">${status}: ${count}</span>`
      ).join(' ')}
    </div>
  `;

  if (!data.length) {
    el('#request-list').innerHTML = '<p>No requests in the system.</p>';
    return;
  }

  el('#request-list').innerHTML = data.map((r) => `
    <div class="card">
      <strong>${r.loanType}</strong> - ₹${r.amountRequested}
      <span class="badge badge--${badgeClass(r.status)}">${r.status}</span>
      <p style="font-size:13px; color:var(--color-muted); margin-top:6px;">
        Applicant ID: ${r.userId.slice(0, 8)}... | Created: ${new Date(r.createdAt).toLocaleDateString()}
      </p>
    </div>
  `).join('');
}

render();