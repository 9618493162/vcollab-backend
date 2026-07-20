# ✉️ Email Service - Quick 5-Minute Setup

## 🎯 What You'll Get
- Welcome emails when users register
- Password reset emails
- Meeting invitations (future feature)

---

## 📋 **Super Simple Steps**

### **Step 1: Enable 2-Step Verification** (2 min)

1. **Go to**: https://myaccount.google.com/security
2. **Find**: "2-Step Verification" section
3. **Click**: "Get Started" or "Turn On"
4. **Follow**: The steps (usually phone verification)
5. **Done**: Wait for confirmation

---

### **Step 2: Generate App Password** (2 min)

1. **Go to**: https://myaccount.google.com/apppasswords
   - Or search "App Passwords" in Google Account settings

2. **Select**:
   - App: `Mail`
   - Device: `Other (Custom name)`

3. **Enter**: `VCollab Backend`

4. **Click**: `Generate`

5. **Copy**: The 16-character password (example: `abcd efgh ijkl mnop`)
   - **IMPORTANT**: Copy it now! You won't see it again

---

### **Step 3: Add to Railway** (1 min)

1. **Go to**: https://railway.app

2. **Select**: Your `vcollab-backend` project

3. **Click**: "Variables" tab

4. **Add these environment variables**:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=VCollab <your-email@gmail.com>
FRONTEND_URL=https://vcollab-react.vercel.app
```

**Replace**:
- `your-email@gmail.com` → Your actual Gmail address
- `abcdefghijklmnop` → Your 16-char app password (no spaces!)

5. **Click**: "Deploy" or wait for auto-deploy

---

### **Step 4: Test It!** (30 sec)

1. **Open**: https://vcollab-react.vercel.app/register

2. **Create a new account**:
   - Name: Test User
   - Email: YOUR-REAL-EMAIL@gmail.com (use your email!)
   - Password: Test123456

3. **Check your email inbox** 📧
   - Look for welcome email from VCollab
   - Should arrive within 1 minute

4. **Success**: You got the email! ✅

---

## 🎯 **Quick Copy-Paste Values**

### For Railway Variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=PASTE-YOUR-EMAIL-HERE
EMAIL_PASSWORD=PASTE-16-CHAR-PASSWORD-HERE
EMAIL_FROM=VCollab <PASTE-YOUR-EMAIL-HERE>
FRONTEND_URL=https://vcollab-react.vercel.app
```

**Example** (with your actual values):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=john@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=VCollab <john@gmail.com>
FRONTEND_URL=https://vcollab-react.vercel.app
```

---

## ✅ **Checklist**

```
☐ 2-Step Verification enabled on Google
☐ App Password generated (16 chars)
☐ App Password copied (no spaces)
☐ Railway variables added (all 6 variables)
☐ "Deploy" clicked in Railway
☐ Waited 2-3 minutes for deployment
☐ Tested registration with real email
☐ Received welcome email ✅
```

---

## 🐛 **Troubleshooting**

### No email received?
**Check**:
1. Spam folder
2. Railway logs for errors: `railway logs`
3. Make sure app password has no spaces
4. Verify EMAIL_USER is correct Gmail address

### "Invalid login" error in Railway logs?
**Fix**:
1. Make sure 2-Step Verification is ON
2. Generate a NEW app password
3. Copy it WITHOUT spaces
4. Update in Railway variables

### "Connection refused" error?
**Fix**:
1. Check EMAIL_HOST is `smtp.gmail.com`
2. Check EMAIL_PORT is `587`
3. Redeploy in Railway

---

## 📧 **What Emails Will Be Sent**

### Welcome Email (Automatic)
Sent when: User registers
Subject: "Welcome to VCollab!"
Content: Welcome message + dashboard link

### Password Reset (When requested)
Sent when: User clicks "Forgot Password"
Subject: "Reset Your VCollab Password"
Content: Reset link (expires in 1 hour)

### Meeting Invites (Future)
Sent when: Host invites people to meeting
Subject: "Meeting Invitation: [Meeting Title]"
Content: Meeting details + join link

---

## ⏱️ **Time: 5 Minutes Total**

- Step 1: 2 minutes (Enable 2-Step)
- Step 2: 2 minutes (Generate password)
- Step 3: 1 minute (Add to Railway)
- Step 4: 30 seconds (Test)

---

## 🎉 **After Setup**

Your users will get:
- ✅ Professional welcome emails
- ✅ Secure password reset emails
- ✅ Meeting invitations
- ✅ Better user experience

---

**Ready? Start with Step 1 now!** 🚀

**Quick Links:**
- 2-Step Verification: https://myaccount.google.com/security
- App Passwords: https://myaccount.google.com/apppasswords
- Railway Dashboard: https://railway.app
