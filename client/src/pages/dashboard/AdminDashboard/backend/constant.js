// Navigation tabs
export const navigationItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "issues", label: "Issues" },
  { id: "map", label: "Map" },
];

// Dummy issues (used when backend is unavailable)
export const dummyIssues = [
  {
    id: 1,
    title: "Pothole near main road",
    description: "Large pothole causing traffic jams.",
    category: "Road Maintenance",
    status: "pending",
    priority: "high",
    department: "Public Works",
    created_at: "2025-09-30T10:00:00Z",
  },
  {
    id: 2,
    title: "Streetlight not working",
    description: "Streetlight near park flickering.",
    category: "Electrical",
    status: "in_progress",
    priority: "medium",
    department: "Electricity Dept.",
    created_at: "2025-09-28T14:00:00Z",
  },
];

// Dummy departments
export const dummyDepartments = [
  { id: 1, name: "Public Works", head: "John Smith" },
  { id: 2, name: "Electricity Dept.", head: "Jane Doe" },
];
