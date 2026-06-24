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


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
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
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><SalesReportPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
        <Route path="/users/add" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
        <Route path="/admin/menu" element={<PrivateRoute><MenuManagementPage /></PrivateRoute>} />
        <Route path="/admin/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
        <Route path="/admin/menu/add" element={<PrivateRoute><AddMenuPage /></PrivateRoute>} />
        <Route path="/cashier/login" element={<Navigate to="/login" replace />} />
        <Route path="/cart" element={<CartPage />} />
<Route path="/cashier" element={<PrivateRoute><CashierDashboard /></PrivateRoute>} />
<Route path="/landing" element={<CustomerLandingPage />} />
<Route path="/menu" element={<CustomerMenuPage />} />
<Route path="/payment" element={<PaymentPage />} />
<Route path="/order-status" element={<OrderStatusPage />} />
<Route path="/payment-success" element={<PaymentSuccessPage />} />
<Route path="/customer/login" element={<CustomerLoginPage />} />
{/* <Route path="/admin/inventory" element={<PrivateRoute><InventoryPageNew /></PrivateRoute>} /> */}


<Route path="/kitchen/login" element={<Navigate to="/login" replace />} />
<Route path="/kitchen/dashboard" element={<PrivateRoute><KitchenDashboard /></PrivateRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;