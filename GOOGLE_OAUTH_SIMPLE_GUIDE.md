# 🔵 Google OAuth Setup - Simple Checklist

## ✅ What You Need
- Your Google account
- 10 minutes
- Two browser tabs

---

## 📋 **Simple 7-Step Checklist**

### ☐ **Step 1: Open Google Cloud Console**
**Link**: https://console.cloud.google.com

**Action**: Click link → Sign in with your Google account

---

### ☐ **Step 2: Create Project**
**Click**: "Select a project" (top bar) → "New Project"

**Fill in**:
- Project name: `VCollab`
- Click "Create"

**Wait**: 10 seconds for project creation

**Verify**: Top bar says "VCollab"

---

### ☐ **Step 3: Enable Google+ API**
**Navigate**: Left sidebar → "APIs & Services" → "Library"

**Search**: Type "Google+ API"

**Click**: "Google+ API" → "Enable" button

**Wait**: API enables (5 seconds)

---

### ☐ **Step 4: OAuth Consent Screen**
**Navigate**: Left sidebar → "OAuth consent screen"

**Select**: 
- ⭕ External (click this radio button)
- Click "Create"

**Fill in**:
```
App name: VCollab
User support email: [your email]
Developer contact email: [your email]
```

**Click**: 
- "Save and Continue" (3 times)
- "Back to Dashboard"

---

### ☐ **Step 5: Create OAuth Client**
**Navigate**: Left sidebar → "Credentials"

**Click**: "+ Create Credentials" → "OAuth client ID"

**Fill in**:
```
Application type: Web application
Name: VCollab Web Client

Authorized JavaScript origins:
  https://vcollab-react.vercel.app
  http://localhost:3000

Authorized redirect URIs:
  https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback
  http://localhost:3000/auth/callback
```

**Click**: "Create"

---

### ☐ **Step 6: Copy Credentials**
**A popup appears with:**

```
Client ID: 123456789-abc...apps.googleusercontent.com
Client Secret: GOCSPX-abc123xyz...
```

**Action**: 
- Click 📋 icon to copy Client ID
- Click 📋 icon to copy Client Secret
- Keep this popup open (or click "Download JSON")

---

### ☐ **Step 7: Add to Supabase**
**Open new tab**: https://supabase.com/dashboard/project/wwdbdstbbpcmcbzwgunj/auth/providers

**Find**: "Google" provider (scroll down)

**Toggle**: "Enable Sign in with Google" → ON

**Paste**:
```
Client ID (from Google): [paste here]
Client Secret (from Google): [paste here]
```

**Click**: "Save" button at bottom

---

## 🎉 **DONE! Test It Now**

**Open**: https://vcollab-react.vercel.app/login

**Click**: Google button (🔵 Google)

**Result**: 
- Redirects to Google
- Sign in with your Google account
- Redirects back to VCollab
- **You're logged in!** ✅

---

## 📸 **Visual Reference**

### Google Cloud Console URLs (for copy-paste):

**Main Console**: 
```
https://console.cloud.google.com
```

**APIs & Services**:
```
https://console.cloud.google.com/apis/dashboard
```

**OAuth Consent Screen**:
```
https://console.cloud.google.com/apis/credentials/consent
```

**Credentials**:
```
https://console.cloud.google.com/apis/credentials
```

### Supabase URLs:

**Auth Providers**:
```
https://supabase.com/dashboard/project/wwdbdstbbpcmcbzwgunj/auth/providers
```

---

## 🔧 **Exact Values to Use**

### For Google Cloud Console:

**Project Name**:
```
VCollab
```

**OAuth Consent Screen - App Name**:
```
VCollab
```

**OAuth Client - Name**:
```
VCollab Web Client
```

**Application Type**:
```
Web application
```

**Authorized JavaScript origins** (add both):
```
https://vcollab-react.vercel.app
http://localhost:3000
```

**Authorized redirect URIs** (add both):
```
https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

---

## ⚠️ **Common Mistakes to Avoid**

### ❌ Wrong Redirect URI
```
❌ https://vcollab-react.vercel.app/auth/callback  (Wrong!)
✅ https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback  (Correct!)
```

### ❌ Missing /auth/v1/callback
```
❌ https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/callback  (Wrong!)
✅ https://wwdbdstbbpcmcbzwgunj.supabase.co/auth/v1/callback  (Correct!)
```

### ❌ Forgot to Enable Google+ API
- OAuth won't work without this API enabled
- Go back to Step 3

### ❌ Wrong Client Secret Format
- Don't add spaces
- Copy exactly as shown
- Should start with "GOCSPX-"

---

## 🐛 **Troubleshooting**

### Error: "redirect_uri_mismatch"
**Fix**: Go back to Google Console → Credentials → Edit your OAuth client → Check redirect URIs match exactly

### Error: "Access blocked"
**Fix**: Complete OAuth Consent Screen (Step 4) properly

### Button doesn't redirect
**Fix**: Clear browser cache, try incognito mode

### Error in Supabase
**Fix**: Make sure you clicked "Save" after adding credentials

---

## ✅ **Checklist Summary**

```
☐ Google Cloud Console opened
☐ Project "VCollab" created
☐ Google+ API enabled
☐ OAuth Consent Screen configured
☐ OAuth Client created
☐ Client ID copied
☐ Client Secret copied
☐ Credentials added to Supabase
☐ Tested on production
☐ Google login works!
```

---

## 🎯 **After This Works**

Once Google OAuth is working, you can:
1. ✅ Set up GitHub OAuth (5 minutes, even easier!)
2. 📧 Enable Email Service (5 minutes)
3. 📹 Add Video Calls (15 minutes)

---

## 📞 **Need Help?**

If you get stuck:
1. Take a screenshot of the error
2. Tell me which step you're on
3. I'll help you fix it!

---

**Time to complete: 10 minutes**
**Difficulty: Easy** (just follow the checklist!)

**Let's do this! 🚀**
