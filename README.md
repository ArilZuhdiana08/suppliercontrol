# Supplier Control - PT. BONECOM TRICOM

Aplikasi web untuk pencatatan dan verifikasi kunjungan supplier dengan fitur face detection real-time.

## 📁 Struktur Project

```
Supplier-BTI/
├── index.html              # Main HTML file
├── style.css               # Global styling
├── js/                     # JavaScript modules
│   ├── config.js          # Configuration & data
│   ├── camera.js          # Camera & face detection
│   └── form.js            # Form & submission logic
└── assets/                # Media files
    └── header.png         # Header image
```

## 📄 File Descriptions

### `index.html`
- File HTML utama yang bersih dan rapi
- Hanya berisi struktur DOM dan link ke external resources
- Semua JavaScript logic dipisahkan ke file terpisah

### `style.css`
- Styling global untuk seluruh aplikasi
- Gradient background dengan warna merek (merah #c8102e)
- Responsive design untuk desktop dan mobile

### `js/config.js`
- **Purpose**: Menyimpan konfigurasi dan data referensi
- **Isi**:
  - `WAKTU_REFERENSI`: Schedule kedatangan setiap supplier
  - `GOOGLE_SHEETS_API`: Endpoint API untuk Google Sheets
  - `TOLERANCE_MINUTES`: Toleransi keterlambatan (10 menit)
  - `EARLY_ARRIVAL_MINUTES`: Durasi early arrival check (30 menit)

### `js/camera.js`
- **Purpose**: Mengelola kamera, face detection, dan capture selfie
- **Fungsi utama**:
  - `initFaceDetection()`: Inisialisasi TensorFlow.js BlazeFace model
  - `startCamera()`: Buka akses kamera dan mulai face detection
  - `stopCamera()`: Matikan kamera dan stop detection
  - `detectFaces()`: Real-time face detection loop
  - `captureSelfie()`: Capture foto dari video stream
  - `useSelfie()`: Confirm dan gunakan selfie, auto-fill tanggal
  - `retakeSelfie()`: Mulai proses pengambilan selfie ulang
  - `isSelfieConfirmed()`: Check status selfie confirmation
  - `resetSelfieState()`: Reset state setelah form submission

### `js/form.js`
- **Purpose**: Mengelola form submission dan kalkulasi status
- **Fungsi utama**:
  - `handleFormSubmit()`: Handler untuk form submission
  - `calculateArrivalStatus()`: Hitung status kedatangan berdasarkan jadwal
  - `sendDataToGoogleSheets()`: Kirim data via Google Sheets API
  - `formatTime()`: Format waktu untuk display
  - `calculateTimeDifference()`: Hitung selisih waktu

## 🔄 Workflow Aplikasi

### 1. **Verifikasi Wajah**
- User klik "Mulai Kamera"
- Kamera menyala, face detection dimulai
- User arahkan wajah ke kamera (ada overlay guide)
- Status deteksi ditampilkan real-time
- User klik "Ambil Selfie" untuk capture
- Preview selfie ditampilkan dengan opsi Gunakan/Ambil Ulang

### 2. **Auto-fill Data**
- Saat user klik "Gunakan Selfie":
  - Tanggal (hari/bulan/tahun) otomatis terisi dari waktu selfie
  - Waktu selfie disimpan untuk kalkulasi status

### 3. **Pilih Supplier**
- User pilih nama supplier dari dropdown
- Form siap untuk dikirim

### 4. **Submit & Status Check**
- User klik "Kirim Data"
- Sistem otomatis:
  - Validasi selfie sudah diambil
  - Ambil waktu dari selfie
  - Compare dengan jadwal supplier
  - Hitung status (Tepat Waktu / Terlambat (Toleransi) / Delay)
  - Kirim ke Google Sheets

### 5. **Toleransi Keterlambatan**
- **Tepat Waktu**: Datang tepat waktu atau sebelum jadwal
- **Terlambat (Toleransi)**: Datang 1-10 menit setelah jadwal
- **Delay**: Datang lebih dari 10 menit setelah jadwal

## 🎯 Key Features

✅ **Face Detection Real-time** - Menggunakan TensorFlow.js BlazeFace
✅ **Automatic Date Filling** - Tanggal auto-fill dari waktu selfie
✅ **Supplier Schedule Check** - Validasi kedatangan dengan toleransi
✅ **Google Sheets Integration** - Data langsung masuk ke spreadsheet
✅ **Responsive Design** - Bekerja di desktop dan mobile
✅ **Beautiful Gradient UI** - Modern dan professional look
✅ **Clean Code Structure** - Modular dan maintainable

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Face Detection**: TensorFlow.js + BlazeFace Model
- **API Integration**: Google Apps Script
- **Styling**: CSS Grid, Flexbox, Gradients, Animations

## 📱 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

**Note**: Memerlukan akses kamera dan HTTPS (untuk production)

## 🚀 Deployment

1. Upload semua file ke web server
2. Ensure HTTPS is enabled (required for camera access)
3. Update Google Sheets endpoint di `config.js` jika diperlukan
4. Buka di browser dan mulai gunakan

## 📝 Notes

- Selfie data disimpan sebagai base64 image
- Verifikasi wajah real-time mencegah spoofing
- Toleransi 10 menit dapat diubah di `config.js`
- Schedule supplier dapat diupdate di `config.js`

---

**Last Updated**: December 4, 2025
