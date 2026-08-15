/* PropCare prototype - router, state and screens */
(function () {
  var D = window.PropCareData;

  var state = {
    user: null,
    nextReqNum: 1080,
    pendingPhotos: []
  };

  /* ---------------- helpers ---------------- */
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initials(name) {
    return name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toLowerCase();
  }

  function statusClass(sid) { return 'st-' + sid; }
  function urgClass(uid) { return 'urg-' + uid; }
  function avatarFor(user) {
    var role = user.role;
    var cls = 'role-' + role;
    return '<span class="avatar ' + cls + '">' + esc(initials(user.name)) + '</span>';
  }

  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function badge(statusId) {
    return '<span class="badge ' + statusClass(statusId) + '">' + D.statusName(statusId) + '</span>';
  }

  function reqRow(r, opts) {
    opts = opts || {};
    var sub = D.catName(r.category) + ' &middot; ' + D.urgName(r.urgency) + ' urgency &middot; ' +
      esc(r.unit) + ' &middot; updated ' + esc(r.updated);
    if (r.techId) sub += ' &middot; ' + esc(D.techName(r.techId));
    return '<div class="request-item" data-id="' + r.id + '">' +
      '<div><div class="r-main">' + esc(r.title) + '</div>' +
      '<div class="r-sub">' + sub + '</div></div>' +
      '<div class="r-right">' + badge(r.status) +
      '<span class="urg ' + urgClass(r.urgency) + '" style="font-size:12px;font-weight:600">' + D.urgName(r.urgency) + '</span></div></div>';
  }

  function reqRowFor(r, opts) {
    opts = opts || {};
    var lines = [];
    lines.push('<span class="trow-main">' + r.id + ' &middot; ' + esc(r.title) + '</span>');
    lines.push('<div class="trow-sub">' + D.catName(r.category) + ' &middot; ' + esc(D.propName(r.propertyId)) + ' &middot; ' + esc(r.unit) + '</div>');
    if (opts.tenant) lines.push('<div class="trow-sub">' + esc(D.userName(r.tenantId)) + '</div>');
    if (r.techId) lines.push('<div class="trow-sub">' + esc(D.techName(r.techId)) + '</div>');
    return '<td>' + lines.join('') + '</td>' +
      '<td>' + badge(r.status) + '</td>' +
      '<td><span class="' + urgClass(r.urgency) + '" style="font-weight:600">' + D.urgName(r.urgency) + '</span></td>' +
      '<td class="trow-sub">' + esc(r.updated) + '</td>';
  }

  function roleLabel(role) {
    return { tenant: 'Tenant', manager: 'Property Manager', technician: 'Technician', admin: 'Administrator' }[role] || role;
  }

  function openCount(list) { return list.filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; }).length; }

  /* ---------------- navigation config ---------------- */
  var NAV = {
    tenant: [
      { key: 'overview', label: 'Overview', ico: '\uD83C\uDFE0', href: '#/overview' },
      { key: 'requests', label: 'My requests', ico: '\uD83D\uDD27', href: '#/requests' },
      { key: 'properties', label: 'My property', ico: '\uD83C\uDFE2', href: '#/properties' },
      { key: 'notifications', label: 'Notifications', ico: '\uD83D\uDD14', href: '#/notifications' },
      { key: 'mockups', label: 'Mockups', ico: '\uD83D\uDDBC\uFE0F', href: '#/mockups' }
    ],
    manager: [
      { key: 'overview', label: 'Overview', ico: '\uD83C\uDFE0', href: '#/overview' },
      { key: 'requests', label: 'Requests', ico: '\uD83D\uDD27', href: '#/requests' },
      { key: 'properties', label: 'Properties', ico: '\uD83C\uDFE2', href: '#/properties' },
      { key: 'tenants', label: 'Tenants', ico: '\uD83D\uDC65', href: '#/tenants' },
      { key: 'technicians', label: 'Technicians', ico: '\uD83E\uDDD1\u200D\uD83D\uDD27', href: '#/technicians' },
      { key: 'reports', label: 'Reports', ico: '\uD83D\uDCCA', href: '#/reports' },
      { key: 'notifications', label: 'Notifications', ico: '\uD83D\uDD14', href: '#/notifications' },
      { key: 'mockups', label: 'Mockups', ico: '\uD83D\uDDBC\uFE0F', href: '#/mockups' }
    ],
    technician: [
      { key: 'jobs', label: 'Jobs', ico: '\uD83D\uDD27', href: '#/jobs' },
      { key: 'schedule', label: 'Schedule', ico: '\uD83D\uDCC5', href: '#/schedule' },
      { key: 'completed', label: 'Completed', ico: '\u2705', href: '#/completed' },
      { key: 'notifications', label: 'Notifications', ico: '\uD83D\uDD14', href: '#/notifications' },
      { key: 'mockups', label: 'Mockups', ico: '\uD83D\uDDBC\uFE0F', href: '#/mockups' }
    ],
    admin: [
      { key: 'overview', label: 'Overview', ico: '\uD83C\uDFE0', href: '#/overview' },
      { key: 'users', label: 'Users', ico: '\uD83D\uDC64', href: '#/users' },
      { key: 'properties', label: 'Properties', ico: '\uD83C\uDFE2', href: '#/properties' },
      { key: 'categories', label: 'Categories', ico: '\uD83D\uDCD6', href: '#/categories' },
      { key: 'roles', label: 'Roles', ico: '\uD83D\uDD11', href: '#/roles' },
      { key: 'reports', label: 'Reports', ico: '\uD83D\uDCCA', href: '#/reports' },
      { key: 'settings', label: 'Settings', ico: '\u2699\uFE0F', href: '#/settings' },
      { key: 'notifications', label: 'Notifications', ico: '\uD83D\uDD14', href: '#/notifications' },
      { key: 'mockups', label: 'Mockups', ico: '\uD83D\uDDBC\uFE0F', href: '#/mockups' }
    ]
  };

  function renderNav() {
    var user = state.user;
    var nav = document.getElementById('topNav');
    var mobile = document.getElementById('bottomNav');
    var items = NAV[user.role];
    var active = activeKey();
    function links(prefix, mobileIco) {
      return items.map(function (n) {
        var on = n.key === active;
        if (prefix === 'top') {
          return '<a href="' + n.href + '" data-nav="' + n.key + '" class="' + (on ? 'active' : '') + '">' + n.label + '</a>';
        }
        return '<a href="' + n.href + '" data-nav="' + n.key + '" class="' + (on ? 'active' : '') + '">' +
          '<span class="bn-ico">' + n.ico + '</span><span>' + n.label + '</span></a>';
      }).join('');
    }
    nav.innerHTML = links('top');
    mobile.innerHTML = links('mobile');
  }

  function activeKey() {
    var hash = location.hash.replace(/^#\/?/, '');
    var seg = hash.split('/')[0];
    return seg || 'overview';
  }

  function renderShell() {
    var user = state.user;
    document.getElementById('userName').textContent = user.name;
    var av = document.getElementById('userAvatar');
    av.textContent = initials(user.name);
    av.className = 'avatar role-' + user.role;
    renderNav();
    var bc = document.getElementById('breadcrumb');
    var seg = activeKey();
    var items = NAV[user.role];
    var label = '';
    for (var i = 0; i < items.length; i++) if (items[i].key === seg) label = items[i].label;
    if (seg === 'request') label = 'Request detail';
    if (seg === 'job') label = 'Job detail';
    if (seg === 'report') label = 'Report an issue';
    bc.innerHTML = 'Horizon Property Group &rsaquo; <b>' + esc(roleLabel(user.role)) + '</b>' +
      (label ? ' &rsaquo; ' + esc(label) : '');
  }

  function renderBottomNav() {
    var mobile = document.getElementById('bottomNav');
    var user = state.user;
    var items = NAV[user.role];
    var active = activeKey();
    mobile.innerHTML = items.map(function (n) {
      return '<a href="' + n.href + '" data-nav="' + n.key + '" class="' + (n.key === active ? 'active' : '') + '">' +
        '<span class="bn-ico">' + n.ico + '</span><span>' + n.label + '</span></a>';
    }).join('');
  }

  function setUser(user) {
    state.user = user;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    renderShell();
    renderBottomNav();
    route();
  }

  /* ---------------- modal ---------------- */
  function openModal(html) {
    document.getElementById('modalBox').innerHTML = html;
    document.getElementById('modalBackdrop').classList.remove('hidden');
  }
  function closeModal() {
    document.getElementById('modalBackdrop').classList.add('hidden');
  }

  /* ---------------- data ops ---------------- */
  function findReq(id) {
    for (var i = 0; i < D.REQUESTS.length; i++) if (D.REQUESTS[i].id === id) return D.REQUESTS[i];
    return null;
  }

  function setStatus(req, statusId, note) {
    req.status = statusId;
    var now = new Date();
    var when = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
    D.HISTORY[req.id] = D.HISTORY[req.id] || [];
    D.HISTORY[req.id].push({ status: D.statusName(statusId), when: when });
    D.COMMENTS[req.id] = D.COMMENTS[req.id] || [];
    D.COMMENTS[req.id].push({ by: state.user.name, role: roleLabel(state.user.role), when: when, text: note || 'Status updated to ' + D.statusName(statusId) + '.' });
    req.updated = now.toISOString().slice(0, 10);
  }

  function addNotification(title, whenText) {
    // lightweight observer-style notification feed
    state.notifications = state.notifications || [];
    state.notifications.unshift({ title: title, when: whenText });
  }

  /* ---------------- screens ---------------- */
  var body = function () { return document.getElementById('appBody'); };

  function screenOverview() {
    var u = state.user;
    if (u.role === 'tenant') return screenTenantOverview();
    if (u.role === 'manager') return screenManagerOverview();
    if (u.role === 'technician') return screenTechOverview();
    return screenAdminOverview();
  }

  function screenTenantOverview() {
    var reqs = D.requestsForTenant(state.user.id);
    var open = reqs.filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; });
    var need = open.filter(function (r) { return r.urgency === 'high' || r.urgency === 'urgent'; });
    var recent = reqs.slice().sort(function (a, b) { return b.updated < a.updated ? -1 : 1; }).slice(0, 4);
    var today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var name = state.user.name.split(' ')[0];
    var unit = state.user.units || [];
    var cats = D.CATEGORIES.map(function (c) {
      var n = reqs.filter(function (r) { return r.category === c.id; }).length;
      return '<span class="chip">' + esc(c.name) + ' <b>' + n + '</b></span>';
    }).join('');

    body().innerHTML =
      '<div class="hero"><h1>Good ' + (new Date().getHours() < 12 ? 'morning' : 'afternoon') + ', ' + esc(name) + '</h1>' +
      '<p>' + today + ' &middot; Keep an eye on your home. We will keep you updated.</p></div>' +
      '<div class="grid stat-grid">' +
      statCard(open.length, 'Open requests', need.length + ' need priority attention') +
      statCard(3, 'Awaiting action', 'Across your workspace') +
      statCard(8, 'Resolved this month', '<span class="delta">12% ahead</span> of last month') +
      statCard('1.8h', 'Average response', 'operational rhythm') +
      '</div>' +
      '<div class="grid two-col">' +
      '<div class="card"><h3 class="card-title">Recent requests <small>' + open.length + ' open</small></h3>' +
      '<div class="req-list">' + (recent.map(function (r) { return reqRow(r); }).join('') || '<p style="color:var(--muted)">No requests yet.</p>') + '</div>' +
      '<button type="button" class="btn btn-accent btn-block" style="margin-top:14px" data-go="#/report">+ Report an issue</button></div>' +
      '<div>' +
      '<div class="card" style="margin-bottom:16px"><h3 class="card-title">My properties</h3>' +
      (unit.map(function (u) { return '<div class="request-item" style="margin-bottom:8px"><span class="n-ico">\uD83C\uDFE2</span><div><div class="r-main">' + esc(u) + '</div></div></div>'; }).join('')) +
      '</div>' +
      '<div class="card"><h3 class="card-title">Categories</h3><div class="category-row">' + cats + '</div>' +
      '<p style="font-size:12.5px;color:var(--muted);margin-top:12px">Good to know &middot; every update is time-stamped and visible to the right people.</p></div>' +
      '</div></div>';
  }

  function statCard(num, cap, delta) {
    return '<div class="stat"><div class="num">' + num + '</div><div class="cap">' + cap + '</div><div style="font-size:12px">' + delta + '</div></div>';
  }

  function screenManagerOverview() {
    var reqs = D.requestsForManager(state.user.id);
    var open = reqs.filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; });
    var urgent = open.filter(function (r) { return r.urgency === 'urgent' || r.urgency === 'high'; }).length;
    var props = D.PROPERTIES.filter(function (p) { return p.managerId === state.user.id; });
    var queue = reqs.slice().sort(function (a, b) { return (a.urgency === b.urgency) ? 0 : (a.urgency === 'urgent' ? -1 : 1); });
    var name = state.user.name.split(' ')[0];
    body().innerHTML =
      '<div class="hero"><h1>Good morning, ' + esc(name) + '</h1><p>Your managed portfolio &middot; ' + props.length +
      ' properties &middot; ' + open.length + ' open maintenance requests.</p></div>' +
      '<div class="grid stat-grid">' +
      statCard(props.length, 'Properties managed', 'across Cape Town') +
      statCard(open.length, 'Open requests', urgent + ' need priority attention') +
      statCard('92%', 'Occupancy', '23 of 25 units') +
      statCard('1.8h', 'Avg response', 'operational rhythm') +
      '</div>' +
      '<div class="card"><h3 class="card-title">Priority queue</h3><div class="table-wrap"><table><thead><tr>' +
      '<th>Request</th><th>Status</th><th>Priority</th><th>Updated</th></tr></thead><tbody>' +
      queue.slice(0, 6).map(function (r) { return '<tr class="clickable" data-go="#/request/' + r.id + '">' + reqRowFor(r, { tenant: true }) + '</tr>'; }).join('') +
      '</tbody></table></div>' +
      '<button type="button" class="btn btn-ghost" style="margin-top:14px" data-go="#/requests">View all requests</button></div>';
  }

  function screenTechOverview() {
    var jobs = D.requestsForTechnician(state.user.id).filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; });
    var done = D.requestsForTechnician(state.user.id).filter(function (r) { return r.status === 'completed' || r.status === 'closed'; });
    var today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    body().innerHTML =
      '<div class="hero"><h1>Good morning, ' + esc(state.user.name.split(' ')[0]) + '</h1><p>Today &middot; ' + today + ' &middot; ' + jobs.length + ' active job(s) in your queue.</p></div>' +
      '<div class="grid stat-grid">' +
      statCard(jobs.length, 'Active jobs', 'assigned to you') +
      statCard(done.length, 'Completed this month', 'work verified') +
      statCard('1.8h', 'Avg response', 'portfolio-wide') +
      statCard('0', 'Overdue', 'on service plan') +
      '</div>' +
      '<div class="card"><h3 class="card-title">Assigned jobs</h3><div class="req-list">' +
      (jobs.map(function (r) { return reqRow(r); }).join('') || '<p style="color:var(--muted)">No active jobs.</p>') +
      '</div></div>';
  }

  function screenAdminOverview() {
    var all = D.REQUESTS;
    var open = all.filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; });
    body().innerHTML =
      '<div class="hero"><h1>System overview</h1><p>Obs Realty Group &middot; Horizon portfolio &middot; all tenants, properties, technicians and requests.</p></div>' +
      '<div class="grid stat-grid">' +
      statCard(D.USERS.length, 'Users', D.TENANTS.length + ' tenants &middot; 2 managers') +
      statCard(D.PROPERTIES.length, 'Properties', '10 locations, 25 units') +
      statCard(D.TECHNICIANS.length, 'Technicians', '5 on service plan') +
      statCard(open.length, 'Open requests', 'across all properties') +
      '</div>' +
      '<div class="grid three-col">' +
      '<div class="card"><h3 class="card-title">By category</h3>' + D.CATEGORIES.map(function (c) {
        var n = all.filter(function (r) { return r.category === c.id; }).length;
        return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)"><span>' + esc(c.name) + '</span><b>' + n + '</b></div>';
      }).join('') + '</div>' +
      '<div class="card"><h3 class="card-title">By status</h3>' + D.STATUSES.filter(function (s) { return s.id !== 'rejected'; }).map(function (s) {
        var n = all.filter(function (r) { return r.status === s.id; }).length;
        return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)"><span>' + s.name + '</span><b>' + n + '</b></div>';
      }).join('') + '</div>' +
      '<div class="card"><h3 class="card-title">Latest activity</h3><div class="notif">' +
      all.slice().sort(function (a, b) { return b.updated < a.updated ? -1 : 1; }).slice(0, 5).map(function (r) {
        return '<div class="n-title">' + esc(r.id) + ' &middot; ' + esc(r.title) + '</div><div class="n-when">' + esc(r.updated) + '</div>';
      }).join('') + '</div></div></div>';
  }

  /* ---------------- requests list (tenant / manager) ---------------- */
  function screenRequests() {
    var u = state.user;
    var list = u.role === 'manager' ? D.requestsForManager(u.id) : D.requestsForTenant(u.id);
    list = list.slice().sort(function (a, b) { return b.updated < a.updated ? -1 : 1; });
    var q = location.hash.split('?')[1] || '';
    var statusFilter = (q.match(/status=([\w-]+)/) || [])[1] || 'all';
    if (statusFilter !== 'all') list = list.filter(function (r) { return r.status === statusFilter; });
    var search = (q.match(/q=([^&]+)/) || [])[1] || '';
    if (search) {
      search = decodeURIComponent(search).toLowerCase();
      list = list.filter(function (r) {
        return (r.title + ' ' + r.id + ' ' + D.catName(r.category) + ' ' + r.unit).toLowerCase().indexOf(search) !== -1;
      });
    }
    var filterChips = ['all'].concat(D.openStatuses().concat(['completed', 'closed', 'cancelled']))
      .map(function (s) {
        return '<span class="chip' + (statusFilter === s ? ' active' : '') + '" data-filter="' + s + '">' +
          (s === 'all' ? 'All statuses' : D.statusName(s)) + '</span>';
      }).join('');
    body().innerHTML =
      '<div class="card" style="margin-bottom:16px">' +
      '<h3 class="card-title">' + (u.role === 'manager' ? 'Maintenance queue' : 'My requests') +
      '<small>' + list.length + ' visible</small></h3>' +
      '<input class="field" id="reqSearch" type="search" placeholder="Search requests" value="' + esc(search) + '">' +
      '<div class="category-row" style="margin-top:12px">' + filterChips + '</div></div>' +
      '<div class="req-list">' +
      (list.map(function (r) { return reqRow(r); }).join('') ||
        '<div class="empty"><div class="big">\uD83D\uDD27</div>No requests match your search.</div>') +
      '</div>';
    var inp = document.getElementById('reqSearch');
    inp.addEventListener('input', function () {
      location.hash = '#/requests?q=' + encodeURIComponent(inp.value);
    });
    body().querySelectorAll('.chip[data-filter]').forEach(function (c) {
      c.addEventListener('click', function () {
        location.hash = '#/requests?status=' + c.getAttribute('data-filter');
      });
    });
  }

  /* ---------------- request detail ---------------- */
  function screenRequest(id) {
    var req = findReq(id);
    if (!req) { location.hash = '#/requests'; return; }
    var u = state.user;
    var role = u.role;
    var hist = (D.HISTORY[req.id] || [{ status: 'Submitted', when: req.created + ' 09:00' }]).slice();
    var notes = (D.COMMENTS[req.id] || []).slice().reverse();

    var actions = '';
    if (role === 'tenant') {
      if (req.status === 'submitted' || req.status === 'under-review') {
        actions = '<button type="button" class="btn btn-danger" data-act="cancel">Cancel request</button>';
      }
      if (req.status === 'completed') {
        actions = '<button type="button" class="btn btn-success" data-act="confirm">Confirm resolved &amp; close</button>' +
          '<button type="button" class="btn btn-ghost" data-act="reopen">Not resolved &mdash; reopen</button>' +
          '<button type="button" class="btn btn-teal" data-act="rate">Rate technician</button>';
      }
      if (req.status === 'closed') {
        actions = '<span class="badge st-closed">Closed &middot; thanks for confirming</span>';
      }
    }
    if (role === 'manager') {
      if (req.status === 'submitted' || req.status === 'under-review') {
        actions = '<button type="button" class="btn btn-accent" data-act="assign">Review &amp; assign technician</button>';
      }
      if (req.status === 'completed') {
        actions = '<button type="button" class="btn btn-success" data-act="approve">Approve &amp; close</button>';
      }
    }
    if (role === 'technician') {
      if (req.status === 'assigned') {
        actions = '<button type="button" class="btn btn-success" data-act="accept">Accept job</button>' +
          '<button type="button" class="btn btn-danger" data-act="reject">Reject job</button>';
      }
      if (req.status === 'in-progress') {
        actions = '<button type="button" class="btn btn-ghost" data-act="hold">Place on hold</button>' +
          '<button type="button" class="btn btn-accent" data-act="note">Add work note</button>' +
          '<button type="button" class="btn btn-success" data-act="complete">Mark complete</button>';
      }
      if (req.status === 'on-hold') {
        actions = '<button type="button" class="btn btn-success" data-act="resume">Resume work</button>';
      }
    }

    var photoTiles = '';
    for (var i = 0; i < (req.photos || 0); i++) photoTiles += '<span class="photo-tile">\uD83D\uDDBC\uFE0F</span>';

    body().innerHTML =
      '<div class="grid two-col">' +
      '<div class="card">' +
      '<h3 class="card-title">' + req.id + ' <small>' + badge(req.status) + '</small></h3>' +
      '<h2 style="margin:0 0 6px">' + esc(req.title) + '</h2>' +
      '<p style="color:var(--muted)">' + esc(D.propName(req.propertyId)) + ' &middot; ' + esc(req.unit) +
      (req.techId ? ' &middot; Technician: ' + esc(D.techName(req.techId)) : '') + '</p>' +
      '<p>' + esc(req.detail) + '</p>' +
      '<div class="category-row" style="margin:10px 0">' +
      '<span class="chip chip-teal">' + esc(D.catName(req.category)) + '</span>' +
      '<span class="chip ' + urgClass(req.urgency) + '">' + esc(D.urgName(req.urgency)) + ' urgency</span></div>' +
      '<h3 class="card-title" style="margin-top:16px">Photos</h3>' +
      (photoTiles || '<p style="color:var(--muted);font-size:13px">No photos attached.</p>') +
      (role === 'technician' ? '<div style="margin-top:8px"><button type="button" class="btn btn-ghost btn-sm" data-act="upload">+ Upload before / after photo</button></div>' : '') +
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">' + actions + '</div></div>' +
      '<div>' +
      '<div class="card" style="margin-bottom:16px"><h3 class="card-title">Status history</h3><ul class="timeline">' +
      hist.map(function (h) { return '<li><b>' + esc(h.status) + '</b><div class="t-when">' + esc(h.when) + '</div></li>'; }).join('') +
      '</ul></div>' +
      '<div class="card"><h3 class="card-title">Conversation</h3>' +
      notes.map(function (c) {
        return '<div class="comment"><span class="avatar">' + esc(initials(c.by)) + '</span><div class="c-body">' +
          '<div class="c-who">' + esc(c.by) + ' <span>&middot; ' + esc(c.role) + '</span><span class="c-when">' + esc(c.when) + '</span></div>' +
          '<div class="c-text">' + esc(c.text) + '</div></div></div>';
      }).join('') +
      '<div style="margin-top:10px"><textarea class="field" id="newComment" placeholder="Add a comment..."></textarea>' +
      '<button type="button" class="btn btn-accent btn-sm" style="margin-top:8px" data-act="comment">Post comment</button></div></div>' +
      '</div></div>';

    body().querySelectorAll('[data-go]').forEach(function (e) {
      e.addEventListener('click', function () { location.hash = e.getAttribute('data-go'); });
    });
    body().querySelectorAll('[data-act]').forEach(function (e) {
      e.addEventListener('click', function () {
        var act = e.getAttribute('data-act');
        if (act === 'cancel') return confirmModal(req, 'Cancel this request?', function () { setStatus(req, 'cancelled', 'Request cancelled by tenant.'); toast(req.id + ' cancelled.'); });
        if (act === 'confirm') return confirmModal(req, 'Confirm the work is resolved?', function () { setStatus(req, 'closed', 'Work confirmed by tenant.'); toast('Thanks! ' + req.id + ' is now closed.'); });
        if (act === 'reopen') return confirmModal(req, 'Reopen this request?', function () { setStatus(req, 'in-progress', 'Reopened by tenant - work not fully resolved.'); toast('Request reopened.'); });
        if (act === 'rate') return rateModal(req);
        if (act === 'assign') return assignModal(req);
        if (act === 'approve') return confirmModal(req, 'Approve and close this request?', function () { setStatus(req, 'closed', 'Approved and closed by property manager.'); toast(req.id + ' approved and closed.'); });
        if (act === 'accept') return confirmModal(req, 'Accept this job?', function () { setStatus(req, 'in-progress', 'Job accepted by technician.'); toast('Job accepted.'); });
        if (act === 'reject') return rejectModal(req);
        if (act === 'hold') return confirmModal(req, 'Place this job on hold?', function () { setStatus(req, 'on-hold', 'Placed on hold (awaiting parts / access).'); toast('Job on hold.'); });
        if (act === 'resume') return confirmModal(req, 'Resume work on this job?', function () { setStatus(req, 'in-progress', 'Work resumed.'); toast('Work resumed.'); });
        if (act === 'complete') return completeModal(req);
        if (act === 'note') return noteModal(req);
        if (act === 'upload') { req.photos = (req.photos || 0) + 1; toast('Photo uploaded (demo).'); route(); }
        if (act === 'comment') {
          var c = document.getElementById('newComment').value.trim();
          if (!c) return toast('Write a comment first.');
          var now = new Date();
          var when = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
          D.COMMENTS[req.id] = D.COMMENTS[req.id] || [];
          D.COMMENTS[req.id].push({ by: u.name, role: roleLabel(u.role), when: when, text: c });
          toast('Comment posted.');
          route();
        }
      });
    });
  }

  function confirmModal(req, title, fn) {
    openModal('<h2>' + title + '</h2><p>Request <b>' + req.id + '</b>: ' + esc(req.title) + '</p>' +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" data-close="1">Cancel</button>' +
      '<button type="button" class="btn btn-accent" id="mOk">Confirm</button></div>');
    document.getElementById('mOk').addEventListener('click', function () { closeModal(); fn(); route(); });
    document.querySelectorAll('#modalBox [data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
  }

  function rateModal(req) {
    openModal('<h2>Rate the completed work</h2><p>How was the service from <b>' + esc(req.techId ? D.techName(req.techId) : 'the technician') + '</b>?</p>' +
      '<div style="font-size:30px;letter-spacing:6px;text-align:center" id="stars">\u2606\u2606\u2606\u2606\u2606</div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" data-close="1">Close</button>' +
      '<button type="button" class="btn btn-accent" id="rateOk">Submit rating</button></div>');
    var stars = 0;
    document.getElementById('stars').addEventListener('click', function (e) {
      var rect = e.target.getBoundingClientRect();
      stars = Math.max(1, Math.round(((e.clientX - rect.left) / rect.width) * 5));
      var txt = '';
      for (var i = 1; i <= 5; i++) txt += i <= stars ? '\u2605' : '\u2606';
      e.target.textContent = txt;
    });
    document.getElementById('rateOk').addEventListener('click', function () {
      if (!stars) return toast('Tap a star to rate.');
      closeModal();
      setStatus(req, req.status, 'Tenant rated the work ' + stars + ' out of 5.');
      toast('Thank you! Rating recorded.');
      route();
    });
    document.querySelectorAll('#modalBox [data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
  }

  function assignModal(req) {
    var opts = D.TECHNICIANS.map(function (t) {
      return '<option value="' + t.id + '"' + (t.skill === D.catName(req.category) ? ' selected' : '') + '>' + esc(t.name) + ' (' + esc(t.skill) + ')</option>';
    }).join('');
    openModal('<h2>Review &amp; assign technician</h2>' +
      '<p>Review request <b>' + req.id + '</b> and assign it to a technician.</p>' +
      '<label class="field-label">Technician</label><select class="field" id="assignTech">' + opts + '</select>' +
      '<label class="field-label">Priority</label><select class="field" id="assignUrg">' +
      D.URGENCIES.map(function (u) { return '<option value="' + u.id + '"' + (u.id === req.urgency ? ' selected' : '') + '>' + u.name + '</option>'; }).join('') +
      '</select>' +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" data-close="1">Cancel</button>' +
      '<button type="button" class="btn btn-accent" id="assignOk">Assign technician</button></div>');
    document.getElementById('assignOk').addEventListener('click', function () {
      req.techId = document.getElementById('assignTech').value;
      req.urgency = document.getElementById('assignUrg').value;
      setStatus(req, 'assigned', 'Assigned to ' + D.techName(req.techId) + '.');
      toast('Assigned to ' + D.techName(req.techId) + '.');
      closeModal();
      route();
    });
    document.querySelectorAll('#modalBox [data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
  }

  function rejectModal(req) {
    openModal('<h2>Reject job</h2><p>Tell the property manager why you are rejecting <b>' + req.id + '</b>.</p>' +
      '<textarea class="field" id="rejectReason" placeholder="Reason (e.g. outside my trade, parts unavailable)"></textarea>' +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" data-close="1">Cancel</button>' +
      '<button type="button" class="btn btn-danger" id="rejectOk">Reject job</button></div>');
    document.getElementById('rejectOk').addEventListener('click', function () {
      var why = document.getElementById('rejectReason').value.trim() || 'Job rejected by technician.';
      setStatus(req, 'rejected', why);
      toast('Job rejected.');
      closeModal();
      route();
    });
    document.querySelectorAll('#modalBox [data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
  }

  function completeModal(req) {
    openModal('<h2>Mark job complete</h2><p>Summarise the work done on <b>' + req.id + '</b>.</p>' +
      '<textarea class="field" id="completeNote" placeholder="Work completed summary..."></textarea>' +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" data-close="1">Cancel</button>' +
      '<button type="button" class="btn btn-success" id="completeOk">Mark complete</button></div>');
    document.getElementById('completeOk').addEventListener('click', function () {
      var note = document.getElementById('completeNote').value.trim() || 'Work completed by technician.';
      req.photos = (req.photos || 0) + 1;
      setStatus(req, 'completed', note + ' (after photo uploaded)');
      toast(req.id + ' marked complete - awaiting tenant confirmation.');
      closeModal();
      route();
    });
    document.querySelectorAll('#modalBox [data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
  }

  function noteModal(req) {
    openModal('<h2>Add work note</h2><textarea class="field" id="noteText" placeholder="Work note..."></textarea>' +
      '<div class="modal-actions"><button type="button" class="btn btn-ghost" data-close="1">Cancel</button>' +
      '<button type="button" class="btn btn-accent" id="noteOk">Save note</button></div>');
    document.getElementById('noteOk').addEventListener('click', function () {
      var t = document.getElementById('noteText').value.trim();
      if (!t) return toast('Note cannot be empty.');
      var now = new Date();
      var when = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);
      D.COMMENTS[req.id] = D.COMMENTS[req.id] || [];
      D.COMMENTS[req.id].push({ by: state.user.name, role: 'Technician', when: when, text: t });
      toast('Work note added.');
      closeModal();
      route();
    });
    document.querySelectorAll('#modalBox [data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
  }

  /* ---------------- report issue flow ---------------- */
  var reportState = { step: 1, cat: null, urg: 'normal', photos: 0, title: '', detail: '', unit: '' };

  function screenReport() {
    renderReportStep();
  }

  function renderReportStep() {
    var s = reportState;
    var steps = ['Category', 'Urgency', 'Details', 'Submit'].map(function (l, i) {
      var n = i + 1;
      return '<div class="step' + (n <= s.step ? (n === s.step ? ' active' : ' done') : '') + '"></div>';
    }).join('') + '<div class="step" style="flex:0"></div>';
    var ui = '';
    if (s.step === 1) {
      ui = '<div class="card"><h3 class="card-title">What needs attention?</h3><div class="category-row">' +
        D.CATEGORIES.map(function (c) { return '<span class="chip' + (s.cat === c.id ? ' active' : '') + '" data-cat="' + c.id + '">' + esc(c.name) + '</span>'; }).join('') +
        '</div></div>';
    } else if (s.step === 2) {
      ui = '<div class="card"><h3 class="card-title">How urgent is it?</h3><div class="urg-options">' +
        D.URGENCIES.map(function (u) {
          return '<div class="urg-opt' + (s.urg === u.id ? ' active' : '') + '" data-urg="' + u.id + '"><b>' + u.name + '</b><small>' +
            ({ low: 'Can wait', normal: 'Soon', high: 'This week', urgent: 'Immediately' })[u.id] + '</small></div>';
        }).join('') +
        '</div></div>';
    } else if (s.step === 3) {
      ui = '<div class="card"><h3 class="card-title">Describe the issue</h3>' +
        '<label class="field-label">Short title</label><input class="field" id="repTitle" placeholder="e.g. Kitchen sink leaking" value="' + esc(s.title) + '">' +
        '<label class="field-label">Details</label><textarea class="field" id="repDetail" placeholder="What is happening and since when?">' + esc(s.detail) + '</textarea>' +
        '<label class="field-label">Unit</label><select class="field" id="repUnit">' +
        (state.user.units || ['My unit']).map(function (u) { return '<option' + (s.unit === u ? ' selected' : '') + '>' + esc(u) + '</option>'; }).join('') + '</select>' +
        '<label class="field-label">Photos (' + s.photos + ')</label>' +
        '<div><button type="button" class="btn btn-ghost btn-sm" id="addPhoto">+ Add photo</button></div></div>';
    } else {
      ui = '<div class="card"><div class="empty"><div class="big">\u2705</div>' +
        '<h2 style="margin:0 0 8px">Issue submitted</h2>' +
        '<p>Your request has been added to the maintenance queue. Track it from My requests.</p>' +
        '<button type="button" class="btn btn-accent" data-go="#/requests">Go to my requests</button></div></div>';
    }
    body().innerHTML =
      '<div class="card" style="margin-bottom:16px"><h3 class="card-title">Report an issue <small>Step ' + Math.min(s.step, 4) + ' of 4</small></h3>' +
      '<div class="steps">' + steps + '</div></div>' + ui +
      (s.step < 4 ? '<div style="margin-top:14px;display:flex;gap:10px">' +
        (s.step > 1 ? '<button type="button" class="btn btn-ghost" id="prevStep">Back</button>' : '') +
        '<button type="button" class="btn btn-accent" id="nextStep">' + (s.step === 3 ? 'Submit request' : 'Continue') + '</button></div>' : '');

    body().querySelectorAll('[data-cat]').forEach(function (c) {
      c.addEventListener('click', function () {
        s.cat = c.getAttribute('data-cat');
        body().querySelectorAll('[data-cat]').forEach(function (x) { x.classList.toggle('active', x === c); });
      });
    });
    body().querySelectorAll('[data-urg]').forEach(function (c) {
      c.addEventListener('click', function () {
        s.urg = c.getAttribute('data-urg');
        body().querySelectorAll('[data-urg]').forEach(function (x) { x.classList.toggle('active', x === c); });
      });
    });
    var next = document.getElementById('nextStep');
    if (next) next.addEventListener('click', function () {
      if (s.step === 1 && !s.cat) return toast('Select a category first.');
      if (s.step === 3) {
        var title = (document.getElementById('repTitle').value || '').trim();
        var detail = (document.getElementById('repDetail').value || '').trim();
        var unit = (document.getElementById('repUnit') && document.getElementById('repUnit').value) || 'My unit';
        s.title = title; s.detail = detail; s.unit = unit;
        if (!title) return toast('Give the issue a short title.');
        var req = {
          id: 'REQ-' + state.nextReqNum++,
          propertyId: 'P1', unit: unit, tenantId: state.user.id,
          category: s.cat, title: title, detail: detail || 'No further details provided.',
          urgency: s.urg, status: 'submitted', techId: null,
          created: todayStr(), updated: todayStr(), photos: s.photos
        };
        D.REQUESTS.unshift(req);
        s.step = 4;
        return renderReportStep();
      }
      s.step += 1;
      renderReportStep();
    });
    var tInputs = ['repTitle', 'repDetail', 'repUnit'];
    tInputs.forEach(function (id) {
      var f = document.getElementById(id);
      if (f) f.addEventListener('input', function () { s[({ repTitle: 'title', repDetail: 'detail', repUnit: 'unit' })[id]] = f.value; });
    });
    var prev = document.getElementById('prevStep');
    if (prev) prev.addEventListener('click', function () { s.step -= 1; renderReportStep(); });
    var ap = document.getElementById('addPhoto');
    if (ap) ap.addEventListener('click', function () { s.photos += 1; toast('Photo attached (demo).'); renderReportStep(); });
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  /* ---------------- properties ---------------- */
  function screenProperties() {
    var u = state.user;
    var list = D.PROPERTIES;
    if (u.role === 'manager') list = D.PROPERTIES.filter(function (p) { return p.managerId === u.id; });
    body().innerHTML =
      '<div class="hero"><h1>' + (u.role === 'tenant' ? 'My property' : 'Your managed portfolio') + '</h1>' +
      '<p>' + list.length + ' properties &middot; 25 active units &middot; 92% occupancy across Cape Town.</p></div>' +
      '<div class="table-wrap card" style="overflow-x:auto"><table><thead><tr>' +
      '<th>Property</th><th>Location</th><th>Manager</th><th>Open requests</th></tr></thead><tbody>' +
      list.map(function (p) {
        var open = openCount(D.requestsForProperty(p.id));
        var mgr = D.MANAGERS.find(function (m) { return m.id === p.managerId; });
        return '<tr><td><span class="trow-main">' + esc(p.name) + '</span><div class="trow-sub">' + esc(p.address) + '</div></td>' +
          '<td class="trow-sub">' + esc(p.area) + '</td>' +
          '<td class="trow-sub">' + esc(mgr ? mgr.name : '-') + '</td>' +
          '<td><span class="badge ' + (open > 0 ? 'st-in-progress' : 'st-closed') + '">' + open + ' open</span></td></tr>';
      }).join('') +
      '</tbody></table></div>' +
      (u.role === 'manager' || u.role === 'admin' ? '<div style="margin-top:14px"><button type="button" class="btn btn-teal">+ Add property</button></div>' : '');
  }

  /* ---------------- technicians (manager) ---------------- */
  function screenTechnicians() {
    body().innerHTML =
      '<div class="hero"><h1>Technicians</h1><p>5 maintenance technicians on the service plan &middot; workloads tracked per request.</p></div>' +
      '<div class="grid three-col">' + D.TECHNICIANS.map(function (t) {
        var jobs = D.requestsForTechnician(t.id);
        var active = jobs.filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; }).length;
        return '<div class="card">' + avatarFor({ name: t.name, role: 'technician' }) +
          '<h3 style="margin:10px 0 2px">' + esc(t.name) + '</h3>' +
          '<p style="color:var(--muted);margin:0 0 10px;font-size:13px">' + esc(t.skill) + '</p>' +
          '<span class="badge st-in-progress">' + active + ' active</span> ' +
          '<span class="badge st-closed">' + jobs.length + ' total</span></div>';
      }).join('') + '</div>';
  }

  /* ---------------- tenants (manager / admin) ---------------- */
  function screenTenants() {
    body().innerHTML =
      '<div class="hero"><h1>Tenants</h1><p>' + D.TENANTS.length + ' tenants across the managed portfolio.</p></div>' +
      '<div class="table-wrap card" style="overflow-x:auto"><table><thead><tr>' +
      '<th>Tenant</th><th>Units</th><th>Open requests</th></tr></thead><tbody>' +
      D.TENANTS.map(function (t) {
        var open = openCount(D.requestsForTenant(t.id));
        return '<tr><td><span class="trow-main">' + esc(t.name) + '</span></td>' +
          '<td class="trow-sub">' + t.units.map(esc).join(', ') + '</td>' +
          '<td><span class="badge ' + (open > 0 ? 'st-in-progress' : 'st-closed') + '">' + open + '</span></td></tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  /* ---------------- reports ---------------- */
  function screenReports() {
    var all = D.REQUESTS;
    var open = all.filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; });
    var closed = all.filter(function (r) { return r.status === 'closed' || r.status === 'completed'; });
    var byCat = D.CATEGORIES.map(function (c) {
      var n = all.filter(function (r) { return r.category === c.id; }).length;
      return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)"><span>' + esc(c.name) + '</span><b>' + n + '</b></div>';
    }).join('');
    var byProp = D.PROPERTIES.map(function (p) {
      var n = openCount(D.requestsForProperty(p.id));
      return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)"><span>' + esc(p.name) + '</span><b>' + n + ' open</b></div>';
    }).join('');
    body().innerHTML =
      '<div class="hero"><h1>Maintenance reports</h1><p>' + all.length + ' requests total &middot; ' + open.length +
      ' open &middot; ' + closed.length + ' resolved &middot; recurring issues flagged below.</p></div>' +
      '<div class="grid two-col">' +
      '<div class="card"><h3 class="card-title">Recurring issues by category</h3>' + byCat +
      '<p style="font-size:12.5px;color:var(--muted);margin-top:10px">Plumbing is the most common category across the portfolio this quarter.</p></div>' +
      '<div class="card"><h3 class="card-title">Open issues by property</h3>' + byProp + '</div></div>' +
      '<div class="card" style="margin-top:16px"><h3 class="card-title">Export</h3>' +
      '<button type="button" class="btn btn-teal" id="exportBtn">Download report (demo)</button></div>';
    document.getElementById('exportBtn').addEventListener('click', function () {
      toast('Report exported (demo) - CSV generated in Task 2.');
    });
  }

  /* ---------------- notifications ---------------- */
  var NOTIFS = [
    { ico: '\uD83D\uDD27', title: 'REQ-1045 is now in our maintenance queue.', when: '14 Aug, 09:01', unread: false },
    { ico: '\uD83D\uDD27', title: 'Johan van der Merwe started work on REQ-1045.', when: '14 Aug, 14:40', unread: false },
    { ico: '\uD83D\uDD14', title: 'Reminder: technician visit scheduled for REQ-1045 tomorrow.', when: '13 Aug, 16:00', unread: true },
    { ico: '\u2705', title: 'REQ-1027 (dishwasher) marked complete - please confirm.', when: '12 Aug, 10:22', unread: true },
    { ico: '\uD83C\uDFE2', title: 'Inspection completed at Milnerton Sands Unit 11.', when: '10 Aug, 12:05', unread: true }
  ];

  function screenNotifications() {
    body().innerHTML =
      '<div class="hero" style="display:flex;align-items:center;justify-content:space-between">' +
      '<div><h1>Activity centre</h1><p>Important updates, without the message sprawl.</p></div>' +
      '<button type="button" class="btn btn-teal" id="markAll">Mark all read</button></div>' +
      '<div class="card">' +
      NOTIFS.map(function (n) {
        return '<div class="notif"><span class="n-ico">' + n.ico + '</span>' +
          '<div><div class="n-title">' + esc(n.title) + '</div><div class="n-when">' + esc(n.when) + '</div></div>' +
          (n.unread ? '<span class="badge st-in-progress" style="margin-left:auto">New</span>' : '') + '</div>';
      }).join('') +
      '</div>';
    document.getElementById('markAll').addEventListener('click', function () {
      NOTIFS.forEach(function (n) { n.unread = false; });
      toast('All notifications marked as read.');
      screenNotifications();
    });
  }

  /* ---------------- jobs (technician) ---------------- */
  function screenJobs() {
    var jobs = D.requestsForTechnician(state.user.id).filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; });
    var accept = jobs.filter(function (r) { return r.status === 'assigned'; });
    body().innerHTML =
      '<div class="hero"><h1>Assigned jobs</h1><p>' + jobs.length + ' active job(s) &middot; ' + accept.length + ' awaiting your acceptance.</p></div>' +
      '<div class="req-list">' +
      (jobs.map(function (r) {
        return '<div class="request-item" data-id="' + r.id + '"><div>' +
          '<div class="r-main">' + esc(r.title) + '</div>' +
          '<div class="r-sub">' + esc(r.id) + ' &middot; ' + esc(r.unit) + ' &middot; ' + esc(D.propName(r.propertyId)) + '</div></div>' +
          '<div class="r-right">' + badge(r.status) + '</div></div>';
      }).join('') || '<div class="empty"><div class="big">\uD83C\uDFAF</div>You have no active jobs right now.</div>') +
      '</div>';
  }

  /* ---------------- schedule (technician) ---------------- */
  function screenSchedule() {
    var jobs = D.requestsForTechnician(state.user.id).filter(function (r) { return D.openStatuses().indexOf(r.status) !== -1; });
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    var rows = days.map(function (d, i) {
      var r = jobs[i];
      return '<tr><td><b>' + d + '</b><div class="trow-sub">' + (r ? '18 Aug' : '') + '</div></td>' +
        '<td>' + (r ? esc(r.title) + '<div class="trow-sub">' + esc(r.unit) + '</div>' : '<span class="trow-sub">Free</span>') + '</td>' +
        '<td>' + (r ? esc(r.id) + '<div class="trow-sub">' + esc(D.propName(r.propertyId)) + '</div>' : '-') + '</td></tr>';
    }).join('');
    body().innerHTML =
      '<div class="hero"><h1>Schedule</h1><p>Planned maintenance visits for the coming week.</p></div>' +
      '<div class="table-wrap card" style="overflow-x:auto"><table><thead><tr><th>Day</th><th>Job</th><th>Request</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  /* ---------------- completed jobs (technician) ---------------- */
  function screenCompleted() {
    var done = D.requestsForTechnician(state.user.id).filter(function (r) { return r.status === 'completed' || r.status === 'closed'; });
    body().innerHTML =
      '<div class="hero"><h1>Completed jobs</h1><p>' + done.length + ' jobs completed, verified with before/after photos.</p></div>' +
      '<div class="req-list">' +
      (done.map(function (r) {
        return '<div class="request-item" data-id="' + r.id + '"><div>' +
          '<div class="r-main">' + esc(r.title) + '</div>' +
          '<div class="r-sub">' + esc(r.id) + ' &middot; ' + esc(r.unit) + '</div></div>' +
          '<div class="r-right">' + badge(r.status) + '</div></div>';
      }).join('') || '<div class="empty"><div class="big">\uD83D\uDD27</div>No completed jobs yet.</div>') +
      '</div>';
  }

  /* ---------------- admin screens ---------------- */
  function screenUsers() {
    body().innerHTML =
      '<div class="hero"><h1>Users</h1><p>All accounts across the platform &middot; role-based access control (RBAC) enforced server-side.</p></div>' +
      '<div class="table-wrap card" style="overflow-x:auto"><table><thead><tr>' +
      '<th>User</th><th>Role</th><th>Email</th><th>Status</th></tr></thead><tbody>' +
      D.USERS.map(function (u) {
        return '<tr><td>' + avatarFor(u) + ' <b>' + esc(u.name) + '</b></td>' +
          '<td><span class="badge st-assigned">' + esc(roleLabel(u.role)) + '</span></td>' +
          '<td class="trow-sub">' + esc(u.email) + '</td>' +
          '<td><span class="badge st-closed">Active</span></td></tr>';
      }).join('') +
      '</tbody></table></div>' +
      '<div style="margin-top:14px"><button type="button" class="btn btn-teal">+ Add user</button></div>';
  }

  function screenCategories() {
    body().innerHTML =
      '<div class="hero"><h1>Maintenance categories</h1><p>Consistent classification for every request.</p></div>' +
      '<div class="grid three-col">' + D.CATEGORIES.map(function (c) {
        var n = D.REQUESTS.filter(function (r) { return r.category === c.id; }).length;
        return '<div class="card"><h3>' + esc(c.name) + '</h3><p style="color:var(--muted);font-size:13px">' + n + ' requests classified</p>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-toast="Category renamed in production">Rename</button> ' +
          '<button type="button" class="btn btn-ghost btn-sm" data-toast="Category archived in production">Archive</button></div>';
      }).join('') + '</div>' +
      '<div style="margin-top:14px"><button type="button" class="btn btn-teal" id="addCat">+ Add category</button></div>';
    document.getElementById('addCat').addEventListener('click', function () { toast('Add category form in Task 2 back end.'); });
  }

  function screenRoles() {
    var roles = [
      { r: 'Tenant', perms: ['View my properties', 'Report maintenance issues', 'Upload photos', 'Track request status', 'Confirm & close requests', 'Rate completed work'] },
      { r: 'Property Manager', perms: ['Review & prioritise requests', 'Assign technicians', 'Monitor portfolio', 'Communicate with tenants', 'Approve & close requests', 'Generate reports'] },
      { r: 'Technician', perms: ['View assigned jobs', 'Accept / reject jobs', 'Update job status', 'Upload before/after photos', 'Add work notes', 'Mark jobs complete'] },
      { r: 'Administrator', perms: ['Manage users & permissions', 'Manage properties', 'Manage categories', 'Manage technicians', 'View system-wide reports', 'System settings'] }
    ];
    body().innerHTML =
      '<div class="hero"><h1>Roles &amp; permissions</h1><p>Role-based access control &middot; every role can only access its own functionality.</p></div>' +
      '<div class="grid two-col">' + roles.map(function (x) {
        return '<div class="card"><h3>' + esc(x.r) + '</h3><ul style="margin:8px 0 0;padding-left:18px">' +
          x.perms.map(function (p) { return '<li style="font-size:13.5px;padding:3px 0">' + esc(p) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>';
  }

  function screenSettings() {
    body().innerHTML =
      '<div class="hero"><h1>System settings</h1><p>Configuration for the Obs Realty deployment.</p></div>' +
      '<div class="grid two-col">' +
      '<div class="card"><h3 class="card-title">Workspace</h3>' +
      '<label class="field-label">Organisation name</label><input class="field" value="Horizon Property Group">' +
      '<label class="field-label">Notification channel (Observer pattern)</label><select class="field"><option>In-app push + email</option><option>In-app push only</option><option>Email only</option></select>' +
      '<div style="margin-top:14px"><button type="button" class="btn btn-accent" id="saveSet">Save settings</button></div></div>' +
      '<div class="card"><h3 class="card-title">Security</h3>' +
      '<ul style="margin:0;padding-left:18px;font-size:13.5px">' +
      '<li>Passwords hashed with bcrypt (never stored in plain text)</li>' +
      '<li>JWTs issued on login; refresh tokens in HttpOnly cookies</li>' +
      '<li>Object-level authorisation: tenants only see their own requests</li>' +
      '<li>Strict Content-Security-Policy on every response</li></ul></div></div>';
    var save = document.getElementById('saveSet');
    if (save) save.addEventListener('click', function () { toast('Settings saved (demo).'); });
  }

  /* ---------------- mockups gallery ---------------- */
  var MOCKUPS = [
    { file: 'PropCare.png', label: 'Login & welcome screen (as-designed)' },
    { file: 'PropCare -1.png', label: 'Tenant overview dashboard' },
    { file: 'PropCare -2.png', label: 'My requests' },
    { file: 'PropCare -3.png', label: 'Managed portfolio (property manager)' },
    { file: 'PropCare -4.png', label: 'Notifications activity centre' }
  ];

  function screenMockups() {
    body().innerHTML =
      '<div class="hero"><h1>Design reference — original mockups</h1>' +
      '<p>The approved Figma mockups that guided this prototype, reproduced here for reference.</p></div>' +
      '<div class="mockup-grid">' +
      MOCKUPS.map(function (m, i) {
        return '<figure class="mockup' + (i === 0 ? ' wide' : '') + '"><img src="assets/mockups/' + m.file +
          '" alt="' + esc(m.label) + '"><figcaption>' + esc(m.label) + '</figcaption></figure>';
      }).join('') + '</div>';
  }

  /* ---------------- router ---------------- */
  function route() {
    if (!state.user) { showLogin(); return; }
    var hash = location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/');
    var seg = parts[0] || 'overview';
    var id = parts[1] || '';
    renderShell();
    renderBottomNav();
    if (seg === 'overview') return screenOverview();
    if (seg === 'requests') return screenRequests();
    if (seg === 'request') return screenRequest(id);
    if (seg === 'report') return screenReport();
    if (seg === 'properties') return screenProperties();
    if (seg === 'notifications') return screenNotifications();
    if (seg === 'mockups') return screenMockups();
    if (seg === 'technicians') return screenTechnicians();
    if (seg === 'tenants') return screenTenants();
    if (seg === 'reports') return screenReports();
    if (seg === 'jobs') return screenJobs();
    if (seg === 'job') return screenRequest(id);
    if (seg === 'schedule') return screenSchedule();
    if (seg === 'completed') return screenCompleted();
    if (seg === 'users') return screenUsers();
    if (seg === 'categories') return screenCategories();
    if (seg === 'roles') return screenRoles();
    if (seg === 'settings') return screenSettings();
    if (seg === 'profile') return screenProfile();
    location.hash = '#/overview';
    return screenOverview();
  }

  function screenProfile() {
    var u = state.user;
    var myReqs = D.requestsForTenant(u.id);
    var open = openCount(myReqs);
    body().innerHTML =
      '<div class="hero"><h1>Profile</h1><p>Your workspace identity and demo account details.</p></div>' +
      '<div class="grid two-col">' +
      '<div class="card" style="text-align:center;padding:30px">' +
      '<span class="avatar role-' + u.role + '" style="width:64px;height:64px;font-size:24px">' + esc(initials(u.name)) + '</span>' +
      '<h2 style="margin:12px 0 2px">' + esc(u.name) + '</h2>' +
      '<p style="color:var(--muted);margin:0 0 12px">' + esc(roleLabel(u.role)) + ' &middot; ' + esc(u.email) + '</p>' +
      '<span class="badge st-in-progress">' + open + ' open requests</span></div>' +
      '<div class="card"><h3 class="card-title">Account details</h3>' +
      '<label class="field-label">Full name</label><input class="field" value="' + esc(u.name) + '">' +
      '<label class="field-label">Work email</label><input class="field" value="' + esc(u.email) + '">' +
      '<label class="field-label">Password</label><input class="field" type="password" value="password123">' +
      '<div style="margin-top:14px"><button type="button" class="btn btn-accent" data-toast="Profile updated (demo).">Save changes</button></div></div></div>';
  }

  function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }

  /* ---------------- login wiring ---------------- */
  function wireLogin() {
    var roleSel = document.getElementById('loginRole');
    var email = document.getElementById('loginEmail');
    var emails = {
      'U1': 'sarahwilliams@example.com', 'U2': 'michael.jacobs@obsrealty.co.za',
      'U9': 'johan.vdm@obsrealty.co.za', 'U14': 'admin@obsrealty.co.za'
    };
    roleSel.addEventListener('change', function () { email.value = emails[roleSel.value] || ''; });
    document.getElementById('loginBtn').addEventListener('click', doLogin);
    document.getElementById('loginPassword').addEventListener('keydown', function (e) { if (e.key === 'Enter') doLogin(); });
    document.getElementById('forgotBtn').addEventListener('click', function () { toast('Password reset link sent (demo).'); });
  }

  function doLogin() {
    var uid = document.getElementById('loginRole').value;
    var user = D.USERS.find(function (u) { return u.id === uid; });
    if (!user) { toast('Account not found.'); return; }
    var ten = D.TENANTS.find(function (t) { return t.id === user.id; });
    user.units = ten ? ten.units : [];
    setUser(user);
  }

  function wireGlobal() {
    document.getElementById('signOutBtn').addEventListener('click', function () {
      state.user = null;
      showLogin();
      toast('Signed out.');
    });
    document.getElementById('userAvatar').addEventListener('click', function () { location.hash = '#/profile'; });
    window.addEventListener('hashchange', route);
    document.getElementById('appBody').addEventListener('click', function (e) {
      var card = e.target.closest('.request-item[data-id]');
      if (card) {
        var role = state.user.role;
        location.hash = (role === 'technician' ? '#/job/' : '#/request/') + card.getAttribute('data-id');
      }
      var go = e.target.closest('[data-go]');
      if (go) location.hash = go.getAttribute('data-go');
      var dt = e.target.closest('[data-toast]');
      if (dt) toast(dt.getAttribute('data-toast'));
    });
  }

  /* ---------------- profile (simple) ---------------- */
  window.PropCareApp = {
    route: route,
    closeModal: closeModal,
    init: function () {
      wireLogin();
      wireGlobal();
      if (location.hash.indexOf('#/') === -1) location.hash = '#/';
      showLogin();
      route();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.PropCareApp.init(); });
  } else {
    window.PropCareApp.init();
  }
})();
