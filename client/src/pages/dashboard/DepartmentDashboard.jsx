import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// ------------------ Dummy Data ------------------ //
const mockKPIs = {
  total: 124,
  inProgress: 37,
  resolved: 78,
  avgResolutionDays: 3.2,
  avgRating: 4.1,
};

const mockIssues = [
  { id: "ISS-1001", title: "Pothole on 5th Ave", citizen: "Anonymous", type: "Pothole", lat: 28.6139, lng: 77.2090, status: "Pending", priority: "High", createdAt: "2025-09-21T08:12:00Z" },
  { id: "ISS-1002", title: "Overflowing garbage bin", citizen: "Rita", type: "Garbage", lat: 28.6145, lng: 77.2105, status: "In Progress", priority: "Medium", createdAt: "2025-09-20T11:02:00Z" },
  { id: "ISS-1003", title: "Streetlight not working", citizen: "Suresh", type: "Streetlight", lat: 28.6151, lng: 77.2082, status: "Resolved", priority: "Low", createdAt: "2025-09-18T19:45:00Z", rating: 5 },
];

const sampleMonthly = [
  { month: "Apr", issues: 20 },
  { month: "May", issues: 24 },
  { month: "Jun", issues: 18 },
  { month: "Jul", issues: 26 },
  { month: "Aug", issues: 21 },
  { month: "Sep", issues: 15 },
];

export default function DepartmentDashboard({ departmentId = "sanitation" }) {
  const [kpis, setKpis] = useState(mockKPIs);
  const [issues, setIssues] = useState(mockIssues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartmentData();
  }, [departmentId]);

  async function fetchDepartmentData() {
    setLoading(true);
    try {
      // ------------------ BACKEND LOGIC PLACEHOLDER ------------------ //
      // Fetch KPI statistics for the department
      // const response = await fetch(`/api/departments/${departmentId}/stats`);
      // const data = await response.json();
      // setKpis(data);
      // Fetch issues assigned to this department
      // const res = await fetch(`/api/departments/${departmentId}/issues`);
      // const issuesData = await res.json();
      // setIssues(issuesData);
      // -------------------------------------------------------------- //

      setKpis(mockKPIs);
      setIssues(mockIssues);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateIssueStatus(issueId, newStatus) {
    // ------------------ BACKEND LOGIC PLACEHOLDER ------------------ //
    // Send PATCH request to backend to update issue status
    // await fetch(`/api/issues/${issueId}/status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus }),
    // });
    // --------------------------------------------------------------- //

    setIssues((s) => s.map((it) => (it.id === issueId ? { ...it, status: newStatus } : it)));
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-6">Department Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500">Total Issues</p>
          <h2 className="text-2xl font-bold">{kpis.total}</h2>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500">In Progress</p>
          <h2 className="text-2xl font-bold">{kpis.inProgress}</h2>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500">Resolved</p>
          <h2 className="text-2xl font-bold">{kpis.resolved}</h2>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500">Avg Resolution</p>
          <h2 className="text-2xl font-bold">{kpis.avgResolutionDays} days</h2>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md text-center">
          <p className="text-sm text-gray-500">Avg Rating</p>
          <h2 className="text-2xl font-bold">{kpis.avgRating}</h2>
        </div>
      </div>

      {/* Map + Chart */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-2">Issue Locations</h2>
          <MapContainer center={[28.6139, 77.2090]} zoom={14} className="h-64 rounded-2xl">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {issues.map((issue) => (
              <Marker key={issue.id} position={[issue.lat, issue.lng]}>
                <Popup>
                  <p className="font-semibold">{issue.title}</p>
                  <p>Status: {issue.status}</p>
                  <p>Priority: {issue.priority}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-2">Monthly Issues Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sampleMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="issues" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issue Table */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="font-semibold mb-4">Issues Assigned to Department</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Citizen</th>
              <th className="p-2">Type</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{issue.id}</td>
                <td className="p-2">{issue.title}</td>
                <td className="p-2">{issue.citizen}</td>
                <td className="p-2">{issue.type}</td>
                <td className="p-2">{issue.priority}</td>
                <td className="p-2">{issue.status}</td>
                <td className="p-2">
                  <select
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
