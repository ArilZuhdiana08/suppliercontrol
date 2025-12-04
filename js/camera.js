/**
 * Camera and Face Detection Module
 * Mengelola akses kamera, deteksi wajah, dan capture selfie
 */

// ===== STATE VARIABLES =====
let detector = null;
let videoStream = null;
let isCameraRunning = false;
let faceDetectionIntervalId = null;
let selfieStartTime = null;
let captureSelfieTime = null;
let selfieConfirmed = false;

// ===== DOM ELEMENTS =====
const cameraFeed = document.getElementById('camera-feed');
const faceCanvas = document.getElementById('face-canvas');
const faceOverlay = document.getElementById('face-overlay');
const faceStatus = document.getElementById('face-status');
const faceDetected = document.getElementById('face-detected');
const selfieTime = document.getElementById('selfie-time');
const selfieDuration = document.getElementById('selfie-duration');
const startCameraBtn = document.getElementById('start-camera-btn');
const captureSelfieBtn = document.getElementById('capture-selfie-btn');
const stopCameraBtn = document.getElementById('stop-camera-btn');
const selfiePreview = document.getElementById('selfie-preview');
const capturedSelfie = document.getElementById('captured-selfie');
const useSelfieBtn = document.getElementById('use-selfie-btn');
const retakeSelfieBtn = document.getElementById('retake-selfie-btn');

// ===== INITIALIZATION =====
/**
 * Initialize face detection model on page load
 */
async function initFaceDetection() {
  try {
    detector = await faceDetection.createDetector(
      faceDetection.SupportedModels.BlazeFace
    );
    console.log("Face detection initialized successfully");
  } catch (error) {
    console.error("Error initializing face detection:", error);
  }
}

// Initialize on page load
window.addEventListener('load', () => {
  initFaceDetection();
  setupCameraEventListeners();
});

/**
 * Setup event listeners untuk camera buttons
 */
function setupCameraEventListeners() {
  startCameraBtn.addEventListener('click', startCamera);
  stopCameraBtn.addEventListener('click', stopCamera);
  captureSelfieBtn.addEventListener('click', captureSelfie);
  useSelfieBtn.addEventListener('click', useSelfie);
  retakeSelfieBtn.addEventListener('click', retakeSelfie);

  // Setup supplier select listener untuk enable/disable submit button
  const supplierSelect = document.getElementById('supplier-select');
  if (supplierSelect) {
    supplierSelect.addEventListener('change', updateSubmitButtonStatus);
  }
}

// ===== CAMERA FUNCTIONS =====
/**
 * Start camera dan mulai face detection
 */
async function startCamera() {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: 'user', 
        width: { ideal: 1280 }, 
        height: { ideal: 720 } 
      }
    });
    
    cameraFeed.srcObject = videoStream;
    isCameraRunning = true;
    selfieStartTime = new Date();

    startCameraBtn.disabled = true;
    stopCameraBtn.disabled = false;
    captureSelfieBtn.disabled = false;

    detectFaces();
  } catch (error) {
    alert('Tidak dapat mengakses kamera. Pastikan Anda mengizinkan akses kamera.');
    console.error('Error accessing camera:', error);
  }
}

/**
 * Stop camera dan hentikan face detection
 */
function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
  
  cameraFeed.srcObject = null;
  isCameraRunning = false;

  if (faceDetectionIntervalId) {
    clearInterval(faceDetectionIntervalId);
  }

  startCameraBtn.disabled = false;
  stopCameraBtn.disabled = true;
  captureSelfieBtn.disabled = true;
  faceStatus.textContent = 'Kamera dimatikan';
  faceDetected.textContent = '❌ Tidak';
}

/**
 * Detect wajah secara real-time menggunakan TensorFlow.js
 */
async function detectFaces() {
  faceDetectionIntervalId = setInterval(async () => {
    if (!isCameraRunning || !detector) return;

    try {
      const predictions = await detector.estimateFaces(cameraFeed, false);

      if (predictions.length > 0) {
        faceDetected.textContent = '✅ Ya';
        faceStatus.textContent = 'Wajah terdeteksi! Siap untuk difoto';
        faceStatus.className = 'face-status face-detected';
        faceOverlay.style.borderColor = '#4CAF50';
      } else {
        faceDetected.textContent = '❌ Tidak';
        faceStatus.textContent = 'Arahkan wajah ke kamera';
        faceStatus.className = 'face-status';
        faceOverlay.style.borderColor = '#ccc';
      }

      // Update durasi session
      updateSessionDuration();
    } catch (error) {
      console.error('Error detecting faces:', error);
    }
  }, 500);
}

