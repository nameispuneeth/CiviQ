import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import IssuesList from "./IssuesList";
import IssueModal from "./IssueModal";
import { navigationItems, dummyIssues, dummyDepartments } from "../AdminDashboard/backend/constant";
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

  // Fetch dummy issues & departments
  useEffect(() => {
    fetchIssues(setIssues, setLoading);
    fetchDepartments(setDepartments);
  }, []);

  // Update dashboard stats when issues change
  useEffect(() => {
    setStats(calculateStats(issues));
  }, [issues]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      <Sidebar
        navigationItems={navigationItems}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex items-center justify-between px-6 border-b border-[#E6E6E6] dark:border-[#333333]">
          <h1 className="text-2xl font-bold text-black dark:text-white font-inter capitalize">
            {activeView}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeView === "dashboard" && (
            <DashboardOverview
              stats={stats}
              issues={issues}
              setActiveView={setActiveView}
              setSelectedIssue={setSelectedIssue}
            />
          )}

          {activeView === "issues" && (
            <IssuesList
              issues={issues}
              filters={filters}
              setFilters={setFilters}
              setSelectedIssue={setSelectedIssue}
            />
          )}

          {
            activeView==="departments" &&
            (
              <Departments 
                
              />
            )
          }

    {activeView === "map" && <MapIssues issues={issues} />}

        </div>
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          departments={departments}
        />
      )}
    </div>
  );
}
