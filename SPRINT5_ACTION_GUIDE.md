# Sprint 5 - Complete Action Guide

## ✅ Step 1: Update Railway JWT Secrets

### Method 1: Railway Web Dashboard (Easiest)

1. **Go to Railway Dashboard**
   - Open browser: https://railway.app
   - Log in with your account
   - Click on your project

2. **Select Backend Service**
   - Find your backend service in the project
   - Click on it to open service details

3. **Update Environment Variables**
   - Click on **"Variables"** tab
   - Find or add these three variables:

   **JWT_SECRET**
   ```
   Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/
   ```

   **JWT_REFRESH_SECRET**
   ```
   toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb
   ```

   **SESSION_SECRET**
   ```
   rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8
   ```

4. **Save and Deploy**
   - Click **"Add"** or **"Update"** for each variable
   - Railway will automatically redeploy your backend
   - Wait for deployment to complete (check "Deployments" tab)

### Method 2: Railway CLI

```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set variables
railway variables set JWT_SECRET="Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/"
railway variables set JWT_REFRESH_SECRET="toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb"
railway variables set SESSION_SECRET="rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8"

# Deploy will happen automatically after variable changes
```

---

## ✅ Step 2: Setup Sprint 5 Database Tables

### Go to Supabase Dashboard

1. **Open Supabase**
   - Go to https://supabase.com
   - Log in to your account
   - Select your vCollab project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Run Database Setup**
   - Open the file: `backend/SPRINT5_DATABASE_SETUP.sql`
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click **"Run"** button
   - Wait for success message

### What This Creates:
- ✅ `password` column in meetings table
- ✅ `user_settings` table for settings page
- ✅ `chat_messages` table for analytics
- ✅ Analytics columns in `meeting_participants`
- ✅ Indexes for better performance
- ✅ Row-Level Security policies

---

## ✅ Step 3: Deploy Backend with New Endpoints

I've already added the backend code. Now deploy:

### If Using Railway:

```bash
cd backend
git add .
git commit -m "Add Sprint 5 API endpoints"
git push origin main
```

Railway will auto-deploy on git push.

### If Manual Deployment:

```bash
cd backend
railway up
```

### New Endpoints Added:

✅ **POST** `/api/meetings/:meetingId/verify-password`
✅ **GET** `/api/meetings/:meetingId/analytics`
✅ **GET** `/api/users/settings`
✅ **PUT** `/api/users/settings`
✅ **GET** `/api/users/profile`
✅ **PUT** `/api/users/profile`

---

## ✅ Step 4: Create PWA Icons

### Option 1: Use Online Generator (Recommended)

1. **Go to Real Favicon Generator**
   - Visit: https://realfavicongenerator.net/

2. **Upload Your Logo**
   - Create or use your vCollab logo (square image, 512x512px minimum)
   - Upload it to the website

3. **Generate Icons**
   - Click "Generate your Favicons and HTML code"
   - Download the favicon package

4. **Extract and Copy**
   - Extract the downloaded zip file
   - Copy these files to `vcollab-react/public/`:
     - `logo-192.png` (rename from android-chrome-192x192.png)
     - `logo-512.png` (rename from android-chrome-512x512.png)
     - `favicon.ico`

### Option 2: Create Manually

If you have a logo image:

```bash
# Install sharp (image processing)
npm install -g sharp-cli

# Generate 192x192
sharp resize -w 192 -h 192 your-logo.png --output logo-192.png

# Generate 512x512
sharp resize -w 512 -h 512 your-logo.png --output logo-512.png

# Move to public folder
mv logo-*.png vcollab-react/public/
```

### Option 3: Use Placeholder for Now

Create simple colored squares as placeholders:

1. Go to https://via.placeholder.com/192x192/2563eb/ffffff?text=vCollab
2. Right-click → Save as `logo-192.png`
3. Repeat for 512x512
4. Place in `vcollab-react/public/`

---

## ✅ Step 5: Test Backend Endpoints

### Test with curl or Postman:

```bash
# 1. Get your auth token (login first)
# 2. Test verify password endpoint
curl -X POST https://your-backend.railway.app/api/meetings/123456/verify-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"password":"test123"}'

# 3. Test analytics endpoint
curl https://your-backend.railway.app/api/meetings/123456/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Test get settings
curl https://your-backend.railway.app/api/users/settings \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Test update settings
curl -X PUT https://your-backend.railway.app/api/users/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"emailNotifications":true,"theme":"dark"}'
```

---

## ✅ Step 6: Deploy Frontend

### Update Frontend Environment Variables

1. **Create/Update `.env.production`** in `vcollab-react/`:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   VITE_SOCKET_URL=https://your-backend.railway.app
   ```

2. **Build Frontend**
   ```bash
   cd vcollab-react
   npm run build
   ```

### Deploy to Vercel (Recommended):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd vcollab-react
vercel --prod

# Set environment variables in Vercel dashboard
# Go to vercel.com → Your Project → Settings → Environment Variables
# Add:
# - VITE_API_URL
# - VITE_SOCKET_URL
```

