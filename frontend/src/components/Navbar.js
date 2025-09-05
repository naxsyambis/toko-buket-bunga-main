import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setIsMenuOpen(false);
  
  // Menutup dropdown profile jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  const renderNavLinks = () => {
    // Tampilan untuk Admin
    if (currentUser?.role === 'admin') {
      return (
        <Link to="/admin" className="nav-link" onClick={closeMobileMenu}>Admin Panel</Link>
      );
    }
    
    // Tampilan untuk Buyer (sudah login)
    if (currentUser?.role === 'buyer') {
      return (
        <>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
          <Link to="/products" className="nav-link" onClick={closeMobileMenu}>Products</Link>
          <Link to="/my-orders" className="nav-link" onClick={closeMobileMenu}>Order History</Link>
        </>
      );
    }

    // Tampilan default untuk tamu (belum login)
    return (
      <>
        <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
        <Link to="/products" className="nav-link" onClick={closeMobileMenu}>Products</Link>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>FLORYN.</Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {renderNavLinks()}
        </div>

        <div className="nav-icons">
          {currentUser && currentUser.role === 'buyer' && (
            <Link to="/cart" className="nav-icon-link">
              <i className="fas fa-shopping-cart"></i>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          )}

          {currentUser ? (
            <div className="profile-menu-container" ref={profileRef}>
              <button className="nav-icon-link profile-button" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <i className="fas fa-user-circle"></i>
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <i className="fas fa-user"></i>
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  {/* Riwayat Pesanan sudah dipindah keluar */}
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login-btn">Login</Link>
          )}
        </div>
        
        <div className="nav-toggle" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;