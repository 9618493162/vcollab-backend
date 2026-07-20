# 🔐 Google Authentication Setup Guide

## ✅ Current Status

Your app **already has Google OAuth code implemented!** You just need to configure it in Supabase and Google Cloud Console.

---

## 🎯 What's Already Done

✅ Frontend: Google OAuth buttons on Login/Register pages  
✅ Backend: Supabase integration ready  
✅ Auth Service: `signInWithGoogle()` function implemented  
✅ OAuth Callback: Handler for redirect after Google login  

**You just need:** Google OAuth credentials + Supabase configuration (15 minutes)

---

## 📋 Setup Steps

### Step 1: Configure Google OAuth in Supabase (5 minutes)

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Select your project** (wwdbdstbbpcmcbzwgunj)

3. **Go to Authentication:**
   - Left sidebar → Authentication
   - Click "Providers" tab

4. **Enable Google Provider:**
   - Find "Google" in the list
   - Toggle it ON
   - You'll see two fields:
     - Client ID (Google)
     - Client Secret (Google)
   
   **Leave this tab open - we'll fill these values in Step 3**

5. **Note the Callback URL:**
   Supabase shows a callback URL like:
   ```
   https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback
   ```
   **Copy this URL - you'll need it for Google Console**

---

### Step 2: Create Google OAuth App (7 minutes)

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/
   ```

2. **Create a New Project** (or select existing):
   - Click project dropdown (top left)
   - Click "New Project"
   - Name: "VCollab" or "VCollab Auth"
   - Click "Create"

3. **Enable Google+ API:**
   - Left menu → APIs & Services → Library
   - Search: "Google+ API"
   - Click on it → Click "Enable"

4. **Configure OAuth Consent Screen:**
   - Left menu → APIs & Services → OAuth consent screen
   - Select "External" (for public use)
   - Click "Create"
   
   **Fill in required fields:**
   - App name: `VCollab`
   - User support email: Your email
   - App logo: (optional - upload your logo if you have one)
   - Developer contact: Your email
   
   **Scopes section:**
   - Click "Add or Remove Scopes"
   - Select:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click "Update"
   - Click "Save and Continue"
   
   **Test users (for development):**
   - Add your email address as a test user
   - Click "Save and Continue"

5. **Create OAuth Credentials:**
   - Left menu → APIs & Services → Credentials
   - Click "+ CREATE CREDENTIALS" (top)
   - Select "OAuth client ID"
   
   **Configure:**
   - Application type: "Web application"
   - Name: "VCollab Web App"
   
   **Authorized JavaScript origins:**
   Add both:
   ```
   https://vcollab-react.vercel.app
   http://localhost:5173
   ```
   
   **Authorized redirect URIs:**
   Add ALL of these:
   ```
   https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback
   https://vcollab-react.vercel.app/auth/callback
   http://localhost:5173/auth/callback
   ```
   
   - Click "Create"

6. **Copy Your Credentials:**
   A modal will appear with:
   - **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxx`
   
   **IMPORTANT:** Copy both values immediately!

---

### Step 3: Add Credentials to Supabase (2 minutes)

1. **Go back to Supabase Dashboard:**
   - Authentication → Providers → Google

2. **Paste the values:**
   - **Client ID (for OAuth)**: Paste from Google Console
   - **Client Secret (for OAuth)**: Paste from Google Console

3. **Site URL** (should already be set):
   ```
   https://vcollab-react.vercel.app
   ```

4. **Redirect URLs** (should already be set):
   ```
   https://vcollab-react.vercel.app/**
   http://localhost:5173/**
   ```

5. **Click "Save"**

---

### Step 4: Create OAuth Callback Page (Already done, verify)

The callback page should exist at:
```
vcollab-react/src/pages/AuthCallback.tsx
```

If it doesn't exist, I'll create it for you. Let me check...

---

### Step 5: Test Google Login (3 minutes)

1. **Open your app:**
   ```
   https://vcollab-react.vercel.app/login
   ```

2. **Click "Google" button**

3. **You should see:**
   - Redirect to Google sign-in page
   - Google asks for permission (email, profile)
   - After approval, redirect back to your app
   - Automatically logged in!

4. **Verify in Database:**
   - Open Supabase → Table Editor → `users`
   - You should see your user with Google profile data

---

## 🎨 What Happens When User Clicks "Sign in with Google"

```
1. User clicks "Google" button on Login/Register page
   ↓
2. signInWithGoogle() function called
   ↓
3. Supabase redirects to Google OAuth consent screen
   ↓
4. User approves permissions (email, profile)
   ↓
5. Google redirects back to: /auth/callback
   ↓
6. AuthCallback page receives OAuth token
   ↓
7. Supabase exchanges token for session
   ↓
8. User profile created/updated in 'users' table
   ↓
9. User redirected to /dashboard
   ↓
10. User is logged in! ✅
```

