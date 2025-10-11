import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Save,
  RefreshCw,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function EnhancedIssuesList({
  issues = [],
  setIssues,
  filters = { search: "" },
  setFilters,
  setSelectedIssue,
}) {
  const {isDark}=useContext(ThemeContext)
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [localIssues, setLocalIssues] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalIssues([...issues]);
    setHasChanges(false);
  }, [issues]);

  const updateStatus = (issueId, newStatus) => {
    setLocalIssues(prev =>
      prev.map(i =>
        i.id === issueId
          ? {
              ...i,
              status: newStatus,
              updated_at: new Date().toISOString(),
              ...(newStatus === "resolved" && {
                resolved_at: new Date().toISOString()
              })
            }
          : i
      )
    );
    setHasChanges(true);
  };

  const updateDepartment = (issueId, newDept) => {
    setLocalIssues(prev =>
      prev.map(i =>
        i.id === issueId
          ? {
              ...i,
              department: newDept,
              assigned_to: newDept ? `${newDept} Team` : null,
              updated_at: new Date().toISOString()
            }
          : i
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (setIssues) setIssues([...localIssues]);
      setHasChanges(false);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  const handleRefresh = () => {
    setLocalIssues([...issues]);
    setHasChanges(false);
  };

  const filteredIssues = localIssues.filter(issue => {
    const matchesSearch =
      !filters.search ||
      issue.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.location_address
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      issue.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
  const paginatedIssues = filteredIssues.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const getStatusInfo = status => {
    const statusMap = {
      pending: {
        label: "Pending",
        icon: Clock,
        color: isDark ? "text-yellow-400" : "text-yellow-700",
        bgColor: isDark ? "bg-yellow-900/40" : "bg-yellow-100",
        borderColor: "border-yellow-500/40"
      },
      in_progress: {
        label: "In Progress",
        icon: AlertTriangle,
        color: isDark ? "text-blue-400" : "text-blue-700",
        bgColor: isDark ? "bg-blue-900/40" : "bg-blue-100",
        borderColor: "border-blue-500/40"
      },
      resolved: {
        label: "Resolved",
        icon: CheckCircle,
        color: isDark ? "text-green-400" : "text-green-700",
        bgColor: isDark ? "bg-green-900/40" : "bg-green-100",
        borderColor: "border-green-500/40"
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const departments = [
    "Roads & Infrastructure",
    "Street Lighting",
    "Sanitation",
    "Parks & Recreation",
    "Water & Utilities",
    "General Services",
    "Emergency Services"
  ];

  const categories = ["Roads", "Lighting", "Sanitation", "Parks", "Water", "Other"];

  const baseClasses = isDark
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-gray-900 border-gray-200";

  const inputClasses = isDark
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500";

  const hoverClasses = isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div
      className={`rounded-xl border shadow-sm ${baseClasses} transition-colors duration-300`}
    >
      {/* Header */}
      <div className={`p-6 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Issues Management Center</h2>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Track, assign, and resolve civic issues efficiently
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg ${hoverClasses} transition-colors duration-200`}
              title="Refresh Data"
            >
              <RefreshCw
                size={20}
                className={isDark ? "text-gray-400" : "text-gray-600"}
              />
            </button>

            {hasChanges && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <Save size={16} />
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Search Issues
            </label>
            <div className="relative">
              <Search
                size={16}
                className={`absolute left-3 top-3 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search by title, description, or location..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Issue Details
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIssues.map(issue => {
              const statusInfo = getStatusInfo(issue.status);
              const StatusIcon = statusInfo.icon;

              return (
                <tr
                  key={issue.id}
                  className={`border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } ${hoverClasses} transition-colors duration-200 cursor-pointer`}
                  onClick={() => setSelectedIssue && setSelectedIssue(issue)}
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                        {issue.title}
                      </h3>
                      {issue.description && (
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          } line-clamp-2`}
                        >
                          {issue.description}
                        </p>
                      )}
                      {issue.location_address && (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          <MapPin size={12} />
                          <span>{issue.location_address}</span>
                        </div>
                      )}
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        <Calendar size={12} />
                        <span>
                          #{issue.id} •{" "}
                          {new Date(issue.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}
                    >
                      <StatusIcon size={14} />
                      {statusInfo.label}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{issue.category}</span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={issue.department || ""}
                      onChange={e => updateDepartment(issue.id, e.target.value)}
                      disabled={issue.status === "resolved"}
                      className={`w-full px-3 py-1 text-sm rounded border ${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedIssue && setSelectedIssue(issue);
                        }}
                        className={`p-1 rounded ${hoverClasses} transition-colors duration-200`}
                        title="View Details"
                      >
                        <Eye
                          size={16}
                          className={isDark ? "text-gray-400" : "text-gray-600"}
                        />
                      </button>

                      {issue.status === "pending" && issue.department && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            updateStatus(issue.id, "in_progress");
                          }}
                          className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                          title="Start Progress"
                        >
                          <Play size={16} />
                        </button>
                      )}

                      {issue.status === "in_progress" && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            updateStatus(issue.id, "resolved");
                          }}
                          className="p-1 rounded hover:bg-green-100 text-green-600 transition-colors duration-200"
                          title="Mark Resolved"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          className={`px-3 py-1 rounded-md border ${
            isDark
              ? "bg-[#1f1f1f] border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === i + 1
                ? isDark
                  ? "bg-[#4b4b4b] border-gray-700 text-white"
                  : "bg-gray-300 border-gray-300 text-gray-800"
                : isDark
                ? "bg-[#1f1f1f] border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          className={`px-3 py-1 rounded-md border ${
            isDark
              ? "bg-[#1f1f1f] border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
}
