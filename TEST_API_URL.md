# How to Fix the 404 Error

## The Problem
The frontend is still calling the wrong URL because the environment variable `VITE_API_URL` is not being loaded correctly.

## Solution: Set Environment Variables in Vercel Dashboard

You need to set the environment variables in the Vercel dashboard, not just in the `.env.production` file.

### Steps:

1. **Go to Vercel Dashboard**
   - Open: https://vercel.com/
   - Select your project: `vcollab-react`

2. **Go to Settings → Environment Variables**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add These Variables:**

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `VITE_API_URL` | `https://vcollab-backend.vercel.app/api` | Production |
   | `VITE_SUPABASE_URL` | `https://wwdbdstbbpcmcbzwgunj.supabase.co` | Production |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA` | Production |
   | `VITE_SOCKET_URL` | `https://vcollab-backend.vercel.app` | Production |

4. **Save and Redeploy**
   - After adding the variables, click "Save"
   - Go to "Deployments" tab
   - Click the "..." menu on the latest deployment
   - Click "Redeploy"
   - **Important:** Check "Use existing build cache" = NO (to force rebuild with new env vars)

5. **Wait for Deployment**
   - Wait for the redeployment to complete (about 1-2 minutes)

6. **Test Again**
   - Go to: https://vcollab-react.vercel.app/dashboard
   - Hard refresh (Ctrl+Shift+R)
   - Log out and log in
   - Try creating a meeting

## OR Use Vercel CLI

Alternatively, you can set the environment variables using the Vercel CLI:

```bash
cd vcollab-react

# Set environment variables
vercel env add VITE_API_URL production
# Enter: https://vcollab-backend.vercel.app/api

vercel env add VITE_SUPABASE_URL production
# Enter: https://wwdbdstbbpcmcbzwgunj.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA

vercel env add VITE_SOCKET_URL production
# Enter: https://vcollab-backend.vercel.app

# Redeploy with new env vars
vercel --prod
```

## Why This Happens

Vite environment variables (prefixed with `VITE_`) are baked into the JavaScript bundle at build time. They're not loaded at runtime like server environment variables.

When Vercel builds your project, it looks for environment variables in:
1. **Vercel Dashboard Environment Variables** (highest priority)
2. `.env.production` file (lower priority)

If the Vercel Dashboard has no environment variables set, and the `.env.production` file isn't being read correctly, the fallback value in the code is used.

The fallback in `src/services/api.ts` is:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vcollab-backend-production.up.railway.app/api'
```

Since `VITE_API_URL` is not being set correctly, it's using the old Railway URL as the fallback.

## Quick Fix (Temporary)

If you don't want to use Vercel Dashboard, you can hardcode the URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://vcollab-backend.vercel.app/api'
```

Then redeploy. But this is not recommended for production.
