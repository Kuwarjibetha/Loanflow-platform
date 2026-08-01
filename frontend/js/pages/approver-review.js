requireRole('approver');

const requestId = new URLSearchParams(window.location.search).get('id');

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
}

el('#approve-btn').addEventListener('click', async () => {
  const remarks = el('#remarks').value;
  try {
    await requestService.approverApprove(requestId, remarks);
    window.location.href = 'queue.html';
  } catch (err) {
    alert(err.message);
  }
});

el('#reroute-btn').addEventListener('click', async () => {
  const targetDepartmentId = prompt('Enter target department ID:');
  if (!targetDepartmentId) return;
  const remarks = el('#remarks').value;
  try {
    await requestService.approverReroute(requestId, targetDepartmentId, remarks);
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
    await requestService.approverReturn(requestId, remarks);
    window.location.href = 'queue.html';
  } catch (err) {
    alert(err.message);
  }
});

render();