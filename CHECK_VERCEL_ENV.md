# Urgent: Check Vercel Environment Variable

The 404 error means the frontend is calling the wrong URL. 

## Do This NOW:

1. Go to: https://vercel.com/dashboard
2. Select **vcollab-react** project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`
5. **What value does it show?**

## It MUST be EXACTLY:
```
https://vcollab-backend.vercel.app/api
```

**NOT:**
- ❌ `https://vcollab-backend.vercel.app` (missing `/api`)
- ❌ `https://vcollab-backend-production.up.railway.app/api` (wrong domain)
- ❌ Any other value

## If It's Wrong:

1. Click the **Edit** button (or ︙ → Edit)
2. Change to: `https://vcollab-backend.vercel.app/api`
3. Click **Save**
4. Go to **Deployments** tab
5. Click ︙ on latest deployment → **Redeploy**
6. **UNCHECK** "Use existing Build Cache"
7. Click **Redeploy**

---

## While Waiting, Check Console

Open browser console (F12) on https://vcollab-react.vercel.app/dashboard

You should see these logs:
```
🔧 API Configuration: {
  VITE_API_URL: "...",
  API_BASE_URL: "...",
  mode: "production"
}
```

**What does it show for `VITE_API_URL`?** This is the smoking gun!

Take a screenshot and share it.
