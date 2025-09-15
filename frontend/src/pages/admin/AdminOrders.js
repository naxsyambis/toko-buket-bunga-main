import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { formatRupiah, formatDate } from '@biyy/format-rupiah-datetime';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = 'http://localhost:5000/api/orders';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama_penerima: '', alamat: '', no_hp: '' });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token tidak ditemukan, pastikan admin sudah login.");
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(API_URL, getAuthHeaders());
      setOrders(data);
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
      setError('Gagal memuat data pesanan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleEdit = (order) => {
    setFormData({
      id: order.id,
      nama_penerima: order.nama_penerima,
      alamat: order.alamat,
      no_hp: order.no_hp
    });
    setShowEditModal(true);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pesanan #${orderId}?`)) {
        try {
            await axios.delete(`${API_URL}/${orderId}`, getAuthHeaders());
            alert('Pesanan berhasil dihapus.');
            fetchOrders();
        } catch (error) {
            console.error("Gagal menghapus pesanan:", error);
            alert('Gagal menghapus pesanan: ' + (error.response?.data?.message || error.message));
        }
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`${API_URL}/${formData.id}`, formData, getAuthHeaders());
        alert('Pesanan berhasil diupdate.');
        setShowEditModal(false);
        fetchOrders();
    } catch (error) {
        console.error("Gagal mengupdate pesanan:", error);
        alert('Gagal mengupdate pesanan: ' + (error.response?.data?.message || error.message));
    }
  };

  const statusOptions = [
      { value: 'pending', label: 'Pending' },
      { value: 'diproses', label: 'Diproses' },
      { value: 'dikirim', label: 'Dikirim' },
      { value: 'selesai', label: 'Selesai' },
      { value: 'dibatalkan', label: 'Dibatalkan' },
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
        await axios.put(`${API_URL}/${orderId}/status`, { status: newStatus }, getAuthHeaders());
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
    } catch (error) {
        console.error("Gagal mengupdate status pesanan:", error);
        alert('Gagal mengupdate status.');
    }
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Laporan Rinci Pesanan - FLORYN.", 14, 20);

    orders.forEach(order => {
      const tableColumn = ["ID", "Customer", "Tanggal", "Total", "Status"];
      const tableRows = [[
        `#${order.id}`,
        order.customer_name,
        formatDate(order.created_at),
        formatRupiah(order.total_pembayaran),
        order.status,
      ]];

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 30,
        theme: 'striped'
      });
      
      if (order.items && order.items.length > 0) {
        const itemColumns = ["Produk", "Jumlah", "Harga Satuan", "Subtotal"];
        const itemRows = order.items.map(item => [
          item.nama_produk,
          item.jumlah,
          formatRupiah(item.harga),
          formatRupiah(item.harga * item.jumlah)
        ]);
        
        autoTable(doc, {
          head: [itemColumns],
          body: itemRows,
          startY: doc.lastAutoTable.finalY,
          theme: 'grid',
          headStyles: { fillColor: [220, 220, 220], textColor: 40 },
          styles: { fontSize: 9 }
        });
      }
    });

    doc.save('laporan-rinci-pesanan.pdf');
  };

  return (
    <div className="admin-orders">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Pesanan</h1>
            <p>Kelola semua pesanan customer</p>
          </div>
          <div>
            <button className="btn-print" onClick={handlePrintPDF}>
              <i className="fas fa-print"></i> Cetak Laporan (PDF)
            </button>
            <button className="btn-refresh" onClick={fetchOrders} disabled={loading}>
              <i className={`fas fa-sync ${loading ? 'fa-spin' : ''}`}></i> Refresh
            </button>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? ( <div className="loading">Memuat data pesanan...</div> ) : 
           error ? ( <div className="error-message">{error}</div> ) : 
           orders.length === 0 ? (
            <div className="empty-data-message">
              <i className="fas fa-file-invoice-dollar"></i>
              <p>Belum ada pesanan yang masuk.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div>{order.customer_name}</div>
                      <small>{order.customer_email}</small>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>{formatRupiah(order.total_pembayaran)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`status-select status-${order.status}`}
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
                            <button className="btn-view" onClick={() => handleViewDetails(order)} title="Lihat Detail">
                                <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn-edit" onClick={() => handleEdit(order)} title="Edit Pesanan">
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(order.id)} title="Hapus Pesanan">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Pesanan #{selectedOrder.id}</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="order-detail-section">
                <h3>Informasi Customer</h3>
                <p><strong>Nama:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
              </div>
              <div className="order-detail-section">
                <h3>Alamat Pengiriman</h3>
                <p><strong>Penerima:</strong> {selectedOrder.nama_penerima}</p>
                <p><strong>No. HP:</strong> {selectedOrder.no_hp}</p>
                <p><strong>Alamat:</strong> {selectedOrder.alamat}</p>
              </div>
              <div className="order-detail-section">
                <h3>Item Pesanan</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <h4>{item.nama_produk}</h4>
                        <p>{item.jumlah} x {formatRupiah(item.harga)}</p>
                      </div>
                      <div className="item-total">
                        {formatRupiah(item.jumlah * item.harga)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                    <span>Total Pembayaran</span>
                    <span>{formatRupiah(selectedOrder.total_pembayaran)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>Edit Pesanan #{formData.id}</h3>
                    <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
                </div>
                <form onSubmit={handleUpdateSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Nama Penerima</label>
                        <input type="text" name="nama_penerima" value={formData.nama_penerima} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>Alamat</label>
                        <textarea name="alamat" rows="3" value={formData.alamat} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                        <label>No. HP</label>
                        <input type="text" name="no_hp" value={formData.no_hp} onChange={handleFormChange} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={() => setShowEditModal(false)}>Batal</button>
                        <button type="submit" className="btn-primary">Update</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;