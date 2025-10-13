"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Building2,
  Calendar,
  FileText,
  Flag,
} from "lucide-react";
import { Modal, Box, Typography, Button, TextField, MenuItem, Tabs, Tab } from "@mui/material";

export default function EmployeeDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [tabValue, setTabValue] = useState("all"); // all / pending / in_progress

  useEffect(() => {
    setCurrentEmployee({
      id: 2,
      name: "Sarah Johnson",
      employee_id: "EMP002",
      designation: "Electrician",
      department: "Electrical",
    });
  }, []);

  useEffect(() => {
    if (currentEmployee) loadDummyIssues();
  }, [currentEmployee]);

  const loadDummyIssues = () => {
    const dummyIssues = [
      {
        id: 1,
        issue_id: "ISS001",
        title: "Light not working in Lab 3",
        description: "Ceiling light in lab 3 is not working since morning.",
        category: "Electrical",
        status: "pending",
        flagged_status: "pending",
        reported_at: "2025-10-12T08:30:00Z",
      },
      {
        id: 2,
        issue_id: "ISS002",
        title: "Projector issue in Seminar Hall",
        description: "Projector flickering during operation.",
        category: "Electrical",
        status: "in_progress",
        flagged_status: "in_progress",
        reported_at: "2025-10-10T10:45:00Z",
      },
      {
        id: 3,
        issue_id: "ISS003",
        title: "AC not cooling properly",
        description: "AC in staff room not cooling below 25°C.",
        category: "Maintenance",
        status: "resolved",
        flagged_status: "resolved",
        reported_at: "2025-10-08T11:00:00Z",
      },
    ];
    setIssues(dummyIssues);
    setLoading(false);
  };

  const updateIssueStatus = (issueId, flaggedStatus, notes = "") => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue?.id === issueId
          ? { ...issue, flagged_status: flaggedStatus, notes }
          : issue
      )
    );
    setSelectedIssue(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-orange-500",
      in_progress: "text-blue-500",
      resolved: "text-green-600",
    };
    return colors[status] || "text-gray-500";
  };
const resolvedCount = issues.filter((i) => i.status === "resolved").length;



  // filtered by tab + search
  const filteredIssues = issues.filter((issue) => {
    const searchMatch =
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issue_id?.toLowerCase().includes(searchTerm.toLowerCase());
    if (tabValue === "all") return searchMatch;
    return issue.status === tabValue && searchMatch;
  });

  const pendingCount = issues.filter((i) => i.status === "pending").length;
  const inProgressCount = issues.filter((i) => i.status === "in_progress").length;

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"} min-h-screen`}>
      {/* Top Bar */}
      <header className={`sticky top-0 z-30 flex justify-between items-center px-6 py-4 shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center space-x-3">
          <LayoutDashboard size={22} />
          <h2 className="text-xl font-bold">Employee Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none ${isDark ? "bg-gray-700 border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-800"}`}
            />
          </div>
          <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
         
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm flex items-center text-gray-400">
          Dashboard <ChevronRight size={14} className="mx-2" /> <span className="font-semibold">My Issues</span>
        </div>

        {/* Employee Info Card */}
      {/* Employee Info + Summary Cards */}
{currentEmployee && (
  <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-white"} shadow flex justify-between items-center mb-6`}>
    <div>
      <Typography variant="h6" sx={{ color: isDark ? "#fff" : "#111827" }}>
        {currentEmployee.name}
      </Typography>
      <Typography variant="body2" sx={{ color: isDark ? "#d1d5db" : "#6b7280" }}>
        {currentEmployee.department}
      </Typography>
    </div>

    <div className="flex space-x-4">
      <div className={`rounded-xl p-4 bg-orange-100 text-orange-600 flex flex-col items-center justify-center`}>
        <span className="font-bold text-xl">{pendingCount}</span>
        <span className="text-sm">Pending</span>
      </div>
      <div className={`rounded-xl p-4 bg-blue-100 text-blue-600 flex flex-col items-center justify-center`}>
        <span className="font-bold text-xl">{inProgressCount}</span>
        <span className="text-sm">In Progress</span>
      </div>
      <div className={`rounded-xl p-4 bg-green-100 text-green-600 flex flex-col items-center justify-center`}>
        <span className="font-bold text-xl">{resolvedCount}</span>
        <span className="text-sm">Resolved</span>
      </div>
    </div>
  </div>
)}


        {/* Tabs */}
      <Tabs
  value={tabValue}
  onChange={(e, val) => setTabValue(val)}
  sx={{
    mb: 4,
    "& .MuiTabs-indicator": {
      backgroundColor: isDark ? "#fff" : "#3b82f6",
    },
  }}
