/**
 * GOOGLE SHEETS DATABASE INTEGRATION GUIDE
 * Panduan lengkap menggunakan Google Sheets sebagai database
 * untuk aplikasi Supplier Control
 */

// ============================================================
// OVERVIEW - BAGAIMANA GOOGLE SHEETS BEKERJA
// ============================================================

/**
 * ARSITEKTUR SISTEM
 * 
 * User (Web Browser)
 *   ↓
 * Application (index.html + JavaScript)
 *   ↓
 * Google Apps Script (Web Handler)
 *   ↓
 * Google Sheets (Database)
 * 
 * Alur data:
 * 1. User submit form di aplikasi
 * 2. JavaScript kirim data ke Google Apps Script
 * 3. Apps Script menerima dan process data
 * 4. Apps Script insert data ke Google Sheets
 * 5. Data tersimpan di spreadsheet
 * 6. User bisa lihat/analisa data di Sheets
 */

// ============================================================
// SETUP GOOGLE SHEETS (First Time)
// ============================================================

/**
 * STEP 1: Create Google Sheet
 * 
 * 1. Buka: https://sheets.google.com
 * 2. Create New Spreadsheet
 * 3. Name: "Supplier Control Database" (atau nama lain)
 * 4. Buat columns sesuai data yang dikirim:
 * 
 *    Column A: SUPPLIER
 *    Column B: TANGGAL
 *    Column C: ACTUAL_DATETIME
 *    Column D: VERIFICATION_TIME
 *    Column E: ARRIVAL_STATUS
 *    Column F: SELFIE_DATA (opsional, atau bisa di sheet terpisah)
 *    Column G: TIMESTAMP (auto-generated)
 * 
 * 5. First row: Header names (seperti di atas)
 * 6. Row 2 onwards: Data akan masuk otomatis
 */

/**
 * STEP 2: Create Google Apps Script
 * 
 * 1. Di sheet Anda, klik: Tools → Script Editor
 * 2. Hapus code template yang ada
 * 3. Copy-paste code dari bawah (SAMPLE GOOGLE APPS SCRIPT)
 * 4. Ubah SHEET_ID sesuai spreadsheet Anda
 * 5. Deploy sebagai "New Deployment" → "Web app"
 * 6. Pilih "Execute as: Your Email"
 * 7. Pilih "Who has access: Anyone"
 * 8. Copy deployment URL → Ini API endpoint Anda!
 * 9. Update di config.js: GOOGLE_SHEETS_API = "URL Anda"
 */

/**
 * STEP 3: Get Sheet ID
 * 
 * Sheet ID ada di URL:
 * https://docs.google.com/spreadsheets/d/SHEET_ID_INI/edit
 * 
 * Contoh:
 * https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
 *                                      └─ SHEET_ID ─┘
 * 
 * Copy ID ini ke Apps Script code: const SHEET_ID = "...";
 */

// ============================================================
// SAMPLE GOOGLE APPS SCRIPT CODE
// ============================================================

/**
 * Paste code ini ke Google Apps Script Editor:
 * 
 * ──────────────────────────────────────────────────────────
 * 
function doPost(e) {
  try {
    // Get sheet
    const ss = SpreadsheetApp.openById("SHEET_ID_ANDA");
    const sheet = ss.getSheetByName("Sheet1");
    
    // Get form data
    const params = e.parameter;
    
    // Prepare row data
    const newRow = [
      params.SUPPLIER || "",
      params.TANGGAL || "",
      params.ACTUAL_DATETIME || "",
      params.VERIFICATION_TIME || "",
      params.ARRIVAL_STATUS || "",
      new Date().toLocaleString('id-ID') // Timestamp
    ];
    
    // Append to sheet
    sheet.appendRow(newRow);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Data berhasil disimpan",
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

 * ──────────────────────────────────────────────────────────
 */

// ============================================================
// DATA STRUCTURE - FIELD YANG DISIMPAN
// ============================================================

