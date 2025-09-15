import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderDetailPage.css'; // Kita akan buat file CSS ini nanti

const API_URL = 'http://localhost:5000/api/orders';
const BASE_URL = 'http://localhost:5000/';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrder(data);
      } catch (err) {
        setError('Gagal memuat detail pesanan.');
        console.error("Fetch order detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="order-detail-container"><p>Memuat detail pesanan...</p></div>;
  }

  if (error) {
    return <div className="order-detail-container"><p className="error-message">{error}</p></div>;
  }
  
  if (!order) {
    return <div className="order-detail-container"><p>Pesanan tidak ditemukan.</p></div>;
  }
  
  const subtotal = order.items.reduce((acc, item) => acc + (item.harga * item.jumlah), 0);
  const ongkosKirim = order.total_pembayaran - subtotal;

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <h1>Detail Pesanan #{order.id}</h1>
        <p>Tanggal Pesan: {formatDate(order.created_at)}</p>
        <span className={`status-badge status-${order.status}`}>{order.status}</span>
      </div>

      <div className="order-detail-layout">
        <div className="order-items-section">
          <h2>Produk yang Dipesan</h2>
          {order.items.map(item => (
            <div key={item.id} className="order-item-card">
              <img 
                src={`${BASE_URL}${item.gambar.replace(/\\/g, '/')}`} 
                alt={item.nama_produk} 
                className="item-image"
              />
              <div className="item-info">
                <h3>{item.nama_produk}</h3>
                <p>{item.jumlah} x {formatPrice(item.harga)}</p>
              </div>
              <div className="item-total">
                {formatPrice(item.jumlah * item.harga)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary-section">
          <div className="summary-box">
            <h2>Ringkasan Pembayaran</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Ongkos Kirim</span>
              <span>{formatPrice(ongkosKirim)}</span>
            </div>
            <div className="summary-total">
              <span>Total Pembayaran</span>
              <span>{formatPrice(order.total_pembayaran)}</span>
            </div>
          </div>

          <div className="shipping-box">
            <h2>Alamat Pengiriman</h2>
            <p><strong>{order.nama_penerima}</strong></p>
            <p>{order.no_hp}</p>
            <p>{order.alamat}</p>
          </div>
        </div>
      </div>
      
      <Link to="/my-orders" className="back-to-history-btn">Kembali ke Riwayat Pesanan</Link>
    </div>
  );
};

export default OrderDetailPage;