import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SalesReportPage from "./pages/SalesReportPage";
import UserListPage from "./pages/UserListPage";
import UserManagementPage from "./pages/UserManagementPage";
import AddMenuPage from "./pages/AddMenuPage";
import MenuManagementPage from "./pages/MenuManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reports" element={<SalesReportPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/add" element={<UserManagementPage />} />
        <Route path="/menu/add" element={<AddMenuPage />} />
        <Route path="/admin/menu" element={<PrivateRoute><MenuManagementPage />/>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;