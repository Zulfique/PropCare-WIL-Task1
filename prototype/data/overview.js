// Mock overview/dashboard data
window.PROPCARE_OVERVIEW = {
  date: "Tuesday, 18 June 2024",
  greetingName: "Sarah",
  stats: [
    { label: "Open requests", value: "4", foot: "1 need priority attention", icon: "wrench" },
    { label: "Awaiting action", value: "3", foot: "Across your workspace", icon: "clock" },
    { label: "Resolved this month", value: "8", foot: "12% ahead of last month", icon: "check", positive: true },
    { label: "Average response", value: "1.8h", foot: "Healthy operational rhythm", icon: "pulse", positive: true }
  ],
  workload: {
    created: 41,
    resolved: 34,
    days: [
      { day: "M", created: 46, resolved: 0 },
      { day: "T", created: 0, resolved: 62 },
      { day: "W", created: 40, resolved: 0 },
      { day: "T", created: 0, resolved: 70 },
      { day: "F", created: 44, resolved: 0 },
      { day: "S", created: 0, resolved: 92 },
      { day: "S", created: 52, resolved: 0 }
    ]
  },
  priorityAttention: [
    { title: "Kitchen sink leaking", priority: "High", code: "REQ-1045", location: "Claremont" }
  ],
  categories: [
    { name: "Plumbing", count: 14, pct: 100 },
    { name: "Electrical", count: 9, pct: 64 },
    { name: "Heating & cooling", count: 7, pct: 50 },
    { name: "Security", count: 5, pct: 36 },
    { name: "Appliances", count: 3, pct: 21 }
  ],
  goodToKnow: [
    { type: "teal", text: "Every update is time-stamped and visible to the right people." },
    { type: "amber", text: "Three requests are approaching their service target." }
  ]
};
