import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import Login from "./pages/auth/login";
import { ThemeProvider } from "./Context/ThemeContext";
import EmployeePage from "./pages/Employee/Employee";
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/notfoundpage";
// import ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
