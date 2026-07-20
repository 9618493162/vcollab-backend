# Testing Instructions for VCollab Meeting Feature

## Current Status
✅ Backend running on http://localhost:5002
✅ Frontend running on http://localhost:3000
✅ Socket.IO configured
✅ WebRTC code implemented

## Test Meeting Room

### Step 1: Open Test Page
Open this URL in your browser:
```
http://localhost:3000/test-meeting.html
```

This will:
- Check if camera/microphone APIs are available
- Test Socket.IO connection to backend
- Show detailed diagnostics

### Step 2: Open Actual Meeting Page
1. First, make sure you're logged in:
   - Go to http://localhost:3000/login.html
   - Use any credentials (mock auth is enabled)

2. Then create a meeting:
   - Go to http://localhost:3000/create-meeting.html
   - Fill in the form and create a meeting

3. Join the meeting:
   - You should be redirected to http://localhost:3000/meeting.html
   - **Allow camera and microphone permissions when prompted**

### Step 3: Check Browser Console
Open browser console (Press F12) and check for errors:
- Look for any red error messages
- Check if "Connected to server" appears
- Check if "Media initialized successfully" appears

### Common Issues & Solutions

#### ❌ Camera not working
**Problem**: Browser blocks camera access
**Solution**: 
- Click the camera icon in browser address bar
- Allow camera and microphone permissions
- Refresh the page

#### ❌ Video controls not showing
**Problem**: JavaScript not loading
**Solution**:
- Open browser console (F12)
- Look for 404 errors on .js files
- Make sure all these files exist:
  - js/api.js
  - js/webrtc.js
  - js/meeting.js

#### ❌ Socket.IO connection failed
**Problem**: Backend not running or port blocked
**Solution**:
- Check backend is running: http://localhost:5002
- You should see "VCollab Backend Running..."
- Restart backend if needed

#### ❌ "Invalid or expired token" error
**Problem**: Authentication token issue
**Solution**:
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Login again
- Create meeting again

### What You Should See

When meeting page works correctly:
1. Your video appears in the main section
2. Control buttons appear at bottom:
   - 🎤 Microphone (green when active)
   - 📹 Camera (green when active)
   - 🖥️ Screen Share
   - 📞 Leave Meeting (red)
3. Chat section on the right side
4. Participant count at top right

### Manual Test Checklist

- [ ] Backend running on port 5002
- [ ] Frontend running on port 3000
- [ ] Can access login page
- [ ] Can create a meeting
- [ ] Meeting page loads
- [ ] Camera permission granted
- [ ] Your video shows on screen
- [ ] Control buttons are visible and clickable
- [ ] Can toggle microphone (button changes color)
- [ ] Can toggle camera (video turns off/on)
- [ ] Can send chat messages
- [ ] Can leave meeting

### Troubleshooting Commands

If something is wrong, run these in a new terminal:

```bash
# Check if backend is running
curl http://localhost:5002

# Check if frontend is running
curl http://localhost:3000

# Restart backend
cd backend
npm run dev

# Restart frontend (in another terminal)
cd IITHYB\folder_A
python -m http.server 3000
```

### Report Back
Please let me know:
1. What happens when you open test-meeting.html?
2. What errors appear in browser console (F12)?
3. Can you see your video on meeting.html?
4. Are the control buttons visible?
