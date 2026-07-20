# 🔧 Quick Fix Checklist

## The Problem
**Error:** "Request failed with status code 404" when creating meetings

**Cause:** `VITE_API_URL` in Vercel is missing `/api` suffix

---

## ✅ The Fix (5 Steps)

### □ Step 1: Go to Vercel
https://vercel.com/dashboard → **vcollab-react** project

### □ Step 2: Update Environment Variable
Settings → Environment Variables → Find `VITE_API_URL`

**Change from:**
```
https://vcollab-backend.vercel.app
```

**Change to:**
```
https://vcollab-backend.vercel.app/api
```

⚠️ **Must end with `/api`**

### □ Step 3: Redeploy
Deployments → Latest deployment → **︙** → Redeploy

⚠️ **Uncheck "Use existing Build Cache"**

### □ Step 4: Verify
Go to: https://vcollab-react.vercel.app/debug-config

Should show:
```
VITE_API_URL: https://vcollab-backend.vercel.app/api
```

Click **Test Backend Connection** → Should succeed

### □ Step 5: Test
1. Login → Dashboard
2. Click **Create New Meeting**
3. Fill form → Submit
4. Should work without 404 error ✅

---

## 🎯 Expected Results

✅ Meeting ID generated (e.g., `654321`)
✅ Meeting link copied to clipboard
✅ Redirected to meeting room
✅ No 404 errors in console
✅ Backend responds with meeting data

---

## 🚨 If Still Not Working

1. Screenshot `/debug-config` page
2. Screenshot console errors
3. Share screenshots for help

---

## 📝 Quick Reference

| Item | Value |
|------|-------|
| Correct URL | `https://vcollab-backend.vercel.app/api` |
| Debug Page | `/debug-config` |
| Dashboard | `/dashboard` |
| Backend Health | `https://vcollab-backend.vercel.app/health` |

**Remember:** The `/api` suffix is CRITICAL!
