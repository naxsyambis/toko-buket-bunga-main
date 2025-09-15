const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();


const pool = mysql.createPool({ //kumpulan koneksi
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, //kalau semua koneksi penuh, request baru akan menunggu.
  connectionLimit: 10, //maksimal koneksi aktif
  queueLimit: 0 // tidak ada batasan antrian request
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  if (connection) {
    connection.release();
    console.log('Connected to MySQL database pool'); // mengembalikan koneksi itu ke pool supaya bisa dipakai lagi oleh query lain
  }
});


module.exports = pool;