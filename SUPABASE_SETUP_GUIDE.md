# 🔧 Panduan Setup Supabase Database

## ⚠️ MASALAH UTAMA
Aplikasi tidak bisa menyimpan dan menampilkan image selfie karena **tabel `supplier_visits` belum dibuat** di Supabase database Anda.

---

## 📋 Langkah-Langkah Setup

### **LANGKAH 1: Login ke Supabase Dashboard**
1. Buka: https://app.supabase.com
2. Login dengan akun Anda
3. Pilih project **`tmemlrumamlwvwioqvhf`** (Supplier BTI)

### **LANGKAH 2: Buka SQL Editor**
1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik **"+ New Query"** atau **"New SQL Query"**

### **LANGKAH 3: Copy SQL Script**
Copy semua kode di bawah ini:

```sql
-- ===================================
-- CREATE TABLE: supplier_visits
-- ===================================

CREATE TABLE IF NOT EXISTS public.supplier_visits (
  id BIGSERIAL PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  scheduled_time TIME,
  actual_arrival_time TIME,
  arrival_date DATE NOT NULL,
  arrival_status TEXT NOT NULL,
  keterangan TEXT,
  selfie_image LONGTEXT,
  latitude FLOAT,
  longitude FLOAT,
  browser_info TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_arrival_status CHECK (
    arrival_status IN ('Tepat Waktu', 'Late - Tolerance', 'Delay')
  )
);

-- ===== CREATE INDEXES =====
CREATE INDEX IF NOT EXISTS idx_supplier_name ON public.supplier_visits(supplier_name);
CREATE INDEX IF NOT EXISTS idx_arrival_date ON public.supplier_visits(arrival_date);
CREATE INDEX IF NOT EXISTS idx_arrival_status ON public.supplier_visits(arrival_status);
CREATE INDEX IF NOT EXISTS idx_created_at ON public.supplier_visits(created_at);

-- ===== CREATE TRIGGER untuk updated_at =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_supplier_visits_updated_at ON public.supplier_visits;
CREATE TRIGGER update_supplier_visits_updated_at
BEFORE UPDATE ON public.supplier_visits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ===== ROW LEVEL SECURITY (RLS) =====
ALTER TABLE public.supplier_visits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON public.supplier_visits;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.supplier_visits;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.supplier_visits;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.supplier_visits;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON public.supplier_visits
FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users"
ON public.supplier_visits
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
ON public.supplier_visits
FOR UPDATE
USING (true);

CREATE POLICY "Enable delete access for all users"
ON public.supplier_visits
FOR DELETE
USING (true);

-- ===== VERIFY SETUP =====
SELECT COUNT(*) as total_records FROM public.supplier_visits;
```

### **LANGKAH 4: Paste dan Run**
1. Paste seluruh script di SQL Editor
2. Klik tombol **"Run"** atau tekan **`Ctrl+Enter`**
3. Tunggu sampai selesai (biasanya 5-10 detik)

### **LANGKAH 5: Verifikasi**
Jika berhasil, Anda akan melihat output: `total_records = 0`

Jika ada error, baca pesan error dan hubungi developer.

---

## ✅ Tanda-Tanda Setup Berhasil

- ✔️ Tidak ada error message di SQL console
- ✔️ Halaman admin bisa menampilkan data
- ✔️ Button "👁️ Lihat" bisa membuka image
- ✔️ Data yang dikirim user bisa tersimpan

---

## 🔍 Troubleshooting

### **Error: "relation "public.supplier_visits" does not exist"**
→ Script belum dijalankan. Ulangi LANGKAH 3-4

### **Error: "permission denied"**
→ Login Anda tidak punya akses. Minta admin project untuk grant akses

### **Error: "already exists"**
→ Tabel sudah ada. Coba hapus tabel lama dan jalankan script ulang, atau hanya jalankan bagian RLS policy

### **Image masih tidak muncul**
1. Buka DevTools (F12) → Console
2. Lihat ada error apa
3. Refresh halaman (Ctrl+R)
4. Coba klik button "👁️ Lihat" lagi
5. Lihat console untuk debug message

---

## 📊 Testing Data (Optional)

Jika ingin test dengan data dummy, uncomment dan run kode ini:

```sql
INSERT INTO public.supplier_visits 
(supplier_name, scheduled_time, actual_arrival_time, arrival_date, arrival_status, keterangan)
VALUES 
('PT. MEIHOKU', '08:00:00', '07:55:00', '2025-12-05', 'Tepat Waktu', 'Test data'),
('PT. ARMSTRONG INDONESIA', '09:00:00', '09:30:00', '2025-12-05', 'Late - Tolerance', 'Test data');
```

---

## ❓ Pertanyaan?

Hubungi: Developer / Tech Support

---

**Last Updated:** 5 Desember 2025
