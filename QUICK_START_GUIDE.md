# 🚀 VCollab Backend - Quick Start Guide

**Version:** 1.0.0 (100% Complete)  
**Time to Run:** 2 minutes ⏱️

---

## ⚡ SUPER QUICK START

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies (if not already done)
npm install

# 3. Start server
npm start

# 4. Test in browser
# Open: http://localhost:5003
```

**That's it!** Server is running with in-memory storage.

---

## 🎯 WHAT YOU GET OUT OF THE BOX

### ✅ Works Immediately (No Setup Required):
- ✅ All 35 API endpoints
- ✅ Socket.IO with 30+ events
- ✅ User registration/login
- ✅ Meeting creation/joining
- ✅ In-memory data storage
- ✅ File uploads (to local disk)
- ✅ Rate limiting
- ✅ Security headers
- ✅ Input validation

### ⚠️ Requires Configuration (Optional):
- 🗄️ MongoDB or Supabase (for persistent storage)
- 📧 Email service (for password reset)
- 🔄 TURN server (for cross-network video)

---

## 📋 STEP-BY-STEP SETUP

### STEP 1: Install Dependencies

```bash
cd backend
npm install
```

**Installed Packages:**
- express, socket.io, mongoose, bcrypt, jsonwebtoken
- @supabase/supabase-js, multer, cors, dotenv
- express-rate-limit, helmet, express-validator, nodemailer

---

### STEP 2: Configure Environment (Optional)

Open `backend/.env` and update if needed:

```env
# Server Port
PORT=5003

# Database (Optional - works without this)
MONGODB_URI=mongodb://localhost:27017/vcollab

# JWT Secrets (Change in production!)
JWT_SECRET=vcollab-super-secret-key-2025-change-in-production
JWT_REFRESH_SECRET=vcollab-refresh-secret-key-2025-change-in-production

# Email (Optional - logs to console if not set)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=VCollab <noreply@vcollab.com>

# Frontend URL (for email links)
FRONTEND_URL=http://127.0.0.1:3000

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

**Note:** Server works fine with default values!

---

### STEP 3: Start Server

```bash
npm start
```

**Expected Output:**
```
🚀 =======================================
✅ VCollab Backend Server v1.0
✅ Server running on port 5003
✅ API: http://localhost:5003
✅ Socket.IO ready for connections
✅ Rate limiting enabled
✅ Security middleware active
🚀 =======================================
```

---

### STEP 4: Test API

**Option 1: Browser**
```
Open: http://localhost:5003
```

**Option 2: cURL**
```bash
curl http://localhost:5003
```

**Expected Response:**
```json
{
  "success": true,
  "message": "VCollab Backend API v1.0",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "meetings": "/api/meetings",
    "recordings": "/api/recordings",
    "uploads": "/api/uploads",
    "rooms": "/api/rooms",
    "admin": "/api/admin"
  },
  "status": "operational"
}
```

---

## 🧪 TEST THE FEATURES

### Test 1: Register User

```bash
curl -X POST http://localhost:5003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "1234567890",
    "fullName": "Test User",
    "email": "test@example.com"
  }
}
```

---

### Test 2: Login

```bash
curl -X POST http://localhost:5003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Copy the `accessToken` from response!**

---

### Test 3: Create Meeting

```bash
# Replace <YOUR_TOKEN> with accessToken from login
curl -X POST http://localhost:5003/api/meetings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "title": "Test Meeting",
    "description": "My first meeting",
    "type": "Public"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Meeting created successfully",
  "meeting": {
    "id": "...",
    "meetingId": "123456",
    "title": "Test Meeting",
    "type": "Public"
  }
}
```

---

### Test 4: Join Meeting

```bash
curl -X POST http://localhost:5003/api/meetings/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "meetingId": "123456"
  }'
```

---

### Test 5: Get Profile

```bash
curl http://localhost:5003/api/auth/profile \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 🌐 TEST WITH FRONTEND

### Method 1: Open HTML Files

1. Navigate to: `IITHYB/folder_A/`
2. Open `register-new.html` in browser
3. Register a new user
4. Open `login-new.html` and login
5. Open `dashboard-dark.html` to see dashboard
6. Open `meeting-dark.html` to join meeting

