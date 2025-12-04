# 🎯 PANDUAN VISUAL - KONEKSI SUPABASE LANGKAH DEMI LANGKAH

## 📺 Langkah 1: Buka Supabase Dashboard

### Screenshot Deskripsi:

**Step 1.1: Buka Supabase**
```
URL: https://supabase.com
Klik tombol biru "Sign In" atau "Start for free"
```

**Step 1.2: Login**
```
Pilih: Email, GitHub, atau Google
Masukkan kredensial Anda
```

**Step 1.3: Pilih Project**
```
Setelah login, Anda akan lihat list project
Cari project: "supplier-bti"
Klik untuk membuka
```

---

## 📺 Langkah 2: Buka Settings → API

### Lokasi Menu:

**Di dashboard project:**
```
┌─────────────────────────────────────┐
│  SIDEBAR KIRI (bawah)               │
│                                     │
│  ⚙️  Settings  ← KLIK INI           │
│  📊 Analytics                       │
│  🔔 Notifications                   │
└─────────────────────────────────────┘
```

**Setelah klik Settings:**
```
┌─────────────────────────────────────┐
│  MENU SIDEBAR BARU:                 │
│                                     │
│  📁 General                         │
│  🔐 Auth                            │
│  🔑 API  ← KLIK INI                 │
│  🗄️  Database                       │
│  📨 Email                           │
│  🔗 Integrations                    │
└─────────────────────────────────────┘
```

---

## 📺 Langkah 3: Dapatkan Project URL

### Di halaman API Settings:

**Lokasi:**
```
┌─────────────────────────────────────┐
│  API SETTINGS PAGE                  │
│                                     │
│  📌 Project URL                     │
│  ┌─────────────────────────────────┐│
│  │ https://abc...supabase.co        ││  ← Ada copy button
│  │                           [📋]   ││
│  └─────────────────────────────────┘│
│                                     │
│  📌 CORS                            │
│  📌 Authorization Token Expiration  │
└─────────────────────────────────────┘
```

### Yang Harus Di-Copy:
```
✅ Benar: https://abcdefghijklmno.supabase.co

❌ Salah: https://supabase.com/dashboard/project/...
```

**Tombol Copy:**
```
Klik icon 📋 di sebelah kanan Project URL
Sekarang sudah ter-copy di clipboard
```

---

## 📺 Langkah 4: Dapatkan Anon Public Key

### Di halaman API Settings (scroll ke bawah):

**Lokasi:**
```
┌─────────────────────────────────────┐
│  ANON PUBLIC                        │
│  ┌─────────────────────────────────┐│
│  │ eyJhbGciOiJIUzI1Ni...           ││  ← Ada copy button
│  │ (key panjang sekali)             ││
│  │                           [📋]   ││
│  └─────────────────────────────────┘│
│                                     │
│  ⚠️  Service Role Secret             │
│  ┌─────────────────────────────────┐│
│  │ eyJhbGciOiJIUzI1Ni...           ││
│  │ (DO NOT USE DI CLIENT!)          ││
│  │                           [📋]   ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Yang Harus Di-Copy:
```
✅ Copy: ANON PUBLIC (bukan Service Role Secret!)
```

**Tombol Copy:**
```
Klik icon 📋 di sebelah kanan ANON PUBLIC
Sekarang sudah ter-copy
```

---

## 📺 Langkah 5: Buka File `js/supabase-config.js`

### Lokasi File:
```
Folder Project:
Supplier-BTI/
  ├── js/
  │   ├── supabase-config.js  ← BUKA FILE INI
  │   ├── form.js
  │   ├── admin.js
  │   └── camera.js
```

### Cara Buka:
```
1. Buka Text Editor (VS Code, Sublime, dll)
2. File → Open → Pilih supabase-config.js
3. Atau drag-drop file ke editor
```

---

## 📺 Langkah 6: Update SUPABASE_URL

### File Contents:

**Sebelum (BARIS 3):**
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
```

**Sesudah (ganti YOUR_PROJECT_ID):**
```javascript
const SUPABASE_URL = 'https://abcdefghijklmno.supabase.co'
```

### Contoh:
```javascript
// Jika Project URL dari Supabase adalah:
// https://tmemlrumamlwvwioqvhf.supabase.co

// Maka di file, ganti menjadi:
const SUPABASE_URL = 'https://tmemlrumamlwvwioqvhf.supabase.co'
```

---

## 📺 Langkah 7: Update SUPABASE_ANON_KEY

### File Contents:

**Sebelum (BARIS 4):**
```javascript
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'
```

**Sesudah (ganti dengan key dari Supabase):**
```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk0ODAwMDAwLCJleHAiOjE3MDI1NzYwMDB9...'
```

### Contoh Lengkap:
```javascript
// Baris 3-4 sudah di-update:
const SUPABASE_URL = 'https://tmemlrumamlwvwioqvhf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZW1scnVtYW1sd3Z3aW9xdmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ4MDAwMDAsImV4cCI6MTcwMjU3NjAwMH0.q2DrFhYZN...'

// Baris 7-8 otomatis akan bekerja:
const { createClient } = supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

---

## 📺 Langkah 8: Save File

### Di Text Editor:
```
Tekan: Ctrl+S (Windows/Linux)
atau:  Cmd+S (Mac)

