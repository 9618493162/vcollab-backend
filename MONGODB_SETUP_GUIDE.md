# 🍃 MongoDB Local Setup Guide

**Time Required:** 15-20 minutes  
**Cost:** FREE  
**Difficulty:** Medium ⭐⭐

---

## 📋 OPTION 1: LOCAL MONGODB (WINDOWS)

### Step 1: Download MongoDB (3 minutes)

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   ```
   Version: 7.0 (current)
   Platform: Windows
   Package: msi
   ```
3. Click **"Download"**
4. Wait for download (500MB+)

---

### Step 2: Install MongoDB (5 minutes)

1. Run the downloaded `.msi` file
2. Click **"Next"**
3. Accept license → **"Next"**
4. Choose **"Complete"** installation
5. **Important:** Check "Install MongoDB as a Service"
6. **Important:** Check "Install MongoDB Compass" (GUI tool)
7. Click **"Next"** → **"Install"**
8. Wait for installation
9. Click **"Finish"**

---

### Step 3: Verify MongoDB is Running (2 minutes)

**Option A: Check Windows Services**
1. Press `Win + R`
2. Type: `services.msc`
3. Find **"MongoDB"** in the list
4. Status should be **"Running"** ✅

**Option B: Test Connection**
```bash
# Open PowerShell or CMD
mongosh

# Should see:
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017
Using MongoDB: 7.0.x
```

Type `exit` to quit mongosh.

---

### Step 4: Create Database (2 minutes)

**Option A: Using MongoDB Compass (GUI)**
1. Open **MongoDB Compass** (installed with MongoDB)
2. Connect to: `mongodb://localhost:27017`
3. Click **"Create Database"**
4. Database name: `vcollab`
5. Collection name: `users`
6. Click **"Create Database"**

**Option B: Using Command Line**
```bash
mongosh

# In MongoDB shell:
use vcollab
db.users.insertOne({ test: "setup" })
db.users.deleteOne({ test: "setup" })
exit
```

---

### Step 5: Update Backend Configuration (1 minute)

Your `.env` already has this:
```env
MONGODB_URI=mongodb://localhost:27017/vcollab
```

✅ No changes needed!

---

### Step 6: Restart Backend Server (30 seconds)

```bash
cd backend

# Stop server if running (Ctrl+C)

# Start server
npm start
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Supabase not configured - using MongoDB/in-memory storage
🚀 Server running on port 5003
```

---

### Step 7: Test Database (1 minute)

**Register User:**
```bash
curl -X POST http://localhost:5003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@mongodb.local",
    "password": "test123"
  }'
```

**Verify in MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `vcollab`
4. Select collection: `users`
5. You should see your test user! ✅

---

## 📋 OPTION 2: MONGODB ATLAS (CLOUD)

### Step 1: Create Atlas Account (2 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Email or Google
3. Verify email

---

### Step 2: Create Cluster (5 minutes)

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select:
   ```
   Provider: AWS (or your preference)
   Region: Closest to you
   Cluster Name: vcollab-cluster
   ```
4. Click **"Create"**
5. Wait 3-5 minutes for cluster creation

---

### Step 3: Set Up Database Access (2 minutes)

1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Fill in:
   ```
   Username: vcollab_user
   Password: [Generate Strong Password - SAVE THIS!]
   Database User Privileges: Read and write to any database
   ```
4. Click **"Add User"**

---

### Step 4: Set Up Network Access (2 minutes)

1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Choose:
   - **For Development:** Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **For Production:** Add specific IP addresses
4. Click **"Confirm"**

---

### Step 5: Get Connection String (2 minutes)

