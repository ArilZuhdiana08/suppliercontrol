/**
 * PROJECT STRUCTURE & MODULE DOCUMENTATION
 * Supplier Control - PT. BONECOM TRICOM
 */

// ============================================================
// FOLDER STRUCTURE
// ============================================================
/*
Supplier-BTI/
├── index.html              # Main HTML entry point
├── style.css               # Global stylesheet
├── README.md               # Project documentation
├── js/
│   ├── config.js          # Configuration & constants
│   ├── camera.js          # Camera & face detection module
│   └── form.js            # Form & submission module
└── assets/
    └── header.png         # Header image
*/

// ============================================================
// MODULE: config.js
// ============================================================
/*
EXPORTS:
  - WAKTU_REFERENSI (Object): Supplier schedule reference
  - GOOGLE_SHEETS_API (String): API endpoint
  - TOLERANCE_MINUTES (Number): Keterlambatan tolerance
  - EARLY_ARRIVAL_MINUTES (Number): Early arrival window
*/

// ============================================================
// MODULE: camera.js
// ============================================================
/*
GLOBAL VARIABLES:
  - detector: TensorFlow.js face detection model
  - videoStream: MediaStream dari kamera
  - isCameraRunning: Boolean flag
  - faceDetectionIntervalId: Interval ID
  - selfieStartTime: Date saat kamera dimulai
  - captureSelfieTime: Date saat selfie diambil
  - selfieConfirmed: Boolean flag untuk konfirmasi selfie

PUBLIC FUNCTIONS:
  - initFaceDetection(): Initialize face detection model
  - setupCameraEventListeners(): Setup event listeners
  - startCamera(): Buka kamera dan mulai detection
  - stopCamera(): Matikan kamera
  - detectFaces(): Real-time face detection loop
  - captureSelfie(): Capture foto dari video
  - useSelfie(): Confirm dan gunakan selfie
  - retakeSelfie(): Ambil selfie ulang
  - isSelfieConfirmed(): Check selfie status
  - resetSelfieState(): Reset state setelah submission

INTERNAL FUNCTIONS:
  - updateSessionDuration(): Update durasi session display
*/

// ============================================================
// MODULE: form.js
// ============================================================
/*
DOM SELECTORS:
  - supplierForm: #supplier-form element

EVENT LISTENERS:
  - Form submit event

PUBLIC FUNCTIONS:
  - handleFormSubmit(e): Main form submission handler
  - calculateArrivalStatus(supplier, datetime): Hitung status
  - sendDataToGoogleSheets(data): Kirim ke API
  - formatTime(hours, minutes): Format waktu
  - calculateTimeDifference(time1, time2): Hitung selisih

INTERNAL FUNCTIONS:
  - setupFormEventListeners(): Setup listeners
*/

// ============================================================
// DATA FLOW
// ============================================================
/*
1. USER TAKES SELFIE
   └─> camera.js: startCamera()
       └─> detectFaces() [loop]
           └─> captureSelfie() [on click]
               └─> useSelfie() [on click]
                   └─> Store in form hidden fields
                   └─> Auto-fill date fields
                   └─> Set selfieConfirmed = true

2. USER SUBMITS FORM
   └─> form.js: handleFormSubmit()
       └─> Validate selfieConfirmed
       └─> calculateArrivalStatus()
           └─> Parse supplier schedule
           └─> Compare with selfie time
           └─> Return status
       └─> Append status to FormData
       └─> sendDataToGoogleSheets()
           └─> Fetch to API
       └─> On success: reset form and state
*/

// ============================================================
// ARRIVAL STATUS CALCULATION LOGIC
// ============================================================
/*
INPUTS:
  - supplier: Nama supplier dari dropdown
  - actualDatetimeStr: ISO datetime dari selfie

PROCESS:
  1. Get reference time(s) dari WAKTU_REFERENSI
  2. Parse multiple times (jika ada; separator)
  3. Convert selfie time to minutes
  4. For each reference time:
     a. Calculate tolerance window (ref + 10 menit)
     b. Calculate early window (ref - 30 menit)
     c. Check if selfie time dalam range
     d. If yes, check if late or on-time
     e. Return appropriate status

OUTPUTS:
  - "Tepat Waktu": Datang tepat waktu atau lebih awal
  - "Terlambat (Toleransi)": Terlambat 1-10 menit
  - "Delay": Terlambat lebih dari 10 menit
  - "Status Tidak Ditemukan": Supplier tidak ditemukan
*/

// ============================================================
// INTEGRATION POINTS
// ============================================================
/*
1. HTML to JavaScript:
   - HTML memiliki id yang match dengan DOM selector di JS
   - Form fields bernama: SUPPLIER, TANGGAL, ACTUAL_DATETIME, etc
   - Hidden fields: selfie-data, verification-time, arrival-status

2. config.js to Other Modules:
   - camera.js: Tidak dependencies (standalone)
   - form.js: Menggunakan WAKTU_REFERENSI, TOLERANCE_MINUTES, etc

3. camera.js to form.js:
   - isSelfieConfirmed(): Form check status
   - resetSelfieState(): Form reset state
   - Hidden fields share data via DOM

4. Google Sheets Integration:
   - Endpoint: GOOGLE_SHEETS_API
   - Method: POST
   - Data: FormData (form fields + calculations)
   - Columns: SUPPLIER, TANGGAL, VERIFICATION_TIME, ARRIVAL_STATUS, etc
*/

// ============================================================
// ERROR HANDLING
// ============================================================
/*
Camera Errors:
  - getUserMedia() fails → Alert user, log error
  - Face detection error → Log, continue loop
  - Canvas error → Log, stop capture

Form Errors:
  - Selfie not taken → Alert validation message
  - Supplier not found → Return "Status Tidak Ditemukan"
  - API call fails → Alert error, log response

All errors logged to console.log() for debugging
*/

// ============================================================
// PERFORMANCE CONSIDERATIONS
// ============================================================
/*
1. Face Detection Loop: 500ms interval
   - Balances CPU usage vs responsiveness
   - Can be tuned in detectFaces() setInterval

2. Video Resolution: 1280x720 ideal
   - Good balance between quality and performance
   - Can be adjusted in startCamera()

3. Canvas Size: Dynamic based on video
   - Automatically scales to match video dimensions
   - Prevents memory leaks from huge images

4. Hidden Fields: Base64 images stored in DOM
   - Causes memory spike temporarily
   - Consider removing after submission for production
*/

// ============================================================
// BROWSER REQUIREMENTS
// ============================================================
/*
1. MediaDevices API (Camera access)
2. Canvas API (Image capture)
3. FormData API
4. Fetch API
5. ES6+ JavaScript support (const, arrow functions, etc)
6. TensorFlow.js library (loaded via CDN)
7. HTTPS (required for camera access in production)
*/
