requireRole('user');

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const id = new URLSearchParams(window.location.search).get('id');
  const { data } = await requestService.status(id);

  el('#status-detail').innerHTML = `
    <div class="card">
      <p><strong>Loan type:</strong> ${data.loanType}</p>
      <p><strong>Amount:</strong> ₹${data.amountRequested}</p>
      <p><strong>Status:</strong> <span class="badge badge--progress">${data.status}</span></p>
    </div>
    <h3 style="margin:16px 0 8px;">Stages</h3>
    ${(data.stages || []).sort((a, b) => a.sequenceOrder - b.sequenceOrder).map((s) => `
      <div class="card">
        ${s.role}${s.departmentId ? ' - dept ' + s.departmentId.slice(0, 8) : ''}
        - <span class="badge badge--${s.status === 'approved' ? 'approved' : s.status === 'returned' ? 'rejected' : 'pending'}">${s.status}</span>
        ${s.remarks ? `<p style="margin-top:8px; font-size:14px; color:var(--color-muted);">"${s.remarks}"</p>` : ''}
      </div>
    `).join('')}
  `;
}

render();