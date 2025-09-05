import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Admin.css';

const API_URL = 'http://localhost:5000/api/orders';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
      alert('Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };
  
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#f6ad55' },
    { value: 'diproses', label: 'Diproses', color: '#4299e1' },
    { value: 'dikirim', label: 'Dikirim', color: '#3182ce' },
    { value: 'selesai', label: 'Selesai', color: '#48bb78' },
    { value: 'dibatalkan', label: 'Dibatalkan', color: '#f56565' },
  ];

  // === PERBAIKAN DI SINI ===
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      alert('Status pesanan berhasil diupdate!');
    } catch (error) {
      console.error("Gagal mengupdate status pesanan:", error);
      // Tampilkan pesan error dari backend jika ada, jika tidak tampilkan pesan default
      const errorMessage = error.response?.data?.message || 'Gagal mengupdate status.';
      alert(errorMessage);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setOrders(orders.filter(order => order.id !== orderId));
      alert('Pesanan berhasil dihapus!');
    } catch (error) {
      console.error("Gagal menghapus pesanan:", error);
      const errorMessage = error.response?.data?.message || 'Gagal menghapus pesanan.';
      alert(errorMessage);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedOrder(data);
      setShowModal(true);
    } catch (error) {
      console.error("Gagal mengambil detail pesanan:", error);
      alert('Gagal mengambil detail pesanan');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status.toLowerCase());
    return statusObj ? statusObj.color : '#718096';
  };

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Kelola Pesanan</h1>
            <p>Kelola semua pesanan customer</p>
          </div>
          <div className="loading-spinner">Memuat data pesanan...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Pesanan</h1>
            <p>Kelola semua pesanan customer</p>
          </div>
          <button className="btn-refresh" onClick={fetchOrders}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Customer</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Tidak ada pesanan
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.customer_name}</div>
                        <small>{order.customer_email}</small>
                      </div>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>{formatPrice(order.total_pembayaran)}</td>
                    <td>
                      <select
                        value={order.status.toLowerCase()}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`status-select status-${order.status.toLowerCase()}`}
                        style={{ borderColor: getStatusColor(order.status) }}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => viewOrderDetails(order.id)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Detail Pesanan */}
        {showModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Detail Pesanan #{selectedOrder.id}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              
              <div className="modal-body">
                <div className="order-detail-section">
                  <h3>Informasi Customer</h3>
                  <p><strong>Nama:</strong> {selectedOrder.nama_user}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Tanggal Pesan:</strong> {formatDate(selectedOrder.created_at)}</p>
                </div>

                <div className="order-detail-section">
                  <h3>Alamat Pengiriman</h3>
                  <p><strong>Penerima:</strong> {selectedOrder.nama_penerima}</p>
                  <p><strong>No. HP:</strong> {selectedOrder.no_hp}</p>
                  <p><strong>Alamat:</strong> {selectedOrder.alamat}</p>
                </div>

                <div className="order-detail-section">
                  <h3>Items Pesanan</h3>
                  <div className="order-items-list">
                    {selectedOrder.items && selectedOrder.items.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="item-info">
                          <h4>{item.nama_produk}</h4>
                          <p>{item.jumlah} x {formatPrice(item.harga)}</p>
                        </div>
                        <div className="item-total">
                          {formatPrice(item.jumlah * item.harga)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-detail-section">
                  <h3>Ringkasan Pembayaran</h3>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.items.reduce((sum, item) => sum + (item.harga * item.jumlah), 0))}</span>
                  </div>
                  <div className="summary-row">
                    <span>Ongkos Kirim:</span>
                    <span>{formatPrice(selectedOrder.total_pembayaran - selectedOrder.items.reduce((sum, item) => sum + (item.harga * item.jumlah), 0))}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>{formatPrice(selectedOrder.total_pembayaran)}</span>
                  </div>
                </div>

                <div className="order-detail-section">
                  <h3>Status Pesanan</h3>
                  <select
                    value={selectedOrder.status.toLowerCase()}
                    onChange={(e) => {
                      handleStatusChange(selectedOrder.id, e.target.value);
                      setSelectedOrder({...selectedOrder, status: e.target.value});
                    }}
                    className={`status-select status-${selectedOrder.status.toLowerCase()}`}
                    style={{ borderColor: getStatusColor(selectedOrder.status) }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;