const bcrypt = require('bcrypt');
const db = require('../config/database'); // Sesuaikan path ke file koneksi database Anda
const User = require('../models/User'); // Sesuaikan path ke model User Anda

// Menampilkan halaman registrasi
exports.showRegisterForm = (req, res) => {
    res.render('register', { title: 'Register' }); // Pastikan Anda punya file view 'register.ejs'
};

// Proses registrasi pengguna baru
exports.register = async (req, res) => {
    try {
        const { nama_user, email, password } = req.body;

        // 1. Cek apakah email sudah ada di database
        const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            // Jika email sudah terdaftar, kirim pesan error
            // Sebaiknya gunakan flash messages untuk pengalaman pengguna yang lebih baik
            return res.status(400).send('Email sudah terdaftar. Silakan gunakan email lain.');
        }

        // 2. Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Simpan pengguna baru dengan role 'buyer' secara default
        const newUser = {
            nama_user,
            email,
            password: hashedPassword,
            role: 'buyer' // Role di-set secara otomatis dan tidak diambil dari form
        };

        await db.promise().query('INSERT INTO users SET ?', newUser);

        // 4. Arahkan ke halaman login setelah registrasi berhasil
        res.redirect('/login');

    } catch (error) {
        console.error("Error saat registrasi:", error);
        res.status(500).send('Terjadi kesalahan pada server saat mencoba mendaftar.');
    }
};

// Menampilkan halaman login
exports.showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' }); // Pastikan Anda punya file view 'login.ejs'
};

// Proses login pengguna
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cari user berdasarkan email
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).send('Email atau password salah.');
        }

        const user = users[0];

        // 2. Bandingkan password yang diinput dengan password di database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Email atau password salah.');
        }

        // 3. Buat sesi untuk pengguna
        // Pastikan Anda sudah mengkonfigurasi express-session di aplikasi utama Anda
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.userName = user.nama_user;

        // 4. Arahkan berdasarkan role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard'); // Arahkan ke dashboard admin
        } else {
            res.redirect('/'); // Arahkan ke homepage untuk buyer
        }

    } catch (error) {
        console.error("Error saat login:", error);
        res.status(500).send('Terjadi kesalahan pada server saat mencoba login.');
    }
};

// Proses logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Tidak bisa logout.');
        }
        res.redirect('/login');
    });
};