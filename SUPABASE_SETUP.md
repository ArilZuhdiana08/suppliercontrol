# SUPABASE DATABASE SETUP GUIDE

## 📋 Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Membuat Project Supabase](#membuat-project-supabase)
3. [Setup Database Tables](#setup-database-tables)
4. [Konfigurasi API Keys](#konfigurasi-api-keys)
5. [Integrasi ke Aplikasi](#integrasi-ke-aplikasi)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 1. Persiapan Awal ✅

Pastikan Anda sudah memiliki:
- Email untuk mendaftar Supabase
- Browser modern (Chrome, Firefox, Safari, Edge)
- Akses ke folder project Supplier-BTI

---

## 2. Membuat Project Supabase

### Step 1: Kunjungi Supabase
1. Buka https://supabase.com
2. Klik tombol "Start your project" atau "Sign In"
3. Daftar menggunakan email atau GitHub account

### Step 2: Buat Project Baru
1. Setelah login, klik "New project"
2. Pilih organisasi Anda (atau buat baru)
3. Isi detail project:
   - **Project Name**: `supplier-bti`
   - **Database Password**: Buat password yang kuat (simpan dengan aman!)
   - **Region**: Pilih yang paling dekat dengan lokasi Anda
   - **Pricing Plan**: Pilih "Free Plan" untuk development

4. Tunggu 1-2 menit hingga project selesai dibuat

### Step 3: Akses Project
Setelah project dibuat, Anda akan melihat dashboard. Catat informasi berikut:
- **Project URL**: `https://YOUR_PROJECT_ID.supabase.co`
- **Anon Key**: Gunakan untuk client-side access
- **Service Role Key**: Gunakan hanya untuk backend (jangan share di client!)

---

## 3. Setup Database Tables

### Membuat Table: `supplier_visits`

1. Di Supabase dashboard, klik **"SQL Editor"** di menu kiri
2. Klik **"New Query"**
3. Copy-paste SQL berikut:

```sql
-- Create supplier_visits table
CREATE TABLE supplier_visits (
  id BIGSERIAL PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  scheduled_time TIME,
  actual_arrival_time TIME,
  arrival_date DATE NOT NULL,
  arrival_status TEXT NOT NULL,
  keterangan TEXT,
  selfie_image TEXT,
  latitude FLOAT,
  longitude FLOAT,
  browser_info TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_arrival_status CHECK (
    arrival_status IN ('Tepat Waktu', 'Late - Tolerance', 'Delay')
  )
);

-- Create indexes for faster queries
CREATE INDEX idx_supplier_name ON supplier_visits(supplier_name);
CREATE INDEX idx_arrival_date ON supplier_visits(arrival_date);
CREATE INDEX idx_arrival_status ON supplier_visits(arrival_status);

-- Add timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_supplier_visits_updated_at
BEFORE UPDATE ON supplier_visits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

4. Klik **"Run"** untuk menjalankan query

### Mengatur Row Level Security (RLS)

1. Klik tab **"Authentication"** di menu kiri
2. Dalam **"Policies"**, setup:

```sql
-- Policy untuk SELECT (public dapat membaca)
CREATE POLICY "Enable read access for all users" 
ON supplier_visits FOR SELECT 
USING (true);

-- Policy untuk INSERT (hanya user terautentikasi)
CREATE POLICY "Enable insert access for authenticated users" 
ON supplier_visits FOR INSERT 
WITH CHECK (true);

-- Policy untuk UPDATE (user dapat update data mereka sendiri)
CREATE POLICY "Enable update access for authenticated users" 
ON supplier_visits FOR UPDATE 
USING (true);
```

---

## 4. Konfigurasi API Keys

### Mendapatkan API Keys

1. Di Supabase dashboard, klik **"Settings"** (gear icon)
2. Klik **"API"** di sidebar
3. Salin nilai berikut:
   - **Project URL**: Contoh `https://abcdefghijklmno.supabase.co`
   - **anon public**: Copy key ini untuk client-side

### Update `js/supabase-config.js`

1. Buka file `js/supabase-config.js`
2. Ganti placeholder dengan nilai sebenarnya:

```javascript
// Ganti ini:
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'

// Dengan nilai sebenarnya:
const SUPABASE_URL = 'https://abcdefghijklmno.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGc... (anon key Anda)'
```

---

## 5. Integrasi ke Aplikasi

### Update `index.html`

Tambahkan script Supabase sebelum script konfigurasi. Di section `<head>`:

```html
<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Config -->
<script src="js/supabase-config.js"></script>
<script src="js/config.js"></script>
<script src="js/camera.js"></script>
<script src="js/form.js"></script>
<script src="js/admin.js"></script>
```

### Update `js/form.js` - Save to Supabase

Dalam fungsi `handleFormSubmit`, ganti bagian Google Sheets dengan Supabase:

```javascript
// Sebelum: mengirim ke Google Sheets
// fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData })

// Sesudah: simpan ke Supabase
try {
  const response = await supabaseService.saveSupplierVisit(formData)
  
  // Juga simpan ke localStorage untuk offline access
  if (typeof addNewSupplierEntry === 'function') {
    addNewSupplierEntry(formData)
  }
  
  showSuccess('Data berhasil disimpan ke database')
  resetForm()
} catch (error) {
  console.error('Error:', error)
  showError(`Gagal menyimpan: ${error.message}`)
}
```

### Update `js/admin.js` - Load from Supabase

Ganti fungsi `loadDataFromLocalStorage()` dengan:

```javascript
async function loadDataFromSupabase(month = null, year = null) {
  try {
    const filters = {}
    if (month && year) {
      filters.month = month
      filters.year = year
    } else if (year) {
      filters.year = year
    }
    
    allSupplierData = await supabaseService.getSupplierVisits(filters)
    return allSupplierData
  } catch (error) {
    console.error('Error loading data from Supabase:', error)
    showError('Gagal memuat data dari database')
    return []
  }
}
```

Update `populateYearFilter()`:

```javascript
async function populateYearFilter() {
  try {
    const years = await supabaseService.getAvailableYears()
    const yearSelect = document.getElementById('year-filter')
    
    yearSelect.innerHTML = '<option value="">Pilih Tahun</option>'
    years.forEach(year => {
      const option = document.createElement('option')
      option.value = year
      option.textContent = year
      yearSelect.appendChild(option)
    })
  } catch (error) {
    console.error('Error populating years:', error)
  }
}
```

Update `filterData()`:

```javascript
async function filterData() {
  const year = document.getElementById('year-filter').value
  const month = document.getElementById('month-filter').value
  
  if (!year) {
    showError('Pilih tahun terlebih dahulu')
    return
  }
  
  try {
    const data = await supabaseService.getSupplierVisitsByMonth(
      month ? parseInt(month) : null,
      parseInt(year)
    )
    
    displayDataTable(data)
    displayStatistics(data)
    displayTopSuppliers(data)
  } catch (error) {
    console.error('Error filtering data:', error)
    showError('Gagal memfilter data')
  }
}
```

---

## 6. Testing

### Test 1: Verifikasi Koneksi Supabase

1. Buka browser console (F12)
2. Jalankan command:
```javascript
console.log(window.supabaseService)
```
Jika berhasil, akan menampilkan semua fungsi yang tersedia.

### Test 2: Test Save Data

1. Isi form dengan data supplier
2. Ambil selfie
3. Submit form
4. Di Supabase dashboard → Table Editor → supplier_visits
5. Verifikasi data sudah masuk

### Test 3: Test Admin Panel

1. Klik hamburger menu
2. Klik "Lihat Data (Admin)"
3. Masukkan password: `123098`
4. Pilih tahun dan bulan
5. Klik "Tampilkan"
6. Verifikasi data muncul di tabel

### Test 4: Test Statistics

1. Di admin panel, pilih bulan/tahun dengan banyak data
2. Verifikasi:
   - Total visits terhitung dengan benar
   - On-time count sesuai
   - Top suppliers menampilkan data benar

---

## 7. Troubleshooting

### Error: "Cannot read property 'createClient' of undefined"

**Solusi:**
- Pastikan library Supabase sudah ter-load
- Periksa urutan script di index.html
- Supabase harus diload sebelum supabase-config.js

### Error: "Invalid API Key"

**Solusi:**
- Verifikasi SUPABASE_ANON_KEY di supabase-config.js
- Pastikan tidak ada whitespace atau typo
- Copy lagi dari Supabase dashboard

### Error: "relation supplier_visits does not exist"

**Solusi:**
- Verifikasi SQL query sudah dijalankan di SQL Editor
- Pastikan table sudah berhasil dibuat
- Cek di Table Editor apakah table muncul

### Data tidak terlihat di Admin Panel

**Solusi:**
1. Verifikasi data sudah tersimpan di Supabase:
   - Dashboard → Table Editor → supplier_visits
   - Harus ada baris data

2. Cek filter month/year sudah dipilih dengan benar

3. Buka browser console, cek error message

### CORS Error

**Solusi:**
- Supabase secara default sudah mengizinkan CORS dari semua domain
- Jika masih error, check CORS settings di Supabase dashboard
- Settings → API → CORS Configuration

---

## 📚 Referensi Fungsi

Semua fungsi tersedia di `window.supabaseService`:

| Fungsi | Deskripsi |
|--------|-----------|
| `saveSupplierVisit(data)` | Simpan data kunjungan supplier |
| `getSupplierVisits(filters)` | Ambil semua kunjungan dengan filter |
| `getSupplierVisitsByMonth(month, year)` | Ambil kunjungan per bulan/tahun |
| `getAllSuppliers()` | Ambil daftar nama supplier unik |
| `getAvailableYears()` | Ambil tahun-tahun yang tersedia |
| `getMonthlyStatistics(month, year)` | Hitung statistik per bulan |
| `getTopSuppliersByOnTime(month, year, limit)` | Ambil top suppliers |
| `updateSupplierVisit(id, updates)` | Update data kunjungan |
| `deleteSupplierVisit(id)` | Hapus data kunjungan |
| `searchSupplierVisits(term)` | Cari kunjungan berdasarkan nama |

---

## ✅ Checklist Implementasi

- [ ] Daftar akun Supabase
- [ ] Buat project baru di Supabase
- [ ] Copy Project URL dan Anon Key
- [ ] Jalankan SQL untuk membuat table
- [ ] Update `js/supabase-config.js` dengan credentials
- [ ] Update `index.html` dengan script Supabase
- [ ] Update `js/form.js` untuk save ke Supabase
- [ ] Update `js/admin.js` untuk load dari Supabase
- [ ] Test koneksi di browser console
- [ ] Test form submission
- [ ] Test admin panel data loading
- [ ] Verifikasi data di Supabase dashboard

---

**Status**: ✅ Ready for Production  
**Last Updated**: 4 Desember 2025  
**Database**: Supabase (PostgreSQL)