### Deploy to Railway:

```bash
cd vcollab-react
railway up
```

### Deploy to Netlify:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd vcollab-react
netlify deploy --prod

# Build settings:
# Build command: npm run build
# Publish directory: dist
```

---

## ✅ Step 7: Test Everything

### Frontend Testing Checklist:

- [ ] Open your deployed frontend URL
- [ ] Login with your account
- [ ] Go to Settings page (`/settings`)
- [ ] Try changing settings in each tab
- [ ] Click "Save Settings"
- [ ] Check if toast notification appears
- [ ] Refresh page and verify settings persisted
- [ ] Create a meeting
- [ ] Try the theme toggle
- [ ] Test on mobile device or Chrome DevTools mobile view
- [ ] Check if PWA install prompt appears (after 3 seconds)
- [ ] Try installing the PWA

### Backend Testing Checklist:

- [ ] Verify JWT secrets updated (check Railway logs)
- [ ] Test login still works with new secrets
- [ ] Test meeting creation
- [ ] Test settings API endpoints
- [ ] Check Supabase tables created successfully

---

## ✅ Step 8: Monitor and Optimize

### Check Railway Logs:

```bash
railway logs
```

Look for:
- ✅ No JWT verification errors
- ✅ No database connection errors
- ✅ API requests returning 200 status

### Check Supabase:

1. Go to Supabase Dashboard
2. Check **"Table Editor"**
3. Verify `user_settings` table exists and has data
4. Check `chat_messages` table exists

### Lighthouse Audit:

1. Open your deployed site in Chrome
2. Open DevTools (F12)
3. Go to **"Lighthouse"** tab
4. Run audit for:
   - Performance
   - PWA
   - Accessibility
5. Target scores:
   - Performance: 90+
   - PWA: 90+
   - Accessibility: 90+

---

## 🎯 Quick Reference

### Files Modified:
- ✅ `backend/src/routes/meetingRoutes.js` - Added 2 endpoints
- ✅ `backend/src/routes/userRoutes.js` - Created new file
- ✅ `backend/src/controllers/meetingController.js` - Added 2 methods
- ✅ `backend/src/controllers/userController.js` - Created new file
- ✅ `backend/src/app.js` - Added user routes
- ✅ `backend/SPRINT5_DATABASE_SETUP.sql` - Created SQL setup

### Environment Variables to Update:

**Railway Backend:**
```
JWT_SECRET=Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/
JWT_REFRESH_SECRET=toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb
SESSION_SECRET=rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8
```

**Frontend (Vercel/Railway/Netlify):**
```
VITE_API_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## 🆘 Troubleshooting

### Problem: JWT Verification Fails After Update

**Solution:**
1. Clear browser cookies and localStorage
2. Log out and log back in
3. Verify secrets are exactly as shown (no extra spaces)

### Problem: Settings Not Saving

**Solution:**
1. Check Supabase SQL ran successfully
2. Verify `user_settings` table exists
3. Check browser console for errors
4. Check Railway backend logs

### Problem: PWA Install Prompt Not Showing

**Solution:**
1. Make sure icons exist in `/public` folder
2. Verify manifest.json is accessible at `/manifest.json`
3. Check HTTPS is enabled (required for PWA)
4. Try incognito mode
5. Check Chrome DevTools → Application → Manifest

### Problem: Rate Limit Errors

**Solution:**
1. Check Railway logs for rate limit hits
2. Adjust rate limits in `backend/src/middleware/rateLimiter.js`
3. Clear rate limit cache (restart backend)

---

## ✅ Success Criteria

You're done when:

- [x] Railway dashboard shows new JWT secrets
- [x] Supabase has new tables (user_settings, chat_messages)
- [x] Backend deploys without errors
- [x] Frontend builds successfully
- [x] Settings page works and saves data
- [x] Theme toggle works
- [x] Mobile navigation appears on small screens
- [x] PWA is installable (check Lighthouse)
- [x] No console errors in browser
- [x] No errors in Railway logs

---

## 🎉 Next Steps After Deployment

1. **Monitor Performance**
   - Check Railway metrics
   - Monitor Supabase usage
   - Watch for errors in logs

2. **Add More Features**
   - Implement WebRTC for real video calls
   - Add push notifications
   - Enhance analytics with more metrics

3. **Optimize Bundle**
   - Implement code splitting
   - Lazy load heavy components
   - Optimize images

4. **Add Tests**
   - Write E2E tests with Playwright
   - Add unit tests for components
   - Test API endpoints

---

Need help? Check:
- Railway docs: https://docs.railway.app
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs

**Sprint 5 Complete!** 🚀
