import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import ReportPage from "./pages/Report";
import TrackIssues from "./pages/track";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup"
import CitizenDashboard from "./pages/dashboard/UserDaahboard";
import Upload from "./pages/dashboard/track/ImageUpload";

function App() {
  return (
      <Routes>
              <Route path="/" element={<CitizenDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report-issues" element={<ReportPage />} />
        <Route path="/track-issues" element={<TrackIssues />} />
      <Route path="/upload" element={<Upload  />}  />
      <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>

      <Route path="/citizen" element={<CitizenDashboard />} />
      </Routes>
  );
}

export default App;
