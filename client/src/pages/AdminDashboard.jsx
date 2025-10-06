import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Filter,
  Search,
  Eye,
  ArrowRight,
  Calendar,
  Target
} from "lucide-react";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all",
    search: ""
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    todayReports: 0
  });

  // Navigation items matching the design pattern
  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
    { name: "All Issues", icon: MapPin, view: "issues" },
    { name: "Map View", icon: MapPin, view: "map" },
    { name: "Departments", icon: Users, view: "departments" },
    { name: "Analytics", icon: Target, view: "analytics" }
  ];

  const statusColors = {
    pending: "bg-red-100 text-red-800 border-red-200",
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200"
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchIssues();
    fetchDepartments();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [issues]);

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      if (!response.ok) throw new Error('Failed to fetch issues');
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const calculateStats = () => {
    const today = new Date().toDateString();
    const todayReports = issues.filter(issue => 
      new Date(issue.created_at).toDateString() === today
    ).length;

    setStats({
      total: issues.length,
      pending: issues.filter(i => i.status === 'pending').length,
      inProgress: issues.filter(i => i.status === 'in_progress').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      todayReports
    });
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update issue');
      
      // Refresh issues list
      fetchIssues();
      
      // Update selected issue if it's currently open
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({ ...selectedIssue, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const assignDepartment = async (issueId, departmentName) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_department: departmentName })
      });

      if (!response.ok) throw new Error('Failed to assign department');
      fetchIssues();
    } catch (error) {
      console.error('Error assigning department:', error);
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filters.status !== "all" && issue.status !== filters.status) return false;
    if (filters.category !== "all" && issue.category !== filters.category) return false;
    if (filters.priority !== "all" && issue.priority !== filters.priority) return false;
    if (filters.search && !issue.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !issue.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const Sidebar = () => (
    <div className="w-60 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full">
      {/* Brand Logo */}
      <div className="p-4 flex justify-start">
        <div className="w-12 h-12 bg-white dark:bg-[#262626] rounded-full border border-[#E4E4E4] dark:border-[#404040] flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full"></div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;

            return (
              <button
                key={item.name}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-[#262626] border border-[#E4E4E4] dark:border-[#404040] text-black dark:text-white"
                    : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                }`}
              >
                <Icon size={20} className={isActive ? "text-black dark:text-white" : "text-black/70 dark:text-white/70"} />
                <span className={`font-medium text-sm font-plus-jakarta ${isActive ? "text-black dark:text-white" : "text-black/70 dark:text-white/70"}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={20} className="text-blue-600" />
            <span className="font-semibold text-gray-600 dark:text-gray-300">Total Issues</span>
          </div>
          <div className="text-3xl font-bold text-black dark:text-white">{stats.total}</div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-red-600" />
            <span className="font-semibold text-gray-600 dark:text-gray-300">Pending</span>
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.pending}</div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-yellow-600" />
            <span className="font-semibold text-gray-600 dark:text-gray-300">In Progress</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-semibold text-gray-600 dark:text-gray-300">Resolved</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={20} className="text-purple-600" />
            <span className="font-semibold text-gray-600 dark:text-gray-300">Today</span>
          </div>
          <div className="text-3xl font-bold text-purple-600">{stats.todayReports}</div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-black dark:text-white font-sora">Recent Issues</h3>
          <button 
            onClick={() => setActiveView("issues")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="space-y-4">
          {issues.slice(0, 5).map((issue) => (
            <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#262626] rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-black dark:text-white">{issue.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{issue.category} • {issue.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[issue.status]}`}>
                  {issue.status.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedIssue(issue)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const IssuesList = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="roads">Roads</option>
            <option value="lighting">Lighting</option>
            <option value="sanitation">Sanitation</option>
            <option value="parks">Parks</option>
            <option value="traffic">Traffic</option>
            <option value="water">Water</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-4 py-2 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-6 font-sora">
          Issues ({filteredIssues.length})
        </h3>
        
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="border border-[#E6E6E6] dark:border-[#333333] rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-black dark:text-white text-lg">{issue.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[issue.priority]}`}>
                      {issue.priority?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{issue.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>📍 {issue.address}</span>
                    <span>📁 {issue.category}</span>
                    <span>📅 {new Date(issue.created_at).toLocaleDateString()}</span>
                    {issue.reporter_name && !issue.is_anonymous && (
                      <span>👤 {issue.reporter_name}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[issue.status]}`}>
                    {issue.status.replace('_', ' ').toUpperCase()}
                  </span>
                  
                  <select
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                    className="px-3 py-1 text-xs border border-[#D9D9D9] dark:border-[#404040] rounded bg-white dark:bg-[#262626]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-blue-600 hover:text-blue-700 p-2"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const IssueModal = ({ issue, onClose }) => {
    if (!issue) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white font-sora">{issue.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex gap-4">
                <span className={`px-3 py-2 rounded-full text-sm font-medium border ${statusColors[issue.status]}`}>
                  {issue.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-2 rounded-full text-sm font-medium ${priorityColors[issue.priority]}`}>
                  {issue.priority?.toUpperCase()} PRIORITY
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{issue.description}</p>
              </div>

              {/* Photo */}
              {issue.photo_url && (
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Photo Evidence</h3>
                  <img
                    src={issue.photo_url}
                    alt="Issue evidence"
                    className="max-w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-2">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">{issue.address}</p>
                {issue.latitude && issue.longitude && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Coordinates: {issue.latitude}, {issue.longitude}
                  </p>
                )}
              </div>

              {/* Reporter Info */}
              {!issue.is_anonymous && issue.reporter_name && (
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Reporter Information</h3>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400">
                    <p><strong>Name:</strong> {issue.reporter_name}</p>
                    {issue.reporter_email && <p><strong>Email:</strong> {issue.reporter_email}</p>}
                    {issue.reporter_phone && <p><strong>Phone:</strong> {issue.reporter_phone}</p>}
                  </div>
                </div>
              )}

              {/* Assignment */}
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-2">Department Assignment</h3>
                <select
                  value={issue.assigned_department || ""}
                  onChange={(e) => assignDepartment(issue.id, e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9D9D9] dark:border-[#404040] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Timestamps */}
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Reported:</strong> {new Date(issue.created_at).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(issue.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      <Sidebar />
      
      <div className="flex-1 flex  flex-col min-w-0">
        {/* Header */}
        <div className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex items-center justify-between px-6 flex-shrink-0 border-b border-[#E6E6E6] dark:border-[#333333]">
          <h1 className="text-2xl font-bold text-black dark:text-white font-inter">
            {activeView === "dashboard" && "Admin Dashboard"}
            {activeView === "issues" && "All Issues"}
            {activeView === "map" && "Map View"}
            {activeView === "departments" && "Departments"}
            {activeView === "analytics" && "Analytics"}
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && <DashboardOverview />}
          {activeView === "issues" && <IssuesList />}
          {activeView === "map" && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 h-full">
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">Interactive Map</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">Map integration will be implemented here</p>
              </div>
            </div>
          )}
          {activeView === "departments" && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
              <h3 className="text-xl font-bold text-black dark:text-white mb-6">Departments</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="border border-[#E6E6E6] dark:border-[#333333] rounded-lg p-4">
                    <h4 className="font-semibold text-black dark:text-white mb-2">{dept.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Head: {dept.head_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dept.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeView === "analytics" && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">Analytics Dashboard</h3>
              <p className="text-gray-500">Advanced analytics and reporting features will be implemented here</p>
            </div>
          )}
        </div>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}


