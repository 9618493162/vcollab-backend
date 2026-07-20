# 🧪 TESTING GUIDE - Real-Time Features & Video Calls

## ✅ Servers Running

- **Backend API**: http://localhost:5002 ✅ Running
- **Frontend**: http://127.0.0.1:3000 ✅ Running
- **Socket.IO**: WebSocket enabled on port 5002 ✅ Ready

---

## 📋 TESTING CHECKLIST

### 1️⃣ **Profile & Settings with Real Data**

**URL**: http://127.0.0.1:3000/profile-dark.html

**What to test:**
- [ ] Page checks for authentication token on load
- [ ] Redirects to login if no token found
- [ ] Fetches real user data from `/api/auth/profile`
- [ ] Displays user's name and email from backend
- [ ] Statistics show real meeting count from database
- [ ] Saving profile updates sends PUT request to API
- [ ] Password change sends real API request

**How to test:**
```bash
# 1. Open browser console (F12)
# 2. Check for these logs:
#    - "🎥 Requesting profile data..."
#    - "✅ Profile loaded"
#    - Check Network tab for API calls

# 3. Try saving profile changes
# 4. Check if API request is sent to localhost:5002
```

---

### 2️⃣ **Admin Dashboard with Real Analytics**

**URL**: http://127.0.0.1:3000/admin-dashboard.html

**What to test:**
- [ ] Fetches real meetings from `/api/meetings/list`
- [ ] Statistics show actual meeting count
- [ ] Chart displays meetings grouped by day
- [ ] Activity feed shows real meeting data
- [ ] Export downloads CSV with real data
- [ ] Refresh button reloads data from API

**How to test:**
```bash
# 1. Open browser console (F12)
# 2. Look for these logs:
#    - "Loading real data..."
#    - "✅ Real statistics calculated"
#    - Network requests to /api/meetings/list

# 3. Click "Refresh Activity" - should fetch new data
# 4. Click "Export" - CSV should contain real meetings
```

---

### 3️⃣ **Real-Time Video Calling with WebRTC**

**URL**: http://127.0.0.1:3000/meeting-dark.html

**What to test:**
- [ ] Browser requests camera/microphone permission
- [ ] Local video stream displays your camera
- [ ] Socket.IO connects to backend
- [ ] Joins meeting room successfully
- [ ] WebRTC peer connections established
- [ ] Remote participants appear when others join
- [ ] Audio/Video toggle works
- [ ] Chat messages sent via Socket.IO
- [ ] Real-time participant count updates

**How to test:**

**Step 1: Open Meeting (First Tab)**
```bash
# 1. Open: http://127.0.0.1:3000/meeting-dark.html?room=test-room-123
# 2. Grant camera/microphone access
# 3. Should see your video in first tile
# 4. Open browser console (F12)
# 5. Check for these logs:
#    ✅ "Media access granted"
#    ✅ "Socket connected"
#    ✅ "Joined room: test-room-123"
```

**Step 2: Join from Second Tab (Simulate Another User)**
```bash
# 1. Open NEW INCOGNITO/PRIVATE window
# 2. Go to: http://127.0.0.1:3000/meeting-dark.html?room=test-room-123
# 3. Grant camera/microphone access
# 4. Check console logs:
#    ✅ "User connected: [peer-id]"
#    ✅ "Creating peer connection"
#    ✅ "Sending offer"
#    ✅ "Received answer"
#    ✅ "Peer connection established"
```

**Step 3: Test Video Call Features**
- [ ] Click mic button - should mute/unmute
- [ ] Click camera button - should stop/start video
- [ ] Type chat message - should appear in both tabs
- [ ] Click reactions - should send via Socket.IO
- [ ] Close one tab - video should disappear in other tab

---

## 🔍 **Debugging - What to Check**

### If Profile Page Doesn't Load Data:
```bash
# Check browser console for:
1. "❌ Failed to fetch profile" - backend may be down
2. "❌ Session expired" - need to log in first
3. Check Network tab - is API call being made?
4. Verify backend is running on port 5002
```

