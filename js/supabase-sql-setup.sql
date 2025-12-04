-- ===================================
-- SUPABASE DATABASE SETUP SQL
-- ===================================
-- Jalankan query ini di SQL Editor Supabase untuk setup database

-- ===== CREATE TABLE: supplier_visits =====
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

-- ===== CREATE INDEXES =====
-- Index untuk query cepat
CREATE INDEX idx_supplier_name ON supplier_visits(supplier_name);
CREATE INDEX idx_arrival_date ON supplier_visits(arrival_date);
CREATE INDEX idx_arrival_status ON supplier_visits(arrival_status);
CREATE INDEX idx_created_at ON supplier_visits(created_at);

-- ===== CREATE TRIGGER untuk updated_at =====
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

-- ===== ROW LEVEL SECURITY (RLS) =====
-- Enable RLS
ALTER TABLE supplier_visits ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang dapat membaca
CREATE POLICY "Enable read access for all users"
ON supplier_visits
FOR SELECT
USING (true);

-- Policy: Siapa saja dapat insert
CREATE POLICY "Enable insert access for all users"
ON supplier_visits
FOR INSERT
WITH CHECK (true);

-- Policy: Siapa saja dapat update
CREATE POLICY "Enable update access for all users"
ON supplier_visits
FOR UPDATE
USING (true);

-- Policy: Siapa saja dapat delete
CREATE POLICY "Enable delete access for all users"
ON supplier_visits
FOR DELETE
USING (true);

-- ===== OPTIONAL: Insert Sample Data =====
-- Uncomment untuk test dengan data dummy

-- INSERT INTO supplier_visits (supplier_name, scheduled_time, actual_arrival_time, arrival_date, arrival_status, keterangan)
-- VALUES 
--   ('PT Supplier A', '08:00', '07:55', '2025-12-04', 'Tepat Waktu', 'Tepat waktu'),
--   ('PT Supplier B', '09:00', '09:30', '2025-12-04', 'Late - Tolerance', 'Terlambat tapi dalam toleransi'),
--   ('PT Supplier C', '10:00', '11:00', '2025-12-04', 'Delay', 'Sangat terlambat'),
--   ('PT Supplier A', '08:00', '08:02', '2025-12-03', 'Tepat Waktu', 'Tepat waktu'),
--   ('PT Supplier B', '09:00', '09:00', '2025-12-02', 'Tepat Waktu', 'Tepat waktu');

-- ===== VERIFY SETUP =====
-- Jalankan query ini untuk verifikasi
SELECT COUNT(*) as total_records FROM supplier_visits;
SELECT table_name FROM information_schema.tables WHERE table_name = 'supplier_visits';
