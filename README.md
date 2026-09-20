# Aplikasi Cashflow Ketsuutama

Aplikasi pengelolaan pemasukan dan pengeluaran menggunakan React/Vite, Express, PostgreSQL, dan autentikasi JWT.

## Struktur

- `backend/src/`: API dan koneksi database.
- `backend/scripts/build.js`: pemeriksaan sintaks dan pembuatan `backend/dist/`.
- `frontend/src/`: aplikasi React.
- `frontend/dist/`: hasil build website.

Dependency dikelola terpisah di backend dan frontend. Tidak ada instalasi npm di root repository.

## Pengembangan lokal

1. Jalankan `npm ci` di masing-masing folder `backend` dan `frontend`.
2. Salin `.env.example` menjadi `.env` pada masing-masing folder dan isi konfigurasi lokal.
3. Siapkan PostgreSQL beserta schema dan data referensi dari database aplikasi yang sudah digunakan.
4. Jalankan `npm run dev` di backend dan frontend menggunakan dua terminal.

Frontend: `http://localhost:5173`. Backend: `http://localhost:3000`.

## Persiapan deployment

Panduan khusus Railway dan pemindahan database melalui DBeaver tersedia di [DEPLOYMENT.md](DEPLOYMENT.md). Repository menyediakan Dockerfile dan railway.json untuk kedua layanan.

| Pengaturan | Backend | Frontend |
| --- | --- | --- |
| Root directory | `backend` | `frontend` |
| Install | `npm ci` | `npm ci` |
| Build | `npm run build` | `npm run build` |
| Start | `npm run start:prod` | Sajikan folder `dist` melalui static hosting |
| Health check | `/health` | `/` |

Gunakan versi Node yang memenuhi engines dependency dalam package-lock.json. Build frontend membutuhkan devDependencies; jangan menghilangkannya pada tahap build. `vite preview` hanya untuk memeriksa hasil build lokal.

### Environment backend

Atur di dashboard hosting:

- `NODE_ENV=production`
- `JWT_SECRET`: secret acak yang kuat dan khusus production. Bisa dibuat dengan `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`.
- `CORS_ORIGIN=https://domain-frontend`: origin tanpa slash terakhir; pisahkan dengan koma jika ada beberapa origin.
- `DATABASE_URL`: connection string PostgreSQL dari provider, termasuk pengaturan TLS/SSL sesuai provider. Alternatif: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- `PORT`: gunakan nilai yang diberikan hosting; default aplikasi adalah `3000`.

Backend mendahulukan `DATABASE_URL` jika terisi. Jangan memasukkan credential production ke repository.

### Environment frontend

Atur `VITE_API_URL=https://domain-backend` **sebelum build**. Perubahan URL memerlukan build ulang. Variabel `VITE_*` dimasukkan ke bundle publik, jadi jangan menyimpan secret di dalamnya.

Aktifkan SPA fallback/rewrite pada hosting: permintaan halaman seperti `/dashboard` dan `/income/edit/1` harus mengembalikan `/index.html` ketika file statis tidak ditemukan. Bentuk konfigurasinya mengikuti platform hosting.

### Database

Repository belum menyediakan migration SQL atau seed. Sebelum deployment, ekspor schema dari database sumber yang sudah bekerja dan restore ke database production. Pastikan tabel berikut beserta constraint, sequence, dan data referensinya tersedia:

- `users`
- `pemasukan`
- `pengeluaran`
- `kabupaten_kota_sumbar` (termasuk data lokasi)

Gunakan backup/restore PostgreSQL sesuai versi database sumber dan tujuan. Jangan melakukan restore di database berisi data penting tanpa backup dan pemeriksaan terlebih dahulu.

### Pemeriksaan sebelum rilis

- Build backend dan frontend berhasil.
- Database production sudah memiliki schema dan data lokasi.
- `GET /health` mengembalikan 200. Endpoint ini hanya memeriksa proses API, bukan koneksi database.
- Registrasi/login dan operasi pemasukan/pengeluaran berhasil pada environment staging.
- Halaman bersarang dapat di-refresh tanpa 404.
- Frontend menggunakan API HTTPS production, bukan localhost.
- Tentukan apakah registrasi publik memang diizinkan: endpoint `/auth/registration` saat ini terbuka.
- `frontend/.env` sebelumnya terlacak Git. Penambahan `.gitignore` tidak menghapus file yang sudah terlacak; sebelum commit deployment, jalankan `git rm --cached frontend/.env` agar file lokal tetap ada tetapi tidak disimpan pada commit berikutnya. Gunakan `.env.example` sebagai template.

## API

- `POST /auth/registration`
- `POST /auth/login`
- `GET /health`
- `GET`, `POST` `/income`
- `GET`, `PUT`, `DELETE` `/income/:id`
- `GET`, `POST` `/outcome`
- `GET /outcome/lokasi`
- `GET`, `PUT`, `DELETE` `/outcome/:id`

Referensi: [Environment Vite](https://vite.dev/guide/env-and-mode), [Build Vite](https://vite.dev/guide/build), [Koneksi node-postgres](https://node-postgres.com/features/connecting).
