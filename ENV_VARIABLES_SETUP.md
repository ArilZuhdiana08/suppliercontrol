# 🔐 Setup Environment Variables untuk Vercel

## 📋 Kenapa Perlu Environment Variables?

**Alasan:**
1. ✅ **Security** - Jangan hardcode secrets di kode
2. ✅ **Flexibility** - Bisa ganti config tanpa edit kode
3. ✅ **Multiple Environments** - Dev, staging, production bisa berbeda
4. ✅ **Vercel Best Practice** - Recommended setup

---

## 🎯 Step 1: Setup Lokal (.env.local)

### Buat file `.env.local`

**Lokasi:** `d:\documen\suppliercontrol\.env.local`

**Isi:**
```env
VITE_SUPABASE_URL=https://emhqxzbyccixquzzrvap.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtaHF4emJ5Y2NpeHF1enpydmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mjc1MzMsImV4cCI6MjA4MDUwMzUzM30.poXSIwm1Of7CdJCWK3PPbBwu4K4S5Qm7sNthLqcSKZk
```

✅ File `.env.local` sudah dibuat!

---

## 🚀 Step 2: Setup di Vercel Dashboard

### 2.1 Buka Vercel Project

```
https://vercel.com/dashboard
↓
Klik project: suppliercontrol
↓
Klik "Settings"
```

### 2.2 Pergi ke Environment Variables

```
Settings → Environment Variables
```

**Screenshot mental:**
```
┌─────────────────────────────────┐
│ SETTINGS                        │
├─────────────────────────────────┤
│ General                         │
│ Domains                         │
│ Environment Variables ← KLIK    │
│ API                             │
│ Functions                       │
│ Deployments                     │
└─────────────────────────────────┘
```

### 2.3 Tambah Environment Variables

**Klik "Add New"** dan isi 2 kali:

#### Variable 1: SUPABASE URL

```
Key:    VITE_SUPABASE_URL
Value:  https://emhqxzbyccixquzzrvap.supabase.co
Environments: Production, Preview, Development
```

Klik **Save**

#### Variable 2: SUPABASE ANON KEY

```
Key:    VITE_SUPABASE_ANON_KEY
Value:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtaHF4emJ5Y2NpeHF1enpydmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mjc1MzMsImV4cCI6MjA4MDUwMzUzM30.poXSIwm1Of7CdJCWK3PPbBwu4K4S5Qm7sNthLqcSKZk
Environments: Production, Preview, Development
```

Klik **Save**

---

## 📋 Verifikasi Environment Variables

### Di Vercel Dashboard:

Lihat di **Environment Variables** - harus ada 2 variables:

```
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
```

---

## 🔄 Re-deploy di Vercel

**Setelah menambah environment variables:**

1. **Buka Vercel Dashboard**
2. **Klik "Deployments"**
3. **Klik 3 dots** pada latest deployment
4. **Pilih "Redeploy"**

Atau **push kode baru ke GitHub** - Vercel otomatis deploy ulang dengan env vars baru

---

## 🧪 Verify Environment Variables di Production

### Di browser (production URL):

1. **Tekan F12** → Console
2. **Jalankan:**
```javascript
debugSupabase()
```

**Expected output:**
```
=== SUPABASE DEBUG ===
Client: initialized ✓
URL: https://emhqxzbyccixquzzrvap.supabase.co
Environment: vercel domain
envSource: ESM (Vite)
Can call storage: true
```

✅ Environment variables loaded dengan benar!

---

## 📝 Checklist

- [ ] Buat file `.env.local` lokal
- [ ] Tambah 2 environment variables di Vercel Dashboard
- [ ] Pilih semua environments (Production, Preview, Development)
- [ ] Redeploy di Vercel
- [ ] Verify di production dengan `debugSupabase()`

---

## ⚠️ Best Practices

### DO ✅

```env
# .env.local atau Vercel dashboard
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

### DON'T ❌

```javascript
// ❌ Jangan hardcode di kode
const SUPABASE_URL = 'https://...'
const SUPABASE_ANON_KEY = 'eyJ...'
```

---

## 🔐 Security Notes

1. **ANON_KEY aman untuk public** - Ini anonymous key, bukan secret
2. **Gunakan RLS policies** - Database protection di Supabase
3. **Jangan share .env file** - Add `.env.local` ke `.gitignore`

---

## 📚 File yang Sudah Diupdate

✅ `.env.local` - Created
✅ `js/supabase-config.js` - Updated untuk baca env vars

---

Sekarang environment variables sudah di-setup dengan benar! 🎉