/**
 * KOLOM DI GOOGLE SHEETS
 * 
 * Column A: SUPPLIER
 *   ├─ Data: Nama supplier (e.g., "PT. TENMA INDONESIA")
 *   ├─ Type: Text
 *   └─ Example: PT. TENMA INDONESIA
 * 
 * Column B: TANGGAL
 *   ├─ Data: Tanggal kunjungan (YYYY-MM-DD format)
 *   ├─ Type: Date
 *   └─ Example: 2025-12-04
 * 
 * Column C: ACTUAL_DATETIME
 *   ├─ Data: ISO datetime saat selfie (waktu arrival actual)
 *   ├─ Type: Datetime
 *   └─ Example: 2025-12-04T08:15:30.000Z
 * 
 * Column D: VERIFICATION_TIME
 *   ├─ Data: ISO datetime saat verifikasi wajah
 *   ├─ Type: Datetime
 *   └─ Example: 2025-12-04T08:15:30.000Z
 * 
 * Column E: ARRIVAL_STATUS
 *   ├─ Data: Status kedatangan
 *   ├─ Type: Text
 *   ├─ Possible values:
 *   │  ├─ "Tepat Waktu"
 *   │  ├─ "Terlambat (Toleransi)"
 *   │  └─ "Delay"
 *   └─ Example: Tepat Waktu
 * 
 * Column F: TIMESTAMP
 *   ├─ Data: Waktu data di-insert ke sheets
 *   ├─ Type: Datetime
 *   └─ Auto-generated oleh Apps Script
 */

/**
 * OPTIONAL: Menyimpan Selfie Image
 * 
 * Karena image base64 sangat besar, ada beberapa opsi:
 * 
 * OPSI 1: Simpan di Google Drive (Recommended)
 *   ├─ Convert base64 → Blob
 *   ├─ Save ke Google Drive folder
 *   ├─ Store file link di Sheets
 *   └─ Hemat space dan faster
 * 
 * OPSI 2: Simpan base64 string (Simple tapi slow)
 *   ├─ Copy base64 langsung ke Sheets
 *   ├─ File akan sangat besar
 *   ├─ Query jadi slow
 *   └─ Not recommended untuk production
 * 
 * OPSI 3: Upload ke cloud storage (Professional)
 *   ├─ Use Firebase Storage atau AWS S3
 *   ├─ Store URL di Sheets
 *   ├─ Terpisah dan efficient
 *   └─ Best practice untuk production
 */

// ============================================================
// HOW DATA FLOWS
// ============================================================

/**
 * FLOW DIAGRAM
 * 
 * 1. USER TAKES SELFIE
 *    └─ browser: captureSelfie() in camera.js
 *       └─ Convert frame → base64 image
 *       └─ Store in hidden field: #selfie-data
 *       └─ Store time in: #actual-datetime
 * 
 * 2. USER FILLS FORM
 *    ├─ Select supplier
 *    ├─ Date auto-filled
 *    └─ All data in form ready
 * 
 * 3. USER SUBMITS FORM
 *    └─ JavaScript: handleFormSubmit() in form.js
 *       ├─ Get all form data
 *       ├─ Calculate arrival status
 *       ├─ Create FormData object
 *       └─ POST to Google Apps Script
 * 
 * 4. GOOGLE APPS SCRIPT RECEIVES
 *    └─ doPost(e) function triggered
 *       ├─ Get spreadsheet by ID
 *       ├─ Extract parameters from request
 *       ├─ Prepare row array
 *       └─ appendRow() → insert ke Sheets
 * 
 * 5. GOOGLE SHEETS STORES
 *    └─ New row added to spreadsheet
 *       ├─ Column A: Supplier name
 *       ├─ Column B: Date
 *       ├─ Column C: DateTime arrival
 *       ├─ Column D: Verification time
 *       ├─ Column E: Status
 *       └─ Column F: Timestamp
 * 
 * 6. USER SEES CONFIRMATION
 *    └─ Alert: "Data berhasil dikirim!"
 *       └─ Form resets
 *       └─ Ready for next entry
 * 
 * 7. MANAGER VIEWS DATA (OPTIONAL)
 *    └─ Open Google Sheets
 *       ├─ See all entries
 *       ├─ Create pivot tables
 *       ├─ Make charts
 *       └─ Export to Excel/PDF
 */

// ============================================================
// ACCESSING THE DATA
// ============================================================

