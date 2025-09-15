<div align="center">
  <h1>Toko Buket Bunga (FLORYN)</h1>
  <p><strong>Aplikasi Web E-Commerce Full-Stack untuk Toko Buket Bunga Online</strong></p>
  <p>Proyek Final Praktikum Pengembangan Aplikasi Web</p>
</div>

-----

## Daftar Isi
  - [Fitur Utama](#fitur-utama)
  - [Aset Proyek](#aset-proyek)
  - [Pemenuhan Spesifikasi Proyek](#pemenuhan-spesifikasi-proyek)
  - [Instalasi dan Menjalankan Proyek](#instalasi-dan-menjalankan-proyek)
  - [Dokumentasi API](#dokumentasi-api)
  - [Kolaborator](#kolaborator)

-----

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

-----

## Aset Proyek

Informasi lebih detail mengenai proyek seperti *use case diagram*, presentasi, ERD, *class diagram*, dan *database* dapat diakses melalui tautan Google Drive berikut:

[PAW\_Kelompok8 - Google Drive](https://naxsyambis-8367600.postman.co/workspace/Friska's-Workspace~de0dc303-8902-4d87-852e-dcf4b7834ade/collection/47332148-9f65aae8-499f-49f8-87b3-159c6b6180c2?action=share&creator=47332148&active-environment=47332148-b065658e-9c5a-4d39-a4d1-95228e54d8d1)

-----

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

-----

## Instalasi dan Menjalankan Proyek

### Prasyarat

  - Node.js (v14 atau lebih baru)
  - NPM (Node Package Manager)
  - MySQL Server (misalnya melalui XAMPP)

### 1\. Setup Database

1.  Buka phpMyAdmin atau *database client* Anda.
2.  Buat database baru dengan nama `buket_bunga_db`.
3.  Impor file skema SQL yang ada di proyek ke dalam database yang baru dibuat.

### 2\. Instalasi dan Konfigurasi

1.  **Instal Node.js**: Pastikan Node.js sudah terinstal di sistem Anda.
2.  **Instal Dependensi**:
      - Buka terminal di direktori `backend` dan jalankan `npm install`.
      - Buka terminal di direktori `frontend` dan jalankan `npm install`.
3.  **Audit Fix**: Jika terdapat *vulnerability*, jalankan `npm audit fix` di masing-masing direktori (`backend` dan `frontend`).
4.  **Instal Library Tambahan (Backend)**:
      - `npm install multer bcryptjs`
      - Untuk *unit testing*: `npm install --save-dev jest supertest cross-env`
      - Untuk format rupiah dan tanggal: `npm install @biyy/format-rupiah-datetime`
5.  **Instal Library Tambahan (Frontend)**:
      - Untuk ekspor PDF: `npm install jspdf jspdf-autotable`
6.  **Setup Backend**:
      - Masuk ke direktori `backend`.
      - Buat file `.env` dan isi sesuai dengan konfigurasi Anda.
      - Jalankan server backend dengan `npm run dev`.
7.  **Setup Frontend**:
      - Buka terminal baru, masuk ke direktori `frontend`.
      - Jalankan aplikasi React dengan `npm start`.

-----

## Dokumentasi API

Dokumentasi lengkap API dapat diakses melalui tautan Postman berikut:

[Dokumentasi API Floryn](https://naxsyambis-8367600.postman.co/workspace/Friska's-Workspace~de0dc303-8902-4d87-852e-dcf4b7834ade/collection/47332148-9f65aae8-499f-49f8-87b3-159c6b6180c2?action=share&creator=47332148&active-environment=47332148-b065658e-9c5a-4d39-a4d1-95228e54d8d1)

Berikut adalah beberapa contoh *screenshot* dari dokumentasi API:

### Alur Otentikasi

| Registrasi User Baru | Login Sebagai Buyer | Login Sebagai Admin |
| :---: | :---: | :---: |
| <img src="Dokumentasi API 8/Authentication Flow (Auth)/Register User Baru.png" width="300"> | <img src="Dokumentasi API 8/Authentication Flow (Auth)/Login Sebagai Buyer.png" width="300"> | <img src="Dokumentasi API 8/Authentication Flow (Auth)/Login Sebagai Admin.png" width="300"> |

### Rute Admin

#### Kelola Produk

| Get Semua Produk | Get Produk by ID | Create Product | Update Product | Delete Product |
| :---: | :---: | :---: | :---: | :---: |
| <img src="Dokumentasi API 8/Admin Routes/Kelola Produk/Get Semua Produk.png" width="180"> | <img src="Dokumentasi API 8/Admin Routes/Kelola Produk/Get Produk by id.png" width="180"> | <img src="Dokumentasi API 8/Admin Routes/Kelola Produk/Create Product.png" width="180"> | <img src="Dokumentasi API 8/Admin Routes/Kelola Produk/Update Product.png" width="180"> | <img src="Dokumentasi API 8/Admin Routes/Kelola Produk/Delete Product.png" width="180"> |

#### Kelola Pesanan

| Get All Orders | Update Order Status | Delete Orders |
| :---: | :---: | :---: |
| <img src="Dokumentasi API 8/Admin Routes/Kelola Pesanan/GET all orders.png" width="300"> | <img src="Dokumentasi API 8/Admin Routes/Kelola Pesanan/Update Order Status.png" width="300"> | <img src="Dokumentasi API 8/Admin Routes/Kelola Pesanan/DeleteOrders.png" width="300"> |

#### Kelola User

| Get Semua User | Create User | Update User | Delete User |
| :---: | :---: | :---: | :---: |
| <img src="Dokumentasi API 8/Admin Routes/Kelola User/Get Semua User.png" width="220"> | <img src="Dokumentasi API 8/Admin Routes/Kelola User/Create User.png" width="220"> | <img src="Dokumentasi API 8/Admin Routes/Kelola User/Update User.png" width="220"> | <img src="Dokumentasi API 8/Admin Routes/Kelola User/Delete User.png" width="220"> |

### Rute User (Buyer)

| Add Item to Cart | View Cart | Place Order | View Order Detail | Mengubah Jumlah | Menghapus Barang |
| :---: | :---: | :---: | :---: | :---: | :---: |
| <img src="Dokumentasi API 8/User(Buyer)Routes/Add Item to Cart.png" width="160"> | <img src="Dokumentasi API 8/User(Buyer)Routes/View Cart.png" width="160"> | <img src="Dokumentasi API 8/User(Buyer)Routes/Place Order.png" width="160"> | <img src="Dokumentasi API 8/User(Buyer)Routes/View Order Detail.png" width="160"> | <img src="Dokumentasi API 8/User(Buyer)Routes/Mengubah Jumlah Barang di Keranjang.png" width="160"> | <img src="Dokumentasi API 8/User(Buyer)Routes/Menghapus Barang di Cart.png" width="160"> |

-----

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