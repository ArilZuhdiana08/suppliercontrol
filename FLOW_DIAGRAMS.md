# 📊 UNIFIED LAYOUT - FLOW DIAGRAM & VISUAL GUIDE

**Version:** 2.1.0  
**Date:** December 4, 2025

---

## 🎨 LAYOUT STRUCTURE

### Desktop View (1200px+)
```
┌─────────────────────────────────────────────────────────┐
│                    HEADER: PT. BONECOM                   │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                   UNIFIED SECTION                        │
│  ┌─────────────────────┬─────────────────────────────┐  │
│  │                     │                             │  │
│  │  CAMERA SECTION     │     FORM SECTION            │  │
│  │  (Left 50%)         │     (Right 50%)             │  │
│  │                     │                             │  │
│  │  ┌───────────────┐  │  ┌─────────────────────┐   │  │
│  │  │  Video Feed   │  │  │  Status Box ✅      │   │  │
│  │  │               │  │  │  (Green, when OK)   │   │  │
│  │  └───────────────┘  │  └─────────────────────┘   │  │
│  │                     │                             │  │
│  │  Face: ❌/✅        │  Supplier: [dropdown]       │  │
│  │  Time: 10:30:45     │  Day: 04 (auto-filled)      │  │
│  │  Duration: 0:05     │  Month: 12 (auto-filled)    │  │
│  │                     │  Year: 2025 (auto-filled)   │  │
│  │  [Start] [Capture]  │  Verification: 10:30:45     │  │
│  │  [Stop]             │                             │  │
│  │                     │  [Kirim Data] (ENABLED)     │  │
│  │  Preview (if taken) │  *Harus selfie & supplier   │  │
│  │  [Gunakan][Ambil]   │                             │  │
│  │                     │                             │  │
│  └─────────────────────┴─────────────────────────────┘  │
│                    Gap: 30px                             │
└──────────────────────────────────────────────────────────┘
```

### Mobile View (<1024px)
```
┌─────────────────────┐
│    HEADER: PT...    │
└─────────────────────┘

┌─────────────────────┐
│  CAMERA SECTION     │
│  (Full width 100%)  │
│                     │
│  ┌───────────────┐  │
│  │  Video Feed   │  │
│  └───────────────┘  │
│                     │
│  Face: ✅           │
│  Time: 10:30:45     │
│                     │
│  [Start Camera]     │
│  [Stop Camera]      │
│                     │
└─────────────────────┘
         Gap: 15px
┌─────────────────────┐
│  FORM SECTION       │
│  (Full width 100%)  │
│                     │
│  Status Box ✅      │
│  Supplier:[⏬ ]     │
│  Day: 04            │
│  Month: 12          │
│  Year: 2025         │
│  Time: 10:30:45     │
│                     │
│ [Kirim Data] FULL   │
│                     │
└─────────────────────┘
```

---

## 🔄 USER FLOW DIAGRAM

### Complete User Journey

```
START
  │
  ├─→ Page loads
  │     ├─ Camera section visible (left)
  │     ├─ Form section visible (right)
  │     ├─ Status box HIDDEN
  │     └─ Submit button DISABLED (gray)
  │
  ├─→ User clicks "Mulai Kamera"
  │     ├─ Camera starts
  │     ├─ Face detection active
  │     └─ "Ambil Selfie" button becomes clickable (when face detected)
  │
  ├─→ User clicks "Ambil Selfie"
  │     ├─ Image captured from video
  │     ├─ Preview shows
  │     └─ Buttons: "✅ Gunakan" | "🔄 Ambil Ulang"
  │
  ├─→ User clicks "✅ Gunakan"
  │     ├─ Status box APPEARS (green: "✅ Selfie Terverifikasi")
  │     ├─ Verification time fills: "10:30:45"
  │     ├─ Date auto-fills:
  │     │   ├─ Day: 04
  │     │   ├─ Month: 12
  │     │   └─ Year: 2025
  │     ├─ selfieConfirmed = true
  │     ├─ Submit button:
  │     │   ├─ Still DISABLED (if no supplier)
  │     │   └─ Becomes ENABLED (if supplier selected)
  │     └─ Alert: "✅ Selfie berhasil disimpan!"
  │
  ├─→ [Branch: If no supplier selected yet]
  │     ├─ Submit button = DISABLED (gray)
  │     └─ User sees hint: "*Harus selfie & supplier"
  │
  ├─→ User selects supplier
  │     ├─ Supplier value changes
  │     ├─ updateSubmitButtonStatus() called
  │     ├─ Check: selfieConfirmed && supplierValue
  │     └─ Submit button ENABLED (red gradient)
  │
  ├─→ User clicks "📤 Kirim Data"
  │     ├─ Validation 1: isSelfieConfirmed()? → YES ✓
  │     ├─ Validation 2: supplierValue? → YES ✓
  │     ├─ Calculate arrival status
  │     ├─ Send to Google Sheets
  │     ├─ Alert: "✅ Data berhasil dikirim!"
  │     ├─ Form reset:
  │     │   ├─ Status box HIDDEN
  │     │   ├─ Verification time cleared
  │     │   ├─ Date fields cleared
  │     │   ├─ Supplier dropdown reset
  │     │   ├─ selfieConfirmed = false
  │     │   └─ Submit button DISABLED
  │     └─ Ready for next entry
  │
  └─→ LOOP (user can enter new data)
```

