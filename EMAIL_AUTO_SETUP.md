# ✉️ Email Service - Automated Setup Guide

## 🚀 **1-Click Gmail Setup**

### **Option A: Quick Gmail Setup (2 minutes)**

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → "Get Started"
   - Follow phone verification steps

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - App: "Mail", Device: "Other (VCollab)"
   - Copy the 16-character password

3. **Update Railway Environment Variables:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=VCollab <your-email@gmail.com>
   FRONTEND_URL=https://vcollab-react.vercel.app
   ```

### **Option B: Alternative Email Providers**

#### **SendGrid (Scalable)**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

#### **Mailgun (Enterprise)**
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@mg.yourdomain.com
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM=VCollab <noreply@yourdomain.com>
```

#### **AWS SES (AWS Users)**
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-aws-access-key
EMAIL_PASSWORD=your-aws-secret-key
EMAIL_FROM=noreply@yourdomain.com
```

### **Testing Email Service**
```bash
# Test endpoint
POST https://vcollab-backend-production.up.railway.app/api/auth/test-email
{
  "email": "your-test@email.com"
}
```

## ✅ **Email Service Status: READY**