>
  <Tab
    label="All"
    value="all"
    sx={{
      color: isDark ? "#fff" : "#111827",
      "&.Mui-selected": { color: "#3b82f6" },
    }}
  />
  <Tab
    label="Pending"
    value="pending"
    sx={{
      color: isDark ? "#fff" : "#111827",
      "&.Mui-selected": { color: "#f59e0b" },
    }}
  />
  <Tab
    label="In Progress"
    value="in_progress"
    sx={{
      color: isDark ? "#fff" : "#111827",
      "&.Mui-selected": { color: "#3b82f6" },
    }}
  />
  <Tab
    label="Resolved"
    value="resolved"
    sx={{
      color: isDark ? "#fff" : "#111827",
      "&.Mui-selected": { color: "#16a34a" },
    }}
  />
</Tabs>
        {/* Issues List */}
        <div className={`rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading issues...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No issues found</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{issue.title}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                          {issue.status?.toUpperCase()}
                        </span>
                        
                      </div>
                      <p className="mt-2 text-sm text-gray-400">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-xs mt-3 text-gray-400">
                        <span className="flex items-center"><Building2 size={12} className="mr-1" /> {issue.category}</span>
                        <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(issue.reported_at).toLocaleDateString()}</span>
                        <span className="flex items-center"><FileText size={12} className="mr-1" /> {issue.issue_id}</span>
                      </div>
                      {issue.flagged_status && (
                        <div className="mt-2 text-purple-400 text-sm flex items-center">
                          <Flag size={12} className="mr-1" /> Flagged as: {issue.flagged_status?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <Button variant="contained" color="primary" onClick={() => setSelectedIssue(issue)}>Update</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MUI Modal */}
<Modal open={!!selectedIssue} onClose={() => setSelectedIssue(null)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 420,
      bgcolor: isDark ? "#111827" : "#fff",
      color: isDark ? "#fff" : "#111827",
      borderRadius: 3,
      p: 4,
      boxShadow: isDark
        ? "0 10px 25px rgba(0,0,0,0.7)"
        : "0 10px 25px rgba(0,0,0,0.2)",
    }}
  >
    {/* Header */}
    <Typography
      variant="h6"
      mb={3}
      sx={{ fontWeight: 600, fontSize: "1.25rem", color: isDark ? "#fff" : "#111827" }}
    >
      Update Issue Status
    </Typography>

    {/* Status Dropdown */}
    <TextField
      select
      label="Flag Status"
      fullWidth
      value={selectedIssue?.flagged_status || ""}
      onChange={(e) =>
        setSelectedIssue((prev) => ({ ...prev, flagged_status: e.target.value }))
      }
      sx={{
        mb: 3,
        bgcolor: isDark ? "#1f2937" : "#f9fafb",
        borderRadius: 2,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isDark ? "#374151" : "#d1d5db",
        },
        "& .MuiInputLabel-root": {
          color: isDark ? "#fff" : "#111827",
        },
        "& .MuiSelect-icon": {
          color: isDark ? "#fff" : "#111827",
        },
        "& .MuiOutlinedInput-input": {
          color: isDark ? "#fff" : "#111827",
        },
      }}
    >
      <MenuItem value="pending">
        <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
        Pending
      </MenuItem>
      <MenuItem value="in_progress">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
        In Progress
      </MenuItem>
      <MenuItem value="resolved">
        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
        Resolved
      </MenuItem>
    </TextField>

    {/* Notes */}
    <TextField
      label="Notes"
      fullWidth
      multiline
      rows={3}
      value={selectedIssue?.notes || ""}
      onChange={(e) =>
        setSelectedIssue((prev) => ({ ...prev, notes: e.target.value }))
      }
      sx={{
        mb: 4,
        bgcolor: isDark ? "#1f2937" : "#f9fafb",
        borderRadius: 2,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isDark ? "#374151" : "#d1d5db",
        },
        "& .MuiInputLabel-root": {
          color: isDark ? "#fff" : "#111827",
        },
        "& .MuiOutlinedInput-input": {
          color: isDark ? "#fff" : "#111827",
        },
      }}
    />

    {/* Buttons */}
    <Box display="flex" gap={2}>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => setSelectedIssue(null)}
        sx={{
          borderRadius: 2,
          color: isDark ? "#fff" : "#111827",
          borderColor: isDark ? "#374151" : "#d1d5db",
          fontWeight: 500,
          "&:hover": {
            bgcolor: isDark ? "#374151" : "#f3f4f6",
          },
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        fullWidth
        onClick={() =>
          updateIssueStatus(
            selectedIssue.id,
            selectedIssue.flagged_status,
            selectedIssue.notes
          )
        }
        sx={{
          borderRadius: 2,
          bgcolor:
            selectedIssue?.flagged_status === "pending"
              ? "#f59e0b"
              : selectedIssue?.flagged_status === "in_progress"
              ? "#3b82f6"
              : "#16a34a",
          "&:hover": {
            bgcolor:
              selectedIssue?.flagged_status === "pending"
                ? "#d97706"
                : selectedIssue?.flagged_status === "in_progress"
                ? "#2563eb"
                : "#15803d",
          },
          fontWeight: 600,
          color: "#fff",
        }}
      >
        Update
      </Button>
    </Box>
  </Box>
</Modal>


      </main>
    </div>
  );
}
