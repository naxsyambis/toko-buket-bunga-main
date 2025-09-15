import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ongkosKirim = subtotal > 0 ? 20000 : 0; // Contoh ongkos kirim
  const total = subtotal + ongkosKirim;
  
  const handleCheckout = () => {
    navigate('/place-order', {
      state: { cartItems, subtotal }
    });
  };

  if (loading) {
    return <div className="cart-container"><h1>Keranjang Belanja Anda</h1><p>Memuat keranjang...</p></div>;
  }

  return (
    <div className="cart-container">
      <h1>Keranjang Belanja Anda</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Keranjang Anda kosong</h2>
          <p>Sepertinya Anda belum menambahkan produk apapun.</p>
          <Link to="/products" className="btn-checkout">Mulai Belanja</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Ringkasan Belanja</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Ongkos Kirim</span>
              <span>{formatPrice(ongkosKirim)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              Lanjutkan ke Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;