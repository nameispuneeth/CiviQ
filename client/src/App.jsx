import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Report from "./pages/Report";
import IssueCard from "./components/IssueCard";
import SignUp from "./auth/signup";
import Login from "./auth/login";

import Home from "./components/Home";
import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import ReportPage from "./pages/Report";
import TrackIssues from "./pages/track";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/citizen" element={<CitizenApp />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report" element={<Report />} />
          <Route path="/issue-card" element={<IssueCard />} />
          <Route path="/signup" element={<SignUp />} />
           <Route path="/login" element={<Login />} />
        <Route path="/report" element={<ReportPage />} />
          <Route path="/track" element={<TrackIssues />} />


      </Routes>
  );
}

export default App;

