# ❓ FAQ - PERTANYAAN YANG SERING DIAJUKAN

## 1. Apa itu Supabase?

**Jawab:**
Supabase adalah platform database online yang menggunakan PostgreSQL.
Fungsinya: menyimpan data aplikasi Anda di server cloud, bukan hanya
di local storage browser.

Keuntungan:
- Data tersimpan permanen
- Bisa diakses dari mana saja
- Lebih aman & scalable
- Ada dashboard untuk melihat data

---

## 2. Apakah Supabase gratis?

**Jawab:**
Ya! Supabase punya free tier yang cukup untuk development.

Free tier includes:
- Database PostgreSQL unlimited
- 2GB storage
- Auth & RLS
- Real-time support
- Dashboard management

Cukup untuk aplikasi kecil-menengah.

---

## 3. Berapa lama setup Supabase?

**Jawab:**
Hanya ~5 menit!

Breakdown:
- Buat account: 2 menit
- Setup database: 1 menit
- Copy credentials: 1 menit
- Update config: 1 menit

Done!

---

## 4. Saya sudah ada database lain, perlu ganti ke Supabase?

**Jawab:**
Tidak harus! Tapi recommended untuk:
- Setup lebih mudah
- Dashboard intuitif
- Free tier generous
- Cocok untuk project kecil-menengah

Kalau sudah ada database yang berfungsi, bisa tetap pakai.

---

## 5. Data saya aman di Supabase?

**Jawab:**
Ya, sangat aman!

Security features:
- HTTPS/SSL encryption
- Row Level Security (RLS)
- Limited API permissions
- Automatic backups
- SOC 2 compliance

Anda bisa trust Supabase untuk production.

---

## 6. Bagaimana kalau internet putus?

**Jawab:**
Aplikasi punya fallback ke localStorage.

Jika Supabase offline:
1. Data tetap bisa di-submit (di-cache ke localStorage)
2. Admin panel masih bisa diakses (dari cache)
3. Saat internet kembali, data akan sync

Jadi aplikasi tetap berfungsi!

---

## 7. Saya lupa copy credentials, bagaimana?

**Jawab:**
Tidak masalah, bisa copy lagi!

Caranya:
1. Buka Supabase dashboard
2. Pilih project
3. Settings → API
4. Copy Project URL & Anon Key lagi

Credentials tidak berubah, selalu bisa di-copy ulang.

---

## 8. Error "Cannot read property 'createClient'"

**Jawab:**
Biasanya karena script loading order salah.

