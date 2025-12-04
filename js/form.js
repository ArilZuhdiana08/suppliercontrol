/**
 * Form and Submission Module
 * Mengelola form submission dan kalkulasi status kedatangan
 */

// ===== DOM ELEMENTS =====
const supplierForm = document.getElementById('supplier-form');

// ===== FORM INITIALIZATION =====
/**
 * Setup form event listeners on page load
 */
window.addEventListener('load', () => {
  setupFormEventListeners();
});

/**
 * Setup event listeners untuk form
 */
function setupFormEventListeners() {
  supplierForm.addEventListener('submit', handleFormSubmit);
}

// ===== FORM HANDLERS =====
/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  // Validasi selfie harus diambil terlebih dahulu
  if (!isSelfieConfirmed()) {
    alert('⚠️ Silakan ambil selfie terlebih dahulu untuk verifikasi wajah.');
    return;
  }

  // Validasi supplier harus dipilih
  const supplierSelect = document.getElementById('supplier-select');
  if (!supplierSelect.value) {
    alert('⚠️ Silakan pilih nama supplier terlebih dahulu.');
    return;
  }

  try {
    // Kumpulkan form data
    const data = new FormData(supplierForm);
    
    // Ambil informasi yang diperlukan
    const supplier = data.get('SUPPLIER');
    const actualDatetimeStr = document.getElementById('actual-datetime').value;
    
    // Hitung status kedatangan
    const arrivalStatus = calculateArrivalStatus(supplier, actualDatetimeStr);
    
    // Tambahkan status ke form data
    data.set('ARRIVAL_STATUS', arrivalStatus);

    // Save to localStorage (for admin panel)
    if (typeof addNewSupplierEntry === 'function') {
      addNewSupplierEntry(data);
    }

    // Save to Supabase
    if (typeof supabaseService !== 'undefined' && typeof supabaseService.saveSupplierVisit === 'function') {
      await sendDataToSupabase(data);
    } else {
      // Fallback ke Google Sheets jika Supabase tidak tersedia
      await sendDataToGoogleSheets(data);
    }

    // Tampilkan success message
    alert(`✅ Data berhasil dikirim!\nStatus: ${arrivalStatus}`);

    // Reset form dan selfie state
    supplierForm.reset();
    resetSelfieState();

  } catch (error) {
    alert("❌ Gagal mengirim data: " + error.message);
    console.error("Form submission error:", error);
  }
}

// ===== ARRIVAL STATUS CALCULATION =====
/**
 * Hitung status kedatangan supplier
 * @param {string} supplier - Nama supplier
 * @param {string} actualDatetimeStr - ISO string dari waktu selfie
 * @returns {string} Status kedatangan (Tepat Waktu, Terlambat (Toleransi), Delay)
 */
function calculateArrivalStatus(supplier, actualDatetimeStr) {
  const referensiStr = WAKTU_REFERENSI[supplier];
  
  if (!referensiStr) {
    return "Status Tidak Ditemukan";
  }

  // Extract waktu dari selfie (jam dan menit)
  const actualDateTime = new Date(actualDatetimeStr);
  const jamSelfie = actualDateTime.getHours();
  const menitSelfie = actualDateTime.getMinutes();
  const selfieTime = jamSelfie * 60 + menitSelfie;

  // Parse reference time(s)
  const referensiTimes = referensiStr.split(';').map(t => t.trim());

  // Check setiap jadwal yang tersedia
  for (const refTime of referensiTimes) {
    const [jamRef, menitRef] = refTime.split(":").map(Number);
    const referenceTime = jamRef * 60 + menitRef;
    const toleranceTime = referenceTime + TOLERANCE_MINUTES;
    const earlyTime = referenceTime - EARLY_ARRIVAL_MINUTES;

    // Jika waktu selfie dalam range jadwal dengan toleransi
    if (selfieTime >= earlyTime && selfieTime <= toleranceTime) {
      // Jika dalam waktu yang tepat atau sedikit terlambat (dalam toleransi)
      if (selfieTime <= referenceTime) {
        return "Tepat Waktu";
      } else {
        return "Terlambat (Toleransi)";
      }
    }
  }

  // Jika tidak ada jadwal yang match
  return "Delay";
}

// ===== API CALLS =====
/**
 * Kirim data ke Supabase
 * @param {FormData} data - Form data yang akan dikirim
 */
async function sendDataToSupabase(data) {
  try {
    // Convert FormData to object
    const formDataObj = {
      SUPPLIER: data.get('SUPPLIER'),
      JAM_MASUK: data.get('JAM_MASUK'),
      JAM_KELUAR: data.get('JAM_KELUAR'),
      TANGGAL: data.get('TANGGAL'),
      ARRIVAL_STATUS: data.get('ARRIVAL_STATUS'),
      KETERANGAN: data.get('KETERANGAN'),
      SELFIE_IMAGE: data.get('SELFIE_IMAGE'),
      LATITUDE: data.get('LATITUDE'),
      LONGITUDE: data.get('LONGITUDE'),
      BROWSER_INFO: data.get('BROWSER_INFO'),
      IP_ADDRESS: data.get('IP_ADDRESS')
    };

    const response = await supabaseService.saveSupplierVisit(data);
    console.log("Supabase response:", response);
    return response;
  } catch (error) {
    console.error("Supabase error:", error);
    throw new Error(`Gagal menyimpan ke database: ${error.message}`);
  }
}

/**
 * Kirim data ke Google Sheets via Apps Script
 * @param {FormData} data - Form data yang akan dikirim
 */
async function sendDataToGoogleSheets(data) {
  const response = await fetch(GOOGLE_SHEETS_API, {
    method: 'POST',
    body: data
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.text();
  console.log("Server response:", result);
  
  return result;
}

// ===== UTILITY FUNCTIONS =====
/**
 * Format time untuk display (HH:MM)
 * @param {number} hours - Jam (0-23)
 * @param {number} minutes - Menit (0-59)
 * @returns {string} Formatted time string
 */
function formatTime(hours, minutes) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Hitung selisih menit antara dua waktu
 * @param {number} time1 - Waktu pertama dalam menit
 * @param {number} time2 - Waktu kedua dalam menit
 * @returns {number} Selisih dalam menit (positif jika time1 lebih besar)
 */
function calculateTimeDifference(time1, time2) {
  return time1 - time2;
}