/**
 * Update durasi session selfie
 */
function updateSessionDuration() {
  const now = new Date();
  const elapsedSeconds = Math.floor((now - selfieStartTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  selfieDuration.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Capture selfie dari video stream
 */
function captureSelfie() {
  const ctx = faceCanvas.getContext('2d');

  faceCanvas.width = cameraFeed.videoWidth;
  faceCanvas.height = cameraFeed.videoHeight;
  ctx.drawImage(cameraFeed, 0, 0);

  captureSelfieTime = new Date();
  const timeString = captureSelfieTime.toLocaleTimeString('id-ID');
  selfieTime.textContent = timeString;

  const imageData = faceCanvas.toDataURL('image/jpeg');
  capturedSelfie.src = imageData;
  selfiePreview.style.display = 'block';

  stopCamera();
}

/**
 * Confirm dan gunakan selfie yang sudah diambil
 */
function useSelfie() {
  selfieConfirmed = true;
  const imageData = capturedSelfie.src;
  
  // Set form data
  document.getElementById('selfie-data').value = imageData;
  document.getElementById('verification-time').value = captureSelfieTime.toISOString();
  document.getElementById('actual-datetime').value = captureSelfieTime.toISOString();

  // Display verification time
  const verificationDisplay = document.getElementById('verification-display');
  if (verificationDisplay) {
    verificationDisplay.value = captureSelfieTime.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  // Show selfie status box
  const selfieStatusBox = document.getElementById('selfie-status-box');
  if (selfieStatusBox) {
    selfieStatusBox.style.display = 'block';
  }

  // Auto-fill tanggal, bulan, tahun
  const day = captureSelfieTime.getDate();
  const month = captureSelfieTime.getMonth() + 1;
  const year = captureSelfieTime.getFullYear();

  document.getElementById('day-input').value = String(day).padStart(2, '0');
  document.getElementById('month-input').value = String(month).padStart(2, '0');
  document.getElementById('year-input').value = year;

  // Set tanggal hidden field (YYYY-MM-DD format)
  document.getElementById('tanggal-hidden').value = 
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  selfiePreview.style.display = 'none';
  startCameraBtn.disabled = false;
  
  // Enable/disable submit button based on supplier selection
  updateSubmitButtonStatus();
  
  alert('✅ Selfie berhasil disimpan! Silakan pilih supplier dan kirim data.');
}

/**
 * Ambil selfie ulang
 */
function retakeSelfie() {
  selfiePreview.style.display = 'none';
  faceDetected.textContent = '❌ Tidak';
  selfieTime.textContent = '--:--:--';
  selfieDuration.textContent = '0 detik';
  startCamera();
}

// ===== GETTER FUNCTIONS =====
/**
 * Get status selfie confirmation
 */
function isSelfieConfirmed() {
  return selfieConfirmed;
}

/**
 * Reset selfie state setelah form submitted
 */
function resetSelfieState() {
  selfieConfirmed = false;
  document.getElementById('selfie-data').value = '';
  document.getElementById('verification-time').value = '';
  document.getElementById('actual-datetime').value = '';
  document.getElementById('day-input').value = '';
  document.getElementById('month-input').value = '';
  document.getElementById('year-input').value = '';
  
  // Hide selfie status box
  const selfieStatusBox = document.getElementById('selfie-status-box');
  if (selfieStatusBox) {
    selfieStatusBox.style.display = 'none';
  }
  
  // Reset verification display
  const verificationDisplay = document.getElementById('verification-display');
  if (verificationDisplay) {
    verificationDisplay.value = '';
  }
  
  // Update submit button status
  updateSubmitButtonStatus();
}

/**
 * Update submit button status berdasarkan selfie dan supplier selection
 */
function updateSubmitButtonStatus() {
  const submitBtn = document.getElementById('submit-btn');
  const supplierSelect = document.getElementById('supplier-select');
  
  if (submitBtn && supplierSelect) {
    // Enable submit hanya jika selfie confirmed dan supplier dipilih
    const isEnabled = selfieConfirmed && supplierSelect.value !== '';
    submitBtn.disabled = !isEnabled;
  }
}