Solusi:
1. Buka index.html
2. Pastikan ada: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`
3. Pastikan sebelum: `<script src="js/supabase-config.js"></script>`
4. Refresh browser Ctrl+F5

---

## 9. Error "Invalid API Key"

**Jawab:**
Ada beberapa kemungkinan:

1. URL salah
   - ❌ Dashboard URL: https://supabase.com/dashboard/...
   - ✅ Project URL: https://abc.supabase.co

2. Copy key yang salah
   - ❌ Service Role Secret
   - ✅ ANON PUBLIC

3. Ada spasi atau typo
   - ❌ 'https://abc.supabase.co '  (ada spasi)
   - ✅ 'https://abc.supabase.co'   (tidak ada spasi)

Solusi:
- Re-copy dari Supabase dashboard
- Pastikan copy EXACT
- Refresh browser

---

## 10. Error "relation 'supplier_visits' does not exist"

**Jawab:**
Table belum di-create di database.

Solusi:
1. Supabase dashboard → SQL Editor
2. New Query
3. Copy-paste dari: js/supabase-sql-setup.sql
4. Klik RUN
5. Tunggu selesai
6. Refresh aplikasi

---

## 11. Bagaimana cara submit data ke Supabase?

**Jawab:**
Sudah otomatis!

Flow-nya:
1. User isi form (selfie, supplier, dll)
2. Klik SUBMIT
3. Otomatis save ke Supabase
4. Kalau Supabase offline, save ke localStorage
5. Notifikasi success

Developer tidak perlu buat extra code, sudah di-handle.

---

## 12. Bagaimana cara lihat data yang sudah di-submit?

**Jawab:**
3 cara:

1. **Via Admin Panel (recommended)**
   - Klik hamburger menu
   - Klik "Lihat Data (Admin)"
   - Enter password: 123098
   - Select month/year
   - Klik "Tampilkan"

2. **Via Supabase Dashboard**
   - Supabase → Table Editor
   - Pilih table "supplier_visits"
   - Lihat semua data

3. **Via Browser Console (developer)**
   ```javascript
   window.supabaseService.getSupplierVisits()
     .then(d => console.log(d))
   ```

---

## 13. Bagaimana backup data?

**Jawab:**
Supabase otomatis backup:

Tersedia:
- Daily backups (free tier)
- Weekly backups
- Manual backup snapshots

Untuk manual backup:
1. Supabase → Settings → Backups
2. Klik "Create Backup"
3. Tersimpan di account

Data Anda aman!

---

## 14. Bisakah saya export data dari Supabase?

**Jawab:**
Ya! Beberapa cara:

1. **CSV Export (manual)**
   - Table Editor → select rows
   - Copy ke Excel/CSV

2. **API Export (developer)**
   ```javascript
   window.supabaseService.getSupplierVisits()
     .then(data => {
       // Convert to CSV / Excel
     })
   ```

3. **Backup Download**
   - Settings → Backups
   - Download backup file

---

## 15. Service Role Key dan Anon Key, apa bedanya?

**Jawab:**
Dua jenis API key dengan permission berbeda:

**Anon Key (Public):**
- ✅ Aman di client-side
- ✅ Limited permissions
- ✅ Pakai di aplikasi web
- ❌ Tidak bisa create/delete users
- ❌ Tidak bisa bypass RLS

**Service Role Key (Secret):**
- ❌ JANGAN di-expose di client
- ❌ Full permissions
- ✅ Hanya di server/backend
- ✅ Bisa bypass RLS
- ✅ Bisa manage users

**Aturan emas:**
- Anon Key → OK di client (JavaScript browser)
- Service Role → RAHASIA di backend only

---

## 16. Bagaimana setup RLS (Row Level Security)?

**Jawab:**
Untuk aplikasi ini, RLS sudah auto-setup!

File: js/supabase-sql-setup.sql sudah include RLS policies:
- Read: Everyone dapat baca
- Create: Everyone dapat submit
- Update: Everyone dapat update
- Delete: Everyone dapat delete

Untuk setup berbeda:
- Buka Supabase → Authentication → Policies
- Edit policy sesuai kebutuhan
- Save

---

## 17. Apa maksimal data yang bisa disimpan?

**Jawab:**
Supabase free tier:
- 2GB storage
- Unlimited database size (dengan billing)

Untuk daily supplier visits:
- ~1KB per entry
- 1 bulan (30 hari) × 20 entries = ~20KB
- 12 bulan = ~240KB per tahun

Dengan 2GB free, bisa store data ratusan tahun!
Jangan khawatir tentang space.

---

## 18. Bagaimana kalau ada bug di aplikasi setelah connected?

**Jawab:**
Debug langkah-langkah:

1. **Buka browser console (F12)**
   - Lihat error message
   - Copy error text

2. **Cek Supabase dashboard**
   - Pastikan project masih online
   - Cek data di table

3. **Test connection**
   ```javascript
   window.supabaseService.getSupplierVisits()
     .then(d => console.log('✅ OK'))
     .catch(e => console.error('❌ Error:', e))
   ```

4. **Refresh browser**
   - Ctrl+F5 (hard refresh)
   - Clear cache

5. **Check documentation**
   - CARA_KONEKSI_SUPABASE.md
   - PANDUAN_KONEKSI_VISUAL.md

---

## 19. Bisakah pindah database ke tempat lain?

**Jawab:**
Ya! Tapi agak kompleks.

Pilihan:
1. **MySQL/MariaDB** - Perlu code changes di service layer
2. **Firebase** - Perlu rewrite backend services
3. **PostgreSQL lain** - Agak mudah (struktur sama)

Rekomendasi:
- Untuk development, tetap pakai Supabase
- Kalau perlu migrasi, contact developer
- Biasanya data bisa di-export & import

---

## 20. Apa support/kontribusi yang tersedia?

**Jawab:**
Tersedia dokumentasi lengkap:

Files:
- `CARA_KONEKSI_SUPABASE.md` - Setup guide text
- `PANDUAN_KONEKSI_VISUAL.md` - Visual step-by-step
- `TUTORIAL_VIDEO_SCRIPT.md` - Video tutorial script
- `SUPABASE_CHECKLIST.md` - Checklist lengkap
- `00_SUPABASE_README.txt` - Quick overview

Support:
- Check documentation first
- Check browser console untuk error messages
- Supabase documentation: https://supabase.com/docs
- GitHub issues (jika ada bug di code)

---

## 🆘 Masih ada pertanyaan?

**Cek file dokumentasi:**
1. `CARA_KONEKSI_SUPABASE.md` - Paling detail
2. `PANDUAN_KONEKSI_VISUAL.md` - Dengan penjelasan visual
3. `SUPABASE_QUICK_START.md` - Quick reference
4. `TUTORIAL_VIDEO_SCRIPT.md` - Script video tutorial

**Atau cek:**
- Browser console (F12) untuk error messages
- Supabase dashboard untuk melihat data
- README.md di project untuk overview

---

**Last Update:** 4 Desember 2025  
**Status:** FAQ Complete ✅
