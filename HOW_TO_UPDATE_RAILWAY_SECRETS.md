# 🔐 How to Update Railway JWT Secrets

## ✅ Your Local Secrets (Already Done!)

Your local `.env` file **already has the new strong secrets**:
- ✅ JWT_SECRET (64 bytes, cryptographically secure)
- ✅ JWT_REFRESH_SECRET (64 bytes, cryptographically secure)
- ✅ SESSION_SECRET (64 bytes, cryptographically secure)

---

## ⚠️ Railway Deployment (Needs Update!)

Your Railway deployment **probably still has the old weak secrets**.

### Old Weak Pattern (BAD):
```
vcollab-super-secret-key-2025-change-in-production
```

### New Strong Secrets (GOOD):
```
JWT_SECRET=Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/
JWT_REFRESH_SECRET=toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb
SESSION_SECRET=rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8
```

---

## 📋 Step-by-Step: Update Railway Secrets

### Step 1: Open Railway Dashboard
1. Go to: **https://railway.app**
2. Log in with your account
3. You should see your projects

### Step 2: Select Your Backend Project
1. Click on your **backend project** (the one with Node.js/Express)
2. You'll see the service overview

### Step 3: Open Variables Tab
1. Click on the **"Variables"** tab in the left sidebar
2. You'll see a list of all environment variables

### Step 4: Find the JWT Variables
Look for these three variables:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_SECRET`

### Step 5: Check Current Values
Click on each variable to see its current value.

**If you see:** `vcollab-super-secret-key-2025-change-in-production`
**Then:** You need to update it! ⚠️

**If you see:** Long random string (64+ characters)
**Then:** It might already be updated ✅

### Step 6: Update Each Variable

For each of the three variables:

#### A. JWT_SECRET
1. Click on the variable
2. Click "Edit" or the pencil icon
3. Delete the old value
4. Paste this exact value:
   ```
   Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/
   ```
5. Click "Update" or "Save"

#### B. JWT_REFRESH_SECRET
1. Click on the variable
2. Click "Edit" or the pencil icon
3. Delete the old value
4. Paste this exact value:
   ```
   toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb
   ```
5. Click "Update" or "Save"

#### C. SESSION_SECRET
1. Click on the variable
2. Click "Edit" or the pencil icon
3. Delete the old value
4. Paste this exact value:
   ```
   rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8
   ```
5. Click "Update" or "Save"

### Step 7: Wait for Redeploy
1. After updating variables, Railway will **automatically trigger a redeploy**
2. Click on the **"Deployments"** tab to watch progress
3. Wait until you see **"Success"** status (usually 2-3 minutes)
4. Check the logs for any errors

---

## 🧪 Verify Update Was Successful

### Check Railway Logs:
```bash
railway logs
```

Look for:
- ✅ "Application middleware configured successfully"
- ✅ No JWT verification errors
- ✅ Server starts without errors

### Test Authentication:
1. Open your deployed frontend URL
2. **Important:** Clear browser cache and cookies first!
   - Chrome: Press `Ctrl+Shift+Delete` → Clear cookies
   - Or use Incognito mode
3. Log out if already logged in
4. Try to log in again
5. If login works → ✅ Secrets updated successfully!
6. If login fails → Check Railway logs for errors

---

## 🔧 Alternative: Use Railway CLI

If you prefer command line:

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login
```bash
railway login
```

### Step 3: Link to Your Project
```bash
cd backend
railway link
```

### Step 4: Set Variables
```bash
railway variables set JWT_SECRET="Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/"

railway variables set JWT_REFRESH_SECRET="toRlQJPMf6gECH8Rzxhg3XYcaSCQIGe8llCJrLrlSOcDzimKwuYkWQlAMDixEsKb"

railway variables set SESSION_SECRET="rimMsFimLEtuYUYXBgWjDDmwYtWl9uuMKYEcaWGMzmKHqd6axbJrQxO7qijw/QJ8"
```

### Step 5: Verify
```bash
railway logs
```

---

## 🎯 Visual Checklist

- [ ] Opened Railway dashboard
- [ ] Selected backend project
- [ ] Opened Variables tab
- [ ] Found JWT_SECRET variable
- [ ] Updated JWT_SECRET with new value
- [ ] Found JWT_REFRESH_SECRET variable
- [ ] Updated JWT_REFRESH_SECRET with new value
- [ ] Found SESSION_SECRET variable
- [ ] Updated SESSION_SECRET with new value
- [ ] Clicked Save/Update for each
- [ ] Watched redeploy complete (Deployments tab)
- [ ] Checked logs for errors
- [ ] Cleared browser cookies
- [ ] Tested login on frontend
- [ ] Login works successfully ✅

---

## ❓ Troubleshooting

### Problem: "JWT malformed" or "Invalid token" errors

**Solution:**
1. Make sure you copied the **entire secret** (no spaces before/after)
2. Clear browser cookies and localStorage
3. Log out and log back in
4. Check Railway logs: `railway logs`

### Problem: Variables tab is empty

**Solution:**
1. Make sure you selected the **backend service** (not frontend)
2. Check if you have the right project selected
3. Try refreshing the page

### Problem: Can't find Variables tab

**Solution:**
1. Make sure you're on the service details page (not project overview)
2. Look for tabs: Overview, Deployments, Variables, Settings
3. Variables should be there (might need to scroll tabs)

### Problem: Redeploy keeps failing

**Solution:**
1. Check Railway logs for specific error
2. Verify secrets don't have extra quotes or spaces
3. Try deleting the variable and creating it fresh
4. Make sure secret is one line (no line breaks)

---

## 🔒 Security Notes

### ✅ DO:
- Update Railway secrets immediately
- Use these cryptographically secure secrets
- Keep secrets in Railway dashboard only
- Clear browser cache after updating

### ❌ DON'T:
- Don't commit secrets to git (already gitignored)
- Don't share secrets publicly
- Don't use the old weak secrets
- Don't skip this step

---

## 📊 Why This Matters

**Old Weak Secret:**
```
vcollab-super-secret-key-2025-change-in-production
```
- Predictable pattern
- Easy to guess
- Security risk
- Could be brute-forced

**New Strong Secrets:**
```
Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/
```
- 64 bytes of random data
- Base64 encoded
- Cryptographically secure
- Impossible to guess

---

## ✅ Success!

Once updated:
- ✅ Your JWT tokens will be cryptographically secure
- ✅ Session management will be more secure
- ✅ Production-ready authentication
- ✅ No more security warnings

---

## 🎉 Next Steps

After updating Railway secrets:
1. Continue with **SPRINT5_CHECKLIST.md** Step 2 (Database setup)
2. Deploy the Sprint 5 backend updates
3. Test all new features

**Estimated Time:** 5-10 minutes

---

Need help? The secrets are already in your local `.env` file, so you just need to copy them to Railway!
