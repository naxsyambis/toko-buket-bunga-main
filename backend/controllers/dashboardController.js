const db = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    // Promise.all untuk menjalankan semua query secara paralel agar lebih cepat
    const [
      [[{ totalProduk }]],
      [[{ totalPesanan }]],
      [[{ totalUser }]],
      [pesananTerbaru]
    ] = await Promise.all([
      db.promise().query("SELECT COUNT(*) as totalProduk FROM products"),
      db.promise().query("SELECT COUNT(*) as totalPesanan FROM orders"),
      db.promise().query("SELECT COUNT(*) as totalUser FROM users"),
      db.promise().query(`
        SELECT 
          o.id, 
          u.nama_user as customer, 
          o.created_at as tanggal, 
          o.total_pembayaran as amount, 
          o.status
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `)
    ]);

    res.json({
      totalProduk,
      totalPesanan,
      totalUser,
      pesananTerbaru,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};