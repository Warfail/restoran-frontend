import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SalesReportPage from "./pages/SalesReportPage";
import UserListPage from "./pages/UserListPage";
import UserManagementPage from "./pages/UserManagementPage";
import MenuManagementPage from "./pages/MenuManagementPage";
import AddMenuPage from "./pages/AddMenuPage";
import InventoryPage from "./pages/InventoryPage";
import KitchenLoginPage from "./pages/KitchenLoginPage";
import KitchenDashboard from "./pages/KitchenDashboard";
import CashierLoginPage from "./pages/CashierLoginPage";
import CashierDashboard from "./pages/CashierDashboard";
import CustomerLandingPage from "./pages/CustomerLandingPage";
import CustomerMenuPage from "./pages/CustomerMenuPage";
import CartPage from "./pages/CartPage";



function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><SalesReportPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
        <Route path="/users/add" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
        <Route path="/admin/menu" element={<PrivateRoute><MenuManagementPage /></PrivateRoute>} />
        <Route path="/admin/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
        <Route path="/admin/menu/add" element={<PrivateRoute><AddMenuPage /></PrivateRoute>} />
        <Route path="/cashier/login" element={<CashierLoginPage />} />
        <Route path="/cart" element={<CartPage />} />
<Route path="/cashier" element={<PrivateRoute><CashierDashboard /></PrivateRoute>} />
<Route path="/landing" element={<CustomerLandingPage />} />
<Route path="/menu" element={<CustomerMenuPage />} />


<Route path="/kitchen/login" element={<KitchenLoginPage />} />
<Route path="/kitchen/dashboard" element={<PrivateRoute><KitchenDashboard /></PrivateRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;