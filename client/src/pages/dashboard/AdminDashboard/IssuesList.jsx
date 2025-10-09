import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function IssuesList({ issues, setIssues, filters, setFilters, setSelectedIssue }) {
  const {isDark} = useContext(ThemeContext);

  const updateStatus = (issueId, newStatus) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const bgColor = isDark ? "bg-[#1E1E1E]" : "bg-white";
  const borderColor = isDark ? "border-[#333333]" : "border-[#E6E6E6]";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark ? "bg-[#2A2A2A]" : "bg-gray-50";
  const inputBorder = isDark ? "border-[#404040]" : "border-gray-300";
  const selectBg = isDark ? "bg-[#262626]" : "bg-white";

  return (
    <div className={`rounded-xl p-6 border ${borderColor} ${bgColor} transition-colors`}>
      <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>Issues List</h3>

      {/* Search Bar */}
      <input
        type="text"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Search issues..."
        className={`w-full mb-4 px-4 py-2 border rounded-lg ${inputBg} ${inputBorder} ${textColor} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {/* Issues */}
      <div className="space-y-3">
        {issues
          .filter((i) => !filters.search || i.title.toLowerCase().includes(filters.search.toLowerCase()))
          .map((issue) => (
            <div
              key={issue.id}
              className={`p-4 border rounded-lg flex flex-col gap-2 transition-colors cursor-pointer hover:shadow-md ${
                isDark ? "border-[#333333] hover:bg-[#2A2A2A]" : "border-[#E6E6E6] hover:bg-gray-100"
              }`}
            >
              <div onClick={() => setSelectedIssue(issue)}>
                <h4 className={`font-semibold ${textColor}`}>{issue.title}</h4>
                <p className={`${subTextColor} text-sm`}>
                  Status: {issue.status} | Priority: {issue.priority} | Category: {issue.category}
                </p>
                {issue.place && <p className={`${subTextColor} text-sm`}>Place: {issue.place}</p>}
                {issue.latitude && issue.longitude && (
                  <p className={`${subTextColor} text-sm`}>
                    Coordinates: {issue.latitude}, {issue.longitude}
                  </p>
                )}
                {issue.department && <p className={`${subTextColor} text-sm`}>Department: {issue.department}</p>}
                {issue.description && <p className={`${subTextColor} text-sm`}>Description: {issue.description}</p>}
              </div>

              {/* Status Select */}
              <select
                value={issue.status}
                onChange={(e) => updateStatus(issue.id, e.target.value)}
                className={`px-3 py-1 text-sm border rounded ${selectBg} ${inputBorder} ${textColor} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
      </div>
    </div>
  );
}
