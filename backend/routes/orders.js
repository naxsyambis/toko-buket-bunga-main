const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user's order history (Protected Route)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const [orders] = await db.promise().query(
      `SELECT o.*, u.nama_user, u.email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    
    // Format total_pembayaran sebagai number
    const formattedOrders = orders.map(order => ({
      ...order,
      total_pembayaran: parseFloat(order.total_pembayaran)
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  const { shippingInfo, orderItems, subtotal, total } = req.body;
  const { namaPenerima, alamat, noHp } = shippingInfo;
  const user_id = req.user.id;
  
  if (!namaPenerima || !alamat || !noHp || !orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'Data pesanan tidak lengkap' });
  }

  const connection = await db.promise().getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Insert into orders table
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_pembayaran, jumlah_produk, nama_penerima, alamat, no_hp, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, total, orderItems.length, namaPenerima, alamat, noHp, 'pending']
    );

    const orderId = orderResult.insertId;

    // 2. Insert order items
    const orderItemsValues = orderItems.map(item => [
      orderId,
      item.product_id, // Menggunakan product_id dari item keranjang
      item.quantity,
      item.price
    ]);

    await connection.query(
      'INSERT INTO order_items (order_id, product_id, jumlah, harga) VALUES ?',
      [orderItemsValues]
    );

    // 3. Clear user's cart
    await connection.query('DELETE FROM carts WHERE user_id = ?', [user_id]);

    await connection.commit();
    
    res.status(201).json({ 
      message: 'Pesanan berhasil dibuat', 
      orderId: orderId 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create Order Error:', error);
    res.status(500).json({ 
      message: 'Gagal membuat pesanan', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
});

// Get all orders (for admin)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat mengakses.' });
    }

    const [orders] = await db.promise().query(`
      SELECT o.*, u.nama_user as customer_name, u.email as customer_email
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    const formattedOrders = orders.map(order => ({
      ...order,
      total_pembayaran: parseFloat(order.total_pembayaran)
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
      SELECT o.*, u.nama_user, u.email
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `, [req.params.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check access rights (admin or order owner)
    if (req.user.role !== 'admin' && orders[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    
    const [orderItems] = await db.promise().query(`
      SELECT oi.*, p.nama_produk, p.gambar 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `, [req.params.id]);
    
    const order = {
      ...orders[0],
      total_pembayaran: parseFloat(orders[0].total_pembayaran),
      items: orderItems.map(item => ({
        ...item,
        harga: parseFloat(item.harga)
      }))
    };
    
    res.json(order);
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// === PERBAIKAN DI SINI ===
// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat mengupdate status.' });
  }
  
  try {
    const validStatuses = ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];
    const lowerCaseStatus = status.toLowerCase();

    if (!validStatuses.includes(lowerCaseStatus)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const [result] = await db.promise().query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [lowerCaseStatus, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }
    
    res.json({ message: 'Status order berhasil diupdate' });
  } catch (error) {
    console.error(`Error updating status for order ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat menghapus order.' });
  }
  
  const connection = await db.promise().getConnection();
  
  try {
    await connection.beginTransaction();
    
    try {
      // Delete order items first
      await connection.query('DELETE FROM order_items WHERE order_id = ?', [req.params.id]);
      
      // Delete order
      const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
      
      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Order not found' });
      }
      
      await connection.commit();
      res.json({ message: 'Order berhasil dihapus' });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;