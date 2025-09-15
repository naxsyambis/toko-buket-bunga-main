import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const API_URL = 'http://localhost:5000/api/products';
const BASE_URL = 'http://localhost:5000/';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nama_produk: '',
    harga: '',
    stok: '',
    kategori: '',
    deskripsi: '',
    gambar: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(API_URL);
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      setError('Gagal memuat data produk');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ 
      nama_produk: '', 
      harga: '', 
      stok: '', 
      kategori: '', 
      deskripsi: '', 
      gambar: '' 
    });
    setSelectedFile(null);
    setPreviewImage(null);
    setUploadProgress(0);
    setError('');
  };

  const handleAdd = () => {
    setIsEditing(false);
    resetForm();
    setCurrentProductId(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setFormData({
      nama_produk: product.nama_produk,
      harga: product.harga,
      stok: product.stok,
      kategori: product.kategori,
      deskripsi: product.deskripsi,
      gambar: product.gambar
    });
    setPreviewImage(product.gambar ? `${BASE_URL}${product.gambar}` : null);
    setSelectedFile(null);
    setShowModal(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProducts();
        alert('Produk berhasil dihapus');
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        alert('Gagal menghapus produk: ' + (error.response?.data?.message || error.message));
      }
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      if (!file.type.startsWith('image/')) {
        setError('Hanya file gambar yang diizinkan');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = new FormData();
      data.append('nama_produk', formData.nama_produk);
      data.append('harga', formData.harga);
      data.append('stok', formData.stok);
      data.append('kategori', formData.kategori);
      data.append('deskripsi', formData.deskripsi);
      
      if (selectedFile) {
        data.append('gambar', selectedFile);
      }

      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      };

      if (isEditing) {
        await axios.put(`${API_URL}/${currentProductId}`, data, config);
        alert('Produk berhasil diupdate');
      } else {
        await axios.post(API_URL, data, config);
        alert('Produk berhasil ditambahkan');
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan produk';
      setError(errorMessage);
      console.error('Error saving product:', error);
    } finally {
      setUploadProgress(0);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  return (
    <div className="admin-products">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Kelola Produk</h1>
          <p>Kelola semua produk di toko buket bunga Anda.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="admin-actions">
          <button className="btn-primary" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Tambah Produk
          </button>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="loading">Loading data produk...</div>
          ) : products.length === 0 ? (
            <div className="empty-data-message">
              <i className="fas fa-box-open"></i>
              <p>Belum ada produk. Silakan tambahkan produk baru.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Nama Produk</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Kategori</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.gambar ? `${BASE_URL}${product.gambar}` : 'https://placehold.co/60'} 
                        alt={product.nama_produk} 
                        className="product-table-image"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/60';
                        }}
                      />
                    </td>
                    <td>{product.nama_produk}</td>
                    <td>{formatPrice(product.harga)}</td>
                    <td>
                      <span className={product.stok === 0 ? 'out-of-stock' : 'in-stock'}>
                        {product.stok}
                      </span>
                    </td>
                    <td>
                      <span className="category-badge">{product.kategori}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(product)}
                          title="Edit Produk"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(product.id)}
                          title="Hapus Produk"
                        >
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

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form" encType="multipart/form-data">
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label>Nama Produk *</label>
                  <input 
                    type="text" 
                    name="nama_produk" 
                    value={formData.nama_produk} 
                    onChange={handleChange} 
                    required 
                    placeholder="Masukkan nama produk"
                  />
                </div>
                
                <div className="form-group">
                  <label>Harga (Rp) *</label>
                  <input 
                    type="number" 
                    name="harga" 
                    value={formData.harga} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    placeholder="Masukkan harga"
                  />
                </div>
                
                <div className="form-group">
                  <label>Stok *</label>
                  <input 
                    type="number" 
                    name="stok" 
                    value={formData.stok} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    placeholder="Masukkan jumlah stok"
                  />
                </div>
                
                <div className="form-group">
                  <label>Kategori *</label>
                  <select 
                    name="kategori" 
                    value={formData.kategori} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Mawar">Mawar</option>
                    <option value="Lavender">Lavender</option>
                    <option value="Tulip">Tulip</option>
                    <option value="Campuran">Campuran</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Deskripsi *</label>
                  <textarea 
                    name="deskripsi" 
                    rows="3" 
                    value={formData.deskripsi} 
                    onChange={handleChange} 
                    required 
                    placeholder="Masukkan deskripsi produk"
                  />
                </div>
                
                <div className="form-group">
                  <label>Gambar Produk {!isEditing && '(Opsional)'}</label>
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="image-preview"/>
                  )}
                  <input 
                    type="file" 
                    name="gambar" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <small>Format: JPG, PNG, GIF (Maks. 5MB)</small>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="upload-progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {uploadProgress}%
                    </div>
                  </div>
                )}
                
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn-primary">
                    {isEditing ? 'Update' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;