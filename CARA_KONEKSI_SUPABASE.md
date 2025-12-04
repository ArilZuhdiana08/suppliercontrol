# 🔗 PANDUAN MENGHUBUNGKAN KE SUPABASE - STEP BY STEP

## 📋 Daftar Isi
1. [Mendapatkan Credentials](#step-1-mendapatkan-credentials)
2. [Update Konfigurasi](#step-2-update-konfigurasi)
3. [Test Koneksi](#step-3-test-koneksi)
4. [Troubleshooting](#troubleshooting)

---

## STEP 1: Mendapatkan Credentials

### 1a. Buka Dashboard Supabase
```
1. Buka: https://supabase.com
2. Login dengan email/GitHub Anda
3. Pilih project "supplier-bti" Anda
4. Klik untuk membuka project
```

### 1b. Cari API Keys di Settings
```
Di dashboard project Anda:
1. Klik menu "Settings" (gear icon) di BAWAH kiri
2. Pilih "API" dari menu sidebar kiri
3. Lihat halaman "API Settings"
```

### 1c. Copy Credentials Penting
Di halaman "API Settings", cari dan copy:

**A. Project URL**
- Lihat bagian "Project URL"
- Contoh format: `https://abcdefghijklmno.supabase.co`
- ⚠️ BUKAN dashboard URL!
- Copy tombol icon di sebelah kanan

**B. Anon Public Key**
- Lihat bagian "Anon Public" (bukan "Service Role")
- Contoh format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (panjang)
- Ini aman untuk client-side
- Copy tombol icon di sebelah kanan

### ✅ Contoh Credentials yang Benar:
```
Project URL: https://abcdefghijklmno.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk...
```

### ⚠️ Yang TIDAK Boleh:
❌ Dashboard URL: `https://supabase.com/dashboard/project/xxx`  
❌ SQL Query URL: `https://supabase.com/dashboard/project/xxx/sql/yyyy`  
❌ Service Role Key: Ini untuk backend only, JANGAN gunakan di client-side!

---

## STEP 2: Update Konfigurasi

### File yang Diubah:
Buka file: `js/supabase-config.js`

### 2a. Update SUPABASE_URL (Baris 3)

**SEBELUM:**
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
```

**SESUDAH:** (dengan credentials Anda)
```javascript
const SUPABASE_URL = 'https://abcdefghijklmno.supabase.co'
```

### 2b. Update SUPABASE_ANON_KEY (Baris 4)

**SEBELUM:**
```javascript
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'
```

**SESUDAH:** (dengan key Anda)
```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk...'
```

### ✅ Contoh File Lengkap:
```javascript
// ===== SUPABASE CONFIGURATION =====
// Initialize Supabase client
const SUPABASE_URL = 'https://abcdefghijklmno.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

// Initialize Supabase
const { createClient } = supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

---

## STEP 3: Test Koneksi

### 3a. Buka Aplikasi di Browser
```
1. Buka file index.html di browser
2. Atau akses via server lokal: http://localhost:3000
```

### 3b. Buka Developer Console
```
Tekan: F12 (atau Ctrl+Shift+I di Windows/Linux, Cmd+Option+I di Mac)
Pilih tab: "Console"
```

### 3c. Jalankan Test Command

Copy-paste command ini di console:
```javascript
window.supabaseService.getSupplierVisits()
  .then(data => console.log('✅ SUCCESS! Data:', data))
  .catch(error => console.error('❌ ERROR:', error))
```

### Expected Result:

**Jika berhasil:**
```
✅ SUCCESS! Data: []
```
(array kosong karena belum ada data)

**Jika ada error, lihat bagian Troubleshooting di bawah**

---

## STEP 4: Verifikasi Database

### 4a. Cek Table di Supabase

```
1. Dashboard Supabase → project Anda
2. Klik "SQL Editor" di sidebar kiri
3. Klik "New Query"
4. Jalankan:
```

```sql
SELECT COUNT(*) as total_records FROM supplier_visits;
```

```
5. Klik "Run" button
6. Harusnya output: total_records: 0 (atau jumlah data jika ada)
```

### 4b. Jika Table Tidak Ada

Jalankan SQL setup dari file `js/supabase-sql-setup.sql`:

```
1. SQL Editor → New Query
2. Copy-paste SEMUA isi dari: js/supabase-sql-setup.sql
3. Klik "Run"
4. Tunggu selesai
```

---

## 🧪 TROUBLESHOOTING

### Error 1: "Cannot read property 'createClient' of undefined"

**Penyebab:** Library Supabase belum ter-load

**Solusi:**
1. Buka `index.html`
2. Cek apakah ada line:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```
3. Pastikan ini ada SEBELUM `<script src="js/supabase-config.js"></script>`
4. Refresh browser (Ctrl+F5)

---

### Error 2: "Invalid/Malformed API Key"

**Penyebab:** API Key salah atau URL salah

**Solusi:**
1. Buka Supabase dashboard → Settings → API
2. Copy lagi Project URL dan Anon Key
3. Paste ke `js/supabase-config.js` baris 3-4
4. Pastikan tidak ada spasi di awal/akhir
5. Refresh browser

---

### Error 3: "relation 'supplier_visits' does not exist"

**Penyebab:** Table belum di-create

**Solusi:**
1. Dashboard Supabase → SQL Editor
2. New Query
3. Copy-paste dari: `js/supabase-sql-setup.sql`
4. Jalankan (Run button)
5. Tunggu selesai
6. Refresh aplikasi

---

### Error 4: "CORS policy: No 'Access-Control-Allow-Origin'"

**Penyebab:** Biasanya settings Supabase

**Solusi:**
1. Dashboard Supabase → Settings → API
2. Scroll ke "CORS"
3. Pastikan domain Anda di-allow
4. Atau biarkan default (semua domain allowed)

---

### Error 5: "Network Error" atau "Failed to fetch"

**Penyebab:** 
- Internet disconnect
- Supabase server down
- Firewall blocking

**Solusi:**
1. Cek internet connection
2. Refresh browser
3. Tunggu beberapa menit
4. Cek status Supabase: https://status.supabase.com

---

## 📝 CHECKLIST SETUP

Pastikan semua ini sudah dikerjakan:

- [ ] Supabase account sudah dibuat (https://supabase.com)
- [ ] Project "supplier-bti" sudah dibuat
- [ ] Settings → API sudah dibuka
- [ ] Project URL sudah di-copy
- [ ] Anon Key sudah di-copy
- [ ] `js/supabase-config.js` baris 3 sudah updated dengan Project URL
- [ ] `js/supabase-config.js` baris 4 sudah updated dengan Anon Key
- [ ] File sudah di-save
- [ ] Browser di-refresh (Ctrl+F5)
- [ ] Test command di-jalankan di console (F12)
- [ ] Output: `✅ SUCCESS!` keluar

---

## 🎓 Penjelasan Format

### Project URL Format:
```
https://[PROJECT_ID].supabase.co
                ^^^^^^^^^^
                Unique ID untuk project Anda
```

Contoh:
```
https://abcdefghijklmno.supabase.co
```

### Anon Key Format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk1MzUwNjA0LCJleHAiOjE4NTMxMTY2MDR9.q2...
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Header
                                    ^^^^^^^^ Payload  
                                           ^^^ Signature
```

Ini adalah JWT token - aman untuk client-side.

---

## ✅ Setelah Setup Selesai

Aplikasi Anda sekarang siap:

1. ✅ Form bisa submit data ke Supabase
2. ✅ Admin panel bisa load data dari Supabase
3. ✅ Statistics bisa calculate dari database
4. ✅ Data persist di database (bukan hanya local storage)

---

## 📞 Verifikasi Koneksi Bekerja

Setelah setup, test dengan:

1. **Submit form** dengan data dummy
2. **Cek admin panel** - data harus muncul
3. **Buka Supabase dashboard** → Table Editor → supplier_visits
4. **Verifikasi data** sudah tersimpan

---

## 🎉 Done!

Jika semua checklist sudah, aplikasi Anda sudah **fully connected ke Supabase**! 

Sekarang data akan tersimpan di database production dan bisa diakses dari mana saja.

---

**Tips:**
- Jangan share Anon Key di public (tapi aman karena limited permissions)
- Service Role Key JANGAN di-share (itu untuk backend only)
- Project URL bisa di-share (itu public)

**Support:**
- Check console (F12) untuk error messages
- Lihat file `SUPABASE_QUICK_START.md` untuk quick reference
