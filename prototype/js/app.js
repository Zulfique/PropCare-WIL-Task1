// PropCare — shared shell: sidebar, topbar, badge helpers
(function () {
  const NAV_ITEMS = [
    { key: "overview", label: "Overview", href: "index.html", icon: "grid" },
    { key: "requests", label: "My requests", href: "requests.html", icon: "wrench" },
    { key: "property", label: "My property", href: "property.html", icon: "building" },
    { key: "notifications", label: "Notifications", href: "notifications.html", icon: "bell" },
    { key: "profile", label: "Profile", href: "profile.html", icon: "user" }
  ];

  function icon(name) {
    return window.PC_ICONS[name] || "";
  }

  function buildSidebar(activeKey) {
    const user = window.PROPCARE_USER;
    const navHtml = NAV_ITEMS.map((item) => {
      const active = item.key === activeKey ? " active" : "";
      return (
        '<a href="' + item.href + '" class="' + active.trim() + '">' +
          icon(item.icon) +
          "<span>" + item.label + "</span>" +
        "</a>"
      );
    }).join("");

    return (
      '<div class="sidebar-brand">' +
        '<div class="brand-mark">P</div>' +
        '<div>' +
          '<div class="brand-name">PropCare</div>' +
          '<div class="brand-sub">' + user.org + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="sidebar-label">Workspace</div>' +
      '<nav class="sidebar-nav">' + navHtml + "</nav>" +
      '<div class="sidebar-spacer"></div>' +
      '<div class="sidebar-footer">' +
        '<div class="sidebar-user">' +
          '<div class="avatar">' + user.initials + "</div>" +
          "<div>" +
            '<div class="sidebar-user-name">' + user.name + "</div>" +
            '<div class="sidebar-user-role">' + user.role + "</div>" +
          "</div>" +
        "</div>" +
        '<a href="#" class="sidebar-signout">' + icon("signout") + "<span>Sign out</span></a>" +
      "</div>"
    );
  }

  function buildTopbar(pageLabel) {
    const user = window.PROPCARE_USER;
    return (
      '<button class="icon-btn menu-btn" id="pc-menu-btn" aria-label="Open menu">' + icon("menu") + "</button>" +
      '<div class="breadcrumb">' +
        '<span>' + user.org + "</span><span>&rsaquo;</span><strong>" + user.workspace + "</strong>" +
      "</div>" +
      '<div class="topbar-right">' +
        '<button class="icon-btn" aria-label="Notifications">' + icon("bell") +
          (window.PROPCARE_NOTIFICATIONS && window.PROPCARE_NOTIFICATIONS.items.length
            ? '<span class="dot-badge"></span>' : "") +
        "</button>" +
        '<div class="topbar-user">' +
          '<div class="avatar">' + user.initials + "</div>" +
          "<div>" +
            '<div class="topbar-user-name">' + user.name + "</div>" +
            '<div class="topbar-user-email">' + user.email + "</div>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function mountShell(activeKey) {
    const sidebarEl = document.getElementById("pc-sidebar");
    const topbarEl = document.getElementById("pc-topbar");
    if (sidebarEl) sidebarEl.innerHTML = buildSidebar(activeKey);
    if (topbarEl) topbarEl.innerHTML = buildTopbar();

    const menuBtn = document.getElementById("pc-menu-btn");
    if (menuBtn && sidebarEl) {
      menuBtn.addEventListener("click", function () {
        sidebarEl.classList.toggle("open");
      });
    }
  }

  function priorityBadge(priority) {
    const cls = priority === "High" ? "badge-high" : "badge-low";
    return '<span class="badge ' + cls + '">' + priority + "</span>";
  }

  function statusBadge(status) {
    const map = {
      "Submitted": "badge-submitted",
      "In progress": "badge-inprogress",
      "Resolved": "badge-resolved"
    };
    const cls = map[status] || "badge-submitted";
    return '<span class="badge ' + cls + '">' + status + "</span>";
  }

  function openBadge(count) {
    const cls = count <= 2 ? "badge-few" : "badge-open";
    return '<span class="badge ' + cls + '">' + count + " open</span>";
  }

  window.PC = { mountShell, priorityBadge, statusBadge, openBadge, icon };
})();
