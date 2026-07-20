# 🚂 UPDATE RAILWAY ENVIRONMENT VARIABLES

## 📋 **You need to update these 2 variables in Railway:**

### **1. SUPABASE_URL**
**New Value:**
```
https://wwdbdstbbpcmcbzwgunj.supabase.co
```

### **2. SUPABASE_ANON_KEY**
**New Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA
```

---

## 🎯 **HOW TO UPDATE (Step by Step):**

### **Step 1: Open Railway Dashboard**
Go to: https://railway.app/dashboard

### **Step 2: Select Your Project**
Click on your **vcollab-backend** project

### **Step 3: Go to Variables**
1. Click on your **service/deployment**
2. Click on the **"Variables"** tab
3. You'll see all your environment variables

### **Step 4: Update SUPABASE_URL**
1. Find **SUPABASE_URL** in the list
2. Click the **edit** icon (pencil) next to it
3. **Replace** the old value with:
   ```
   https://wwdbdstbbpcmcbzwgunj.supabase.co
   ```
4. Click **"Update"** or press Enter

### **Step 5: Update SUPABASE_ANON_KEY**
1. Find **SUPABASE_ANON_KEY** in the list
2. Click the **edit** icon (pencil) next to it
3. **Replace** the old value with:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA
   ```
4. Click **"Update"** or press Enter

### **Step 6: Trigger Redeploy**
Railway should automatically redeploy when you change variables. If not:
1. Go to the **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment

---

## ⏱️ **Wait for Deployment**
- Railway will rebuild and deploy (takes 2-3 minutes)
- Watch the deployment logs
- Wait for **"Deployed"** status

---

## ✅ **Verify It Works**

Once deployed, test the production API:

### **Test 1: Check API is responding**
```bash
curl https://vcollab-backend-production.up.railway.app/api
```

Should return:
```json
{
  "success": true,
  "message": "VCollab Backend API v1.0",
  "status": "operational"
}
```

### **Test 2: Register a user on production**
```bash
curl -X POST https://vcollab-backend-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Production Test","email":"prod@vcollab.com","password":"Test123456"}'
```

Should return user data with tokens!

---

## 🎊 **What This Does:**

✅ **Production backend** → Connected to real Supabase database  
✅ **User registrations** → Saved to database (persist forever)  
✅ **User logins** → Read from database  
✅ **No data loss** → Everything persists across deployments  

---

## 📋 **Quick Checklist:**

- [ ] Opened Railway dashboard
- [ ] Found vcollab-backend project
- [ ] Clicked "Variables" tab
- [ ] Updated SUPABASE_URL
- [ ] Updated SUPABASE_ANON_KEY
- [ ] Waited for redeploy
- [ ] Tested production API
- [ ] Verified user registration works

---

## 🆘 **Need Help?**

If Railway shows any errors in deployment logs, copy them and share with me!

---

**Once you've updated the variables and Railway redeployed, tell me "Railway updated" and I'll verify everything works!** 🚀
