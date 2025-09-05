import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(data);
      } catch (error) {
        console.error("Gagal mengambil riwayat pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderHistory();
  }, []);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  // === PERBAIKAN DI SINI ===
  const getStatusDisplay = (status) => {
    if (!status) return { text: 'Pending', className: 'status-pending' };
    
    switch (status.toLowerCase()) {
      case 'selesai': 
        return { text: 'Selesai', className: 'status-completed' };
      case 'diproses': 
        return { text: 'Diproses', className: 'status-processing' };
      case 'dikirim': 
        return { text: 'Dikirim', className: 'status-shipped' };
      case 'dibatalkan': 
        return { text: 'Dibatalkan', className: 'status-cancelled' };
      case 'pending':
      default:
        return { text: 'Pending', className: 'status-pending' };
    }
  };

  return (
    <div className="order-history-container">
      <h1>Riwayat Pesanan Saya</h1>
      {isLoading ? (
        <p>Memuat data pesanan...</p>
      ) : orders.length === 0 ? (
        <p>Anda belum memiliki riwayat pesanan.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const statusInfo = getStatusDisplay(order.status);
            return (
              <div key={order.id} className="order-card">
                <div className="order-details">
                  <span className="order-id">Pesanan #{order.id}</span>
                  <span className="order-date">Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                  <span className="order-total">{formatPrice(order.total_pembayaran)}</span>
                </div>
                <div className="order-actions">
                  <span className={`order-status ${statusInfo.className}`}>{statusInfo.text}</span>
                  <Link to={`/order/${order.id}`} className="btn-details">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;