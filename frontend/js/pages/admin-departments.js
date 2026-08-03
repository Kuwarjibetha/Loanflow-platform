requireRole('admin');

// ── State ────────────────────────────────────────────────────────────────────
// departments is the live list used to re-render; edits happen in-place by id.
let departments = [];

// ── Helpers ──────────────────────────────────────────────────────────────────
function showAddError(msg) {
  const box = el('#add-error');
  box.textContent = msg;
  box.style.display = msg ? 'block' : 'none';
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderList() {
  const container = el('#dept-list');

  if (!departments.length) {
    container.innerHTML = `<div class="empty"><p>No departments yet. Add one above.</p></div>`;
    return;
  }

  // Sort ascending by sequenceOrder before rendering
  const sorted = [...departments].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  container.innerHTML = sorted.map((d) => `
    <div class="doc-row" id="dept-row-${d.id}" style="flex-wrap:wrap; gap:10px; align-items:flex-start;">

      <!-- View mode (shown by default) -->
      <div id="view-${d.id}" style="flex:1; display:flex; align-items:center; gap:12px; min-width:0;">
        <span style="
          width:26px; height:26px; border-radius:6px;
          background:var(--c-accent-bg); color:var(--c-accent);
          font-size:11px; font-weight:700; display:grid; place-items:center; flex-shrink:0;
        ">${d.sequenceOrder}</span>
        <span style="font-size:14px; font-weight:500;">${d.name}</span>
      </div>

      <!-- Edit mode (hidden by default) -->
      <div id="edit-${d.id}" style="flex:1; display:none; gap:8px; flex-wrap:wrap;">
        <input
          id="edit-name-${d.id}"
          type="text"
          value="${d.name}"
          style="flex:2; min-width:120px; padding:7px 10px; border:1px solid var(--c-border-2); border-radius:var(--radius-sm); font-size:13px;"
        >
        <input
          id="edit-order-${d.id}"
          type="number"
          value="${d.sequenceOrder}"
          min="0"
          style="flex:1; min-width:60px; padding:7px 10px; border:1px solid var(--c-border-2); border-radius:var(--radius-sm); font-size:13px;"
        >
      </div>

      <!-- Action buttons -->
      <div id="actions-${d.id}" style="display:flex; gap:6px; flex-shrink:0;">
        <!-- View-mode buttons -->
        <button class="btn btn--outline" style="font-size:12px; padding:5px 10px;"
          onclick="startEdit('${d.id}')">Edit</button>
        <button class="btn btn--danger"  style="font-size:12px; padding:5px 10px;"
          onclick="deleteDept('${d.id}')">Delete</button>
      </div>

    </div>
  `).join('');
}

// ── Edit mode ────────────────────────────────────────────────────────────────
window.startEdit = function(id) {
  el(`#view-${id}`).style.display   = 'none';
  el(`#edit-${id}`).style.display   = 'flex';
  el(`#actions-${id}`).innerHTML = `
    <button class="btn btn--primary" style="font-size:12px; padding:5px 10px;"
      onclick="saveEdit('${id}')">Save</button>
    <button class="btn btn--ghost" style="font-size:12px; padding:5px 10px;"
      onclick="cancelEdit('${id}')">Cancel</button>
  `;
};

window.cancelEdit = function(id) {
  // Re-render from state (discards changes)
  renderList();
};

window.saveEdit = async function(id) {
  const name         = el(`#edit-name-${id}`).value.trim();
  const sequenceOrder = Number(el(`#edit-order-${id}`).value);

  if (!name) { alert('Name cannot be empty.'); return; }

  try {
    const { data } = await requestService.adminUpdateDepartment(id, { name, sequenceOrder });
    // Update local state
    const idx = departments.findIndex((d) => d.id === id);
    if (idx !== -1) departments[idx] = data;
    renderList();
  } catch (err) {
    alert('Failed to update: ' + err.message);
  }
};

// ── Delete ───────────────────────────────────────────────────────────────────
window.deleteDept = async function(id) {
  const dept = departments.find((d) => d.id === id);
  if (!confirm(`Delete "${dept?.name}"? This cannot be undone.`)) return;

  try {
    await requestService.adminDeleteDepartment(id);
    departments = departments.filter((d) => d.id !== id);
    renderList();
  } catch (err) {
    alert('Failed to delete: ' + err.message);
  }
};

// ── Add ──────────────────────────────────────────────────────────────────────
async function addDepartment() {
  showAddError('');
  const name         = el('#new-name').value.trim();
  const sequenceOrder = Number(el('#new-order').value);

  if (!name) { showAddError('Name is required.'); return; }
  if (el('#new-order').value === '') { showAddError('Sequence order is required.'); return; }

  try {
    const { data } = await requestService.adminCreateDepartment(name, sequenceOrder);
    departments.push(data);
    el('#new-name').value  = '';
    el('#new-order').value = '';
    renderList();
  } catch (err) {
    showAddError(err.message);
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
async function render() {
  await loadComponent('#navbar-slot', '../../components/navbar.html');
  el('#nav-logout').addEventListener('click', () => authService.logout());

  try {
    const { data } = await requestService.adminListDepartments();
    departments = data;
    renderList();
  } catch (err) {
    el('#dept-list').innerHTML = `<div class="alert alert--error">${err.message}</div>`;
  }

  el('#add-btn').addEventListener('click', addDepartment);

  // Also submit on Enter in either add-form input
  ['#new-name', '#new-order'].forEach((sel) => {
    el(sel).addEventListener('keydown', (e) => { if (e.key === 'Enter') addDepartment(); });
  });
}

render();