---

## 🎛️ SUBMIT BUTTON STATE MACHINE

### Visual Representation

```
DISABLED STATE (Gray)
═════════════════════════════════════════════════════════

Initial:
  selfieConfirmed = false
  supplier = ""
  → [Kirim Data] DISABLED ⚫

User takes selfie:
  selfieConfirmed = true
  supplier = ""
  → [Kirim Data] DISABLED ⚫  (still no supplier)

User selects supplier:
  selfieConfirmed = true
  supplier = "PT. TENMA"
  → [Kirim Data] ENABLED 🔴 (both conditions met!)


ENABLED STATE (Red Gradient)
═════════════════════════════════════════════════════════

After supplier selected:
  selfieConfirmed = true
  supplier = "PT. TENMA"
  → [Kirim Data] ENABLED 🔴 (clickable!)

User hovers:
  → Color intensity increases ✨
  → Button lifts up slightly (translateY effect)

User clicks:
  → Form submits
  → Form resets
  → Back to DISABLED ⚫


LOGIC CODE
═════════════════════════════════════════════════════════

submitBtn.disabled = !(selfieConfirmed && supplierValue !== '')

This triggers when:
  1. User clicks "✅ Gunakan" → updateSubmitButtonStatus()
  2. User selects supplier → updateSubmitButtonStatus()
  3. User submits form → resetSelfieState() calls it
```

---

## 🎨 STATUS BOX ANIMATION

### Show Animation (When selfie confirmed)
```
Timeline:
0ms   → opacity: 0, transform: translateY(-10px)   [hidden]
         ↓ (animation: slideInDown 0.4s)
400ms → opacity: 1, transform: translateY(0)       [visible]

Visual:
┌──────────────────────────┐
│ [Sliding in from top]    │
│                          │
│ ✅ Selfie Terverifikasi  │ ← Green gradient
│                          │
└──────────────────────────┘
```

### Hide Animation (When form reset)
```
Instantly hidden:
display: none;

Result:
Status box disappears completely
```

---

## 📋 FORM AUTO-FILL SEQUENCE

### Timeline of Auto-Fill

```
Event: User clicks "✅ Gunakan Selfie"
Time: T=0

T+0ms:   captureSelfieTime = new Date()
         └─ Store exact timestamp when selfie taken

T+50ms:  Auto-fill tanggal
         ├─ day = captureSelfieTime.getDate()        → 04
         ├─ month = getMonth() + 1                   → 12
         ├─ year = getFullYear()                     → 2025
         └─ Update input values

T+100ms: Auto-fill waktu verifikasi
         └─ verificationDisplay = toLocaleTimeString('id-ID')
            → 10:30:45

T+150ms: Set hidden fields (for database)
         ├─ VERIFICATION_TIME = toISOString()
         │  → 2025-12-04T10:30:45.123Z
         ├─ ACTUAL_DATETIME = toISOString()
         │  → 2025-12-04T10:30:45.123Z
         └─ TANGGAL (YYYY-MM-DD)
            → 2025-12-04

All auto-fill complete! ✓
```

---

## 🎯 VALIDATION FLOW DIAGRAM

### Submit Validation Logic

```
                        User clicks [Kirim Data]
                                 ↓
                    ┌────────────────────────┐
                    │ Validation Chain       │
                    └────────────────────────┘
                                 ↓
                    Check 1: isSelfieConfirmed()?
                           ↙                    ↖
                        YES                      NO
                         ↓                        ↓
                   Continue ✓          Alert ⚠️: "Silakan ambil
                                       selfie terlebih dahulu"
                         ↓                        ↓
                    Check 2: supplierSelect.value?
                           ↙                    ↖
                        YES                      NO
                         ↓                        ↓
                   Continue ✓          Alert ⚠️: "Silakan pilih
                                       supplier"
                         ↓                        ↓
              Collect form data           STOP (return)
                         ↓
              Calculate arrival status
                         ↓
              Send to Google Sheets
                         ↓
              Success alert ✓
                         ↓
              Reset form & state
                         ↓
              Ready for next entry
```

---

## 📱 RESPONSIVE BREAKPOINTS

### CSS Grid Behavior

```
@media: width >= 1200px
┌─────────────────────────────────────┐
│ grid-template-columns: 1fr 1fr      │
│ gap: 30px                           │
│                                     │
│ [Camera 50%] [Form 50%]            │
└─────────────────────────────────────┘

@media: 1024px <= width < 1200px
┌─────────────────────────────────────┐
│ grid-template-columns: 1fr 1fr      │
│ gap: 20px                           │
│                                     │
│ [Camera 50%] [Form 50%]            │
└─────────────────────────────────────┘

@media: width < 1024px
┌──────────────────────┐
│ grid-template-columns: 1fr
│ gap: 15px              │
│                        │
│ [Camera 100%]          │
│ [Form 100%]            │
└──────────────────────┘
```

