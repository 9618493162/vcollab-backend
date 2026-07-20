# Manual Fix Steps (No CLI Required)

## Problem
You're getting "Request failed with status code 404" when creating meetings because the `VITE_API_URL` environment variable in Vercel doesn't have the `/api` suffix.

---

## Fix Using Vercel Dashboard

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Log in if needed
3. Find and click on: **vcollab-react** project

### Step 2: Check Environment Variables

1. Click on **Settings** tab (top navigation)
2. Click on **Environment Variables** in the left sidebar
3. Find the variable: `VITE_API_URL`

### Step 3: Update the Variable

#### Option A: Edit Existing Variable (if available)
1. Click the **︙** (three dots) next to `VITE_API_URL`
2. Click **Edit**
3. Change the value to: `https://vcollab-backend.vercel.app/api`
   - **IMPORTANT:** Must end with `/api`
4. Make sure **Production** checkbox is checked
5. Click **Save**

#### Option B: Delete and Re-add (if edit doesn't work)
1. Click the **︙** (three dots) next to `VITE_API_URL`
2. Click **Delete**
3. Confirm deletion
4. Click **Add New** button
5. Fill in:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://vcollab-backend.vercel.app/api`
   - **Environment:** Check **Production**
6. Click **Save**

### Step 4: Redeploy

1. Click on **Deployments** tab (top navigation)
2. Find the most recent deployment (top of the list)
3. Click the **︙** (three dots) on the right
4. Select **Redeploy**
5. **IMPORTANT:** Uncheck "Use existing Build Cache"
6. Click **Redeploy** button
7. Wait for the deployment to complete (2-5 minutes)

---

## Verify the Fix

### Test 1: Debug Config Page

1. Go to: https://vcollab-react.vercel.app/debug-config
2. Check the displayed value:
   ```
   VITE_API_URL: https://vcollab-backend.vercel.app/api
   ```
3. Click **Test Backend Connection** button
4. Should see success message

**If it shows the wrong value:**
- Vercel env var wasn't updated correctly
- Go back to Step 2 and try again
- Make sure you redeployed with fresh build (no cache)

### Test 2: Create a Meeting

1. Go to: https://vcollab-react.vercel.app/login
2. Log in with your credentials
3. You'll be redirected to Dashboard
4. Click **Create New Meeting**
5. Fill in:
   - **Title:** Test Meeting
   - **Type:** Instant Meeting
6. Click **Create Meeting**

**Expected Result:**
- ✅ Meeting is created
- ✅ Meeting ID is generated (e.g., `654321`)
- ✅ Meeting link is copied to clipboard
- ✅ You're redirected to the meeting room
- ✅ No 404 error in console

**If you still see 404:**
- Open browser DevTools (F12)
- Go to **Console** tab
- Look for the error
- Screenshot the error and the URL it's trying to call
- Share the screenshot for further debugging

### Test 3: Check Browser Console

1. Open DevTools (F12)
2. Go to **Network** tab
3. Create a new meeting
4. Find the request to `create`
5. Check:
   - **Request URL:** Should be `https://vcollab-backend.vercel.app/api/meetings/create`
   - **Status:** Should be `201 Created`
   - **Response:** Should show meeting data

---

## What Each File Does

### Files Updated Locally (already done ✅)
- `.env` → Updated to have `/api` suffix
- `.env.production` → Already had `/api` suffix
- `src/pages/DebugConfig.tsx` → New debug page to check env vars
- `src/App.tsx` → Added route for debug page

### What Needs Updating in Vercel
- Environment variable `VITE_API_URL` → Must be `https://vcollab-backend.vercel.app/api`
- Fresh deployment → To rebuild with new env var

---

## Why This Happens

Vite (the build tool) reads environment variables **at build time**, not at runtime. This means:

1. If Vercel has `VITE_API_URL=https://vcollab-backend.vercel.app` (without `/api`)
2. The build process reads this value
3. It's baked into the compiled JavaScript
4. The deployed app uses `https://vcollab-backend.vercel.app/meetings/create`
5. But the backend expects `/api/meetings/create`
6. Result: 404 error

**The Fix:**
1. Update the env var to include `/api`
2. Rebuild the app (redeploy with fresh build)
3. Now the compiled JavaScript has the correct URL
4. Requests go to `https://vcollab-backend.vercel.app/api/meetings/create`
5. Backend responds successfully

---

## Common Mistakes

❌ **Updating `.env` file but not redeploying**
   → Local file changes don't affect Vercel deployment

✅ **Update Vercel env var AND redeploy**
   → This updates the deployed build

---

❌ **Redeploying with cached build**
   → Old build still has wrong env var

✅ **Redeploy with fresh build (no cache)**
   → New build reads updated env var

---

❌ **Using `https://vcollab-backend.vercel.app`**
   → Missing `/api` suffix

✅ **Using `https://vcollab-backend.vercel.app/api`**
   → Correct URL with `/api`

---

## Still Not Working?

### Check Backend First

Open this URL in browser: https://vcollab-backend.vercel.app/health

**Expected:** Should show:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": "..."
}
```

If backend is down, no amount of frontend changes will help.

### Check Frontend Debug Page

URL: https://vcollab-react.vercel.app/debug-config

**Expected:**
```
VITE_API_URL: https://vcollab-backend.vercel.app/api
MODE: production
PROD: true
```

If it shows something else, the env var wasn't updated correctly.

### Share These for Help

1. Screenshot of `/debug-config` page
2. Screenshot of browser console errors
3. Screenshot of Network tab showing the failing request
4. Screenshot of Vercel environment variables page

---

## After Fix Works

Once meetings can be created successfully, test:

1. ✅ Create instant meeting
2. ✅ Create scheduled meeting
3. ✅ Join meeting via meeting ID
4. ✅ Copy meeting link
5. ✅ Share meeting link
6. ✅ Video/audio in meeting
7. ✅ Screen sharing
8. ✅ Chat in meeting

---

## Quick Reference

**Debug Page:** https://vcollab-react.vercel.app/debug-config
**Dashboard:** https://vcollab-react.vercel.app/dashboard
**Backend Health:** https://vcollab-backend.vercel.app/health
**Vercel Dashboard:** https://vercel.com/dashboard

**Correct VITE_API_URL value:**
```
https://vcollab-backend.vercel.app/api
```

**Remember:** Must end with `/api`!
