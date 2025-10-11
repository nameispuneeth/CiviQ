import { useContext, useState } from "react";
import { Search } from "lucide-react";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function IssuesTable() {
  const { isDark } = useContext(ThemeContext);

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [issues, setIssues] = useState([
    {
      id: "ISS-001",
      title: "Broken Projector",
      description: "Projector in Lecture Hall 2 not working",
      reporter: "John Doe",
      date: "2025-10-08",
      status: "Pending",
      department: "",
      priority: "High",
    },
    {
      id: "ISS-002",
      title: "WiFi Not Working",
      description: "No internet connectivity in Lab 3",
      reporter: "Sara Ali",
      date: "2025-10-07",
      status: "In Progress",
      department: "IT",
      priority: "Medium",
    },
    {
      id: "ISS-003",
      title: "Light Flickering",
      description: "Light flickering in corridor",
      reporter: "Rahul Verma",
      date: "2025-10-09",
      status: "Completed",
      department: "Electrical",
      priority: "Low",
    },
    {
      id: "ISS-004",
      title: "AC Not Cooling",
      description: "AC in Lab 2 blowing hot air",
      reporter: "Anita Singh",
      date: "2025-10-10",
      status: "Pending",
      department: "",
      priority: "High",
    },
    {
      id: "ISS-005",
      title: "Projector Lens Broken",
      description: "Lens cracked in Lecture Hall 1",
      reporter: "John Doe",
      date: "2025-10-06",
      status: "Completed",
      department: "Maintenance",
      priority: "Medium",
    },
    {
      id: "ISS-006",
      title: "Network Cable Loose",
      description: "Ethernet port not working in Lab 1",
      reporter: "Sara Ali",
      date: "2025-10-09",
      status: "Pending",
      department: "",
      priority: "Low",
    },
  ]);

  const handleStatusChange = (id, value) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? { ...issue, status: value, department: value === "Pending" ? "" : issue.department }
          : issue
      )
    );
    setHasChanges(true);
  };

  const handleDeptChange = (id, value) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, department: value } : issue
      )
    );
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesStatus =
      filterStatus === "All" || issue.status === filterStatus;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 ${
        isDark
          ? "bg-[#121212] border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      {/* Header with search + filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold">Issues List</h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search box */}
          <div
            className={`flex items-center px-3 py-2 rounded-md border w-full sm:w-64 ${
              isDark
                ? "bg-[#1f1f1f] border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <Search size={18} className="opacity-70 mr-2" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent outline-none ${
                isDark ? "placeholder-gray-400" : "placeholder-gray-500"
              }`}
            />
          </div>

          {/* Status Filter */}
          <select
            className={`p-2 rounded-md border ${
              isDark
                ? "bg-[#1f1f1f] border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr
              className={`text-left text-sm ${
                isDark ? "bg-[#1f1f1f] text-gray-200" : "bg-gray-100 text-gray-700"
              }`}
            >
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b">Reporter</th>
              <th className="py-3 px-4 border-b">Date Reported</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Department</th>
              <th className="py-3 px-4 border-b">Priority</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIssues.map((issue) => (
              <tr
                key={issue.id}
                className={`text-sm transition-all ${
                  isDark
                    ? "hover:bg-[#1b1b1b] border-gray-700"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
              >
                <td className="py-3 px-4 border-b">{issue.id}</td>
                <td className="py-3 px-4 border-b">{issue.title}</td>
                <td className="py-3 px-4 border-b">{issue.description}</td>
                <td className="py-3 px-4 border-b">{issue.reporter}</td>
                <td className="py-3 px-4 border-b">{issue.date}</td>

                {/* Status select */}
                <td className="py-3 px-4 border-b">
                  <select
                    className={`p-1 rounded-md text-sm border ${
                      isDark
                        ? "bg-[#1f1f1f] border-gray-700 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                {/* Department column */}
                <td className="py-3 px-4 border-b">
                  {issue.status === "Pending" ? (
                    <select
                      className={`p-1 rounded-md text-sm border ${
                        isDark
                          ? "bg-[#1f1f1f] border-gray-700 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      value={issue.department}
                      onChange={(e) => handleDeptChange(issue.id, e.target.value)}
                    >
                      <option value="">Select Department</option>
                      <option value="IT">IT</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    <span>{issue.department}</span>
                  )}
                </td>

                <td className="py-3 px-4 border-b">{issue.priority}</td>
              </tr>
            ))}
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