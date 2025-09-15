const express = require('express');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/users -> Mengambil semua pengguna (Hanya Admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, nama_user, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/users -> Membuat pengguna baru (Hanya Admin)
router.post('/', auth, adminAuth, async (req, res) => {
  const { nama_user, email, password, role } = req.body;

  if (!nama_user || !email || !password || !role) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter' });
  }

  try {
    const [existingUsers] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.promise().query(
      'INSERT INTO users (nama_user, email, password, role) VALUES (?, ?, ?, ?)',
      [nama_user, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User berhasil dibuat', userId: result.insertId });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/:id -> Mengupdate pengguna (Hanya Admin)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { nama_user, email, role } = req.body;
    
    if (!nama_user || !email || !role) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const [existingUsers] = await db.promise().query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, req.params.id]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }
    
    const [result] = await db.promise().query(
      'UPDATE users SET nama_user = ?, email = ?, role = ? WHERE id = ?',
      [nama_user, email, role, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User berhasil diupdate' });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/users/:id -> Menghapus pengguna (Hanya Admin)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const [orders] = await db.promise().query('SELECT id FROM orders WHERE user_id = ?', [req.params.id]);
    
    if (orders.length > 0) {
      return res.status(400).json({ message: 'Tidak dapat menghapus user yang memiliki order' });
    }

    const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;