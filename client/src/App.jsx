import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import ReportPage from "./pages/Report";
import TrackIssues from "./pages/track";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup"
import CitizenDashboard from "./pages/dashboard/UserDaahboard";

function App() {
  return (
      <Routes>

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report-issues" element={<ReportPage />} />
        <Route path="/track-issues" element={<TrackIssues />} />
      <Route path="/" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>

      <Route path="/citizen" element={<CitizenDashboard />} />
      </Routes>
  );
}

export default App;