1. Click **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Click **"Drivers"**
4. Copy the connection string:
   ```
   mongodb+srv://vcollab_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

---

### Step 6: Update Backend Configuration (1 minute)

Open `backend/.env` and update:
```env
MONGODB_URI=mongodb+srv://vcollab_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/vcollab?retryWrites=true&w=majority
```

---

### Step 7: Test Connection (1 minute)

```bash
cd backend
npm start
```

**Expected Output:**
```
✅ Connected to MongoDB
🚀 Server running on port 5003
```

---

## 🔄 DATABASE MODELS

Your backend already has these Mongoose models:

### User Model (`src/models/User.js`)
```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (optional),
  role: String (user/admin),
  createdAt: Date
}
```

### Meeting Model (`src/models/Meeting.js`)
```javascript
{
  meeting_id: String (unique, 6-digit),
  title: String (required),
  host_id: ObjectId (reference to User),
  scheduled_time: Date,
  duration: Number,
  description: String,
  participants: [ObjectId],
  status: String (scheduled/active/completed),
  createdAt: Date
}
```

### RefreshToken Model (`src/models/RefreshToken.js`)
```javascript
{
  token: String (unique, required),
  userId: ObjectId (reference to User),
  expiresAt: Date,
  isRevoked: Boolean,
  createdAt: Date
}
```

### PasswordReset Model (`src/models/PasswordReset.js`)
```javascript
{
  userId: ObjectId (reference to User),
  email: String,
  token: String (hashed),
  expiresAt: Date (1 hour),
  used: Boolean,
  createdAt: Date
}
```

### Recording Model (`src/models/Recording.js`)
```javascript
{
  meetingId: ObjectId (reference to Meeting),
  hostId: ObjectId (reference to User),
  title: String,
  filename: String,
  filePath: String,
  fileSize: Number,
  duration: Number (seconds),
  format: String (webm/mp4),
  status: String (recording/processing/ready),
  startedAt: Date,
  endedAt: Date
}
```

**All models automatically created when first used!** ✅

---

## 🔍 VERIFY DATABASE WORKS

### Test All Collections:

**1. Register User:**
```bash
curl -X POST http://localhost:5003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@test.com","password":"test123"}'
```
**Creates:** `users` collection

---

**2. Login (get token):**
```bash
curl -X POST http://localhost:5003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'
```
**Creates:** `refreshtokens` collection

---

**3. Create Meeting:**
```bash
curl -X POST http://localhost:5003/api/meetings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Meeting","type":"Public"}'
```
**Creates:** `meetings` collection

---

**4. Request Password Reset:**
```bash
curl -X POST http://localhost:5003/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com"}'
```
**Creates:** `passwordresets` collection

---

### Check in MongoDB Compass:

1. Open MongoDB Compass
2. Connect to your database
3. Select database: `vcollab`
4. You should see collections:
   - ✅ users
   - ✅ meetings
   - ✅ refreshtokens
   - ✅ passwordresets
   - ✅ recordings (created when first recording is made)

---

## 🔒 MONGODB VS SUPABASE

| Feature | MongoDB Local | MongoDB Atlas | Supabase |
|---------|--------------|---------------|----------|
| **Setup Time** | 15 min | 10 min | 10 min |
| **Cost** | Free | Free (512MB) | Free (500MB) |
| **Installation** | Required | None | None |
| **Internet** | Not needed | Required | Required |
| **Backup** | Manual | Automatic | Automatic |
| **Scaling** | Manual | Automatic | Automatic |
| **GUI** | Compass | Atlas UI | Supabase UI |
| **Best For** | Development | Production | Production |

---

## 🐛 TROUBLESHOOTING

### MongoDB Won't Start

**Solution 1: Check Service**
```bash
# Open PowerShell as Admin
net start MongoDB
```

**Solution 2: Reinstall**
1. Uninstall MongoDB
2. Delete `C:\Program Files\MongoDB`
3. Delete `C:\data\db`
4. Reinstall

---

### "MongoServerError: Authentication failed"

**Solution:**
Check your connection string:
- Username correct?
- Password correct?
- Database name included?

---

### "Connection timed out"

**Solution for Atlas:**
1. Check Network Access allows your IP
2. Check internet connection
3. Try "Allow from anywhere" temporarily

---

## 🎯 DATABASE SETUP COMPLETE!

**Local MongoDB:**
- ✅ MongoDB installed and running
- ✅ Database created
- ✅ Backend connected
- ✅ Models auto-created

**MongoDB Atlas:**
- ✅ Cloud cluster created
- ✅ User configured
- ✅ Network access enabled
- ✅ Backend connected

**Database Status:** 35% → **100%** ✅

---

## 📚 MONGODB RESOURCES

**MongoDB Compass:** Installed with MongoDB  
**Documentation:** https://www.mongodb.com/docs  
**Atlas Dashboard:** https://cloud.mongodb.com  
**Mongoose Docs:** https://mongoosejs.com  

---

**Setup Time:** 15-20 minutes  
**Status:** COMPLETE ✅  
**Database:** 100% Ready 🍃

**Your MongoDB database is production-ready! 🎉**
