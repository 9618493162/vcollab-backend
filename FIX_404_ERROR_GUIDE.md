# Fix 404 Error - Complete Guide

## Problem
Your frontend is getting a 404 error when calling `POST /api/meetings/create` because the `VITE_API_URL` environment variable in Vercel is not set correctly or is missing the `/api` suffix.

## Root Cause
Vite environment variables are **baked into the build at build time**. If Vercel has the wrong value, even if your local `.env` files are correct, the deployed app will use the wrong URL.

---

## Solution: Update Vercel Environment Variables

### Option 1: Using Vercel Dashboard (RECOMMENDED)

1. Go to: https://vercel.com/dashboard
2. Select your project: **vcollab-react**
3. Go to: **Settings** → **Environment Variables**
4. Find `VITE_API_URL`
5. Click **Edit** or **Delete** and re-add
6. Set the value to: `https://vcollab-backend.vercel.app/api`
   - **CRITICAL:** Must end with `/api`
7. Make sure it's enabled for **Production** environment
8. Click **Save**
9. Go to **Deployments** tab
10. Click the **︙** (three dots) on the latest deployment
11. Select **Redeploy** → Check **Use existing Build Cache: No** → Click **Redeploy**

---

### Option 2: Using Vercel CLI

Run these commands in PowerShell:

```powershell
cd "c:\Users\HP\Downloads\IITHYB (3)\vcollab-react"

# Remove the old variable
vercel env rm VITE_API_URL production

# Add it back with the correct value
vercel env add VITE_API_URL production
# When prompted, enter: https://vcollab-backend.vercel.app/api

# Force a fresh build and redeploy
vercel --prod --force
```

---

## Verification Steps

### Step 1: Check What URL Your Frontend Is Using

1. After redeploying, go to: https://vcollab-react.vercel.app/debug-config
2. You should see:
   ```
   VITE_API_URL: https://vcollab-backend.vercel.app/api
   ```
3. Click **Test Backend Connection** button
4. Should see success message with backend health data

### Step 2: Test Meeting Creation

1. Log in to: https://vcollab-react.vercel.app/login
2. Go to Dashboard
3. Click **Create New Meeting**
4. Fill in the form and submit
5. Should see:
   - Meeting ID generated (e.g., `654321`)
   - Meeting link copied to clipboard
   - Redirect to meeting room
   - **NO MORE 404 ERROR**

### Step 3: Verify in Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. When you create a meeting, you should see:
   ```
   POST https://vcollab-backend.vercel.app/api/meetings/create
   Status: 201 Created
   ```
   
   **NOT:**
   ```
   POST https://vcollab-backend.vercel.app/meetings/create
   Status: 404 Not Found
   ```

---

## What Changed

### Local Files Fixed (Already Done ✅)
- ✅ `vcollab-react/.env` → Added `/api` suffix
- ✅ `vcollab-react/.env.production` → Already had `/api` suffix
- ✅ Created debug page at `/debug-config`

### What YOU Need to Do
- ⚠️ Update Vercel environment variable `VITE_API_URL` to include `/api`
- ⚠️ Redeploy with fresh build (no cache)

---

## Common Mistakes to Avoid

❌ **Wrong:** `https://vcollab-backend.vercel.app`
✅ **Correct:** `https://vcollab-backend.vercel.app/api`

❌ **Wrong:** Editing `.env` file but not redeploying
✅ **Correct:** Edit Vercel env var AND redeploy

❌ **Wrong:** Redeploy with existing build cache
✅ **Correct:** Redeploy with **Use existing Build Cache: No**

---

## Expected Behavior After Fix

1. **Dashboard:**
   - Shows list of meetings ✅
   - "Create New Meeting" button works ✅
   - Meeting ID is generated ✅
   - Meeting link is auto-copied ✅

2. **Meeting Room:**
   - Can join meeting with meeting ID ✅
   - LiveKit video/audio connects ✅
   - Chat works ✅
   - Screen sharing works ✅

3. **No More Errors:**
   - ✅ No 404 errors in console
   - ✅ No "Request failed with status code 404"
   - ✅ Meetings persist in database

---

## If Still Not Working

### Check #1: Verify Backend is Working

```powershell
# Test backend health
curl https://vcollab-backend.vercel.app/health

# Test meeting creation endpoint (should return 401, not 404)
curl -X POST https://vcollab-backend.vercel.app/api/meetings/create -H "Content-Type: application/json"
```

Expected responses:
- `/health` → `{"status":"ok",...}`
- `/api/meetings/create` → `{"success":false,"message":"Authentication required"}` (401, NOT 404)

### Check #2: Verify Frontend Build

Go to: https://vcollab-react.vercel.app/debug-config

Should show:
```
VITE_API_URL: https://vcollab-backend.vercel.app/api
MODE: production
PROD: true
```

### Check #3: Check Browser Network Tab

1. Open DevTools (F12) → **Network** tab
2. Create a meeting
3. Find the `create` request
4. Check:
   - **Request URL:** Should be `https://vcollab-backend.vercel.app/api/meetings/create`
   - **Status Code:** Should be 201 (not 404)
   - **Response:** Should have `{"success":true,"meeting":{...}}`

---

## Next Steps After Fix

Once meeting creation works:

1. Test joining a meeting via meeting ID
2. Test LiveKit video/audio
3. Test screen sharing
4. Test chat functionality
5. Test breakout rooms
6. Test recording (if enabled)

---

## Quick Commands Reference

```powershell
# Navigate to frontend
cd "c:\Users\HP\Downloads\IITHYB (3)\vcollab-react"

# Check current env vars in Vercel
vercel env ls

# Remove old env var
vercel env rm VITE_API_URL production

# Add new env var with correct value
vercel env add VITE_API_URL production
# Enter: https://vcollab-backend.vercel.app/api

# Force fresh deployment
vercel --prod --force

# Check build logs
vercel logs
```

---

## Debug Page Access

**URL:** https://vcollab-react.vercel.app/debug-config

This page shows:
- Current `VITE_API_URL` value
- Environment mode
- Test button to verify backend connection

**Use this FIRST** after redeploying to confirm the env var is correct.

---

## Contact

If you still see 404 errors after following this guide:

1. Send screenshot of `/debug-config` page
2. Send screenshot of browser console with the error
3. Send screenshot of Network tab showing the failing request
4. I'll help diagnose the specific issue