### If Admin Dashboard Shows Zero Data:
```bash
# Check browser console for:
1. "⚠️ Could not load data - using demo mode"
2. Check if /api/meetings/list returns data
3. Create a meeting first to have data
4. Check Supabase database connection
```

### If Video Call Doesn't Work:
```bash
# Common issues:

1. Camera permission denied
   - Solution: Grant permissions in browser settings

2. Socket.IO not connecting
   - Check: Backend running on port 5002?
   - Check: Network tab shows websocket connection?

3. No peer connection
   - Check console for WebRTC errors
   - Verify STUN servers are reachable
   - Try opening second tab in incognito mode

4. Video doesn't appear
   - Check: Did getUserMedia succeed?
   - Check: Is video element created in DOM?
   - Look for "Local video displayed" log
```

---

## 🧪 **Quick Test Commands**

### Test Backend API:
```bash
# Check if backend is responding
curl http://localhost:5002

# Should return: "VCollab Backend Running..."
```

### Test Socket.IO:
```bash
# Open browser console on any page and run:
const socket = io('http://localhost:5002');
socket.on('connect', () => console.log('✅ Socket works!'));
```

---

## 📊 **Expected Console Logs**

### Profile Page:
```
🔄 Loading user profile...
✅ Profile loaded
📊 Loading statistics...
✅ Statistics: 5 meetings, 120 minutes
```

### Admin Dashboard:
```
🔄 Loading real data...
✅ Fetched 5 meetings from API
📊 Calculating statistics...
✅ Real statistics calculated
```

### Meeting Room:
```
🎥 Requesting camera and microphone access...
✅ Media access granted
✅ Local video displayed
🔌 Connecting to Socket.IO...
✅ Socket connected: [socket-id]
📍 Joined room: test-room-123
👤 User connected: [peer-id]
🔗 Creating peer connection with [peer-id]
➕ Added video track to peer connection
➕ Added audio track to peer connection
📤 Sending offer to [peer-id]
📥 Received answer from [peer-id]
✅ Peer connection established with [peer-id]
📺 Received video track from [peer-id]
📺 Received audio track from [peer-id]
✅ Remote video displayed for [peer-id]
```

---

## ✅ **Success Criteria**

### Profile & Settings:
- ✅ Shows real user name/email
- ✅ Statistics from database
- ✅ Save button makes API call
- ✅ No mock data visible

### Admin Dashboard:
- ✅ Real meeting count displayed
- ✅ Chart shows actual data
- ✅ Activity from database
- ✅ Export includes real data

### Video Calling:
- ✅ Camera video appears
- ✅ Socket.IO connects
- ✅ Second participant joins
- ✅ Both see each other's video
- ✅ Chat works real-time
- ✅ Controls (mute/camera) work

---

## 🚨 **Important Notes**

1. **First Time Setup:**
   - You need to log in first to get authentication token
   - Go to login.html and sign in
   - Token is stored in localStorage

2. **Camera Access:**
   - Browser will ask for camera/microphone permission
   - Grant it for video calls to work
   - Use HTTPS in production (required for getUserMedia)

3. **Multiple Participants:**
   - Open multiple browser tabs or incognito windows
   - Each needs to use same room ID (in URL parameter)
   - Example: ?room=my-meeting-123

4. **Backend Requirements:**
   - Supabase must be configured
   - Socket.IO must be running
   - CORS must allow frontend origin

---

## 🎯 **Testing Priority**

**High Priority (Must Work):**
1. ✅ Video camera access
2. ✅ Socket.IO connection
3. ✅ Local video display
4. ✅ Real API data fetching

**Medium Priority (Should Work):**
5. ✅ Multi-participant video
6. ✅ Chat messages
7. ✅ Mute/camera controls

**Low Priority (Nice to Have):**
8. ✅ Reactions
9. ✅ Screen sharing
10. ✅ Recording

---

## 📞 **Support**

If something doesn't work:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify both servers are running
4. Check this guide's debugging section
5. Try refreshing the page (Ctrl+F5)

---

**Last Updated**: Now
**Version**: 1.0 - Real Data Implementation
