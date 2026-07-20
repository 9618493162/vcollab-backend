# Sprint 5 - Quick Deployment Checklist

## 📋 Before You Start
- [ ] Have Railway account access
- [ ] Have Supabase dashboard access
- [ ] Backend is deployed on Railway
- [ ] Frontend code is ready

---

## 🔐 Step 1: Update JWT Secrets (5 minutes)

### Railway Dashboard:
- [ ] Go to https://railway.app
- [ ] Open your backend project
- [ ] Click "Variables" tab
- [ ] Update `JWT_SECRET` to: `Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/`
- [ ] Update `JWT_REFRESH_SECRET` to: `toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb`
- [ ] Update `SESSION_SECRET` to: `rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8`
- [ ] Click "Save" for each
- [ ] Wait for auto-redeploy (check Deployments tab)

---

## 💾 Step 2: Setup Database (3 minutes)

### Supabase:
- [ ] Go to https://supabase.com
- [ ] Open your vCollab project
- [ ] Click "SQL Editor" in sidebar
- [ ] Click "New Query"
- [ ] Open file: `backend/SPRINT5_DATABASE_SETUP.sql`
- [ ] Copy entire SQL code
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" button
- [ ] Wait for success message
- [ ] Verify tables created (Table Editor → Check `user_settings` exists)

---

## 🚀 Step 3: Deploy Backend (5 minutes)

### If using Git with Railway:
```bash
cd backend
git add .
git commit -m "Sprint 5: Add settings and analytics endpoints"
git push origin main
```
- [ ] Run git commands above
- [ ] Check Railway auto-deploys
- [ ] Verify deployment succeeds (no errors in logs)

### OR Manual Railway Deploy:
```bash
cd backend
railway up
```
- [ ] Run railway up
- [ ] Wait for deployment
- [ ] Check logs: `railway logs`

---

## 🎨 Step 4: Create PWA Icons (10 minutes)

### Quick Option - Use Placeholder:
- [ ] Go to https://via.placeholder.com/192/2563eb/ffffff?text=V
- [ ] Save image as `logo-192.png`
- [ ] Go to https://via.placeholder.com/512/2563eb/ffffff?text=V
- [ ] Save image as `logo-512.png`
- [ ] Move both to `vcollab-react/public/` folder

### OR Better Option - Generate Real Icons:
- [ ] Go to https://realfavicongenerator.net/
- [ ] Upload your logo (512x512 minimum)
- [ ] Click "Generate"
- [ ] Download favicon package
- [ ] Extract and copy:
  - `android-chrome-192x192.png` → `logo-192.png`
  - `android-chrome-512x512.png` → `logo-512.png`
- [ ] Move to `vcollab-react/public/`

---

## 🌐 Step 5: Deploy Frontend (10 minutes)

### Update Environment:
- [ ] Open `vcollab-react/.env.production`
- [ ] Set `VITE_API_URL=https://your-backend.railway.app`
- [ ] Set `VITE_SOCKET_URL=https://your-backend.railway.app`

### Build:
```bash
cd vcollab-react
npm run build
```
- [ ] Run build command
- [ ] Check for errors
- [ ] Verify `dist/` folder created

### Deploy to Vercel (Recommended):
```bash
vercel --prod
```
- [ ] Run vercel command
- [ ] Follow prompts
- [ ] Note the deployment URL
- [ ] Go to Vercel dashboard → Settings → Environment Variables
- [ ] Add `VITE_API_URL` and `VITE_SOCKET_URL`

### OR Deploy to Railway:
```bash
railway up
```
- [ ] Run railway up (from vcollab-react folder)
- [ ] Note deployment URL

---

## ✅ Step 6: Test Everything (10 minutes)

### Basic Tests:
- [ ] Open deployed frontend URL
- [ ] Log in with your account
- [ ] Dashboard loads correctly
- [ ] Click Settings in nav (or menu)
- [ ] Settings page loads with 5 tabs
- [ ] Try Profile tab - see your name
- [ ] Try Notifications tab - toggle switches
- [ ] Try Devices tab - see device dropdowns
- [ ] Try Appearance tab - toggle theme
- [ ] Try Privacy tab - toggle options
- [ ] Click "Save Settings" button
- [ ] See success toast notification
- [ ] Refresh page
- [ ] Settings are still saved

