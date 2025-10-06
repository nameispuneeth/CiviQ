import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import ReportPage from "./pages/Report";
import TrackIssues from "./pages/track";
import Signup from "./pages/auth/login";

function App() {
  return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/track" element={<TrackIssues />} />
      <Route path="/login" element={<Signup />}/>

      </Routes>
  );
}

export default App;
