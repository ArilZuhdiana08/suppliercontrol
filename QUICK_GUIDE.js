#!/usr/bin/env node

/**
 * QUICK REFERENCE GUIDE
 * Supplier Control Application
 */

// ============================================================
// FILE LOCATIONS & PURPOSES
// ============================================================

/**
 * 📄 HTML & STYLING
 * 
 * index.html (122 lines)
 *   └─ Main entry point - clean, no logic
 *   └─ Only HTML structure and external script links
 *
 * style.css (300+ lines)
 *   └─ All styling including gradients and animations
 *   └─ Responsive design for all devices
 */

/**
 * 📦 JAVASCRIPT MODULES (js/ folder)
 * 
 * config.js (35 lines)
 *   ├─ WAKTU_REFERENSI: Supplier schedules
 *   ├─ GOOGLE_SHEETS_API: API endpoint
 *   ├─ TOLERANCE_MINUTES: 10 minute tolerance
 *   └─ EARLY_ARRIVAL_MINUTES: 30 minute early window
 *
 * camera.js (250+ lines)
 *   ├─ initFaceDetection(): Load TensorFlow model
 *   ├─ startCamera(): Open camera + start detection
 *   ├─ stopCamera(): Close camera
 *   ├─ detectFaces(): Real-time detection loop
 *   ├─ captureSelfie(): Take photo
 *   ├─ useSelfie(): Confirm + auto-fill date
 *   ├─ retakeSelfie(): Restart capture
 *   ├─ isSelfieConfirmed(): Check status
 *   └─ resetSelfieState(): Clear data after submit
 *
 * form.js (140+ lines)
 *   ├─ handleFormSubmit(): Main form handler
 *   ├─ calculateArrivalStatus(): Determine on-time status
 *   ├─ sendDataToGoogleSheets(): Submit to API
 *   ├─ formatTime(): Display time format
 *   └─ calculateTimeDifference(): Time math
 */

// ============================================================
// COMMON TASKS & HOW TO DO THEM
// ============================================================

/**
 * ❓ HOW TO: Add a new supplier
 * 
 * 1. Open: js/config.js
 * 2. Find: WAKTU_REFERENSI object
 * 3. Add: "PT. NEW_COMPANY": "HH:MM" (or "HH:MM; HH:MM" for multiple times)
 * 4. Also update: index.html <select> options
 * 
 * Example:
 *   "PT. NEW_COMPANY": "08:30"        // Single schedule
 *   "PT. NEW_COMPANY": "08:30; 14:00" // Multiple times
 */

/**
 * ❓ HOW TO: Change tolerance minutes
 * 
 * 1. Open: js/config.js
 * 2. Find: TOLERANCE_MINUTES = 10
 * 3. Change: 10 to your desired minutes
 * 
 * Example:
 *   const TOLERANCE_MINUTES = 15; // 15 minute tolerance
 */

/**
 * ❓ HOW TO: Update Google Sheets API
 * 
 * 1. Open: js/config.js
 * 2. Find: GOOGLE_SHEETS_API
 * 3. Replace: URL with your new Apps Script endpoint
 * 
 * Example:
 *   const GOOGLE_SHEETS_API = "https://script.google.com/macros/s/YOUR_NEW_KEY/exec";
 */

/**
 * ❓ HOW TO: Change UI colors
 * 
 * 1. Open: style.css
 * 2. Find: :root or color definitions
 * 3. Change: #c8102e (red) to your color
 * 4. Update: Gradient colors in body background
 * 
 * Main color: #c8102e (current red)
 * Gradient uses: #c8102e, #e74c3c, #ff6b6b
 */

/**
 * ❓ HOW TO: Debug face detection
 * 
 * 1. Open browser console (F12)
 * 2. Look for: "Face detection initialized successfully"
 * 3. Check: "Error detecting faces" messages
 * 4. Verify: TensorFlow.js library loaded in Network tab
 * 5. Test: Camera access permission granted
 */

