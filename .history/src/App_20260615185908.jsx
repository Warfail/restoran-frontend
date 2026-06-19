import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SalesReportPage from "./pages/SalesReportPage";
import UserListPage from "./pages/UserListPage";
import UserManagementPage from "./pages/UserManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reports" element={<SalesReportPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/add" element={<UserManagementPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;