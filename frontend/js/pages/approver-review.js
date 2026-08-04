requireRole('approver');

const requestId = new URLSearchParams(window.location.search).get('id');

async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  const deptName = authService.getDept() || '';
  const subtitle = el('#dept-subtitle');
  if (subtitle && deptName) {
    let cleanDept = deptName.replace(/\s*approver\s*/gi, '').trim();
    if (cleanDept && !cleanDept.toLowerCase().includes('dept')) {
      cleanDept = cleanDept + ' Department';
    }
    subtitle.textContent = `Reviewing as: ${cleanDept}`;
  }

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

let departmentsLoaded = false;

el('#reroute-btn').addEventListener('click', async () => {
  const rerouteBox = el('#reroute-box');
  const isHidden = rerouteBox.style.display === 'none';
  rerouteBox.style.display = isHidden ? 'block' : 'none';

  if (isHidden && !departmentsLoaded) {
    try {
      const { data: depts } = await requestService.approverListDepartments();
      const select = el('#target-dept-select');
      if (!depts || !depts.length) {
        select.innerHTML = `<option value="">No departments available</option>`;
      } else {
        select.innerHTML = depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
      }
      departmentsLoaded = true;
    } catch (err) {
      alert('Failed to load departments: ' + err.message);
    }
  }
});

el('#cancel-reroute-btn').addEventListener('click', () => {
  el('#reroute-box').style.display = 'none';
});

el('#confirm-reroute-btn').addEventListener('click', async () => {
  const targetDepartmentId = el('#target-dept-select').value;
  if (!targetDepartmentId) {
    alert('Please select a target department');
    return;
  }
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