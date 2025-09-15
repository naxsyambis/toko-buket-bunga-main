// backend/__tests__/auth.test.js

const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const db = require('../config/database');

// Setup aplikasi Express mini untuk testing
const app = express();
app.use(express.json()); // Middleware untuk membaca body JSON dari request
app.use('/api/auth', authRoutes);


// Tes akan dijalankan dalam blok "describe"
describe('Test Authentication Flow', () => {

  const uniqueEmail = `testuser.jwt.${Date.now()}@example.com`;
  let authToken; // Variabel untuk menyimpan token

  // Membersihkan database setelah semua tes selesai
  afterAll(async () => {
    await db.promise().query("DELETE FROM users WHERE email = ?", [uniqueEmail]);
    await db.end();
  });

  // Tes ini mirip dengan "Test Cookie Write" Anda
  test("Test User Login & Token Generation", async () => {
    // 1. Kita buat dulu user-nya agar bisa login
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123'
      });
      
    // 2. Sekarang kita tes login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: "password123"
      });

    // 3. Verifikasi respons
    // Di sini kita tidak memeriksa 'Set-Cookie', tapi memastikan body respons berisi 'token'
    expect(response.body).toHaveProperty("token"); 
    expect(response.body.user.email).toBe(uniqueEmail);
    expect(response.statusCode).toBe(200);

    // 4. Simpan token untuk tes selanjutnya
    authToken = response.body.token;
  });

  // Tes ini mirip dengan "Test Cookie Read" Anda
  test("Test Access Protected Route with Token", async () => {
    const response = await request(app)
      .get("/api/auth/profile")
      // Alih-alih .set("Cookie", ...), kita gunakan .set("Authorization", ...)
      .set("Authorization", `Bearer ${authToken}`); 

    // Memastikan server mengembalikan data user yang benar berdasarkan token
    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(uniqueEmail);
  });
});