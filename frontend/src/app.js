import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import HomePage from './pages/home/HomePage';
import ProductPage from './pages/buyer/ProductPage';
import ProductDetailPage from './pages/buyer/ProductDetailPage';
import CartPage from './pages/buyer/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OrderHistoryPage from './pages/buyer/OrderHistoryPage';
import PlaceOrderPage from './pages/buyer/PlaceOrderPage';
import OrderDetailPage from './pages/buyer/OrderDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Import CSS
import './App.css';

// Komponen untuk melindungi route
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Jika tidak login, arahkan ke halaman login
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    // Jika role tidak sesuai, arahkan ke halaman utama
    return <Navigate to="/" />;
  }
  
  return children;
};

// Komponen untuk mengelola layout aplikasi
const AppLayout = () => {
  const location = useLocation();
  const noNavPaths = ['/login', '/register'];
  const showNavbar = !noNavPaths.includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rute yang Dilindungi untuk Buyer */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} /> {/* <-- Tambahkan Rute Baru */}
          <Route path="/place-order" element={<ProtectedRoute><PlaceOrderPage /></ProtectedRoute>} />
          
          {/* Rute Admin */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Komponen App utama
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;