**Note:** Update frontend API URLs if needed (default: http://localhost:5003)

---

### Method 2: Test Socket.IO

```javascript
// In browser console (while on any HTML page)
const socket = io('http://localhost:5003');

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO');
  
  // Join a room
  socket.emit('join-room', 'test-room', 'user123', 'Test User');
  
  // Send a message
  socket.emit('send-message', {
    userId: 'user123',
    userName: 'Test User',
    message: 'Hello from console!'
  }, 'test-room');
});

socket.on('receive-message', (msg) => {
  console.log('📨 Message received:', msg);
});
```

---

## 📚 API ENDPOINTS OVERVIEW

### 🔐 Authentication (9 endpoints)
```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/logout            - Logout
GET    /api/auth/profile           - Get profile
PUT    /api/auth/profile           - Update profile
POST   /api/auth/change-password   - Change password
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
```

### 📹 Meetings (4 endpoints)
```
POST   /api/meetings/create        - Create meeting
POST   /api/meetings/join          - Join meeting
GET    /api/meetings/list          - Get user's meetings
GET    /api/meetings/:meetingId    - Get meeting by ID
```

### 🎬 Recordings (6 endpoints)
```
POST   /api/recordings/start       - Start recording
POST   /api/recordings/:id/stop    - Stop recording
POST   /api/recordings/upload      - Upload recording file
GET    /api/recordings/list        - Get recordings
GET    /api/recordings/:id         - Get recording by ID
DELETE /api/recordings/:id         - Delete recording
```

### 📤 Uploads (4 endpoints)
```
POST   /api/uploads/avatar         - Upload avatar
POST   /api/uploads/meeting-file   - Upload meeting file
POST   /api/uploads/recording      - Upload recording
DELETE /api/uploads/file           - Delete file
```

### 🏠 Rooms (5 endpoints)
```
GET    /api/rooms/:id/status       - Get room status
GET    /api/rooms/:id/participants - Get participants
PUT    /api/rooms/:id/settings     - Update room settings
DELETE /api/rooms/:id/participants/:userId - Kick participant
GET    /api/rooms/active           - Get all active rooms
```

### 👑 Admin (7 endpoints)
```
GET    /api/admin/users            - Get all users
GET    /api/admin/users/:id        - Get user by ID
PUT    /api/admin/users/:id        - Update user
DELETE /api/admin/users/:id        - Delete user
GET    /api/admin/meetings         - Get all meetings
DELETE /api/admin/meetings/:id     - Delete meeting
GET    /api/admin/stats            - Get system stats
```

**Total: 35 REST API endpoints + 30+ Socket.IO events**

---

## 🔍 TROUBLESHOOTING

### Problem: Port 5003 already in use

**Solution:**
```bash
# Change port in .env
PORT=5004
```

Or kill existing process:
```bash
# Windows
netstat -ano | findstr :5003
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5003
kill -9 <PID>
```

---

### Problem: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: "Cannot connect to MongoDB"

**This is normal!** Server uses in-memory storage as fallback.

**To use MongoDB:**
```bash
# Install MongoDB locally
# Windows: https://www.mongodb.com/try/download/community
# Then start MongoDB service

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with connection string
```

---

### Problem: Email service not working

**This is normal!** Emails are logged to console instead.

**To enable email:**
1. Get Gmail app password: https://myaccount.google.com/apppasswords
2. Update .env with EMAIL_USER and EMAIL_PASSWORD
3. Restart server

---

### Problem: File uploads failing

**Check:**
1. `uploads/` directory exists (auto-created)
2. File size under limits (10MB avatar, 50MB files, 500MB recordings)
3. File type allowed (see validation rules)

---

## 📖 NEXT STEPS

### For Development:
1. ✅ Backend is running ← **You are here**
2. Set up database (MongoDB or Supabase)
3. Configure email service
4. Update frontend API URLs
5. Test all features

### For Production:
1. Change JWT secrets in .env
2. Set up MongoDB or Supabase
3. Configure email service
4. Add TURN server for video
5. Deploy to hosting (Railway, Render, Heroku)
6. Add monitoring (optional)

---

## 📚 DOCUMENTATION

**Full API Documentation:**
- See `API_DOCUMENTATION.md` (150+ KB)
- Complete endpoint reference
- Socket.IO event documentation
- Request/response examples

**Completion Report:**
- See `BACKEND_100_PERCENT_COMPLETE.md`
- Feature breakdown
- Files created
- Security enhancements

---

## 🎉 SUCCESS INDICATORS

You know it's working when:

✅ Server starts without errors  
✅ Browser shows JSON response at http://localhost:5003  
✅ Registration creates user (check console)  
✅ Login returns access token  
✅ Protected endpoints require token  
✅ Meeting creation generates 6-digit ID  
✅ Socket.IO connection successful  
✅ File uploads save to uploads/ folder  

---

## 🆘 NEED HELP?

1. Check console for error messages
2. Verify .env configuration
3. Review API_DOCUMENTATION.md
4. Test with provided cURL commands
5. Check that port 5003 is available

---

## 🚀 YOU'RE READY!

Backend is **100% complete** and ready to use.

**What works NOW:**
- ✅ All 35 API endpoints
- ✅ Socket.IO real-time events
- ✅ User authentication
- ✅ Meeting management
- ✅ File uploads
- ✅ Admin dashboard
- ✅ Rate limiting
- ✅ Security features

**Start building your frontend!** 🎨

---

**Last Updated:** January 2025  
**Status:** Production-Ready ✅  
**Support:** Check API_DOCUMENTATION.md