/**
 * ❓ HOW TO: View form data before submit
 * 
 * 1. Open js/form.js
 * 2. Find: handleFormSubmit() function
 * 3. Add before sendDataToGoogleSheets():
 *    console.log('Form data:', Object.fromEntries(data));
 * 4. Check browser console F12 for output
 */

/**
 * ❓ HOW TO: Add email notification
 * 
 * 1. Create Google Apps Script trigger on form submit
 * 2. In script: use MailApp.sendEmail()
 * 3. Or use IFTTT integration with webhook
 * 4. Alternative: Use Google Sheets add-on
 */

// ============================================================
// STATUS CODES EXPLAINED
// ============================================================

/**
 * ARRIVAL STATUS VALUES
 * 
 * "Tepat Waktu"
 *   └─ User arrived on time or before schedule
 *   └─ Selfie time <= reference time
 *
 * "Terlambat (Toleransi)"
 *   └─ User arrived late but within tolerance (10 min)
 *   └─ reference time < selfie time <= reference time + 10 min
 *
 * "Delay"
 *   └─ User arrived more than 10 minutes late
 *   └─ selfie time > reference time + 10 min
 *   └─ OR no matching schedule found
 *
 * "Status Tidak Ditemukan"
 *   └─ Supplier not in WAKTU_REFERENSI
 */

// ============================================================
// TROUBLESHOOTING
// ============================================================

/**
 * ❌ Camera not working
 * 
 * Possible causes:
 *   1. Browser permission denied
 *      └─ Check browser settings, allow camera access
 *   2. HTTPS not enabled
 *      └─ Required for camera access (production)
 *   3. Camera already in use
 *      └─ Close other apps using camera
 *   4. Browser not supported
 *      └─ Use Chrome/Edge (recommended)
 */

/**
 * ❌ Face not detected
 * 
 * Possible causes:
 *   1. Face not visible to camera
 *      └─ Ensure good lighting, face in center
 *   2. Face too small/far away
 *      └─ Move closer to camera
 *   3. Multiple faces
 *      └─ Only one face should be visible
 *   4. TensorFlow not loaded
 *      └─ Check browser console for errors
 */

/**
 * ❌ Data not sent to Google Sheets
 * 
 * Possible causes:
 *   1. Selfie not taken
 *      └─ Alert message says "Ambil selfie terlebih dahulu"
 *   2. Supplier not selected
 *      └─ Validate form before submit
 *   3. API endpoint wrong
 *      └─ Check GOOGLE_SHEETS_API in config.js
 *   4. Apps Script error
 *      └─ Check Apps Script logs for errors
 *   5. Network issue
 *      └─ Check browser Network tab in F12
 */

/**
 * ❌ Date not auto-filling
 * 
 * Possible causes:
 *   1. Selfie not confirmed
 *      └─ Click "Gunakan Selfie" button
 *   2. Browser time wrong
 *      └─ Check system clock
 *   3. Date input field issue
 *      └─ Check browser console for errors
 */

// ============================================================
// TESTING CHECKLIST
// ============================================================

/**
 * ✅ FUNCTIONALITY TEST
 * 
 * [ ] Camera starts and displays video
 * [ ] Face detection shows "✅ Ya" when face visible
 * [ ] Face detection shows "❌ Tidak" when no face
 * [ ] Selfie capture saves image
 * [ ] Selfie preview displays
 * [ ] "Gunakan Selfie" auto-fills date
 * [ ] Supplier dropdown works
 * [ ] Form submission triggers
 * [ ] Alert shows arrival status
 * [ ] Data appears in Google Sheets
 * [ ] Form resets after successful submit
 */

/**
 * ✅ STATUS CALCULATION TEST
 * 
 * Schedule: 08:00
 * 
 * [ ] Selfie at 07:50 → "Tepat Waktu"
 * [ ] Selfie at 08:00 → "Tepat Waktu"
 * [ ] Selfie at 08:05 → "Terlambat (Toleransi)"
 * [ ] Selfie at 08:10 → "Terlambat (Toleransi)"
 * [ ] Selfie at 08:15 → "Delay"
 * [ ] Selfie at 09:00 → "Delay"
 */

