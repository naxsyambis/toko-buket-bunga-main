import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { useCart } from '../../context/CartContext'; // Import useCart
import './PlaceOrderPage.css';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { fetchCartItems } = useCart(); // Ambil fungsi untuk refresh cart

  const { cartItems, subtotal } = location.state || { cartItems: [], subtotal: 0 };
  
  const [shippingInfo, setShippingInfo] = useState({
    namaPenerima: currentUser?.name || '',
    noHp: '',
    alamat: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingInfo.namaPenerima || !shippingInfo.noHp || !shippingInfo.alamat) {
      alert('Harap isi semua informasi pengiriman.');
      return;
    }

    const shippingCost = 20000;
    const orderData = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      total: subtotal + shippingCost
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert('Pesanan berhasil dibuat!');
      fetchCartItems(); // Kosongkan keranjang di frontend
      navigate('/my-orders');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Gagal membuat pesanan. ' + (error.response?.data?.message || ''));
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };
  
  if (!cartItems || cartItems.length === 0) {
    // Redirect jika tidak ada item
    React.useEffect(() => navigate('/cart'), [navigate]);
    return null;
  }

  return (
    <div className="place-order-container">
      <h1>Konfirmasi Pesanan</h1>
      <form className="place-order-layout" onSubmit={handlePlaceOrder}>
        <div className="shipping-form">
          <h2>Informasi Pengiriman</h2>
          <div className="form-group">
            <label htmlFor="namaPenerima">Nama Penerima</label>
            <input type="text" id="namaPenerima" name="namaPenerima" value={shippingInfo.namaPenerima} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="noHp">Nomor HP</label>
            <input type="tel" id="noHp" name="noHp" value={shippingInfo.noHp} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="alamat">Alamat Lengkap</label>
            <textarea id="alamat" name="alamat" rows="4" value={shippingInfo.alamat} onChange={handleInputChange} required></textarea>
          </div>
        </div>

        <div className="order-summary-box">
          <h2>Ringkasan Pesanan</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Ongkos Kirim</span>
            <span>{formatPrice(20000)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(subtotal + 20000)}</span>
          </div>
          <button type="submit" className="btn-place-order">Buat Pesanan</button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrderPage;