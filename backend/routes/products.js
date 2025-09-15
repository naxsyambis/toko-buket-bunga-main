const express = require('express');
const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/products/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan'), false);
    }
  }
});

// GET /api/products -> Mengambil semua produk
router.get('/', async (req, res) => {
  try {
    const [products] = await db.promise().query('SELECT * FROM products ORDER BY created_at DESC');
    
    // Format path gambar
    const formattedProducts = products.map(product => ({
      ...product,
      gambar: product.gambar ? `uploads/products/${path.basename(product.gambar)}` : null
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// GET /api/products/:id -> Mengambil satu produk
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.promise().query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    if (product.gambar) {
      product.gambar = `uploads/products/${path.basename(product.gambar)}`;
    }
    
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/products -> Menambah produk baru dengan upload gambar
router.post('/', upload.single('gambar'), async (req, res) => {
  try {
    const { nama_produk, harga, stok, kategori, deskripsi } = req.body;
    
    // Validasi
    if (!nama_produk || !harga || !stok || !kategori || !deskripsi) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const gambarPath = req.file ? req.file.path : null;

    const [result] = await db.promise().query(
      'INSERT INTO products (nama_produk, harga, stok, kategori, deskripsi, gambar) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_produk, parseFloat(harga), parseInt(stok), kategori, deskripsi, gambarPath]
    );
    
    res.status(201).json({ 
      message: 'Produk berhasil ditambahkan', 
      productId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// PUT /api/products/:id -> Mengupdate produk dengan upload gambar
router.put('/:id', upload.single('gambar'), async (req, res) => {
  try {
    const { nama_produk, harga, stok, kategori, deskripsi } = req.body;
    
    // Cek apakah produk ada
    const [existingProducts] = await db.promise().query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    let gambarPath = existingProducts[0].gambar;
    
    // Jika ada file gambar baru, hapus gambar lama dan gunakan yang baru
    if (req.file) {
      // Hapus gambar lama jika ada
      if (gambarPath && fs.existsSync(gambarPath)) {
        fs.unlinkSync(gambarPath);
      }
      gambarPath = req.file.path;
    }

    const [result] = await db.promise().query(
      'UPDATE products SET nama_produk = ?, harga = ?, stok = ?, kategori = ?, deskripsi = ?, gambar = ? WHERE id = ?',
      [nama_produk, parseFloat(harga), parseInt(stok), kategori, deskripsi, gambarPath, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    res.json({ message: 'Produk berhasil diupdate' });
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// DELETE /api/products/:id -> Menghapus produk
router.delete('/:id', async (req, res) => {
  try {
    // Cek produk dan hapus gambar jika ada
    const [products] = await db.promise().query('SELECT gambar FROM products WHERE id = ?', [req.params.id]);
    
    if (products.length > 0 && products[0].gambar && fs.existsSync(products[0].gambar)) {
      fs.unlinkSync(products[0].gambar);
    }

    const [result] = await db.promise().query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;