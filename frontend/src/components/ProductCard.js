import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ id, name, price, image, description }) => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/600x400';
  }

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk menambahkan barang ke keranjang.');
      navigate('/login');
    } else {
      addToCart(id);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} onError={handleError} />
        <div className="product-overlay">
          <Link to={`/products/${id}`} className="view-details-btn">
            Lihat Detail
          </Link>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        {/* Baris deskripsi di bawah ini dihapus */}
        {/* <p className="product-description">{description}</p> */}
        <div className="product-price">{formatPrice(price)}</div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;