### Advanced Tests:
- [ ] Create a new meeting
- [ ] Join a meeting
- [ ] Theme toggle works (top right)
- [ ] Open on mobile or use Chrome DevTools mobile view
- [ ] Bottom navigation appears on mobile
- [ ] After 3 seconds, PWA install prompt appears
- [ ] Try installing PWA
- [ ] No console errors in browser DevTools

---

## 🔍 Step 7: Verify Backend (5 minutes)

### Check Railway Logs:
```bash
railway logs
```
- [ ] Run logs command
- [ ] Look for "Application middleware configured"
- [ ] No JWT verification errors
- [ ] No database errors
- [ ] API requests return 200 status

### Check Supabase:
- [ ] Go to Supabase dashboard
- [ ] Table Editor → `user_settings`
- [ ] Should have entries after saving settings
- [ ] Check `meetings` table has `password` column
- [ ] Check `chat_messages` table exists

---

## 🎯 Step 8: Final Verification

### Run Lighthouse Audit:
- [ ] Open deployed site in Chrome
- [ ] Press F12 (DevTools)
- [ ] Click "Lighthouse" tab
- [ ] Select: Performance, PWA, Accessibility
- [ ] Click "Analyze page load"
- [ ] Wait for results
- [ ] Check scores:
  - Performance: 70+ ✅ (target: 90+)
  - PWA: 80+ ✅ (target: 90+)
  - Accessibility: 85+ ✅ (target: 90+)

### Test All Sprint 5 Features:
- [ ] Security: Session timeout warning (wait 28 minutes or test with shorter timeout)
- [ ] Security: Rate limit indicator (make many requests quickly)
- [ ] Security: CSP Monitor visible in dev mode only
- [ ] Enterprise: Password protection (if meeting has password)
- [ ] Enterprise: Meeting analytics (after meeting ends)
- [ ] UI: Enhanced toast notifications with progress bar
- [ ] UI: Loading skeletons (check network throttling)
- [ ] UI: Theme toggle (dark ↔ light)
- [ ] UI: Smooth page transitions
- [ ] Mobile: Bottom nav on small screens
- [ ] Mobile: Swipe gestures work
- [ ] Mobile: PWA install prompt
- [ ] Settings: All 5 tabs functional
- [ ] Settings: Data persists after save

---

## ✨ Success! You're Done When:

- ✅ Railway shows new JWT secrets
- ✅ Supabase has new tables
- ✅ Backend deploys without errors
- ✅ Frontend deploys successfully
- ✅ Settings page works
- ✅ Data saves and persists
- ✅ PWA is installable
- ✅ No console errors
- ✅ Lighthouse scores acceptable

---

## 🆘 Quick Troubleshooting

### "JWT verification failed"
→ Clear cookies, logout, login again

### "Settings not saving"
→ Check Supabase SQL ran successfully

### "PWA not installable"
→ Check icons exist, verify HTTPS enabled

### "Build errors"
→ Check all imports are correct, run `npm install`

### "Backend errors"
→ Check Railway logs: `railway logs`

---

## 📊 Time Estimate

| Step | Time |
|------|------|
| Update JWT Secrets | 5 min |
| Setup Database | 3 min |
| Deploy Backend | 5 min |
| Create Icons | 10 min |
| Deploy Frontend | 10 min |
| Testing | 10 min |
| Verification | 7 min |
| **Total** | **~50 min** |

---

## 📚 Reference Files

- `SPRINT5_ACTION_GUIDE.md` - Detailed step-by-step guide
- `SPRINT5_DEPLOYMENT.md` - Deployment documentation
- `SPRINT5_COMPONENTS.md` - Component reference
- `backend/SPRINT5_DATABASE_SETUP.sql` - Database setup SQL
- `vcollab-react/package.json` - Frontend dependencies

---

## 🎉 Congratulations!

Once all checkboxes are complete, Sprint 5 is fully deployed and functional!

**Your vCollab app now has:**
- 🔐 Enhanced security features
- 🏢 Enterprise features
- 🎨 Polished UI with dark theme
- 📱 Mobile optimization
- ⚡ Performance utilities
- ⚙️ Complete settings page
- 📲 PWA support

**Next:** Start using your production-ready video collaboration platform! 🚀
