import { useState, useEffect, useContext } from "react";
import {
  CssBaseline,
  Box,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from "@mui/material";
import { DarkMode, LightMode, Dashboard, ListAlt, Map, Apartment } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import IssuesList from "./IssuesList";
import IssueModal from "./IssueModal";
import Departments from "./Departments";
import MapIssues from "./MapIssues";
import { navigationItems } from "../AdminDashboard/backend/constant";
import { calculateStats } from "../AdminDashboard/backend/hooks";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function AdminDashboard() {
  const { isDark, toggleTheme } = useContext(ThemeContext); // useContext for theme

  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filters, setFilters] = useState({ status: "all", category: "all", priority: "all", search: "" });
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, todayReports: 0 });

  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(async() => {
    setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        alert("Login Required");
        navigate("/login");
        return;
      }
      const response = await fetch("http://localhost:8000/api/AdminDetails", {
        method: "GET",
        headers: {
          'authorization': token,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      console.log(data);
      setIssues(data.Issues);
      setDepartments(data.Departments);
      setLoading(false);
  }, []);

  useEffect(() => {
    setStats(calculateStats(issues));
  }, [issues]);

  if (loading)
    return (
      <>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: isDark ? "#121212" : "#f3f3f3",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );

  return (
    <>
      {/* <CssBaseline /> */}
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh", bgcolor: isDark ? "#121212" : "#f3f3f3" }}>
        {!isMobile && <Sidebar navigationItems={navigationItems} activeView={activeView} setActiveView={setActiveView} />}

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
      <AppBar
  position="static"
  color="default"
  sx={{
    borderBottom: 1,
    borderColor: "divider",
    boxShadow: "none",
    bgcolor: isDark ? "#1A1A1A" : "#fff",
  }}
>
  <Toolbar>
    <Typography
      variant="h6"
      sx={{
        flexGrow: 1,
        textTransform: "capitalize",
        color: isDark ? "#fff" : "#000", // make title visible
      }}
    >
      {activeView}
    </Typography>

    <IconButton onClick={toggleTheme} color="inherit">
      {isDark ? (
        <LightMode sx={{ color: "#FFD700" }} /> // sun icon, yellow in dark mode
      ) : (
        <DarkMode sx={{ color: "#00008B" }} /> // moon icon, dark blue in light mode
      )}
    </IconButton>
  </Toolbar>
</AppBar>


          <Container sx={{ flex: 1, overflowY: "auto", py: 3, mb: isMobile ? "56px" : 0 }}>
            {activeView === "dashboard" && (
              <DashboardOverview stats={stats} issues={issues} setActiveView={setActiveView} setSelectedIssue={setSelectedIssue} />
            )}
            {activeView === "issues" && (
              <IssuesList issues={issues} filters={filters} setFilters={setFilters} setSelectedIssue={setSelectedIssue} dept={departments} />
            )}
            {activeView === "departments" && <Departments dept={departments} />}
            {activeView === "map" && <MapIssues issues={issues} />}
          </Container>

          {selectedIssue && <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} departments={departments} />}

          {isMobile && (
            <BottomNavigation
              value={activeView}
              onChange={(e, newValue) => setActiveView(newValue)}
              showLabels
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: 1,
                borderColor: "divider",
                bgcolor: isDark ? "#1A1A1A" : "#fff",
                zIndex: 1200,
              }}
            >
              <BottomNavigationAction label="Dashboard" value="dashboard" icon={<Dashboard />} />
              <BottomNavigationAction label="Issues" value="issues" icon={<ListAlt />} />
              <BottomNavigationAction label="Departments" value="departments" icon={<Apartment />} />
              <BottomNavigationAction label="Map" value="map" icon={<Map />} />
            </BottomNavigation>
          )}
        </Box>
      </Box>
    </>
  );
}
