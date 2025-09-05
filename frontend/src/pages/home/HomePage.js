import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import './HomePage.css';

const API_URL = 'http://localhost:5000/api/products';
const BASE_URL = 'http://localhost:5000/';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(API_URL);
        // Format URL gambar dan ambil 3 produk pertama
        const formattedProducts = data.slice(0, 3).map(product => ({
          ...product,
          name: product.nama_produk,
          price: parseFloat(product.harga),
          image: product.gambar ? `${BASE_URL}${product.gambar.replace(/\\/g, '/')}` : 'https://placehold.co/600x400',
          description: product.deskripsi
        }));
        setFeaturedProducts(formattedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Toko Buket Bunga Terbaik di Bantul</h1>
          <p>Ayo Bungakan dan Hidupkan Dunia!</p>
          <p>Setiap Bunga Adalah Mimpi Dari Benih Kecil Yang Menjadi Nyata.</p>
          <Link to="/products" className="cta-button">Lihat Produk</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Rekomendasi Buket</h2>
          <div className="products-grid featured">
            {loading ? (
              <p>Memuat produk...</p>
            ) : (
              featuredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  description={product.description}
                />
              ))
            )}
          </div>
          <div className="view-all">
            <Link to="/products" className="view-all-btn">Lihat Semua Produk</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Mengapa Memilih Kami?</h2>
              <p>Kami menyediakan buket bunga segar dengan kualitas terbaik. Setiap bunga dipilih dengan teliti dan dirangkai oleh florist profesional untuk memberikan kesan yang tak terlupakan.</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> Bunga segar setiap hari</li>
                <li><i className="fas fa-check-circle"></i> Pengiriman cepat dan aman</li>
                <li><i className="fas fa-check-circle"></i> Packaging eksklusif</li>
                <li><i className="fas fa-check-circle"></i> Harga terjangkau</li>
              </ul>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGZsb3dlciUyMGJvdXF1ZXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" alt="Florist." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;