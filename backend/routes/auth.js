const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Harap isi nama, email, dan password' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password harus minimal 6 karakter' });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Email tidak valid' });
  }
  
  try {
    // Check if user exists
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length > 0) {
      return res.status(400).json({ message: 'User sudah terdaftar' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user
    const [result] = await db.promise().query(
      'INSERT INTO users (nama_user, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'buyer']
    );
    
    // Generate token
    const token = jwt.sign(
      { 
        id: result.insertId, 
        role: 'buyer',
        email: email
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User berhasil dibuat',
      token,
      user: { 
        id: result.insertId, 
        name: name, 
        email: email, 
        role: 'buyer' 
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Harap isi email dan password' });
  }
  
  try {
    // Check if user exists
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }
    
    const user = users[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }
    
    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login berhasil',
      token,
      user: { 
        id: user.id, 
        name: user.nama_user, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const [users] = await db.promise().query(
      'SELECT id, nama_user, email, role, created_at FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    const user = users[0];
    res.json({ 
      user: {
        id: user.id,
        name: user.nama_user,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token diperlukan' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user still exists
    const [users] = await db.promise().query(
      'SELECT id, nama_user, email, role FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }
    
    res.json({ 
      valid: true, 
      user: {
        id: users[0].id,
        name: users[0].nama_user,
        email: users[0].email,
        role: users[0].role
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.json({ valid: false, message: 'Token tidak valid' });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const { token, currentPassword, newPassword } = req.body;
    
    if (!token) {
      return res.status(401).json({ message: 'Token diperlukan' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Get user with password
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    const user = users[0];
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password saat ini salah' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await db.promise().query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );
    
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;