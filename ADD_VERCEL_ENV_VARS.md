# 🔧 How to Add Environment Variables to Vercel

## ⚠️ IMPORTANT: .env file is NOT used in production!

The `.env` file only works for local development. For Vercel production, you MUST add environment variables through the Vercel dashboard.

---

## 📋 Step-by-Step Instructions

### 1. Go to Vercel Dashboard
Open: https://vercel.com/dashboard

### 2. Select Backend Project
Click on: **vcollab-backend**

### 3. Go to Settings
Click: **Settings** (top navigation)

### 4. Go to Environment Variables
On the left sidebar, click: **Environment Variables**

### 5. Add These 3 Variables

Click "Add" button for each variable:

#### Variable 1:
- **Key:** `LIVEKIT_URL`
- **Value:** `wss://vcollab-a6y9bamp.livekit.cloud`
- **Environment:** Check all (Production, Preview, Development)
- Click "Save"

#### Variable 2:
- **Key:** `LIVEKIT_API_KEY`
- **Value:** `APviq7oyyp5n9kk`
- **Environment:** Check all (Production, Preview, Development)
- Click "Save"

#### Variable 3:
- **Key:** `LIVEKIT_API_SECRET`
- **Value:** `SqGM3qauo0Cpq22AGHy7JgZ4xIMCNIICRWVUovJNUK`
- **Environment:** Check all (Production, Preview, Development)
- **Sensitive:** ✅ Check this box (keeps it encrypted)
- Click "Save"

### 6. Redeploy
After adding all 3 variables:
- Go to **Deployments** tab
- Click on the latest deployment
- Click **"..."** menu
- Click **"Redeploy"**
- Wait for deployment to finish (~1 minute)

### 7. Test Again
```
curl https://vcollab-backend.vercel.app/api/livekit/config
```

Should now show:
```json
{
  "success": true,
  "configured": true,
  "url": "wss://vcollab-a6y9bamp.livekit.cloud",
  "message": "LiveKit is configured and ready"
}
```

---

## 🎯 Alternative: Use Vercel CLI

If you prefer command line:

```bash
cd "c:\Users\HP\Downloads\IITHYB (3)\backend"

vercel env add LIVEKIT_URL production
# When prompted, enter: wss://vcollab-a6y9bamp.livekit.cloud

vercel env add LIVEKIT_API_KEY production
# When prompted, enter: APviq7oyyp5n9kk

vercel env add LIVEKIT_API_SECRET production
# When prompted, enter: SqGM3qauo0Cpq22AGHy7JgZ4xIMCNIICRWVUovJNUK

# Then redeploy
vercel --prod --yes
```

---

## ✅ How to Verify Variables are Set

### Method 1: Check in Vercel Dashboard
1. Go to Project Settings → Environment Variables
2. You should see:
   - `LIVEKIT_URL` ✅
   - `LIVEKIT_API_KEY` ✅
   - `LIVEKIT_API_SECRET` ✅ (hidden value)

### Method 2: Test the API
```bash
curl https://vcollab-backend.vercel.app/api/livekit/config
```

If you see `"configured": false`, variables are NOT set in Vercel.

---

## 🐛 Common Mistakes

### ❌ Mistake 1: Only added to .env file
**Problem:** .env is ignored in production
**Solution:** Add to Vercel dashboard

### ❌ Mistake 2: Forgot to redeploy
**Problem:** Changes don't take effect until redeploy
**Solution:** Redeploy after adding variables

### ❌ Mistake 3: Wrong project
**Problem:** Added to frontend instead of backend
**Solution:** Make sure you're in **vcollab-backend** project

### ❌ Mistake 4: Typo in variable name
**Problem:** Code looks for exact name
**Solution:** Double-check: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

---

## 📸 Screenshots Guide

### What you should see in Vercel:

**Environment Variables Page:**
```
Environment Variables (3)

LIVEKIT_URL                  wss://vcollab-a6y9bamp.live...  [Edit] [Delete]
LIVEKIT_API_KEY              APviq7oyyp5n9kk                [Edit] [Delete]
LIVEKIT_API_SECRET           **************************      [Edit] [Delete]
```

---

## 🎯 Quick Test

After adding variables and redeploying, test immediately:

```bash
curl https://vcollab-backend.vercel.app/api/livekit/config
```

**If you see `"configured": true`** → ✅ Success! Variables are working!

**If you see `"configured": false`** → ❌ Variables not set or wrong project

---

## 🆘 Still Not Working?

Send me a screenshot of:
1. Vercel Dashboard → vcollab-backend → Settings → Environment Variables
2. The output of: `curl https://vcollab-backend.vercel.app/api/livekit/config`

This will help me see exactly what's wrong!

---

**REMEMBER:** .env file = local only, Vercel dashboard = production! 🚀
