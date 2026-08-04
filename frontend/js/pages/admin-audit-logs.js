requireRole('admin');

function actionBadgeClass(action) {
  if (action === 'REQUEST_APPROVED' || action === 'STAGE_APPROVED' || action === 'STAGE_FORWARDED') return 'approved';
  if (action === 'REQUEST_RETURNED') return 'rejected';
  if (action === 'STAGE_REROUTED') return 'pending';
  return 'progress';
}

function formatActionName(action) {
  return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const requestId = new URLSearchParams(window.location.search).get('requestId');
  const filterIndicator = el('#filter-indicator');

  if (requestId) {
    filterIndicator.style.display = 'block';
    filterIndicator.innerHTML = `Filtered by Request ID: <strong>${requestId.slice(0, 8)}...</strong> &bull; <a href="audit-logs.html">View All Logs</a>`;
  }

  const list = el('#audit-log-list');

  try {
    const { data: logs } = await requestService.adminAuditLogs(requestId);

    if (!logs || !logs.length) {
      list.innerHTML = `<div class="empty"><p>No audit log entries found.</p></div>`;
      return;
    }

    list.innerHTML = logs.map((log) => {
      const actorName = log.user ? log.user.name : 'System / Unknown';
      const actorEmail = log.user ? log.user.email : '';
      const actorRole = log.user ? log.user.role : '';
      const loanType = log.loanRequest ? log.loanRequest.loanType : 'Loan Request';
      const formattedDate = new Date(log.createdAt).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });

      let detailsText = '';
      if (log.details) {
        if (typeof log.details === 'object') {
          const parts = [];
          if (log.details.remarks) parts.push(`Remarks: "${log.details.remarks}"`);
          if (log.details.stageRole) parts.push(`Stage: ${log.details.stageRole}`);
          if (log.details.amountRequested) parts.push(`Amount: ₹${Number(log.details.amountRequested).toLocaleString('en-IN')}`);
          detailsText = parts.length > 0 ? parts.join(' &bull; ') : JSON.stringify(log.details);
        } else {
          detailsText = String(log.details);
        }
      }

      return `
        <div class="card" style="margin-bottom: 12px; padding: 16px 20px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
            <div>
              <span class="badge badge--${actionBadgeClass(log.action)}" style="margin-bottom:6px;">${formatActionName(log.action)}</span>
              <p style="font-size:14px; font-weight:600;">${actorName} <span style="font-size:12px; font-weight:400; color:var(--c-muted);">(${actorEmail} &bull; ${actorRole})</span></p>
            </div>
            <span style="font-size:12px; color:var(--c-muted); font-weight:500;">${formattedDate}</span>
          </div>
          <div style="margin-top:8px; font-size:13px; color:var(--c-text);">
            Request: <strong>${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan</strong> 
            <a href="audit-logs.html?requestId=${log.loanRequestId}" style="font-size:12px; margin-left:6px; color:var(--c-accent);">(Req ID: ${log.loanRequestId.slice(0, 8)}...)</a>
          </div>
          ${detailsText ? `<div style="margin-top:6px; font-size:12px; color:var(--c-muted); background:var(--c-bg); padding:6px 10px; border-radius:var(--radius-sm);">${detailsText}</div>` : ''}
        </div>
      `;
    }).join('');
  } catch (err) {
    list.innerHTML = `<div class="alert alert--error">${err.message}</div>`;
  }
}

render();