---

## 🔗 EVENT LISTENER CHAIN

### Events and Handlers

```
Input: User Action
  │
  ├─ startCameraBtn.click
  │   └─→ startCamera() → video stream starts
  │
  ├─ captureSelfieBtn.click
  │   └─→ captureSelfie() → image captured, preview shown
  │
  ├─ useSelfieBtn.click
  │   └─→ useSelfie()
  │       ├─ selfieConfirmed = true
  │       ├─ Show status box
  │       ├─ Fill verification time
  │       ├─ Fill date (day, month, year)
  │       └─ updateSubmitButtonStatus() → may ENABLE button
  │
  ├─ supplierSelect.change
  │   └─→ updateSubmitButtonStatus()
  │       ├─ Check: selfieConfirmed && supplier value
  │       ├─ If both true → Button ENABLED
  │       └─ If either false → Button DISABLED
  │
  └─ submiBttn.click
      └─→ handleFormSubmit()
          ├─ Validate selfie
          ├─ Validate supplier
          ├─ Calculate status
          └─ Send to Google Sheets
```

---

## 💾 DATA SUBMISSION FLOW

### From User to Google Sheets

```
User Action: Click [Kirim Data]
      ↓
JavaScript: handleFormSubmit()
      ↓
Collect FormData:
  ├─ SUPPLIER: "PT. TENMA INDONESIA"
  ├─ TANGGAL: "2025-12-04"
  ├─ ACTUAL_DATETIME: "2025-12-04T10:30:45.123Z"
  ├─ VERIFICATION_TIME: "2025-12-04T10:30:45.123Z"
  ├─ ARRIVAL_STATUS: "Tepat Waktu"
  └─ SELFIE_DATA: "data:image/jpeg;base64,..."
      ↓
Network: Fetch POST to Google Apps Script
  URL: GOOGLE_SHEETS_API (from config.js)
  Method: POST
  Body: FormData
      ↓
Google Apps Script: doPost(e)
  ├─ Receive parameters
  ├─ Parse FormData
  ├─ Create new row
  └─ Append to Google Sheets
      ↓
Google Sheets: Data stored
  ├─ Column A: SUPPLIER
  ├─ Column B: TANGGAL
  ├─ Column C: ACTUAL_DATETIME
  ├─ Column D: VERIFICATION_TIME
  ├─ Column E: ARRIVAL_STATUS
  ├─ Column F: SELFIE_DATA
  └─ Column G: TIMESTAMP (auto)
      ↓
Browser: Response received
  ├─ Status: success
  ├─ Show alert: "✅ Data berhasil dikirim!"
  └─ Reset form
      ↓
Ready for next entry
```

---

## 🎯 KEYBOARD & TOUCH INTERACTIONS

### Desktop (Keyboard)
```
TAB:  Navigate through form elements
      ├─ Tab 1: Supplier dropdown
      ├─ Tab 2: Camera button
      └─ Tab 3: Submit button

ENTER: Submit form
       └─ Triggers form submission

SPACE: Click button
       ├─ Start Camera
       ├─ Capture Selfie
       └─ Submit Form
```

### Mobile (Touch)
```
TAP:      Select elements
          ├─ Tap camera buttons
          ├─ Tap supplier dropdown
          └─ Tap submit button

SWIPE:    Scroll between sections (if needed)

HOLD:     Camera access permission
          └─ Allow/Deny popup
```

---

## 📊 CSS ANIMATION SUMMARY

### All Animations Used

```
1. slideDown (0.5s)
   From: opacity 0, translateY(-20px)
   To:   opacity 1, translateY(0)
   Usage: Header image

2. fadeInUp (0.6s)
   From: opacity 0, translateY(20px)
   To:   opacity 1, translateY(0)
   Usage: Camera & form sections

3. slideInDown (0.4s)
   From: opacity 0, translateY(-10px)
   To:   opacity 1, translateY(0)
   Usage: Status box when appearing

4. Transitions (0.3s ease)
   Applied to:
   ├─ input:focus → border-color, box-shadow
   ├─ button:hover → transform, box-shadow
   └─ All state changes
```

---

## ✅ TESTING VISUAL CHECKLIST

### What to Look For

```
✓ Camera section on LEFT side (desktop)
✓ Form section on RIGHT side (desktop)
✓ Both sections visible without scroll (desktop)
✓ Gap between sections looks good
✓ Status box is GREEN when shown
✓ Status box is HIDDEN when reset
✓ Verification time displays correctly
✓ Date fields show correct values
✓ Submit button is GRAY when disabled
✓ Submit button is RED when enabled
✓ Mobile: Camera on TOP, Form on BOTTOM
✓ Mobile: Full width, stacked layout
✓ All buttons responsive to touch
✓ Hover effects smooth
✓ No overflow or layout issues
✓ Text readable on all sizes
```

---

**Visual Documentation Complete! ✅**

This diagram helps understand the complete layout, flow, and interactions.
