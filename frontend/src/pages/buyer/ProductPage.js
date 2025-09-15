import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import './ProductPage.css';

// URL dari backend API Anda
const API_URL = 'http://localhost:5000/api/products';
const BASE_URL = 'http://localhost:5000/';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(API_URL);
        // Memformat URL gambar sebelum disimpan ke state
        const formattedProducts = data.map(product => ({
          ...product,
          // Menggunakan nama kolom yang konsisten
          name: product.nama_produk,
          price: parseFloat(product.harga),
          image: product.gambar ? `${BASE_URL}${product.gambar.replace(/\\/g, '/')}` : 'https://placehold.co/600x400',
          description: product.deskripsi,
          category: product.kategori.toLowerCase()
        }));
        setProducts(formattedProducts);
      } catch (err) {
        setError('Gagal memuat data produk. Silakan coba lagi nanti.');
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'Semua Produk' },
    { id: 'mawar', name: 'Buket Mawar' },
    { id: 'tulip', name: 'Buket Tulip' },
    { id: 'lavender', name: 'Buket Lavender' },
    { id: 'campuran', name: 'Buket Campuran' },
    { id: 'lainnya', name: "Lainnya" }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return <div className="product-page"><div className="container"><p>Memuat produk...</p></div></div>;
  }

  if (error) {
    return <div className="product-page"><div className="container"><p className="error-message">{error}</p></div></div>;
  }

  return (
    <div className="product-page">
      <div className="container">
        <h1>Katalog Produk</h1>
        <p className="page-subtitle">Temukan buket bunga sempurna untuk setiap momen</p>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
              />
            ))
          ) : (
            <div className="no-products">
              <p>Tidak ada produk dalam kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;