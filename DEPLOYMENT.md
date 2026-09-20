# Deployment Railway dan DBeaver

Railway menjalankan PostgreSQL, backend, dan frontend. DBeaver adalah aplikasi desktop untuk koneksi serta backup/restore PostgreSQL.

## 1. Siapkan repository

Commit dan push file deployment ke repository GitHub yang akan dihubungkan ke Railway. Jangan commit credential. `frontend/.env` masih terlacak Git: jalankan `git rm --cached frontend/.env` sebelum commit agar salinan lokal tetap ada. Dockerfile sudah mengecualikan semua `.env` dari image.

## 2. Buat PostgreSQL di Railway

1. Buat project Railway, lalu tambahkan database PostgreSQL; gunakan nama service `Postgres` untuk mengikuti contoh ini.
2. Tunggu database aktif. Lihat Variables dan pengaturan koneksi database.
3. Untuk DBeaver, aktifkan TCP Proxy/Public Networking jika belum aktif. Gunakan detail koneksi publik dari `DATABASE_PUBLIC_URL`, bukan hostname `*.railway.internal`.

## 3. Sambungkan DBeaver

Pilih **Database > New Database Connection > PostgreSQL**. Isi:

| Field | Nilai dari Railway |
| --- | --- |
| Host | Host publik TCP Proxy |
| Port | Port publik TCP Proxy, bukan otomatis 5432 |
| Database | `PGDATABASE` |
| Username | `PGUSER` |
| Password | `PGPASSWORD` |

Klik **Test Connection**, unduh driver jika diminta, lalu **Finish**. Ikuti konfigurasi SSL dari layanan database yang dipilih. Jangan mengirim password ke chat atau memasukkannya ke Git.

## 4. Pindahkan database lokal

Repository belum memiliki schema SQL. Gunakan database lokal yang telah bekerja sebagai sumber.

1. Di DBeaver, hubungkan database lokal dan database Railway dengan nama koneksi yang jelas berbeda.
2. Klik kanan database lokal > **Tools > Backup**. Pilih format **Custom** dan schema aplikasi (umumnya `public`), termasuk struktur dan data. Simpan backup di luar repository.
3. Jika diminta Local Client, pilih folder `bin` PostgreSQL yang memiliki `pg_dump` dan `pg_restore`. Gunakan versi tool yang kompatibel dengan server sumber; tujuan sebaiknya versi mayor yang sama atau lebih baru.
4. Pada database Railway yang masih kosong: **Tools > Restore**, pilih backup tadi. Aktifkan opsi tanpa owner dan tanpa privileges/ACL (opsi `--no-owner --no-privileges`) agar role lokal tidak diperlukan. Jangan pilih clean/drop pada database berisi data.
5. Periksa hasil restore dan jalankan query berikut dari SQL Editor koneksi Railway:

```sql
SELECT 'users' AS tabel, COUNT(*) AS jumlah FROM users
UNION ALL SELECT 'pemasukan', COUNT(*) FROM pemasukan
UNION ALL SELECT 'pengeluaran', COUNT(*) FROM pengeluaran
UNION ALL SELECT 'kabupaten_kota_sumbar', COUNT(*) FROM kabupaten_kota_sumbar;
```

Bandingkan hasil dengan database lokal. Backup penuh juga mempertahankan sequence, constraint, dan data lokasi.

## 5. Buat dua layanan aplikasi

Tambahkan dua service dari repository GitHub yang sama. Atur sebelum deployment:

| Pengaturan | Backend | Frontend |
| --- | --- | --- |
| Nama service | `backend` | `frontend` |
| Root Directory | `/backend` | `/frontend` |
| Railway Config File | `/backend/railway.json` | `/frontend/railway.json` |
| Builder | Dockerfile | Dockerfile |
| Custom Build/Start Command | Kosongkan; gunakan Dockerfile | Kosongkan; gunakan Dockerfile |
| Healthcheck | `/health` | `/` |

File config menggunakan path dari root repository. Dockerfile menggunakan konteks masing-masing Root Directory.

Di Settings > Networking, Generate Domain untuk backend dan frontend. Contoh di bawah memakai `https://BACKEND.up.railway.app` dan `https://FRONTEND.up.railway.app`; ganti dengan domain sebenarnya.

## 6. Variables dan deployment

Backend:

```env
NODE_ENV=production
PORT=8080
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=ISI_SECRET_ACAK
CORS_ORIGIN=https://FRONTEND.up.railway.app
```

Gunakan Add Reference untuk DATABASE_URL jika nama service database berbeda. Referensi internal ini berlaku dalam project/environment Railway yang sama. Jangan gunakan URL publik untuk komunikasi backend dengan database jika URL internal tersedia.

Buat JWT secret secara lokal lalu salin langsung ke Variables Railway:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Frontend:

```env
PORT=8080
VITE_API_URL=https://BACKEND.up.railway.app
```

Set target port domain kedua aplikasi ke **8080**. Deploy backend, lalu frontend. Jika domain frontend baru tersedia setelah deployment pertama, sementara isi CORS_ORIGIN dengan `http://localhost:5173`, kemudian ganti dengan domain HTTPS frontend dan redeploy backend sebelum digunakan.

VITE_API_URL dibaca saat build melalui Docker ARG. Jika berubah, rebuild frontend. Nginx menyajikan file hasil build dan menangani refresh halaman React Router. Docker tidak memasukkan `.env` lokal.

## 7. Verifikasi

- Buka `https://BACKEND.up.railway.app/health`: harus 200. Ini memeriksa proses API, bukan database.
- Periksa log backend: koneksi database harus berhasil.
- Login dengan akun yang dipindahkan; pastikan data tampil dan daftar lokasi terisi.
- Buat, ubah, lalu hapus satu transaksi uji.
- Refresh `/dashboard` dan `/income` langsung: tidak boleh 404.
- Periksa Network di browser: request menuju backend Railway dan tidak gagal CORS.

Jika koneksi DBeaver gagal, periksa host/port publik dan TCP Proxy. Jika backend gagal koneksi, periksa reference DATABASE_URL dan environment. Jika relasi/tabel tidak ditemukan, periksa hasil restore serta schema. Jika frontend gagal build karena VITE_API_URL, isi variable tersebut dan deploy ulang.

## Referensi resmi

- [Railway monorepo](https://docs.railway.com/deployments/monorepo)
- [Railway Dockerfile dan build variables](https://docs.railway.com/builds/dockerfiles)
- [Railway PostgreSQL](https://docs.railway.com/databases/postgresql)
- [DBeaver backup/restore](https://dbeaver.com/docs/dbeaver/Backup-Restore/)
