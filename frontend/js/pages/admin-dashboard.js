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
    <div class="card" style="margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${r.loanType.charAt(0).toUpperCase() + r.loanType.slice(1)} Loan</strong> - ₹${Number(r.amountRequested).toLocaleString('en-IN')}
          <span class="badge badge--${badgeClass(r.status)}" style="margin-left:8px;">${r.status.replace(/_/g, ' ')}</span>
        </div>
        <a href="audit-logs.html?requestId=${r.id}" class="btn btn--outline" style="font-size:11px; padding:4px 10px;">Audit Trail ↗</a>
      </div>
      <p style="font-size:12px; color:var(--c-muted); margin-top:8px;">
        Applicant ID: ${r.userId.slice(0, 8)}... | Request ID: ${r.id.slice(0, 8)}... | Created: ${new Date(r.createdAt).toLocaleDateString('en-IN')}
      </p>
    </div>
  `).join('');
}

render();