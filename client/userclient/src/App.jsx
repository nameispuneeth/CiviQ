import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ReportPage from "./pages/Report";
import TrackIssues from "./pages/track";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup"
import CitizenDashboard from "./pages/dashboard/UserDaahboard";
import Upload from "./pages/dashboard/track/ImageUpload";
import { ThemeProvider } from "./Context/ThemeContext";
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/notfoundpage";
// import ThemeProvider
function App() {
  return (
     <ThemeProvider>
       <Routes>
            <Route path="/" element={<HomePage/>}/>
              <Route path="/user-home" element={<CitizenDashboard />} />
        <Route path="/report-issues" element={<ReportPage />} />
        <Route path="/track-issues" element={<TrackIssues />} />
      <Route path="/upload" element={<Upload  />}  />
      <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>
      <Route path="/citizen" element={<CitizenDashboard />} />
      <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
     </ThemeProvider>
  );
}

export default App;
