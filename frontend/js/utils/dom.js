function el(selector) {
  return document.querySelector(selector);
}

function showError(container, message) {
  const box = el(container);
  if (box) {
    box.textContent = message;
    box.style.display = 'block';
  }
}

async function initNavbarNotifications() {
  const btn = el('#nav-notif-btn');
  const dropdown = el('#notif-dropdown');
  const closeBtn = el('#notif-close');
  const badge = el('#notif-badge');
  const list = el('#notif-list');
  const deptBadge = el('#nav-dept-badge');

  // Render role & department badge
  if (deptBadge && typeof authService !== 'undefined') {
    const role = authService.getRole();
    const dept = authService.getDept();

    if (role === 'approver') {
      deptBadge.textContent = dept ? `Approver (${dept})` : 'Approver';
      deptBadge.className = 'badge badge--pending';
      deptBadge.style.display = 'inline-flex';
    } else if (role === 'checker') {
      deptBadge.textContent = 'Checker Queue';
      deptBadge.className = 'badge badge--progress';
      deptBadge.style.display = 'inline-flex';
    } else if (role === 'admin') {
      deptBadge.textContent = 'Admin Portal';
      deptBadge.className = 'badge badge--rejected';
      deptBadge.style.display = 'inline-flex';
    } else if (role === 'user') {
      deptBadge.textContent = 'Applicant';
      deptBadge.className = 'badge badge--approved';
      deptBadge.style.display = 'inline-flex';
    } else {
      deptBadge.style.display = 'none';
    }
  }

  if (!btn || !dropdown) return;

  btn.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  };

  if (closeBtn) {
    closeBtn.onclick = () => { dropdown.style.display = 'none'; };
  }

  document.addEventListener('click', (e) => {
    if (dropdown && !dropdown.contains(e.target) && e.target !== btn) {
      dropdown.style.display = 'none';
    }
  });

  try {
    const { data: notifications } = await requestService.getNotifications();
    const unread = (notifications || []).filter(n => !n.read);

    if (badge) {
      if (unread.length > 0) {
        badge.textContent = unread.length;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }

    if (list) {
      if (!notifications || notifications.length === 0) {
        list.innerHTML = `<p style="color:var(--c-muted); font-size:13px; text-align:center; padding:12px 0;">No notifications</p>`;
      } else {
        list.innerHTML = notifications.map(n => `
          <div style="padding: 10px; border-bottom: 1px solid var(--c-border); margin-bottom: 6px; ${!n.read ? 'background:var(--c-accent-bg); border-radius:var(--radius-sm);' : ''}">
            <div style="font-size:13px; color:var(--c-text); line-height:1.4;">${n.message}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
              <span style="font-size:11px; color:var(--c-muted);">${new Date(n.createdAt).toLocaleDateString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
              ${!n.read ? `<button onclick="markNotifRead('${n.id}')" class="btn btn--ghost" style="font-size:11px; padding:2px 6px; color:var(--c-accent);">Mark read</button>` : ''}
            </div>
          </div>
        `).join('');
      }
    }
  } catch (err) {
   
  }
}

window.markNotifRead = async function(id) {
  try {
    await requestService.markNotificationRead(id);
    initNavbarNotifications();
  } catch (err) {
    alert('Failed to mark notification as read: ' + err.message);
  }
};

async function loadComponent(targetSelector, componentPath) {
  const res = await fetch(componentPath);
  const html = await res.text();
  document.querySelector(targetSelector).innerHTML = html;
  if (targetSelector === '#navbar-slot') {
    initNavbarNotifications();
  }
}