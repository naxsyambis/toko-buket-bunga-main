import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const API_URL = 'http://localhost:5000/api/users';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nama_user: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API_URL, getAuthHeaders());
      setUsers(data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      setError('Gagal memuat data pengguna.');
    }
  };

  const resetForm = () => {
    setFormData({
      nama_user: '',
      email: '',
      password: '',
      role: 'buyer',
    });
    setError('');
  };

  const handleAdd = () => {
    setIsEditing(false);
    resetForm();
    setCurrentUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData({
      nama_user: user.nama_user,
      email: user.email,
      password: '', // Password dikosongkan saat edit
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await axios.delete(`${API_URL}/${userId}`, getAuthHeaders());
        fetchUsers();
        alert('User berhasil dihapus.');
      } catch (error) {
        console.error("Gagal menghapus user:", error);
        alert('Gagal menghapus user: ' + (error.response?.data?.message || error.message));
      }
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isEditing) {
        // Data yang dikirim untuk update tidak menyertakan password atau status
        const updateData = {
          nama_user: formData.nama_user,
          email: formData.email,
          role: formData.role,
        };
        await axios.put(`${API_URL}/${currentUser.id}`, updateData, getAuthHeaders());
        alert('User berhasil diupdate.');
      } else {
        await axios.post(API_URL, formData, getAuthHeaders());
        alert('User berhasil ditambahkan.');
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan user';
      setError(errorMessage);
      console.error("Gagal menyimpan user:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="admin-users">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Kelola User</h1>
          <p>Kelola semua user yang terdaftar</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <div className="admin-actions">
          <button className="btn-primary" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Tambah User
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Tanggal Bergabung</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.nama_user}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(user)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{isEditing ? `Edit User: ${currentUser.nama_user}` : 'Tambah User Baru'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" name="nama_user" value={formData.nama_user} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                {!isEditing && (
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                  </div>
                )}
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="buyer">Buyer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn-primary">{isEditing ? 'Update' : 'Tambah'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;