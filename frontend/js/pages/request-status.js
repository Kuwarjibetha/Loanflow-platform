requireRole('user');

function docBadgeClass(status) {
  if (status === 'verified') return 'approved';
  if (status === 'invalid') return 'rejected';
  return 'pending';
}

function stageDotClass(s) {
  if (s === 'approved') return 'timeline-dot--done';
  if (s === 'returned') return 'timeline-dot--reject';
  if (s === 'in_progress') return 'timeline-dot--active';
  return '';
}

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());
  const id = new URLSearchParams(window.location.search).get('id');
  const { data } = await requestService.status(id);
  // DEBUG: inspect full API response in browser DevTools Console — remove after confirming
  console.log('[request-status] raw API data:', JSON.stringify(data, null, 2));

  const statusClass = data.status === 'approved' ? 'approved' : data.status === 'returned_to_user' ? 'rejected' : 'progress';

  el('#status-detail').innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <p style="font-size:12px; color:var(--c-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600; margin-bottom:4px;">Loan Type</p>
          <p style="font-size:18px; font-weight:600;">${data.loanType.charAt(0).toUpperCase() + data.loanType.slice(1)} Loan</p>
        </div>
        <span class="badge badge--${statusClass}">${data.status.replace(/_/g, ' ')}</span>
      </div>
      <div class="divider"></div>
      <p style="font-size:13px; color:var(--c-muted);">Amount Requested</p>
      <p style="font-size:22px; font-weight:600; letter-spacing:-0.5px;">₹${Number(data.amountRequested).toLocaleString('en-IN')}</p>
    </div>

    <p class="section-label" style="margin: 22px 0 10px;">Documents</p>
    ${!data.documents || !data.documents.length
      ? `<div class="card--flat"><p style="color:var(--c-muted); font-size:13px;">No documents uploaded yet.</p></div>`
      : data.documents.map((d) => `
        <div class="doc-row">
          <div>
            <p class="doc-row__name">${d.docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
            <a class="doc-row__link" href="${d.filePath}" target="_blank">View document ↗</a>
            ${d.invalidReason ? `<p class="doc-row__reason">Reason: "${d.invalidReason}"</p>` : ''}
          </div>
          <span class="badge badge--${docBadgeClass(d.verificationStatus)}">${d.verificationStatus}</span>
        </div>
      `).join('')
    }

    <p class="section-label" style="margin: 22px 0 10px;">Approval Stages</p>
    <div class="timeline">
      ${(data.stages || []).sort((a, b) => a.sequenceOrder - b.sequenceOrder).map((s) => `
        <div class="timeline-item">
          <div class="timeline-dot ${stageDotClass(s.status)}"></div>
          <div class="timeline-body">
            <p>${s.role.charAt(0).toUpperCase() + s.role.slice(1)}${s.departmentId ? ` <span style="color:var(--c-muted); font-weight:400; font-size:12px;">dept ${s.departmentId.slice(0, 8)}</span>` : ''}</p>
            <small><span class="badge badge--${s.status === 'approved' ? 'approved' : s.status === 'returned' ? 'rejected' : 'progress'}">${s.status.replace(/_/g, ' ')}</span></small>
            ${s.remarks ? `<blockquote>"${s.remarks}"</blockquote>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

render();