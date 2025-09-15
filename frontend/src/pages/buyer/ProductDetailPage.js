import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './ProductDetailPage.css'; // Kita akan buat file CSS ini

const API_URL = 'http://localhost:5000/api/products';
const BASE_URL = 'http://localhost:5000/';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Produk tidak ditemukan atau terjadi kesalahan.');
        console.error("Fetch product detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk menambahkan barang ke keranjang.');
      navigate('/login');
    } else {
      addToCart(product.id);
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) return <div className="detail-container"><p>Memuat produk...</p></div>;
  if (error) return <div className="detail-container"><p className="error-message">{error}</p></div>;
  if (!product) return null;

  return (
    <div className="detail-container">
      <div className="product-detail-layout">
        <div className="product-detail-image">
          <img 
            src={product.gambar ? `${BASE_URL}${product.gambar.replace(/\\/g, '/')}` : 'https://placehold.co/600x400'} 
            alt={product.nama_produk} 
          />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.kategori}</span>
          <h1 className="product-title">{product.nama_produk}</h1>
          <p className="product-price">{formatPrice(product.harga)}</p>
          <p className="product-stock">Stok: <span>{product.stok > 0 ? `${product.stok} tersedia` : 'Habis'}</span></p>
          <h3 className="description-title">Deskripsi Produk</h3>
          <p className="product-description-full">{product.deskripsi}</p>
          <button 
            className="add-to-cart-btn-detail" 
            onClick={handleAddToCart}
            disabled={product.stok === 0}
          >
            {product.stok > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;