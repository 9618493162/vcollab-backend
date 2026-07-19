# Email Service Setup Guide

## 🔐 Issue 2 Solved: Email Configuration

Your email service is currently set to placeholders. Here's how to configure it properly for password reset functionality.

---

## Option 1: Gmail (Recommended - Free)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: **vCollab Backend**
5. Click **Generate**
6. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### Step 3: Update Backend .env
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Paste the app password here
EMAIL_FROM=VCollab <your-email@gmail.com>
```

### Step 4: Update Railway Environment Variables
1. Go to Railway dashboard
2. Select backend service
3. Variables tab
4. Add/Update:
   - `EMAIL_USER` = your-email@gmail.com
   - `EMAIL_PASSWORD` = (app password from step 2)
   - `EMAIL_HOST` = smtp.gmail.com
   - `EMAIL_PORT` = 587
   - `EMAIL_FROM` = VCollab <your-email@gmail.com>

---

## Option 2: SendGrid (Better for Production)

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com/
2. Sign up for free tier (100 emails/day)
3. Verify your email
4. Complete account setup

### Step 2: Create API Key
1. Go to Settings → API Keys
2. Click **Create API Key**
3. Name: **vCollab Backend**
4. Permissions: **Full Access**
5. Copy the API key (starts with SG.)

### Step 3: Verify Sender Identity
1. Go to Settings → Sender Authentication
2. Click **Verify a Single Sender**
3. Fill in your details
4. Verify email

### Step 4: Update Backend Code
Update `backend/src/utils/emailService.js` (if it exists) or create it:

```javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendResetEmail = async (email, resetLink) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Reset Your vCollab Password',
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 1 hour.</p>
    `
  }
  
  try {
    await sgMail.send(msg)
    console.log('Reset email sent to:', email)
  } catch (error) {
    console.error('SendGrid error:', error)
    throw error
  }
}
```

### Step 5: Install SendGrid
```bash
cd backend
npm install @sendgrid/mail
```

### Step 6: Update Railway Variables
- `SENDGRID_API_KEY` = (your API key)
- `EMAIL_FROM` = your-verified-email@domain.com

---

## Option 3: SMTP2GO (Easy Setup)

1. Go to https://www.smtp2go.com/
2. Sign up (1000 free emails/month)
3. Get SMTP credentials
4. Update .env:
```env
EMAIL_HOST=mail.smtp2go.com
EMAIL_PORT=2525
EMAIL_USER=(your smtp2go username)
EMAIL_PASSWORD=(your smtp2go password)
```

---

## Option 4: Mailgun

1. Go to https://www.mailgun.com/
2. Sign up (5,000 free emails/month)
3. Verify domain or use sandbox
4. Get SMTP credentials
5. Update .env:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=(your mailgun username)
EMAIL_PASSWORD=(your mailgun password)
```

---

## Testing Email Configuration

### Test Locally:
```bash
cd backend
node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transport.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'If you receive this, email is working!'
}).then(() => console.log('✅ Email sent!'))
  .catch(err => console.error('❌ Error:', err));
"
```

### Test from Frontend:
1. Deploy backend with email configured
2. Go to /forgot-password page
3. Enter your email
4. Check inbox for reset email
5. Click link to verify it works

---

## Current Status

**Without email configured:**
- ❌ Password reset emails won't send
- ❌ Email verification won't work
- ❌ Notification emails won't work
- ✅ Everything else works fine!

**After email configured:**
- ✅ Password reset functional
- ✅ Email verification functional
- ✅ Notification emails work
- ✅ Full production ready

---

## Quick Setup (Gmail - 5 minutes)

```bash
# 1. Generate Gmail app password (see Step 2 above)

# 2. Update Railway
railway variables set EMAIL_USER="your-email@gmail.com"
railway variables set EMAIL_PASSWORD="your-app-password"
railway variables set EMAIL_HOST="smtp.gmail.com"
railway variables set EMAIL_PORT="587"
railway variables set EMAIL_FROM="VCollab <your-email@gmail.com>"

# 3. Test
# Go to your app → Forgot Password → Enter email → Check inbox
```

---

## Recommended for Production

**Development/Testing:**
- Use Gmail (free, easy setup)

**Production:**
- Use SendGrid, Mailgun, or SMTP2GO
- Better deliverability
- Analytics and tracking
- Higher sending limits
- Professional

---

## Environment Variables Summary

Add these to Railway (after choosing a service):

```env
# Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=VCollab <your-email@gmail.com>

# OR SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=your-verified-email@domain.com

# OR SMTP2GO
EMAIL_HOST=mail.smtp2go.com
EMAIL_PORT=2525
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com

# OR Mailgun
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM=noreply@yourdomain.com
```

---

**Note:** This is optional for MVP launch. You can configure it later when you need password reset functionality!
