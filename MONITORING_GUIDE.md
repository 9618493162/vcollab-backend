# 📊 Production Monitoring Guide

## 1. Railway Dashboard Logs

### Access Logs
1. **Go to Railway Dashboard**: https://railway.app
2. **Select your project**: vcollab-backend
3. **Click "Deployments"** tab
4. **Click on the latest deployment**
5. **View real-time logs** in the "Logs" section

### Log Types You'll See

#### ✅ Application Logs
```
✅ User saved to Supabase
✅ Email service configured
📧 Email sent to user@example.com
✅ User found in Supabase
```

#### ⚠️ Warning Logs
```
⚠️ Email service not configured
⚠️ User saved to in-memory storage
```

#### ❌ Error Logs
```
❌ Email sending failed: Invalid login
Supabase error: Connection timeout
Register error: All fields are required
```

### Useful Railway CLI Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# View live logs
railway logs

# View last 100 lines
railway logs --lines 100

# Follow logs in real-time
railway logs --follow
```

---

## 2. Monitor Key Metrics

### Response Times
Check Railway dashboard → Metrics tab:
- **API response time**: Should be < 500ms
- **Database queries**: Should be < 100ms
- **Memory usage**: Should be < 512MB

### Health Checks

Add health check endpoint (already exists in `src/app.js`):
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
```

Test: https://vcollab-backend-production.up.railway.app/health

---

## 3. Error Tracking with Logs

### Backend Logs Location
- **Local**: `backend/logs/*.log`
- **Production**: Railway dashboard

### Log Files (Local)
```
logs/
  ├── application-YYYY-MM-DD.log    # All logs
  ├── error-YYYY-MM-DD.log          # Errors only
  ├── security-YYYY-MM-DD.log       # Auth events
  ├── exceptions-YYYY-MM-DD.log     # Unhandled exceptions
  └── rejections-YYYY-MM-DD.log     # Promise rejections
```

### View Local Logs
```bash
# View today's application logs
cat backend/logs/application-2026-07-16.log

# View errors only
cat backend/logs/error-2026-07-16.log

# Follow application logs in real-time
tail -f backend/logs/application-*.log

# Search for specific user
grep "user@example.com" backend/logs/application-*.log
```

---

## 4. Supabase Database Monitoring

### Access Supabase Dashboard
1. **Go to**: https://supabase.com/dashboard
2. **Select your project**: wwdbdstbbpcmcbzwgunj
3. **View**:
   - **Table Editor**: See all users, meetings
   - **SQL Editor**: Run custom queries
   - **Logs**: Database queries
   - **API**: Monitor API calls

### Useful SQL Queries

```sql
-- Count total users
SELECT COUNT(*) FROM users;

-- Recent registrations (last 7 days)
SELECT full_name, email, created_at 
FROM users 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Find user by email
SELECT id, full_name, email, created_at 
FROM users 
WHERE email = 'user@example.com';

-- Check authentication success rate
SELECT 
  DATE(created_at) as date,
  COUNT(*) as registrations
FROM users
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 5. Frontend Monitoring (Vercel)

### Access Vercel Dashboard
1. **Go to**: https://vercel.com/dashboard
2. **Select**: vcollab-react project
3. **View**:
   - **Analytics**: Page views, visitors
   - **Speed Insights**: Performance metrics
   - **Logs**: Build and runtime logs

### Vercel Analytics (Free)
```bash
npm install @vercel/analytics

# Add to src/main.tsx:
import { Analytics } from '@vercel/analytics/react'

// In render():
<Analytics />
```

---

## 6. Production Alerts

### Set Up Email Alerts

1. **Railway Alerts**:
   - Go to Project Settings → Notifications
   - Add email for deployment failures
   - Enable crash alerts

2. **Supabase Alerts**:
   - Go to Project Settings → Reports
   - Enable weekly reports
   - Set up custom alerts for errors

### Custom Alert System (Optional)

Create `backend/src/utils/alerting.js`:
```javascript
const nodemailer = require('nodemailer');

const sendAlert = async (subject, message) => {
  if (process.env.NODE_ENV === 'production') {
    // Send alert email to admin
    await emailService.sendEmail(
      process.env.ADMIN_EMAIL,
      `🚨 ALERT: ${subject}`,
      message
    );
  }
};

// Critical error handler
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  sendAlert('Unhandled Rejection', reason.toString());
});

module.exports = { sendAlert };
```

---

## 7. Performance Monitoring

### Monitor API Endpoints
```bash
# Test response time
curl -w "@curl-format.txt" -o /dev/null -s https://vcollab-backend-production.up.railway.app/api/auth/login

# Create curl-format.txt:
echo "
    time_namelookup:  %{time_namelookup}s
       time_connect:  %{time_connect}s
    time_appconnect:  %{time_appconnect}s
   time_pretransfer:  %{time_pretransfer}s
      time_redirect:  %{time_redirect}s
 time_starttransfer:  %{time_starttransfer}s
                    ----------
         time_total:  %{time_total}s
" > curl-format.txt
```

### Add Response Time Logging

Update `backend/src/middleware/logger.js`:
```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    
    // Alert if slow
    if (duration > 2000) {
      logger.warn(`Slow request: ${req.path} took ${duration}ms`);
    }
  });
  next();
});
```

---

## 8. Debug Production Issues

### Step 1: Check Logs
```bash
# Railway
railway logs --lines 500

# Filter errors
railway logs | grep "ERROR"
```

### Step 2: Test Endpoints
```bash
# Test registration
curl -X POST https://vcollab-backend-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"Test123"}'

# Test login
curl -X POST https://vcollab-backend-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'
```

### Step 3: Check Database
```sql
-- Supabase SQL Editor
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

### Step 4: Verify Environment Variables
```bash
# Railway CLI
railway variables

# Or check in Railway dashboard → Variables tab
```

---

## 9. Common Issues & Solutions

### Issue: Registration Timeout
**Check**: Email service configuration
**Solution**: Verify Gmail app password in Railway variables

### Issue: Database Connection Error
**Check**: Supabase credentials
**Solution**: Update SUPABASE_URL and SUPABASE_ANON_KEY

### Issue: CORS Errors (Frontend)
**Check**: Backend CORS configuration
**Solution**: Add frontend domain to CORS whitelist

### Issue: Socket.IO Not Connecting
**Check**: WebSocket support
**Solution**: Verify ws:// protocol is allowed

---

## 10. Daily Monitoring Checklist

- [ ] Check Railway deployment status (green)
- [ ] Review error logs (0 critical errors)
- [ ] Monitor API response times (<500ms)
- [ ] Check database health (queries <100ms)
- [ ] Verify email service (0 failed sends)
- [ ] Review user registrations (normal pattern)
- [ ] Check memory usage (<80%)
- [ ] Test critical endpoints (login, register)

---

## Quick Commands Reference

```bash
# Railway
railway login
railway link
railway logs
railway logs --follow
railway variables

# Local logs
tail -f backend/logs/application-*.log
grep "ERROR" backend/logs/*.log
cat backend/logs/error-*.log

# Test production
curl https://vcollab-backend-production.up.railway.app/health
curl https://vcollab-react.vercel.app

# Database
psql $DATABASE_URL
```

---

## Support

- **Railway Status**: https://status.railway.app
- **Supabase Status**: https://status.supabase.com
- **Vercel Status**: https://www.vercel-status.com
