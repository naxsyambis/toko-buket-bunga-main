const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    // --- PERBAIKAN DI SINI ---
    // Mengubah p.name menjadi p.nama_produk, p.price menjadi p.harga, dan p.image menjadi p.gambar
    const [cartItems] = await db.promise().query(`
      SELECT c.id, c.quantity, p.id as product_id, p.nama_produk, p.harga, p.gambar 
      FROM carts c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `, [req.user.id]);
    
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to cart
router.post('/', auth, async (req, res) => {
  const { product_id, quantity } = req.body;
  
  try {
    // Check if product already in cart
    const [existing] = await db.promise().query(
      'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );
    
    if (existing.length > 0) {
      // Jika sudah ada, update kuantitasnya
      await db.promise().query(
        'UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      // Jika belum ada, tambahkan item baru
      await db.promise().query(
        'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }
    
    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/:id', auth, async (req, res) => {
  const { quantity } = req.body;
  
  try {
    const [result] = await db.promise().query(
      'UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item keranjang tidak ditemukan' });
    }
    
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from cart
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.promise().query(
      'DELETE FROM carts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item keranjang tidak ditemukan' });
    }
    
    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;