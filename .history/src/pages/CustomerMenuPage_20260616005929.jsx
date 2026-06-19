import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, X, Search, CheckCircle } from "lucide-react";
import { api } from "../services/api";

export default function CustomerMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "5";
  const customerName = searchParams.get("name") || "Guest";
  const orderType = searchParams.get("type") || "Makan di Tempat";
  
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["Semua"]);

  // Fetch menu dari API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await api.getMenu();
        setMenuItems(data);
        // Extract unique categories
        const uniqueCats = ["Semua", ...new Set(data.map(item => item.category))];
        setCategories(uniqueCats);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // ... sisanya sama (addToCart, updateQuantity, removeFromCart, dll)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        tableNumber: parseInt(tableNumber),
        customerName,
        orderType,
        items: cart.map(item => ({
          menuId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        })),
        totalAmount,
        status: "pending"
      };
      
      const response = await api.createOrder(orderData);
      console.log("Order created:", response);
      
      setOrderSummary(orderData);
      setShowCart(false);
      setShowSuccessModal(true);
      setCart([]);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Gagal memproses pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // ... render (sama seperti sebelumnya, tambah loading state)
}