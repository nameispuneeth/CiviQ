import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import IssuesList from "./IssuesList";
import IssueModal from "./IssueModal";
import { navigationItems } from "../AdminDashboard/backend/constant";
import { fetchIssues, fetchDepartments, calculateStats } from "../AdminDashboard/backend/hooks";
import Departments from "./Departments";
import MapIssues from "./MapIssues";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("departments");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all",
    search: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    todayReports: 0,
  });

  // Theme state
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    fetchIssues(setIssues, setLoading);
    fetchDepartments(setDepartments);
  }, []);

  useEffect(() => {
    setStats(calculateStats(issues));
  }, [issues]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${theme === "light" ? "bg-[#F3F3F3]" : "bg-[#0A0A0A]"}`}>
      <Sidebar
        navigationItems={navigationItems}
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div
          className={`h-16 flex items-center justify-between px-6 border-b ${
            theme === "light" ? "bg-[#F3F3F3] border-[#E6E6E6]" : "bg-[#1A1A1A] border-[#333333]"
          }`}
        >
          <h1
            className={`text-2xl font-bold font-inter capitalize ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            {activeView}
          </h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <DashboardOverview
              stats={stats}
              issues={issues}
              setActiveView={setActiveView}
              setSelectedIssue={setSelectedIssue}
              theme={theme}
            />
          )}

          {activeView === "issues" && (
            <IssuesList
              issues={issues}
              filters={filters}
              setFilters={setFilters}
              setSelectedIssue={setSelectedIssue}
              theme={theme}
            />
          )}

          {activeView === "departments" && <Departments theme={theme} />}

          {activeView === "map" && <MapIssues issues={issues} theme={theme} />}
        </div>
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          departments={departments}
          theme={theme}
        />
      )}
    </div>
  );
}
