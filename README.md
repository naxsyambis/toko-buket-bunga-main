<div align="center">
  <h1>Toko Buket Bunga (FLORYN)</h1>
  <p><strong>Aplikasi Web E-Commerce Full-Stack untuk Toko Buket Bunga Online</strong></p>
  <p>Proyek Final Praktikum Pengembangan Aplikasi Web</p>
</div>

---

**FLORYN** adalah aplikasi web E-commerce lengkap yang dibangun dengan MERN stack (MySQL, Express.js, React.js, Node.js). Aplikasi ini menyediakan platform yang fungsional dan modern bagi pelanggan untuk membeli buket bunga dan bagi administrator untuk mengelola toko.

## Fitur Utama

- **Untuk Pembeli:**
    - **Katalog Produk:** Melihat katalog buket bunga dengan filter berdasarkan kategori.
    - **Detail Produk:** Melihat informasi rinci untuk setiap produk.
    - **Keranjang Belanja:** Menambah, mengubah kuantitas, dan menghapus produk dari keranjang.
    - **Proses Checkout:** Melakukan pemesanan dengan mengisi informasi pengiriman.
    - **Riwayat Pesanan:** Melihat riwayat semua pesanan yang pernah dibuat beserta detailnya.
    - **Otentikasi:** Sistem registrasi dan login yang aman menggunakan JWT.

- **Untuk Admin:**
    - **Dashboard:** Halaman utama dengan statistik ringkas mengenai total produk, pesanan, dan pengguna.
    - **Manajemen Produk:** Operasi CRUD (Create, Read, Update, Delete) lengkap untuk produk, termasuk fitur upload gambar.
    - **Manajemen Pesanan:** Melihat semua pesanan dari pelanggan dan mengubah status pesanan (pending, diproses, dikirim, selesai, dibatalkan).
    - **Manajemen Pengguna:** Mengelola data pengguna yang terdaftar di sistem (CRUD).
    - **Cetak PDF:** Fitur untuk mengunduh laporan pesanan dalam format PDF.

---

## Pemenuhan Spesifikasi Proyek

Proyek ini telah memenuhi semua spesifikasi teknis dan fungsional yang diwajibkan.

| Kriteria | Status | Implementasi |
| :--- | :---: | :--- |
| **Arsitektur Backend** | | |
| 1. Clean Architecture | ✅ | Menerapkan pemisahan yang jelas antara **Routes**, **Controllers**, dan **Middleware**. |
| 2. Framework & API | ✅ | Menggunakan **Node.js** & **Express.js** dengan prinsip **RESTful API**. |
| 3. Operasi Database (CRUD) | ✅ | Implementasi CRUD penuh pada entitas Produk, Pengguna, dan Pesanan menggunakan **MySQL**. |
| 4. Autentikasi & Autorisasi | ✅ | Sistem **Login/Register** dengan **JWT**, dua peran (**admin** & **buyer**), dan password hashing **(bcrypt.js)**. |
| 5. Validasi Data | ✅ | Validasi *request body* pada sisi server untuk memastikan integritas data. |
| 6. Manajemen File (Upload) | ✅ | Fitur **upload gambar produk** menggunakan `multer`. |
| 7. Cetak PDF | ✅ | Admin dapat men-generate **laporan pesanan PDF** dari dashboard. |
| 8. Manajemen Konfigurasi | ✅ | Data sensitif dikelola melalui file `.env`. |
| **Frontend (Sisi Klien)** | | |
| 1. Framework | ✅ | Dibangun menggunakan **React.js**. |
| 2. Manajemen State | ✅ | Menggunakan **React Hooks** (`useState`, `useEffect`, `useContext`). |
| 3. Routing | ✅ | Navigasi antar halaman menggunakan **React Router**. |
| 4. Komunikasi API | ✅ | Interaksi dengan backend API (GET, POST, PUT, DELETE) menggunakan **Axios**. |
| 5. Styling | ✅ | Antarmuka pengguna yang bersih dan responsif menggunakan **CSS murni**. |

---

## Instalasi dan Menjalankan Proyek

### Prasyarat
- Node.js (v14 atau lebih baru)
- NPM (Node Package Manager)
- MySQL Server (misalnya melalui XAMPP)

### 1. Setup Database
1.  Buka phpMyAdmin atau *database client* Anda.
2.  Buat database baru dengan nama `buket_bunga_db`.
3.  Impor file skema SQL yang ada di proyek ke dalam database yang baru dibuat.

### 2. Setup Backend
```
# 1. Masuk ke direktori backend
cd backend

# 2. Install semua dependencies
npm install

# 3. Buat file .env dan isi sesuai dengan konfigurasi Anda

# 4. Jalankan server backend
npm run dev
```
### 3. Setup Frontend
```
# 1. Buka terminal baru, masuk ke direktori frontend
cd frontend

# 2. Install semua dependencies
npm install

# 3. Jalankan aplikasi React
npm start
---
```
## 👥 Kolaborator

Terima kasih kepada para kontributor luar biasa yang telah membantu mewujudkan proyek ini:

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/Aivylv">
        <img src="https://avatars.githubusercontent.com/u/161410803?v=4" width="100px;" alt="Lyvia Ayuning Larasati"/>
        <br />
        <sub><b>Lyvia Ayuning Larasati (20230140182)</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/naxsyambis">
        <img src="https://avatars.githubusercontent.com/u/155415896?v=4" width="100px;" alt="Friska Venunza Bayu"/>
        <br />
        <sub><b>Friska Venunza Bayu (20230140163)</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/dianfitrip">
        <img src="https://avatars.githubusercontent.com/u/161410454?v=4" width="100px;" alt="Dian Fitri Pradini"/>
        <br />
        <sub><b>Dian Fitri Pradini (20230140177)</b></sub>
      </a>
    </td>
    </tr>
</table>
