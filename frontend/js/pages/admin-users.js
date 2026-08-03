requireRole('admin');

// ── State ────────────────────────────────────────────────────────────────────
let users       = [];
let departments = [];

const ROLES = ['user', 'checker', 'approver', 'admin'];

// ── Helpers ──────────────────────────────────────────────────────────────────
function roleBadgeClass(role) {
  if (role === 'admin')    return 'rejected';   // red — stands out
  if (role === 'checker')  return 'progress';   // blue
  if (role === 'approver') return 'pending';    // amber
  return 'approved';                            // green for regular user
}

function deptName(departmentId) {
  if (!departmentId) return '—';
  const d = departments.find((d) => d.id === departmentId);
  return d ? d.name : departmentId.slice(0, 8) + '…';
}

function deptOptions(selectedId) {
  const none = `<option value="">— None —</option>`;
  const opts = departments
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
    .map((d) => `<option value="${d.id}" ${d.id === selectedId ? 'selected' : ''}>${d.name}</option>`)
    .join('');
  return none + opts;
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderList() {
  const container = el('#user-list');

  if (!users.length) {
    container.innerHTML = `<div class="empty"><p>No users found.</p></div>`;
    return;
  }

  container.innerHTML = users.map((u) => `
    <div class="doc-row" id="user-row-${u.id}" style="flex-wrap:wrap; gap:10px; align-items:center;">

      <!-- View mode -->
      <div id="view-${u.id}" style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:3px;">
        <span style="font-size:14px; font-weight:500;">${u.name}</span>
        <span style="font-size:12px; color:var(--c-muted);">${u.email}</span>
      </div>

      <div id="view-meta-${u.id}" style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
        <span class="badge badge--${roleBadgeClass(u.role)}">${u.role}</span>
        ${['checker','approver'].includes(u.role)
          ? `<span style="font-size:12px; color:var(--c-muted);">${deptName(u.departmentId)}</span>`
          : ''}
      </div>

      <!-- Edit mode (hidden) -->
      <div id="edit-${u.id}" style="display:none; flex-wrap:wrap; gap:8px; align-items:center; flex:1; min-width:280px;">
        <select id="edit-role-${u.id}"
          style="padding:7px 10px; border:1px solid var(--c-border-2); border-radius:var(--radius-sm); font-size:13px;"
          onchange="toggleDeptSelect('${u.id}')">
          ${ROLES.map((r) => `<option value="${r}" ${r === u.role ? 'selected' : ''}>${r}</option>`).join('')}
        </select>

        <select id="edit-dept-${u.id}"
          style="padding:7px 10px; border:1px solid var(--c-border-2); border-radius:var(--radius-sm); font-size:13px;
                 display:${['checker','approver'].includes(u.role) ? 'block' : 'none'};">
          ${deptOptions(u.departmentId)}
        </select>
      </div>

      <!-- Action buttons -->
      <div id="actions-${u.id}" style="display:flex; gap:6px; flex-shrink:0;">
        <button class="btn btn--outline" style="font-size:12px; padding:5px 10px;"
          onclick="startEdit('${u.id}')">Edit</button>
      </div>

    </div>
  `).join('');
}

// ── Edit mode ────────────────────────────────────────────────────────────────
window.toggleDeptSelect = function(id) {
  const role = el(`#edit-role-${id}`).value;
  el(`#edit-dept-${id}`).style.display = ['checker', 'approver'].includes(role) ? 'block' : 'none';
};

window.startEdit = function(id) {
  el(`#view-meta-${id}`).style.display = 'none';
  el(`#edit-${id}`).style.display      = 'flex';
  el(`#actions-${id}`).innerHTML = `
    <button class="btn btn--primary" style="font-size:12px; padding:5px 10px;"
      onclick="saveEdit('${id}')">Save</button>
    <button class="btn btn--ghost"   style="font-size:12px; padding:5px 10px;"
      onclick="cancelEdit('${id}')">Cancel</button>
  `;
};

window.cancelEdit = function() {
  renderList(); // discard — re-render from state
};

window.saveEdit = async function(id) {
  const role         = el(`#edit-role-${id}`).value;
  const departmentId = el(`#edit-dept-${id}`).value || null;

  try {
    const { data } = await requestService.adminUpdateUser(id, { role, departmentId });
    // Merge department object back in if available
    if (data.departmentId) {
      data.department = departments.find((d) => d.id === data.departmentId) || null;
    }
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) users[idx] = { ...users[idx], ...data };
    renderList();
  } catch (err) {
    alert('Failed to update user: ' + err.message);
    renderList(); // still re-render so edit mode collapses
  }
};

// ── Init ─────────────────────────────────────────────────────────────────────
async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  try {
    // Fetch both in parallel
    const [usersResp, deptsResp] = await Promise.all([
      requestService.adminListUsers(),
      requestService.adminListDepartments(),
    ]);
    users       = usersResp.data;
    departments = deptsResp.data;
    renderList();
  } catch (err) {
    el('#user-list').innerHTML = `<div class="alert alert--error">${err.message}</div>`;
  }
}

render();
