# Aplikasi Cashflow Ketsuutama

Repository ini adalah monorepo yang menggabungkan project **backend** dan **frontend** aplikasi keuangan dalam satu repository GitHub. Struktur seperti ini umum dipakai untuk aplikasi full-stack karena memudahkan pengelolaan source code, dependency, dan workflow pengembangan dalam satu tempat.

## Struktur Project

Project ini dipisahkan menjadi dua folder utama agar backend dan frontend tetap rapi dan mudah dikelola.

```bash
aplikasi-keuangan/
├── backend/
│   ├── app.js
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── router/
│   ├── service/
│   ├── utils/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── package.json
├── .gitignore
└── README.md
```

## Teknologi

Project ini memakai React dengan Vite di sisi frontend dan Express.js di sisi backend, yang merupakan kombinasi umum untuk monorepo full-stack JavaScript.

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs

### Frontend
- React
- Vite
- React Router DOM
- Axios
- CSS custom

## Instalasi

Pastikan Node.js dan npm sudah terpasang di komputer sebelum menjalankan project ini.

### 1. Clone repository
```bash
git clone https://github.com/Crowre/aplikasi-cashflow-ketsuutama.git
cd aplikasi-cashflow-ketsuutama
```

### 2. Install dependency root
Root `package.json` dapat dipakai untuk membantu menjalankan frontend dan backend dari satu repository.

```bash
npm install
```

### 3. Install dependency backend
```bash
cd backend
npm install
```

### 4. Install dependency frontend
```bash
cd ../frontend
npm install
```

## Konfigurasi Environment

Buat file `.env` pada folder backend dan frontend sesuai kebutuhan project.

### Backend `.env`
```env
PORT=3000
JWT_SECRET=isi_dengan_secret_kamu
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_kamu
DB_NAME=nama_database
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3000
```

## Menjalankan Project

### Menjalankan backend
```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:3000` bila konfigurasi port mengikuti file server saat ini.

### Menjalankan frontend
```bash
cd frontend
npm run dev
```

Frontend biasanya akan berjalan di port bawaan Vite, misalnya `http://localhost:5173`.

### Menjalankan dari root repository
Jika root project sudah memakai script gabungan, frontend dan backend bisa dijalankan dari root repository dengan satu perintah.

```bash
npm run dev
```

## Fitur Utama

### Backend
- Registrasi user
- Login user dengan JWT
- CRUD data pemasukan
- CRUD data pengeluaran
- Endpoint data lokasi Sumatera Barat
- Validasi request dan error handling

### Frontend
- Login dan registrasi user
- Halaman data pemasukan
- Halaman data pengeluaran
- Alert box untuk notifikasi aksi
- Confirm dialog untuk hapus data
- Tampilan mobile dan desktop
- Sorting data ascending berdasarkan tanggal

## Endpoint API

Backend saat ini menyediakan route utama `/auth`, `/income`, dan `/outcome`.

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/auth/registration` | Registrasi user  |
| POST | `/auth/login` | Login user  |
| GET | `/income` | Ambil semua data pemasukan   |
| GET | `/income/:id` | Ambil detail pemasukan   |
| POST | `/income` | Tambah data pemasukan  |
| PUT | `/income/:id` | Update data pemasukan  |
| DELETE | `/income/:id` | Hapus data pemasukan  |
| GET | `/outcome` | Ambil semua data pengeluaran  |
| GET | `/outcome/lokasi` | Ambil data lokasi Sumatera Barat  |
| GET | `/outcome/:id` | Ambil detail pengeluaran  |
| POST | `/outcome` | Tambah data pengeluaran  |
| PUT | `/outcome/:id` | Update data pengeluaran  |
| DELETE | `/outcome/:id` | Hapus data pengeluaran  |

## Catatan Pengembangan

Menggabungkan frontend dan backend dalam satu repository memudahkan sinkronisasi perubahan antarlayer, terutama saat endpoint backend dan konsumsi API frontend berkembang bersama.[2] Struktur monorepo seperti ini juga memudahkan dokumentasi, setup lokal, dan deployment dibanding memisahkan repository terlalu dini.

## Git Workflow

Contoh alur dasar setelah project berada dalam satu repository:

```bash
git add .
git commit -m "Update frontend and backend"
git push origin main
```

Jika menggunakan SSH dan muncul error `Permission denied (publickey)`, berarti autentikasi SSH key ke GitHub belum berhasil dan remote bisa sementara diganti ke HTTPS atau SSH key perlu dikonfigurasi dengan benar.

## Lisensi

Project ini dapat disesuaikan dengan kebutuhan pribadi, tugas, atau pengembangan internal.
