requireRole('checker');
const requestId = new URLSearchParams(window.location.search).get('id');

function docBadgeClass(status) {
  if (status === 'verified') return 'approved';
  if (status === 'invalid') return 'rejected';
  return 'pending';
}

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const { data } = await requestService.status(requestId);
  el('#request-detail').innerHTML = `
    <div class="card">
      <p><strong>Loan type:</strong> ${data.loanType}</p>
      <p><strong>Amount:</strong> ₹${data.amountRequested}</p>
      <p><strong>Status:</strong> ${data.status}</p>
    </div>
  `;

  renderDocuments(data.documents || []);
}

function renderDocuments(documents) {
  const list = el('#document-list');

  if (!documents.length) {
    list.innerHTML = '<div class="card"><p style="color:var(--color-muted);">No documents uploaded.</p></div>';
    return;
  }

  list.innerHTML = documents.map((d) => `
    <div class="card">
      <a href="${d.filePath}" target="_blank">${d.docType}</a>
      - <span class="badge badge--${docBadgeClass(d.verificationStatus)}">${d.verificationStatus}</span>
      ${d.invalidReason ? `<p style="margin-top:6px; font-size:14px; color:var(--color-muted);">Reason: "${d.invalidReason}"</p>` : ''}
      <div style="margin-top:10px;">
        <button class="btn btn--outline" data-verify="${d.id}">Mark Verified</button>
        <button class="btn btn--danger" data-invalid="${d.id}">Mark Invalid</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-verify]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await requestService.checkerVerifyDocument(requestId, btn.dataset.verify, 'verified');
        render();
      } catch (err) {
        alert(err.message);
      }
    });
  });

  document.querySelectorAll('[data-invalid]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const reason = prompt('Reason this document is invalid:');
      if (!reason) return;
      try {
        await requestService.checkerVerifyDocument(requestId, btn.dataset.invalid, 'invalid', reason);
        render();
      } catch (err) {
        alert(err.message);
      }
    });
  });
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
  if (!remarks) {
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