/**
 * VIEW DATA IN GOOGLE SHEETS
 * 
 * 1. Open your spreadsheet
 * 2. Data appears as new rows automatically
 * 3. Can see:
 *    - Supplier name
 *    - Date of visit
 *    - Actual arrival time
 *    - Status (on-time, late, etc)
 *    - When data was recorded
 * 
 * REAL-TIME VIEW
 * ├─ Data visible immediately after submission
 * ├─ No need to refresh (sometimes takes 5-10 seconds)
 * └─ All responses timestamped
 */

/**
 * ANALYZE DATA IN GOOGLE SHEETS
 * 
 * 1. CREATE PIVOT TABLE
 *    └─ Data → Pivot Table
 *       └─ Rows: SUPPLIER
 *       └─ Values: Count of ARRIVAL_STATUS
 *       └─ See: On-time vs late by supplier
 * 
 * 2. CREATE CHARTS
 *    └─ Insert → Chart
 *       ├─ Bar chart: On-time percentage
 *       ├─ Pie chart: Status distribution
 *       ├─ Timeline: Arrivals per day
 *       └─ Compare suppliers
 * 
 * 3. FILTERS & SORTING
 *    └─ Click Data → Create a filter
 *       ├─ Filter by supplier
 *       ├─ Filter by status
 *       ├─ Filter by date range
 *       └─ Sort any column
 * 
 * 4. CONDITIONAL FORMATTING
 *    └─ Format → Conditional formatting
 *       ├─ Highlight "Delay" in red
 *       ├─ Highlight "Tepat Waktu" in green
 *       └─ Custom color rules
 */

/**
 * EXPORT DATA
 * 
 * EXPORT TO EXCEL
 * └─ File → Download → Excel (.xlsx)
 *    └─ Open in Microsoft Excel
 *    └─ Do additional analysis
 *    └─ Share with others
 * 
 * EXPORT TO PDF
 * └─ File → Download → PDF Document
 *    └─ Print-friendly format
 *    └─ Share via email
 * 
 * EXPORT TO CSV
 * └─ File → Download → CSV (.csv)
 *    └─ Import to other systems
 *    └─ Use in Python/SQL queries
 */

// ============================================================
// ADVANTAGES OF GOOGLE SHEETS
// ============================================================

/**
 * ✅ PROS OF USING GOOGLE SHEETS AS DATABASE
 * 
 * 1. FREE & SIMPLE
 *    ├─ No backend server needed
 *    ├─ No database setup
 *    ├─ No IT infrastructure
 *    └─ Perfect for small to medium projects
 * 
 * 2. EASY TO SETUP
 *    ├─ No coding required (just copy-paste Apps Script)
 *    ├─ Deploy in 5 minutes
 *    ├─ No complex configuration
 *    └─ Anyone can manage it
 * 
 * 3. REAL-TIME VIEWING
 *    ├─ See data as it comes in
 *    ├─ Live updates
 *    ├─ No dashboard needed
 *    └─ Instant visibility
 * 
 * 4. BUILT-IN ANALYSIS
 *    ├─ Pivot tables
 *    ├─ Charts & graphs
 *    ├─ Filters & sorting
 *    └─ Conditional formatting
 * 
 * 5. SHARING & COLLABORATION
 *    ├─ Easy to share with team
 *    ├─ Multiple users can view/edit
 *    ├─ Comments & notes
 *    └─ Version history
 * 
 * 6. RELIABLE & SECURE
 *    ├─ Google's infrastructure
 *    ├─ Auto backups
 *    ├─ Access controls
 *    ├─ HTTPS encryption
 *    └─ SOC 2 compliant
 * 
 * 7. EXPORT & INTEGRATION
 *    ├─ Export to Excel
 *    ├─ Export to PDF
 *    ├─ Download as CSV
 *    ├─ API access available
 *    └─ Integrate with other tools
 */

