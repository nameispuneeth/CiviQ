import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ReportPage from "./pages/Report";
import ImageReport from "./pages/ImageReport";
import TrackIssues from "./pages/track";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup"
import CitizenDashboard from "./pages/dashboard/UserDaahboard";
import Upload from "./pages/dashboard/track/ImageUpload";
import { ThemeProvider } from "./Context/ThemeContext";
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/notfoundpage";
import ProtectedRoute from "./components/ProtectedRoute";
// import ThemeProvider
function App() {
  return (
     <ThemeProvider>
       <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Everything below requires a token — the guard renders the child
            route only when one is present, so a new protected page is a single
            line in here rather than another per-page check. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/user-home" element={<CitizenDashboard />} />
          <Route path="/report-issues" element={<ReportPage />} />
          <Route path="/image-report" element={<ImageReport />} />
          <Route path="/track-issues" element={<TrackIssues />} />
          <Route path="/upload" element={<Upload />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
     </ThemeProvider>
  );
}

export default App;