/**
 * ✅ MOBILE TEST
 * 
 * [ ] Camera works on mobile
 * [ ] Layout responsive
 * [ ] Buttons tap-able
 * [ ] Touch friendly
 * [ ] Performance good
 */

/**
 * ✅ BROWSER TEST
 * 
 * [ ] Chrome (latest)
 * [ ] Firefox (latest)
 * [ ] Safari (latest)
 * [ ] Edge (latest)
 * [ ] Mobile Safari
 * [ ] Mobile Chrome
 */

// ============================================================
// PERFORMANCE TIPS
// ============================================================

/**
 * 🚀 OPTIMIZATION NOTES
 * 
 * Face Detection Loop:
 *   └─ Current: 500ms interval
 *   └─ Faster: 300ms (more CPU)
 *   └─ Slower: 1000ms (less responsive)
 *
 * Video Resolution:
 *   └─ Current: 1280x720 ideal
 *   └─ Can adjust in camera.js startCamera()
 *
 * Base64 Images:
 *   └─ Stored in hidden form field
 *   └─ Can cause memory spike
 *   └─ Consider streaming direct to server
 *
 * Google Sheets API:
 *   └─ May timeout on large images
 *   └─ Consider compressing before send
 */

// ============================================================
// FILE SIZES & LOAD TIMES
// ============================================================

/**
 * ESTIMATED SIZES
 * 
 * index.html:      ~4 KB
 * style.css:       ~15 KB
 * config.js:       ~1 KB
 * camera.js:       ~10 KB
 * form.js:         ~6 KB
 * ────────────────────
 * Total (gzipped):  ~10 KB
 * 
 * External:
 *   TensorFlow:    ~1.2 MB (first load, cached)
 *   Face-detection: ~0.3 MB (first load, cached)
 */

// ============================================================
// QUICK LINKS & RESOURCES
// ============================================================

/**
 * 📚 DOCUMENTATION FILES
 * 
 * README.md         - Project overview & features
 * STRUCTURE.md      - Technical architecture & data flow
 * REFACTORING.md    - Refactoring notes & benefits
 * QUICK_GUIDE.js    - This file! Quick reference
 */

/**
 * 🔗 EXTERNAL RESOURCES
 * 
 * TensorFlow.js:
 *   https://www.tensorflow.org/js
 *   https://github.com/tensorflow/tfjs
 *
 * Face Detection:
 *   https://github.com/tensorflow/tfjs-models/tree/master/face-detection
 *   BlazeFace Model: https://github.com/google/mediapipe
 *
 * Google Apps Script:
 *   https://script.google.com
 *   Docs: https://developers.google.com/apps-script
 *
 * MDN Web Docs:
 *   Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 *   MediaDevices: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
 */

// ============================================================
// CONTACT & SUPPORT
// ============================================================

/**
 * 👤 DEVELOPMENT TEAM
 * 
 * PT. Bonecom Tricom Development Team
 * 
 * For issues or questions:
 *   1. Check browser console (F12) for errors
 *   2. Review STRUCTURE.md for architecture
 *   3. Check troubleshooting section above
 *   4. Review config.js for settings
 */

/**
 * 📋 VERSION HISTORY
 * 
 * v2.0 (Dec 4, 2025)
 *   ✅ Refactored to modular architecture
 *   ✅ Added comprehensive documentation
 *   ✅ Improved code organization
 *   ✅ Clean HTML, CSS, and JavaScript separation
 *
 * v1.0
 *   ✅ Initial implementation
 *   └─ Face detection integration
 *   └─ Google Sheets submission
 *   └─ Arrival status calculation
 */

// ============================================================
// END OF QUICK REFERENCE
// ============================================================

console.log("📚 Quick Reference Guide Loaded");
console.log("For help, check README.md and STRUCTURE.md");
