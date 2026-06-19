import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SalesReportPage from "./pages/SalesReportPage";       ← tambah ini
import UserListPage from "./pages/UserListPage";             ← tambah ini
import UserManagementPage from "./pages/UserManagementPage"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reports" element={<PrivateRoute><SalesReportPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
        <Route path="/users/add" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;