import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalPesanan: 0,
    totalUser: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error
        const { data } = await axios.get('http://localhost:5000/api/dashboard/stats', getAuthHeaders());
        setStats({
          totalProduk: data.totalProduk,
          totalPesanan: data.totalPesanan,
          totalUser: data.totalUser,
        });
        setRecentOrders(data.pesananTerbaru);
      } catch (err) {
        setError('Gagal memuat data dasbor.');
        console.error('Fetch dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Produk', value: stats.totalProduk, icon: 'fas fa-box', color: '#d53f8c', link: '/admin/products' },
    { title: 'Total Pesanan', value: stats.totalPesanan, icon: 'fas fa-shopping-bag', color: '#38a169', link: '/admin/orders' },
    { title: 'Total User', value: stats.totalUser, icon: 'fas fa-users', color: '#3182ce', link: '/admin/users' },
  ];
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };
  
  const getStatusClass = (status) => {
    if (!status) return 'pending';
    return status.toLowerCase();
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Selamat datang di panel admin FLORYN.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-content">
          <div className="quick-actions">
            <h2>Management Data</h2>
            <div className="action-buttons">
              <Link to="/admin/products" className="action-btn">
                <i className="fas fa-box"></i>
                <span>Kelola Produk</span>
              </Link>
              <Link to="/admin/orders" className="action-btn">
                <i className="fas fa-shopping-bag"></i>
                <span>Kelola Pesanan</span>
              </Link>
              <Link to="/admin/users" className="action-btn">
                <i className="fas fa-users"></i>
                <span>Kelola User</span>
              </Link>
            </div>
          </div>

          <div className="recent-orders">
            <div className="section-header">
              <h2>Pesanan Terbaru</h2>
              <Link to="/admin/orders" className="view-all">Lihat Semua</Link>
            </div>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>ID Pesanan</th>
                    <th>Customer</th>
                    <th>Tanggal</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>Memuat pesanan...</td></tr>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td>#{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{formatDate(order.tanggal)}</td>
                        <td>{formatPrice(order.amount)}</td>
                        <td>
                          <span className={`status-badge status-${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada pesanan terbaru.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;