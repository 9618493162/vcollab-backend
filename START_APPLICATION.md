# 🚀 VCollab - Quick Start Guide

## Prerequisites
- Node.js installed
- Both backend and frontend folders present

---

## 🏃 Start the Application (Both Servers)

### **Terminal 1 - Backend**
```bash
cd "c:\Users\HP\Downloads\IITHYB (3)\backend"
npm start
```
✅ Backend will start on: http://localhost:5003

### **Terminal 2 - Frontend** 
```bash
cd "c:\Users\HP\Downloads\IITHYB (3)\vcollab-react"
npm run dev
```
✅ Frontend will start on: http://localhost:3000

---

## 🌐 Access the Application

Open your browser and go to: **http://localhost:3000**

---

## 📝 Test User Account

You can create a new account or use this test account:
- **Email**: test@vcollab.com
- **Password**: Test123456

---

## 🔄 Typical User Flow

1. **Landing Page** (`/`)
   - Click "Get Started" or "Sign In"

2. **Register** (`/register`)
   - Enter your name, email, password
   - Click "Create Account"

3. **Dashboard** (`/dashboard`)
   - Click "New Meeting" to start instant meeting
   - Or "Join Meeting" to enter a meeting code

4. **Meeting Room** (`/meeting/:id`)
   - See basic meeting interface
   - Test mute/unmute, video on/off
   - End call to return to dashboard

---

## 🛑 Stop the Application

### Stop Frontend:
Press `Ctrl + C` in Terminal 2

### Stop Backend:
Press `Ctrl + C` in Terminal 1

---

## 🔍 Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
npm start
```

### Frontend not starting?
```bash
cd vcollab-react
npm install
npm run dev
```

### Port already in use?
Kill the process using that port:
```bash
# Kill port 5003 (backend)
npx kill-port 5003

# Kill port 3000 (frontend)
npx kill-port 3000
```

---

## 📊 Check if Everything is Working

### Test Backend API:
Open: http://localhost:5003/api

Should see:
```json
{
  "success": true,
  "message": "VCollab Backend API v1.0",
  "status": "operational"
}
```

### Test Frontend:
Open: http://localhost:3000

Should see the landing page with:
- VCollab logo
- "Meet. Collaborate. Create." headline
- "Get Started" and "Sign In" buttons

---

## 🎨 What to Expect

### Current Features (Iteration 1):
✅ Beautiful landing page
✅ User registration/login
✅ Dashboard with meeting list
✅ Create instant meetings
✅ Join meetings by ID
✅ Basic meeting room with controls
✅ Real-time participant updates
✅ Toast notifications

### Coming Soon (Iteration 2):
⏳ Real video/audio (WebRTC)
⏳ Gallery/Speaker view toggle
⏳ Chat sidebar
⏳ Participants list
⏳ Screen sharing
⏳ Reactions & emojis
⏳ Device settings
⏳ Background blur

---

## 🌐 Production URLs

### Backend (Railway):
https://vcollab-backend-production.up.railway.app

### Frontend:
⏳ Not deployed yet (will be Vercel/Netlify)

---

**Enjoy using VCollab! 🎉**

Need help? Check `ITERATION_1_COMPLETE.md` for detailed documentation.
