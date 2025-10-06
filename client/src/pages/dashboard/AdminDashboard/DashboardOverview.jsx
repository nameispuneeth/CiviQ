import * as React from "react";
import Button from "@mui/material/Button";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";

export default function DashboardOverview({
  stats,
  issues,
  setActiveView,
  setSelectedIssue,
  theme,
}) {
  const isDark = theme === "dark";

  // ----- Statistics -----
  const pending = issues.filter((i) => i.status === "pending").length;
  const inProgress = issues.filter((i) => i.status === "in_progress").length;
  const completed = issues.filter((i) => i.status === "completed").length;

  // ----- Chart 1: Status Overview -----
  const barData = [pending, inProgress, completed];
  const barLabels = ["Pending", "In Progress", "Completed"];

  // ----- Chart 2: Priority Distribution -----
  const priorityCounts = {
    high: issues.filter((i) => i.priority === "high").length,
    medium: issues.filter((i) => i.priority === "medium").length,
    low: issues.filter((i) => i.priority === "low").length,
  };
  const pieData = [
    { id: 0, value: priorityCounts.high, label: "High" },
    { id: 1, value: priorityCounts.medium, label: "Medium" },
    { id: 2, value: priorityCounts.low, label: "Low" },
  ];

  // ----- Chart 3: Issues Created Over Time -----
  const dateCounts = {};
  issues.forEach((i) => {
    const date = new Date(i.created_at).toLocaleDateString();
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  const lineLabels = Object.keys(dateCounts);
  const lineData = Object.values(dateCounts);

  // Chart colors
  const chartColors = isDark
    ? ["#4FC3F7", "#81C784", "#FFB74D", "#E57373"]
    : ["#1976D2", "#2E7D32", "#F57C00", "#D32F2F"];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
          Dashboard Overview
        </h2>
        <Button variant="contained">Hello world</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className={`border rounded-xl p-4 text-center shadow-md hover:shadow-xl transition ${
              isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"
            }`}
          >
            <p className={`text-sm capitalize ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {key}
            </p>
            <h3 className={`text-2xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              {value}
            </h3>
          </div>
        ))}
      </div>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div
          className={`border rounded-xl p-6 shadow-md hover:shadow-xl transition ${
            isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"
          }`}
        >
          <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
            Issues by Status
          </h3>
          <BarChart
            xAxis={[{ data: barLabels, scaleType: "band" }]}
            series={[{ data: barData, color: isDark ? "#ca1d1dff" : "#1976D2" }]}
            height={300}
            sx={{
              backgroundColor: "transparent",
              "& .MuiChartsAxis-line": { stroke: isDark ? "#510f0fff" : "#374151" },
              "& .MuiChartsAxis-tickLabel": { fill: isDark ? "#e16163ff" : "#374151" },
              "& .MuiChartsGrid-line": { stroke: isDark ? "#374151" : "#E5E7EB" },
            }}
          />
        </div>

        {/* Pie Chart */}
        <div
          className={`border rounded-xl p-6 shadow-md hover:shadow-xl transition ${
            isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"
          }`}
        >
          <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
            Issue Priority Distribution
          </h3>
          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: 40,
                outerRadius: 120,
                paddingAngle: 5,
                cornerRadius: 5,
                colors: chartColors,
              },
            ]}
            height={300}
          />
        </div>
      </div>

      {/* Line Chart Full Width */}
      <div
        className={`border rounded-xl p-6 shadow-md hover:shadow-xl transition ${
          isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"
        }`}
      >
        <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
          Issues Created Over Time
        </h3>
        <LineChart
          xAxis={[{ data: lineLabels }]}
          series={[{ data: lineData, color: chartColors[1], label: "Issues" }]}
          height={300}
          sx={{
            backgroundColor: "transparent",
            "& .MuiChartsAxis-line": { stroke: isDark ? "#888" : "#ccc" },
            "& .MuiChartsAxis-tickLabel": { fill: isDark ? "#eee" : "#333" },
          }}
        />
      </div>
    </div>
  );
}
