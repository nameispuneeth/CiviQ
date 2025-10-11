import React from "react";
import { Paper, Typography } from "@mui/material";
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ThemeContext, ThemeProvider } from "../../../Context/ThemeContext";
import { useContext } from "react";

export default function Charts({ stats, issues }) {
  const { isDark } =useContext(ThemeContext);

  const barData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inprogress },
    { name: "Resolved", value: stats.resolved },
  ];

  const priorityCounts = {
    high: issues.filter((i) => i.priority === "high").length,
    medium: issues.filter((i) => i.priority === "medium").length,
    low: issues.filter((i) => i.priority === "low").length,
  };

  const pieData = [
    { name: "High", value: priorityCounts.high },
    { name: "Medium", value: priorityCounts.medium },
    { name: "Low", value: priorityCounts.low },
  ];

  const pieColors = ["#EF4444", "#F59E0B", "#10B981"];

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" ,marginTop:"20px"}}>
      <Paper sx={{ p: 2, flex: 1, minWidth: 300, boxShadow: 3, backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>
        <Typography variant="h6">Issues by Status</Typography>
        <BarChart width={300} height={250} data={barData}>
          <CartesianGrid stroke={isDark ? "#444" : "#eee"} />
          <XAxis dataKey="name" stroke={isDark ? "#fff" : "#000"} />
          <YAxis stroke={isDark ? "#fff" : "#000"} />
          <Tooltip />
          <Bar dataKey="value" fill="#3B82F6" />
        </BarChart>
      </Paper>

      <Paper sx={{ p: 2, flex: 1, minWidth: 300, boxShadow: 3, backgroundColor: isDark ? "#1E1E2F" : "#fff", color: isDark ? "#fff" : "#000" }}>
        <Typography variant="h6">Priority Distribution</Typography>
        <PieChart width={300} height={250}>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieData.map((entry, index) => (
              <Cell key={index} fill={pieColors[index]} />
            ))}
          </Pie>
        </PieChart>
      </Paper>
    </div>
  );
}
