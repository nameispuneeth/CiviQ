import React, { useState, useEffect } from "react";
import { ClipboardList, CheckCircle, Clock, RefreshCcw } from "lucide-react";

/**
 * DepartmentDashboard.jsx
 * ------------------------
 * Displays issues assigned to a specific department.
 * Department staff can update issue status (e.g., "In Progress", "Resolved").
 * 
 * 🔧 Backend Logic (to be implemented later):
 * ------------------------------------------
 * 1️⃣ On page load, fetch all issues assigned to the logged-in department.
 *    GET /api/issues/department/:deptId
 *
 * 2️⃣ When status is updated:
 *    PATCH /api/issues/:issueId
 *    { status: "resolved" }
 *    → This should also notify the admin & user (through DB updates or notifications).
 *
 * 3️⃣ When issue is resolved, mark completion date & push update to frontend.
 */

export default function DepartmentDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Dummy data (replace with backend fetch)
  const dummyIssues = [
    {
      id: 1,
      title: "Street Light Not Working",
      description: "Lamp post near Park #5 has been out for 3 days.",
      category: "Lighting",
      location: "Green Park Road",
      status: "In Progress",
      assignedDate: "2025-10-05",
      reporter: "Anonymous",
    },
    {
      id: 2,
      title: "Garbage Overflow",
      description: "Overflowing bins near main market area.",
      category: "Sanitation",
      location: "Main Market Street",
      status: "Pending",
      assignedDate: "2025-10-04",
      reporter: "Ravi Kumar",
    },
  ];

  useEffect(() => {
    // Simulate fetch delay
    setTimeout(() => {
      setIssues(dummyIssues);
      setLoading(false);
    }, 1000);

    // In real backend:
    // fetch(`/api/issues/department/${departmentId}`)
    //   .then(res => res.json())
    //   .then(data => setIssues(data))
    //   .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    );

    // 🔧 Backend logic (PATCH request)
    // fetch(`/api/issues/${id}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ status: newStatus }),
    // });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <RefreshCcw className="animate-spin mr-2" /> Loading Department Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-sora">
          Department Dashboard
        </h1>

        {issues.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No issues assigned yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 transition-all hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-sora">
                    {issue.title}
                  </h2>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      issue.status === "Resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                        : issue.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-3 font-inter">
                  {issue.description}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  📍 {issue.location}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  🕒 Assigned: {issue.assignedDate}
                </p>

                <div className="flex items-center gap-3">
                  {issue.status !== "In Progress" && (
                    <button
                      onClick={() => handleStatusChange(issue.id, "In Progress")}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      <Clock size={18} /> In Progress
                    </button>
                  )}

                  {issue.status !== "Resolved" && (
                    <button
                      onClick={() => handleStatusChange(issue.id, "Resolved")}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      <CheckCircle size={18} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

