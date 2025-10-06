import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import ReportPage from "./pages/Report";
import TrackIssues from "./pages/track";

function App() {
  return (
      <Routes>
        {/* <Route path="/citizen" element={<CitizenApp />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report" element={<ReportPage />} />
          <Route path="/track" element={<TrackIssues />} />


      </Routes>
  );
}

export default App;
