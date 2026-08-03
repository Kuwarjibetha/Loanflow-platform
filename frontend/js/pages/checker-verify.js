requireRole('checker');

const requestId = new URLSearchParams(window.location.search).get('id');

function docBadgeClass(status) {
  if (status === 'verified') return 'approved';
  if (status === 'invalid')  return 'rejected';
  return 'pending';
}

// Renders the documents section and wires verify buttons.
function renderDocs(documents) {
  const container = el('#doc-section');

  if (!documents || !documents.length) {
    container.innerHTML = `<p style="color:var(--c-muted); font-size:13px;">No documents uploaded for this request.</p>`;
    return;
  }

  container.innerHTML = documents.map((d) => `
    <div class="doc-row" id="doc-${d.id}" style="flex-wrap:wrap; gap:10px;">
      <div style="flex:1; min-width:0;">
        <p class="doc-row__name">${d.docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
        <a class="doc-row__link" href="${d.filePath}" target="_blank">View document ↗</a>
        <div id="reason-wrap-${d.id}" style="display:none; margin-top:8px;">
          <input
            type="text"
            id="reason-${d.id}"
            placeholder="Enter reason for rejection…"
            style="width:100%; padding:7px 10px; border:1px solid var(--c-border-2); border-radius:var(--radius-sm); font-size:13px;"
          >
        </div>
      </div>
      <div style="display:flex; align-items:flex-start; gap:6px; flex-shrink:0;">
        <span class="badge badge--${docBadgeClass(d.verificationStatus)}" id="badge-${d.id}">${d.verificationStatus}</span>
        <button
          class="btn btn--outline btn--valid"
          style="font-size:12px; padding:5px 10px;"
          id="valid-btn-${d.id}"
          onclick="markDoc('${d.id}', 'verified')"
        >✓ Valid</button>
        <button
          class="btn btn--outline btn--invalid"
          style="font-size:12px; padding:5px 10px;"
          id="invalid-btn-${d.id}"
          onclick="showInvalidInput('${d.id}')"
        >✗ Invalid</button>
      </div>
    </div>
  `).join('');
}

// Shows the reason input + confirm button when marking invalid.
window.showInvalidInput = function(docId) {
  el(`#reason-wrap-${docId}`).style.display = 'block';

  // Replace the "✗ Invalid" button with a "Confirm" button
  el(`#invalid-btn-${docId}`).outerHTML = `
    <button
      class="btn btn--danger"
      style="font-size:12px; padding:5px 10px;"
      id="confirm-btn-${docId}"
      onclick="markDoc('${docId}', 'invalid')"
    >Confirm</button>
  `;
};

// Calls PATCH /checker/:requestId/documents/:docId and refreshes the badge.
window.markDoc = async function(docId, status) {
  const invalidReason = status === 'invalid' ? (el(`#reason-${docId}`)?.value || '') : null;

  if (status === 'invalid' && !invalidReason.trim()) {
    el(`#reason-${docId}`).style.border = '1px solid var(--c-red)';
    el(`#reason-${docId}`).placeholder = 'Reason is required';
    return;
  }

  try {
    await requestService.checkerVerifyDocument(requestId, docId, status, invalidReason);

    // Update badge in-place — no full re-render needed
    const badge = el(`#badge-${docId}`);
    badge.textContent = status;
    badge.className = `badge badge--${docBadgeClass(status)}`;

    // Hide action buttons after decision
    const validBtn  = document.getElementById(`valid-btn-${docId}`);
    const reasonWrap = document.getElementById(`reason-wrap-${docId}`);
    if (validBtn) validBtn.remove();
    // Remove the confirm button too (it replaced invalid-btn, so target by class near badge)
    badge.parentElement.querySelectorAll('button').forEach(b => b.remove());
    if (reasonWrap) reasonWrap.remove();

    if (status === 'invalid') {
      const reasonText = document.createElement('p');
      reasonText.className = 'doc-row__reason';
      reasonText.textContent = `Reason: "${invalidReason}"`;
      el(`#doc-${docId} .doc-row__name`).insertAdjacentElement('afterend', reasonText);
    }
  } catch (err) {
    alert('Failed to update document: ' + err.message);
  }
};

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.status(requestId);

  const statusClass = data.status === 'approved' ? 'approved' : data.status === 'returned_to_user' ? 'rejected' : 'progress';

  el('#request-detail').innerHTML = `
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
      <p style="font-size:20px; font-weight:600;">₹${Number(data.amountRequested).toLocaleString('en-IN')}</p>
    </div>

    <p class="section-label" style="margin: 20px 0 10px;">Documents</p>
    <div id="doc-section"></div>
  `;

  renderDocs(data.documents);
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
  if (!remarks.trim()) {
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