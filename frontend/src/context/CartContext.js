import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const API_URL = 'http://localhost:5000/api/cart';
const BASE_URL = 'http://localhost:5000/';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchCartItems = useCallback(async () => {
    if (!currentUser) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL, getAuthHeaders());
      const formattedItems = data.map(item => ({
        ...item,
        // --- PERBAIKAN DI SINI ---
        image: item.gambar ? `${BASE_URL}${item.gambar.replace(/\\/g, '/')}` : 'https://placehold.co/100',
        price: parseFloat(item.harga), // Menggunakan item.harga
        name: item.nama_produk // Menggunakan item.nama_produk
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error("Gagal mengambil item keranjang:", error);
      if (error.response && error.response.status === 401) {
        // Mungkin perlu fungsi logout dari AuthContext di sini
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCartItems();
  }, [currentUser, fetchCartItems]);

  const addToCart = async (productId, quantity = 1) => {
    if (!currentUser) {
      alert('Silakan login untuk menambahkan item ke keranjang.');
      return;
    }
    try {
      await axios.post(API_URL, { product_id: productId, quantity }, getAuthHeaders());
      alert('Produk berhasil ditambahkan ke keranjang!');
      fetchCartItems(); // Muat ulang keranjang setelah menambah item
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
      alert('Gagal menambahkan produk.');
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(`${API_URL}/${cartId}`, { quantity }, getAuthHeaders());
      fetchCartItems();
    } catch (error) {
      console.error("Gagal mengupdate kuantitas:", error);
    }
  };

    const removeFromCart = async (cartId) => {
    // ... (fungsi ini biarkan seperti sebelumnya)
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCartItems, // <-- TAMBAHKAN BARIS INI
    itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};