import { dummyIssues, dummyDepartments } from "../backend/constant";

/*
  🧠 These functions simulate backend calls.
  They can be replaced later with real API requests.
*/

// Fetches issues (simulates GET /api/issues)
export const fetchIssues = async (setIssues, setLoading) => {
  setLoading(true);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    setLoading(false);
    setIssues(dummyIssues);
    return;
  }
  const response = await fetch("http://localhost:8000/api/AdminGetIssues", {
    method: "GET",
    headers: {
      'authorization': token,
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json();
  console.log(data);
  setIssues([...dummyIssues, ...data.Issues]);
  setLoading(false);
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
    (i) => new Date(i.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return { total, pending, inProgress, resolved, todayReports };
};
