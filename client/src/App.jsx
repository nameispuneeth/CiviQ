import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import ReportPage from "./pages/Report";
import TrackIssues from "./pages/track";
import Signup from "./pages/auth/login";
import CitizenDashboard from "./pages/dashboard/UserDaahboard";

function App() {
  return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report-issues" element={<ReportPage />} />
        <Route path="/track-issues" element={<TrackIssues />} />
      <Route path="/login" element={<Signup />}/>
      <Route path="/citizen" element={<CitizenDashboard />} />
      </Routes>
  );
}

export default App;
