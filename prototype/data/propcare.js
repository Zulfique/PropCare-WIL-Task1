/* PropCare - dummy data (derived from the PropCare WIL Task 1 documentation and mockups) */

window.PropCareData = (function () {

  var CATEGORIES = [
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'hvac', name: 'Heating & cooling' },
    { id: 'security', name: 'Security' },
    { id: 'appliances', name: 'Appliances' }
  ];

  var URGENCIES = [
    { id: 'low', name: 'Low' },
    { id: 'normal', name: 'Normal' },
    { id: 'high', name: 'High' },
    { id: 'urgent', name: 'Urgent' }
  ];

  var STATUSES = [
    { id: 'submitted', name: 'Submitted' },
    { id: 'under-review', name: 'Under review' },
    { id: 'assigned', name: 'Assigned' },
    { id: 'in-progress', name: 'In progress' },
    { id: 'on-hold', name: 'On hold' },
    { id: 'completed', name: 'Completed' },
    { id: 'closed', name: 'Closed' },
    { id: 'cancelled', name: 'Cancelled' },
    { id: 'rejected', name: 'Rejected' }
  ];

  var PROPERTIES = [
    { id: 'P1',  name: 'Oak Avenue Residences',    address: '12 Oak Avenue',      area: 'Claremont',    managerId: 'U2' },
    { id: 'P2',  name: 'The Rondebosch Collection',address: '41 Main Road',       area: 'Rondebosch',   managerId: 'U2' },
    { id: 'P3',  name: 'Kenilworth Mews',          address: '8 Doncaster Road',   area: 'Kenilworth',   managerId: 'U3' },
    { id: 'P4',  name: 'Observatory Lofts',        address: '17 Lower Trill Rd',  area: 'Observatory',  managerId: 'U2' },
    { id: 'P5',  name: 'Bellville Grove',          address: '5 Voortrekker Road', area: 'Bellville',    managerId: 'U3' },
    { id: 'P6',  name: 'Century City Quays',       address: '22 Rialto Road',     area: 'Century City', managerId: 'U2' },
    { id: 'P7',  name: 'Durbanville House',        address: '3 Wellington Road',  area: 'Durbanville',  managerId: 'U3' },
    { id: 'P8',  name: 'Milnerton Sands',          address: '66 Beach Road',      area: 'Milnerton',    managerId: 'U2' },
    { id: 'P9',  name: 'Newlands Park',            address: '9 Kildare Road',     area: 'Newlands',     managerId: 'U3' },
    { id: 'P10', name: 'Mowbray Terraces',         address: '28 Mowbray Road',    area: 'Mowbray',      managerId: 'U2' }
  ];

  var TECHNICIANS = [
    { id: 'T1', name: 'Johan van der Merwe', skill: 'Plumbing' },
    { id: 'T2', name: 'Riaan Botha',         skill: 'Electrical' },
    { id: 'T3', name: 'Naledi Mokoena',      skill: 'Heating & cooling' },
    { id: 'T4', name: 'David Pillay',        skill: 'Security' },
    { id: 'T5', name: 'Mark Petersen',       skill: 'Appliances' }
  ];

  var TENANTS = [
    { id: 'U1', name: 'Sarah Williams', units: ['Claremont Unit 3B', 'Claremont Unit 1A', 'Century City Unit 2A', 'Claremont Unit 5A'] },
    { id: 'U4', name: 'Thabo Nkosi',    units: ['Rondebosch Unit 7', 'Observatory Unit 12'] },
    { id: 'U5', name: 'Priya Naidoo',   units: ['Kenilworth Unit 4'] },
    { id: 'U6', name: 'Zanele Dlamini', units: ['Bellville Unit 9'] },
    { id: 'U7', name: 'Pieter Botha',   units: ['Milnerton Unit 11'] },
    { id: 'U8', name: 'Aisha Khan',     units: ['Newlands Unit 2'] }
  ];

  var MANAGERS = [
    { id: 'U2', name: 'Michael Jacobs' },
    { id: 'U3', name: 'Ayesha Patel' }
  ];

  var USERS = [
    { id: 'U1', name: 'Sarah Williams',  role: 'tenant',    email: 'sarahwilliams@example.com' },
    { id: 'U2', name: 'Michael Jacobs',  role: 'manager',   email: 'michael.jacobs@obsrealty.co.za' },
    { id: 'U3', name: 'Ayesha Patel',    role: 'manager',   email: 'ayesha.patel@obsrealty.co.za' },
    { id: 'U4', name: 'Thabo Nkosi',     role: 'tenant',    email: 'thabo.nkosi@example.com' },
    { id: 'U5', name: 'Priya Naidoo',    role: 'tenant',    email: 'priya.naidoo@example.com' },
    { id: 'U6', name: 'Zanele Dlamini',  role: 'tenant',    email: 'zanele.dlamini@example.com' },
    { id: 'U7', name: 'Pieter Botha',    role: 'tenant',    email: 'pieter.botha@example.com' },
    { id: 'U8', name: 'Aisha Khan',      role: 'tenant',    email: 'aisha.khan@example.com' },
    { id: 'U9', name: 'Johan van der Merwe', role: 'technician', email: 'johan.vdm@obsrealty.co.za' },
    { id: 'U10', name: 'Riaan Botha',    role: 'technician', email: 'riaan.botha@obsrealty.co.za' },
    { id: 'U11', name: 'Naledi Mokoena', role: 'technician', email: 'naledi.mokoena@obsrealty.co.za' },
    { id: 'U12', name: 'David Pillay',   role: 'technician', email: 'david.pillay@obsrealty.co.za' },
    { id: 'U13', name: 'Mark Petersen',  role: 'technician', email: 'mark.petersen@obsrealty.co.za' },
    { id: 'U14', name: 'System Admin',   role: 'admin',      email: 'admin@obsrealty.co.za' }
  ];

  function catName(id) { var c = CATEGORIES.find(function (x) { return x.id === id; }); return c ? c.name : 'General'; }
  function urgName(id) { var u = URGENCIES.find(function (x) { return x.id === id; }); return u ? u.name : 'Normal'; }
  function statusName(id) { var s = STATUSES.find(function (x) { return x.id === id; }); return s ? s.name : id; }
  function userName(id) { var u = USERS.find(function (x) { return x.id === id; }); return u ? u.name : 'Unknown'; }
  function propName(id) { var p = PROPERTIES.find(function (x) { return x.id === id; }); return p ? p.name : 'Unknown'; }
  function techName(id) { var t = TECHNICIANS.find(function (x) { return x.id === id; }); return t ? t.name : ''; }

  var REQUESTS = [
    { id: 'REQ-1045', propertyId: 'P1', unit: 'Claremont Unit 3B', tenantId: 'U1', category: 'plumbing',
      title: 'Kitchen sink leaking', detail: 'Water is pooling under the kitchen sink and the cupboard base is becoming saturated. It has been leaking since yesterday morning.',
      urgency: 'high', status: 'in-progress', techId: 'T1', created: '2026-08-08', updated: '2026-08-14', photos: 2 },
    { id: 'REQ-1046', propertyId: 'P1', unit: 'Claremont Unit 1A', tenantId: 'U1', category: 'plumbing',
      title: 'Leaking tap in bathroom', detail: 'The hot water tap in the main bathroom drips continuously and will not fully close.',
      urgency: 'normal', status: 'submitted', techId: null, created: '2026-08-12', updated: '2026-08-12', photos: 1 },
    { id: 'REQ-1061', propertyId: 'P6', unit: 'Century City Unit 2A', tenantId: 'U1', category: 'security',
      title: 'Pool pump making noise', detail: 'The pool pump housing is vibrating loudly during operation and the access cover has come loose.',
      urgency: 'high', status: 'assigned', techId: 'T4', created: '2026-08-10', updated: '2026-08-14', photos: 1 },
    { id: 'REQ-1076', propertyId: 'P1', unit: 'Claremont Unit 5A', tenantId: 'U1', category: 'appliances',
      title: 'Oven not heating', detail: 'The oven reaches temperature very slowly and then switches off mid-cycle.',
      urgency: 'normal', status: 'under-review', techId: null, created: '2026-08-13', updated: '2026-08-14', photos: 0 },
    { id: 'REQ-1032', propertyId: 'P2', unit: 'Rondebosch Unit 7', tenantId: 'U4', category: 'electrical',
      title: 'No power in living room', detail: 'Two sockets and the light fitting in the living room have no power after the storm.',
      urgency: 'urgent', status: 'in-progress', techId: 'T2', created: '2026-08-06', updated: '2026-08-13', photos: 3 },
    { id: 'REQ-1038', propertyId: 'P4', unit: 'Observatory Unit 12', tenantId: 'U4', category: 'hvac',
      title: 'Air conditioner not cooling', detail: 'The wall unit blows warm air even on the lowest temperature setting.',
      urgency: 'normal', status: 'on-hold', techId: 'T3', created: '2026-08-07', updated: '2026-08-12', photos: 1 },
    { id: 'REQ-1027', propertyId: 'P3', unit: 'Kenilworth Unit 4', tenantId: 'U5', category: 'appliances',
      title: 'Dishwasher not draining', detail: 'The dishwasher completes a cycle but leaves water standing in the bottom.',
      urgency: 'low', status: 'completed', techId: 'T5', created: '2026-08-02', updated: '2026-08-09', photos: 2 },
    { id: 'REQ-1015', propertyId: 'P5', unit: 'Bellville Unit 9', tenantId: 'U6', category: 'plumbing',
      title: 'Toilet running continuously', detail: 'The cistern keeps refilling and never stops. Please inspect the inlet valve.',
      urgency: 'normal', status: 'completed', techId: 'T1', created: '2026-07-28', updated: '2026-08-04', photos: 0 },
    { id: 'REQ-1009', propertyId: 'P8', unit: 'Milnerton Unit 11', tenantId: 'U7', category: 'security',
      title: 'Front gate lock sticking', detail: 'The electronic gate opens but the manual lock is stiff and difficult to turn.',
      urgency: 'normal', status: 'closed', techId: 'T4', created: '2026-07-20', updated: '2026-07-29', photos: 1 },
    { id: 'REQ-1019', propertyId: 'P9', unit: 'Newlands Unit 2', tenantId: 'U8', category: 'electrical',
      title: 'Ceiling light flickering', detail: 'The hallway light flickers constantly and occasionally goes dark for a few seconds.',
      urgency: 'low', status: 'closed', techId: 'T2', created: '2026-07-22', updated: '2026-07-30', photos: 0 },
    { id: 'REQ-1079', propertyId: 'P7', unit: 'Durbanville Unit 3', tenantId: 'U6', category: 'hvac',
      title: 'Geyser not heating', detail: 'No hot water for the last two days. The geyser thermostat may need replacement.',
      urgency: 'urgent', status: 'submitted', techId: null, created: '2026-08-14', updated: '2026-08-14', photos: 1 },
    { id: 'REQ-1078', propertyId: 'P10', unit: 'Mowbray Unit 6', tenantId: 'U7', category: 'plumbing',
      title: 'Shower pressure very low', detail: 'The shower has almost no pressure even with the tap fully open.',
      urgency: 'normal', status: 'under-review', techId: null, created: '2026-08-13', updated: '2026-08-14', photos: 0 }
  ];

  var COMMENTS = {
    'REQ-1045': [
      { by: 'Sarah Williams', role: 'Tenant', when: '2026-08-08 09:15', text: 'Reported the issue with photos of the leaking pipes.' },
      { by: 'Michael Jacobs', role: 'Property Manager', when: '2026-08-08 11:02', text: 'Thanks Sarah. Assigned to Johan and prioritised as high.' },
      { by: 'Johan van der Merwe', role: 'Technician', when: '2026-08-14 14:40', text: 'On site now. Replacing the flexi hose under the sink, then testing.' }
    ],
    'REQ-1061': [
      { by: 'Sarah Williams', role: 'Tenant', when: '2026-08-10 17:30', text: 'The noise is getting worse at night.' },
      { by: 'Michael Jacobs', role: 'Property Manager', when: '2026-08-11 08:10', text: 'David will inspect the pump tomorrow morning.' }
    ],
    'REQ-1032': [
      { by: 'Thabo Nkosi', role: 'Tenant', when: '2026-08-06 20:45', text: 'Still no power after the storm last night.' },
      { by: 'Michael Jacobs', role: 'Property Manager', when: '2026-08-07 07:30', text: 'Logged with Riaan as urgent - checking the distribution board.' }
    ]
  };

  var HISTORY = {
    'REQ-1045': [
      { status: 'Submitted', when: '2026-08-08 09:15' },
      { status: 'Under review', when: '2026-08-08 10:00' },
      { status: 'Assigned', when: '2026-08-08 11:02' },
      { status: 'In progress', when: '2026-08-09 08:20' }
    ],
    'REQ-1061': [
      { status: 'Submitted', when: '2026-08-10 17:30' },
      { status: 'Under review', when: '2026-08-11 08:10' },
      { status: 'Assigned', when: '2026-08-11 08:15' }
    ]
  };

  function requestsForTenant(tenantId) {
    return REQUESTS.filter(function (r) { return r.tenantId === tenantId; });
  }

  function requestsForProperty(propertyId) {
    return REQUESTS.filter(function (r) { return r.propertyId === propertyId; });
  }

  function requestsForTechnician(techId) {
    return REQUESTS.filter(function (r) { return r.techId === techId; });
  }

  function requestsForManager(managerId) {
    var props = PROPERTIES.filter(function (p) { return p.managerId === managerId; }).map(function (p) { return p.id; });
    return REQUESTS.filter(function (r) { return props.indexOf(r.propertyId) !== -1; });
  }

  function openStatuses() {
    return ['submitted', 'under-review', 'assigned', 'in-progress', 'on-hold'];
  }

  return {
    CATEGORIES: CATEGORIES,
    URGENCIES: URGENCIES,
    STATUSES: STATUSES,
    PROPERTIES: PROPERTIES,
    TECHNICIANS: TECHNICIANS,
    TENANTS: TENANTS,
    MANAGERS: MANAGERS,
    USERS: USERS,
    REQUESTS: REQUESTS,
    COMMENTS: COMMENTS,
    HISTORY: HISTORY,
    catName: catName,
    urgName: urgName,
    statusName: statusName,
    userName: userName,
    propName: propName,
    techName: techName,
    requestsForTenant: requestsForTenant,
    requestsForProperty: requestsForProperty,
    requestsForTechnician: requestsForTechnician,
    requestsForManager: requestsForManager,
    openStatuses: openStatuses
  };
})();
