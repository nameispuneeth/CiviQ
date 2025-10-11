'use client';

import React, { useState, useEffect } from 'react';
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
  User,
  Mail,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function EnhancedIssuesList({ 
  issues = [], 
  setIssues, 
  filters = { search: '' }, 
  setFilters, 
  setSelectedIssue,
  isDark = false 
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
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
      prev.map(i => (i.id === issueId ? { 
        ...i, 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        ...(newStatus === "resolved" && { resolved_at: new Date().toISOString() })
      } : i))
    );
    setHasChanges(true);
  };

  const updateDepartment = (issueId, newDept) => {
    setLocalIssues(prev => prev.map(i => (i.id === issueId ? { 
      ...i, 
      department: newDept,
      assigned_to: newDept ? `${newDept} Team` : null,
      updated_at: new Date().toISOString()
    } : i)));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (setIssues) {
        setIssues([...localIssues]);
      }
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
    const matchesSearch = !filters.search || 
      issue.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.location_address?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || issue.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || issue.priority?.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
  const paginatedIssues = filteredIssues.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "Pending",
        icon: Clock,
        color: "text-yellow-600",
        bgColor: isDark ? "bg-yellow-900/30" : "bg-yellow-100",
        borderColor: "border-yellow-500/30"
      },
      in_progress: {
        label: "In Progress", 
        icon: AlertTriangle,
        color: "text-blue-600",
        bgColor: isDark ? "bg-blue-900/30" : "bg-blue-100",
        borderColor: "border-blue-500/30"
      },
      resolved: {
        label: "Resolved",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: isDark ? "bg-green-900/30" : "bg-green-100",
        borderColor: "border-green-500/30"
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return isDark ? "text-red-400 bg-red-900/30 border-red-500/30" : "text-red-600 bg-red-100 border-red-500/30";
      case 'medium': return isDark ? "text-yellow-400 bg-yellow-900/30 border-yellow-500/30" : "text-yellow-600 bg-yellow-100 border-yellow-500/30";
      case 'low': return isDark ? "text-green-400 bg-green-900/30 border-green-500/30" : "text-green-600 bg-green-100 border-green-500/30";
      default: return isDark ? "text-gray-400 bg-gray-800 border-gray-600" : "text-gray-600 bg-gray-100 border-gray-300";
    }
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
  const priorities = ["High", "Medium", "Low"];

  const baseClasses = isDark 
    ? "bg-gray-800 text-white border-gray-700" 
    : "bg-white text-gray-900 border-gray-200";

  const inputClasses = isDark
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500";

  const hoverClasses = isDark
    ? "hover:bg-gray-700"
    : "hover:bg-gray-50";

  return (
    <div className={`rounded-xl border shadow-sm ${baseClasses} transition-colors duration-300`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Issues Management Center</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Track, assign, and resolve civic issues efficiently
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg ${hoverClasses} transition-colors duration-200`}
              title="Refresh Data"
            >
              <RefreshCw size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Search Issues
            </label>
            <div className="relative">
              <Search size={16} className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search by title, description, or location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2 text-sm">
              <Filter size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {filteredIssues.length} of {localIssues.length} issues
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Issue Details</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Reporter</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIssues.map((issue, index) => {
              const statusInfo = getStatusInfo(issue.status);
              const StatusIcon = statusInfo.icon;

              return (
                <tr
                  key={issue.id}
                  className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${hoverClasses} transition-colors duration-200 cursor-pointer`}
                  onClick={() => setSelectedIssue && setSelectedIssue(issue)}
                >
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                        {issue.title}
                      </h3>
                      {issue.description && (
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                          {issue.description}
                        </p>
                      )}
                      {issue.location_address && (
                        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          <MapPin size={12} />
                          <span>{issue.location_address}</span>
                        </div>
                      )}
                      <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        <Calendar size={12} />
                        <span>#{issue.id} • {new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                      <StatusIcon size={14} />
                      {statusInfo.label}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(issue.priority)}`}>
                      {issue.priority || 'Medium'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{issue.category}</span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={issue.department || ""}
                      onChange={(e) => updateDepartment(issue.id, e.target.value)}
                      disabled={issue.status === "resolved"}
                      className={`w-full px-3 py-1 text-sm rounded border ${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="" disabled>Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!issue.is_anonymous ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                            {issue.citizen_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {issue.citizen_name || 'Unknown'}
                            </p>
                            {issue.citizen_email && (
                              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {issue.citizen_email}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-600'}`}>
                            ?
                          </div>
                          <span className={`text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Anonymous
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssue && setSelectedIssue(issue);
                        }}
                        className={`p-1 rounded ${hoverClasses} transition-colors duration-200`}
                        title="View Details"
                      >
                        <Eye size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      </button>
                      
                      {issue.status === "pending" && issue.department && (
                        <button
                          onClick={(e) => {
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
                          onClick={(e) => {
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
      <div className={`px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredIssues.length)} of {filteredIssues.length} results
          </span>
          
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            className={`px-3 py-1 text-sm rounded border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`p-2 rounded border ${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed ${hoverClasses} transition-colors duration-200`}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : `${hoverClasses} ${isDark ? 'text-gray-300' : 'text-gray-700'}`
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className={`p-2 rounded border ${inputClasses} disabled:opacity-50 disabled:cursor-not-allowed ${hoverClasses} transition-colors duration-200`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}