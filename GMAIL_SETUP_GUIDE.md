# 📧 Gmail Email Service Setup Guide

## Step 1: Enable 2-Step Verification (Required)

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/security
   - Click **"2-Step Verification"**
   - Follow the prompts to enable it (using phone number)

## Step 2: Generate App Password

1. **Go to App Passwords:**
   - Visit: https://myaccount.google.com/apppasswords
   - Or search "App Passwords" in Google Account settings

2. **Create App Password:**
   - Select app: **"Mail"**
   - Select device: **"Other (Custom name)"**
   - Enter name: **"VCollab Backend"**
   - Click **"Generate"**
   - Copy the 16-character password (example: `abcd efgh ijkl mnop`)

## Step 3: Add to Railway Environment Variables

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app
   - Select your **vcollab-backend** project
   - Go to **"Variables"** tab

2. **Add these environment variables:**

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=VCollab <your-email@gmail.com>
FRONTEND_URL=https://vcollab-react.vercel.app
```

**Important:** 
- `EMAIL_PASSWORD` should be the 16-character app password (remove spaces)
- `EMAIL_USER` is your full Gmail address

3. **Click "Deploy"** to restart the backend with new credentials

## Step 4: Test Email Service

After deployment, test registration again. The welcome email should be sent!

## Alternative: Use Environment-specific Email

For development (optional):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=VCollab Dev <youremail@gmail.com>
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### "Invalid login: 535-5.7.8 Username and Password not accepted"
- Make sure 2-Step Verification is enabled
- Generate a new App Password
- Check that EMAIL_PASSWORD has no spaces
- Verify EMAIL_USER is your full Gmail address

### "Less secure app access"
- Gmail no longer supports "Less secure apps"
- You MUST use App Passwords (requires 2-Step Verification)

### Emails not sending
- Check Railway logs: `railway logs`
- Verify all environment variables are set correctly
- Make sure app password is copied correctly (16 chars, no spaces)

## Alternative Email Providers

If you don't want to use Gmail:

### SendGrid (Free tier: 100 emails/day)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun (Free tier: 5,000 emails/month)
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
```

### AWS SES (Pay per use, very cheap)
Requires AWS account and verification.