atau:  Menu → File → Save
```

### Verifikasi:
```
Jika ada 🔴 dot di tab = belum di-save
Klik save = 🔴 akan hilang
```

---

## 📺 Langkah 9: Refresh Browser

### Buka Aplikasi:
```
1. Buka file index.html di browser
2. atau klik: Open with → Browser
3. atau akses via: http://localhost:3000 (jika pakai server)
```

### Refresh:
```
Tekan: F5 atau Ctrl+R
atau: Ctrl+Shift+R (hard refresh, clear cache)
```

---

## 📺 Langkah 10: Test Koneksi

### Buka Developer Console:
```
Tekan: F12
Pilih tab: "Console"
```

### Jalankan Command:
```javascript
window.supabaseService.getSupplierVisits()
  .then(data => console.log('✅ SUCCESS!', data))
  .catch(error => console.error('❌ ERROR:', error))
```

### Copy-Paste Steps:
```
1. Buka console (F12)
2. Klik di area input console
3. Paste command di atas
4. Tekan Enter
5. Tunggu hasil
```

### Expected Output:

**Jika Berhasil:**
```
✅ SUCCESS! []
```
(Array kosong = normal, karena belum ada data)

**Jika Ada Data:**
```
✅ SUCCESS! [
  { id: 1, supplier_name: 'PT ABC', ... },
  { id: 2, supplier_name: 'PT XYZ', ... }
]
```

---

## 📺 Langkah 11: Test Form Submission

### Submit Data:
```
1. Di aplikasi, ambil SELFIE
2. Pilih SUPPLIER
3. Klik SUBMIT
4. Tunggu notifikasi "Data berhasil dikirim"
```

### Verifikasi di Database:
```
1. Buka Supabase dashboard
2. Pilih project "supplier-bti"
3. Klik "Table Editor" di sidebar
4. Pilih table "supplier_visits"
5. Lihat data baru sudah ada ✓
```

---

## 📺 Troubleshooting Visual

### Error 1: "Cannot read property 'createClient'"

**Cek:**
```
index.html seharusnya ada:

<head>
  ...
  <!-- Supabase library (harus di-load DULUAN) -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>  ← Ini harus ADA
  ...
</head>

<body>
  ...
  <script src="js/supabase-config.js"></script>  ← Ini SETELAH Supabase library
  ...
</body>
```
```

**Solusi:**
- Pastikan urutan script benar
- Refresh browser Ctrl+F5
```

### Error 2: "Invalid API Key"

**Kemungkinan:**
```
❌ URL salah:        https://supabase.com/dashboard/... ← SALAH
✅ URL benar:        https://abc...supabase.co ← BENAR

❌ Key salah:        Kopi Service Role Key ← SALAH
✅ Key benar:        Kopi ANON PUBLIC ← BENAR

❌ Ada spasi:        'https://abc...supabase.co ' ← SALAH
✅ Tidak ada spasi:  'https://abc...supabase.co' ← BENAR
```

**Solusi:**
- Re-copy dari Supabase dashboard
- Pastikan copy EXACT (tanpa spasi)
- Refresh browser Ctrl+F5
```

### Error 3: "relation 'supplier_visits' does not exist"

**Penyebab:**
```
Table belum di-create di database
```

**Solusi:**
```
1. Supabase dashboard → SQL Editor
2. New Query
3. Copy-paste SEMUA dari: js/supabase-sql-setup.sql
4. Klik RUN
5. Tunggu selesai
6. Refresh aplikasi
```

---

## ✅ Checklist Setup Lengkap

```
[ ] Buka Supabase https://supabase.com
[ ] Login dengan akun Anda
[ ] Pilih project "supplier-bti"
[ ] Settings → API
[ ] Copy Project URL
[ ] Copy Anon Public Key
[ ] Buka js/supabase-config.js
[ ] Update SUPABASE_URL (baris 3)
[ ] Update SUPABASE_ANON_KEY (baris 4)
[ ] Save file (Ctrl+S)
[ ] Refresh browser (Ctrl+F5)
[ ] F12 → Console
[ ] Jalankan test command
[ ] Output: ✅ SUCCESS!
[ ] Test form submission
[ ] Cek di Supabase dashboard
[ ] Data ada di table ✓
```

---

## 🎉 Success!

Jika semua langkah sudah dan console output: `✅ SUCCESS!`

**Selamat! Aplikasi Anda sudah terhubung ke Supabase!** 🚀

Data sekarang akan tersimpan di database production.

---

## 📞 Quick Reference

**File Penting:**
- `js/supabase-config.js` - Konfigurasi (ganti baris 3-4)
- `index.html` - Script tags harus benar
- `CARA_KONEKSI_SUPABASE.md` - Panduan text (file ini)

**Test Command:**
```javascript
window.supabaseService.getSupplierVisits()
  .then(d => console.log('✅ OK:', d))
  .catch(e => console.error('❌ Error:', e))
```

**Credentials Location:**
- Supabase → Settings → API
- Copy Project URL & Anon Public Key

---

**Selamat Menggunakan Supabase! 🎊**
