import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import SalesReportPage from "./pages/SalesReportPage";
import UserListPage from "./pages/UserListPage";
import UserManagementPage from "./pages/UserManagementpage";
import MenuManagementPage from "./pages/MenuManagementPage";
import AddMenuPage from "./pages/AddMenuPage";
import InventoryPage from "./pages/InventoryPage";
import AddInventoryPage from "./pages/AddInventoryPage";
import KitchenLoginPage from "./pages/KitchenLoginPage";
import KitchenDashboard from "./pages/KitchenDashboard";
import CashierLoginPage from "./pages/CashierLoginPage";
import CashierDashboard from "./pages/CashierDashboard";
import CustomerLandingPage from "./pages/CustomerLandingPage";
import CustomerMenuPage from "./pages/CustomerMenuPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import InventoryPageNew from "./pages/InventoryPageNew";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage"; 


function PrivateRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika allowedRoles diberikan dan role user tidak ada di dalamnya
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect ke dashboard masing-masing sesuai role yang dimiliki
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "kasir") return <Navigate to="/cashier" replace />;
    if (role === "kitchen") return <Navigate to="/kitchen/dashboard" replace />;
    
    // Fallback
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute allowedRoles={["admin"]}><SalesReportPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute allowedRoles={["admin"]}><UserListPage /></PrivateRoute>} />
        <Route path="/users/add" element={<PrivateRoute allowedRoles={["admin"]}><UserManagementPage /></PrivateRoute>} />
        <Route path="/admin/menu" element={<PrivateRoute allowedRoles={["admin"]}><MenuManagementPage /></PrivateRoute>} />
        <Route path="/admin/inventory" element={<PrivateRoute allowedRoles={["admin"]}><InventoryPage /></PrivateRoute>} />
        <Route path="/admin/inventory/add" element={<PrivateRoute allowedRoles={["admin"]}><AddInventoryPage /></PrivateRoute>} />
        <Route path="/admin/menu/add" element={<PrivateRoute allowedRoles={["admin"]}><AddMenuPage /></PrivateRoute>} />
        <Route path="/cashier/login" element={<Navigate to="/login" replace />} />
        <Route path="/cart" element={<CartPage />} />
<Route path="/cashier" element={<PrivateRoute allowedRoles={["kasir"]}><CashierDashboard /></PrivateRoute>} />
<Route path="/landing" element={<CustomerLandingPage />} />
<Route path="/menu" element={<CustomerMenuPage />} />
<Route path="/payment" element={<PaymentPage />} />
<Route path="/payment-methods" element={<PaymentMethodsPage />} />
<Route path="/order-status" element={<OrderStatusPage />} />
<Route path="/payment-success" element={<PaymentSuccessPage />} />
<Route path="/customer/login" element={<CustomerLoginPage />} />
<Route path="/customer-login" element={<CustomerLoginPage />} />
{/* <Route path="/admin/inventory" element={<PrivateRoute><InventoryPageNew /></PrivateRoute>} /> */}


<Route path="/kitchen/login" element={<Navigate to="/login" replace />} />
<Route path="/kitchen/dashboard" element={<PrivateRoute allowedRoles={["kitchen"]}><KitchenDashboard /></PrivateRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;