/**
 * ❌ LIMITATIONS OF GOOGLE SHEETS
 * 
 * 1. SCALABILITY
 *    ├─ Max 10 million cells per sheet
 *    ├─ Performance slows with large datasets
 *    ├─ Not ideal for 1M+ records
 *    └─ Consider SQL database for enterprise
 * 
 * 2. PERFORMANCE
 *    ├─ Apps Script can be slow (1-5 seconds)
 *    ├─ Not for real-time high-frequency data
 *    ├─ Limited by Google's quota
 *    └─ Query performance not optimized
 * 
 * 3. CONCURRENCY
 *    ├─ Multiple simultaneous writes can cause issues
 *    ├─ Not ideal for high concurrency
 *    ├─ Rate limiting applies
 *    └─ May get "Service temporarily disabled"
 * 
 * 4. QUERYING
 *    ├─ No SQL-like queries
 *    ├─ Have to download entire sheet to filter
 *    ├─ Limited query capabilities
 *    └─ Manual analysis needed
 * 
 * 5. STORAGE LIMITS
 *    ├─ Google Drive: 15 GB free (or more paid)
 *    ├─ Large images/files reduce available space
 *    └─ Need to manage storage manually
 */

// ============================================================
// WHEN TO USE GOOGLE SHEETS VS SQL DATABASE
// ============================================================

/**
 * USE GOOGLE SHEETS IF:
 * 
 * ✓ Small to medium project (< 10,000 records)
 * ✓ Infrequent updates (< 100/day)
 * ✓ Simple data structure
 * ✓ Need quick setup
 * ✓ Limited budget
 * ✓ Non-technical team managing data
 * ✓ Simple reporting needs
 * 
 * TYPICAL USE CASE: Your Supplier Control app ✓
 * └─ 20-30 entries per day
 * └─ Simple data structure
 * └─ Easy to view/analyze
 * └─ No complex queries needed
 */

/**
 * USE SQL DATABASE (MySQL, PostgreSQL) IF:
 * 
 * ✗ Large dataset (> 100,000 records)
 * ✗ High frequency updates (> 1,000/second)
 * ✗ Complex queries needed
 * ✗ Need advanced security
 * ✗ Real-time data synchronization
 * ✗ Multiple applications accessing data
 * ✗ Complex reporting/analytics
 * 
 * TYPICAL USE CASE: Enterprise application
 * └─ Multiple locations, thousands of entries/day
 * └─ Complex data relationships
 * └─ Advanced analytics needed
 * └─ 24/7 high availability required
 */

// ============================================================
// OPTIMIZATION TIPS
// ============================================================

/**
 * UNTUK BETTER PERFORMANCE:
 * 
 * 1. SPLIT SELFIE DATA
 *    ├─ Store selfie in separate sheet (or Google Drive)
 *    ├─ Store only link/reference in main sheet
 *    ├─ Reduces sheet size significantly
 *    └─ Improves query speed
 * 
 * 2. ARCHIVE OLD DATA
 *    ├─ Move old data to Archive sheet
 *    ├─ Keep main sheet lean
 *    ├─ Do this quarterly/yearly
 *    └─ Faster performance
 * 
 * 3. LIMIT COLUMNS
 *    ├─ Only store essential data
 *    ├─ Don't store redundant info
 *    ├─ Can always calculate from raw data
 *    └─ Simpler & faster
 * 
 * 4. USE MULTIPLE SHEETS
 *    ├─ Current month data in main sheet
 *    ├─ Archive old data in separate sheets
 *    ├─ Easier navigation & analysis
 *    └─ Better organization
 * 
 * 5. BACKUP REGULARLY
 *    ├─ Download monthly backup as Excel
 *    ├─ Store in Google Drive folder
 *    ├─ Create another copy for safety
 *    └─ Never lose data
 */

// ============================================================
// TROUBLESHOOTING GOOGLE SHEETS
// ============================================================

/**
 * ❓ DATA NOT APPEARING IN SHEETS
 * 
 * Possible causes:
 *   1. Apps Script URL wrong in config.js
 *      └─ Check: GOOGLE_SHEETS_API value
 *      └─ Fix: Update with correct URL
 * 
 *   2. Sheet ID wrong in Apps Script
 *      └─ Check: SHEET_ID in Apps Script code
 *      └─ Fix: Get correct ID from URL
 * 
 *   3. Apps Script not deployed
 *      └─ Check: New Deployment created?
 *      └─ Fix: Deploy as "Web app"
 * 
 *   4. Permission issues
 *      └─ Check: Execute as your email?
 *      └─ Check: Anyone can access?
 *      └─ Fix: Update deployment settings
 * 
 *   5. Network issue
 *      └─ Check: F12 → Network tab
 *      └─ Check: POST request successful?
 *      └─ Fix: Check browser console for errors
 */

