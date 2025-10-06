import { dummyIssues, dummyDepartments } from "../backend/constant";

/*
  🧠 These functions simulate backend calls.
  They can be replaced later with real API requests.
*/

// Fetches issues (simulates GET /api/issues)
export const fetchIssues = (setIssues, setLoading) => {
  setLoading(true);
  setTimeout(() => {
    setIssues(dummyIssues);
    setLoading(false);
  }, 500);
};

// Fetches departments (simulates GET /api/departments)
export const fetchDepartments = (setDepartments) => {
  setTimeout(() => {
    setDepartments(dummyDepartments);
  }, 400);
};

// Calculates dashboard statistics
export const calculateStats = (issues) => {
  const total = issues.length;
  const pending = issues.filter((i) => i.status === "pending").length;
  const inProgress = issues.filter((i) => i.status === "in_progress").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;
  const todayReports = issues.filter(
    (i) => new Date(i.created_at).toDateString() === new Date().toDateString()
  ).length;

  return { total, pending, inProgress, resolved, todayReports };
};