---

## 🔧 OAuth Callback Page Code

I need to verify if `AuthCallback.tsx` exists. If not, here's what it should contain:

```typescript
// vcollab-react/src/pages/AuthCallback.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleOAuthCallback } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { showToast } = useUIStore()

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const data = await handleOAuthCallback()
        
        if (data) {
          // Store session data
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          // Update auth store
          setUser(data.user)
          
          showToast({
            type: 'success',
            message: `Welcome, ${data.user.fullName}!`,
          })
          
          // Redirect to dashboard
          navigate('/dashboard')
        } else {
          throw new Error('No session data received')
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error)
        showToast({
          type: 'error',
          message: error.message || 'Authentication failed',
        })
        navigate('/login')
      }
    }

    processOAuthCallback()
  }, [navigate, setUser, showToast])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
```

Then add to router:
```typescript
// In App.tsx
import AuthCallback from './pages/AuthCallback'

// Add route:
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 🔒 Security Notes

### Production Settings:

1. **Authorized Origins** (only these domains):
   ```
   https://vcollab-react.vercel.app
   ```

2. **Redirect URIs** (only these URLs):
   ```
   https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback
   https://vcollab-react.vercel.app/auth/callback
   ```

3. **Never commit credentials** to Git:
   - Client ID and Secret are in Supabase (encrypted)
   - Never add them to `.env` files in the repo

4. **Rate Limiting:**
   - Google has daily quotas (10,000 requests/day for free tier)
   - Should be plenty for your use case

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:**
- Check Google Console → Credentials → Your OAuth Client
- Make sure redirect URIs EXACTLY match:
  ```
  https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback
  ```
- No trailing slashes
- Use HTTPS (not HTTP)

### Error: "OAuth consent screen not configured"
**Solution:**
- Complete Step 2.4 (OAuth consent screen)
- Add your email as a test user during development

### Error: "User not found after login"
**Solution:**
- Check Supabase → Table Editor → `users`
- Verify the OAuth callback created the user record
- Check browser console for errors

### Google Sign-In button does nothing
**Solution:**
- Check browser console for errors
- Verify Supabase environment variables are in Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Make sure Google provider is enabled in Supabase

### Error: "User email not available"
**Solution:**
- In Google Console, ensure scopes include:
  - `userinfo.email`
  - `userinfo.profile`

---

## 📱 Mobile/iOS Considerations

For iOS app (if you build one later):
- You'll need to add iOS bundle ID to Google Console
- Add custom URL scheme
- Use deep linking for OAuth redirect

---

## 💰 Cost

**Google OAuth is FREE!**
- No cost from Google (10,000 requests/day free)
- No cost from Supabase (part of free tier)
- No additional backend code needed

---

## ✅ Testing Checklist

After setup, test these scenarios:

1. **New User - Google Sign Up:**
   - [ ] Click Google button on Register page
   - [ ] Grant permissions
   - [ ] New user created in `users` table
   - [ ] Redirected to dashboard
   - [ ] Profile shows Google info (name, avatar)

2. **Existing User - Google Sign In:**
   - [ ] Click Google button on Login page
   - [ ] Auto-login (no password needed)
   - [ ] Redirected to dashboard

3. **Profile Data:**
   - [ ] User's full name from Google
   - [ ] User's email from Google
   - [ ] User's profile picture (if available)

4. **Session Management:**
   - [ ] Stay logged in after page refresh
   - [ ] Can logout
   - [ ] Can login again with Google

---

## 🚀 Quick Setup Summary

**Total time: ~15 minutes**

1. Enable Google in Supabase (2 min)
2. Create Google OAuth app (7 min)
3. Add credentials to Supabase (2 min)
4. Create AuthCallback page (2 min) - I'll do this for you!
5. Test login (2 min)

**After setup:**
- Users can sign in with one click
- No password needed
- Profile data auto-filled
- Avatar from Google

---

## 📊 Current Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend OAuth Buttons | ✅ Complete | Login & Register pages |
| Supabase Integration | ✅ Complete | `signInWithGoogle()` |
| OAuth Callback Handler | ✅ Complete | `handleOAuthCallback()` |
| AuthCallback Page | ⚠️ Need to verify | Will create if missing |
| Router Config | ⚠️ Need to verify | Add `/auth/callback` route |
| Google OAuth App | ❌ Not configured | Need to create in Google Console |
| Supabase Provider | ❌ Not configured | Need to enable + add credentials |

---

## 🎯 Next Steps

**I'll now:**
1. Check if AuthCallback page exists
2. Create it if missing
3. Verify router configuration
4. Provide you with exact credentials to add

**You'll:**
1. Create Google OAuth app (following Step 2)
2. Add credentials to Supabase (following Step 3)
3. Test Google login!

---

**Ready?** Let me check your current files and complete the implementation!