/**
 * ❓ GETTING "Service Temporarily Disabled"
 * 
 * This happens when:
 *   └─ Too many requests in short time
 *   └─ Google rate limiting triggered
 * 
 * Solution:
 *   ├─ Wait a few minutes
 *   ├─ Try again
 *   └─ Spread out requests over time
 */

/**
 * ❓ SLOW DATA INSERTION
 * 
 * Typical speed:
 *   └─ 1-5 seconds per insert
 *   └─ This is normal for Google Apps Script
 * 
 * To improve:
 *   ├─ Remove unnecessary columns
 *   ├─ Don't store large base64 images
 *   ├─ Archive old data regularly
 *   └─ Use batch operations (advanced)
 */

// ============================================================
// ADVANCED: IMAGE HANDLING
// ============================================================

/**
 * HOW TO HANDLE SELFIE IMAGE
 * 
 * CURRENT: Base64 in hidden field
 *   ├─ Very large (500KB+)
 *   ├─ Slow to send
 *   ├─ Not ideal
 *   └─ Only for simple cases
 * 
 * BETTER: Save to Google Drive
 * 
 * Modified Apps Script:
 * 
 *   function doPost(e) {
 *     try {
 *       const params = e.parameter;
 *       const selfieBase64 = params.SELFIE_DATA;
 *       
 *       // Convert base64 to blob
 *       const blob = Utilities.newBlob(
 *         Utilities.base64Decode(selfieBase64.split(',')[1]),
 *         'image/jpeg',
 *         'selfie_' + params.SUPPLIER + '_' + Date.now() + '.jpg'
 *       );
 *       
 *       // Save to Google Drive
 *       const folder = DriveApp.getFolderById('FOLDER_ID');
 *       const file = folder.createFile(blob);
 *       
 *       // Get file link
 *       const fileLink = file.getUrl();
 *       
 *       // Store link in sheet (not image)
 *       const ss = SpreadsheetApp.openById("SHEET_ID");
 *       const sheet = ss.getSheetByName("Sheet1");
 *       const newRow = [
 *         params.SUPPLIER,
 *         params.TANGGAL,
 *         params.ACTUAL_DATETIME,
 *         params.VERIFICATION_TIME,
 *         params.ARRIVAL_STATUS,
 *         fileLink,  // ← Link instead of base64
 *         new Date().toLocaleString('id-ID')
 *       ];
 *       sheet.appendRow(newRow);
 *       
 *       return ContentService.createTextOutput(...)
 *     } catch (error) {
 *       // error handling
 *     }
 *   }
 */

// ============================================================
// SUMMARY - CHEAT SHEET
// ============================================================

/**
 * SETUP CHECKLIST
 * 
 * [ ] 1. Create Google Sheet
 * [ ] 2. Add column headers (SUPPLIER, TANGGAL, etc)
 * [ ] 3. Create Apps Script trigger
 * [ ] 4. Copy-paste Apps Script code
 * [ ] 5. Update SHEET_ID in Apps Script
 * [ ] 6. Deploy as Web app
 * [ ] 7. Copy deployment URL
 * [ ] 8. Update GOOGLE_SHEETS_API in config.js
 * [ ] 9. Test by submitting form
 * [ ] 10. Check if data appears in Sheets
 * 
 * DONE! ✓ Database ready to use
 */

/**
 * QUICK LINKS
 * 
 * Google Sheets: https://sheets.google.com
 * Apps Script: https://script.google.com
 * Sheet ID: In URL between /d/ and /edit
 * Apps Script Docs: https://developers.google.com/apps-script
 * Sample Code: See SAMPLE above
 */

// ============================================================
// CONCLUSION
// ============================================================

/**
 * ✅ GOOGLE SHEETS IS PERFECT FOR:
 * 
 * Your Supplier Control application because:
 * 
 * 1. Simple setup - No backend needed
 * 2. Perfect for 20-30 daily entries
 * 3. Easy to view and analyze
 * 4. Free and reliable
 * 5. Can be done in 5 minutes
 * 6. No technical skills required
 * 7. Team can access anytime
 * 8. Real-time data visibility
 * 9. Built-in charts and pivot tables
 * 10. Can export to Excel anytime
 * 
 * Already integrated in your app! ✓
 * Just need to setup Google Sheet + Apps Script
 */
