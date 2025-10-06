import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AdminDashboard from "./pages/AdminDashboard";
import Report from "./pages/Report";
import IssueCard from "./components/IssueCard";
import SignIn from "./auth/signin";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/citizen" element={<CitizenApp />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report" element={<Report />} />
          <Route path="/issue-card" element={<IssueCard />} />
          <Route path="/sign-in" element={<SignIn />} />


      </Routes>
  );
}

export default App;
