# OAuth Setup Guide

## Problem
Google/GitHub authentication redirects to `localhost:3000` instead of `vcollab-react.vercel.app`.

## Solution
Add your production URL to Supabase's allowed redirect URLs.

---

## Steps to Fix

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/wwdbdstbbpcmcbzwgunj

### 2. Configure Redirect URLs
1. Click **Authentication** (left sidebar)
2. Click **URL Configuration** tab
3. Under **Redirect URLs**, add:
   ```
   https://vcollab-react.vercel.app/auth/callback
   ```
4. Click **Save**

### 3. Configure Google OAuth (Optional - if you want Google login)

#### A. Get Google OAuth Credentials
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
5. Choose **Web application**
6. Add these URLs:
   - **Authorized JavaScript origins**: 
     ```
     https://vcollab-react.vercel.app
     ```
   - **Authorized redirect URIs**: 
     ```
     https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback
     ```
7. Save and copy **Client ID** and **Client Secret**

#### B. Add to Supabase
1. In Supabase Dashboard > **Authentication** > **Providers**
2. Find **Google** and click **Enable**
3. Paste **Client ID** and **Client Secret**
4. Click **Save**

### 4. Configure GitHub OAuth (Optional - if you want GitHub login)

#### A. Get GitHub OAuth App
1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: vCollab
   - **Homepage URL**: `https://vcollab-react.vercel.app`
   - **Authorization callback URL**: `https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy **Client ID** and generate **Client Secret**

#### B. Add to Supabase
1. In Supabase Dashboard > **Authentication** > **Providers**
2. Find **GitHub** and click **Enable**
3. Paste **Client ID** and **Client Secret**
4. Click **Save**

---

## Quick Fix (Just Supabase Redirect)

If you just want to fix the redirect error:

1. Go to https://supabase.com/dashboard/project/wwdbdstbbpcmcbzwgunj/auth/url-configuration
2. Add `https://vcollab-react.vercel.app/auth/callback` to **Redirect URLs**
3. Click **Save**

Done! OAuth will now redirect to your production URL.

---

## Test

1. Open https://vcollab-react.vercel.app/login
2. Click **Continue with Google** or **Continue with GitHub**
3. Should redirect to `https://vcollab-react.vercel.app/auth/callback` (not localhost)
4. Should log you in successfully

---

## Current Status

✅ Code is correct (`window.location.origin` is used)
✅ OAuth callback route exists (`/auth/callback`)
✅ Frontend deployed to Vercel
❌ Supabase redirect URLs need production URL added
❌ Google OAuth not configured (optional)
❌ GitHub OAuth not configured (optional)

---

## Next Steps

**Option 1: Minimal Fix (Recommended)**
- Add production URL to Supabase redirect URLs only
- OAuth buttons will redirect correctly but won't work until providers are configured

**Option 2: Full OAuth Setup**
- Follow all steps above to enable Google + GitHub login
- Users can log in with social accounts

**Option 3: Disable OAuth Buttons**
- Remove Google/GitHub buttons from login page
- Use only email/password authentication
