# 🔍 LiveKit Test Instructions

## Quick Diagnostic

### Step 1: Check Backend
Open this URL in your browser:
```
https://vcollab-backend.vercel.app/api/livekit/config
```

**Expected result:**
```json
{
  "success": true,
  "configured": true,
  "url": "wss://vcollab-a6y9bamp.livekit.cloud",
  "message": "LiveKit is configured and ready"
}
```

✅ If you see this, backend is working!
❌ If you see error, backend needs fixing

---

### Step 2: Login to VCollab
```
https://vcollab-react.vercel.app/login
```

Use your credentials to log in.

---

### Step 3: Go to Dashboard
```
https://vcollab-react.vercel.app/dashboard
```

Click "New Meeting" button and note the meeting ID.

---

### Step 4: Test LiveKit Meeting

Replace `YOUR_MEETING_ID` with the ID from Step 3:
```
https://vcollab-react.vercel.app/meeting-livekit/YOUR_MEETING_ID
```

**What should happen:**
1. Page loads with "Joining meeting…" spinner
2. Browser asks for camera/microphone permission
3. LiveKit meeting room appears
4. You see yourself in the video

---

## 🐛 If Something Goes Wrong

### Error: "Failed to join meeting"
**Check:**
1. Are you logged in? (Check Step 2)
2. Does the meeting ID exist? (Create one in dashboard first)
3. Open browser console (F12) and check for errors

### Error: "Failed to get LiveKit token"
**Check:**
1. Backend config is working (Step 1)
2. You're logged in (check cookies/localStorage)
3. Meeting ID is correct

### Error: "Page not found" or 404
**Check:**
1. URL is exactly: `/meeting-livekit/MEETING_ID` (with hyphen)
2. Frontend is deployed correctly
3. Try clearing cache and reloading

### Camera/Microphone not working
**Check:**
1. Browser permissions are granted
2. No other app is using camera/mic
3. Try in incognito mode
4. Try different browser

---

## 📊 Detailed Test with Browser Console

1. Open the meeting URL
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for these messages:

**Good signs:**
```
✅ Got LiveKit token: { room: ..., identity: ..., isHost: ... }
✅ Connected to LiveKit room: YOUR_MEETING_ID
👤 Participant identity: user-id-here
```

**Bad signs:**
```
❌ Failed to get LiveKit token
❌ Failed to connect to LiveKit
❌ Network error
```

Take a screenshot of the console and show me if you see errors.

---

## 🧪 Alternative Test: Use Old Meeting Room

If LiveKit meeting doesn't work, test the old WebRTC version:
```
https://vcollab-react.vercel.app/meeting/YOUR_MEETING_ID
```

If this works but LiveKit doesn't, the issue is with LiveKit integration.
If this also doesn't work, the issue is with meetings in general.

---

## 📸 What to Send Me

If still not working, send me:
1. Screenshot of browser console (F12 → Console tab)
2. The exact URL you're trying to access
3. The error message you see on screen
4. Result of Step 1 (backend config check)

---

## 🔧 Manual Token Test (Advanced)

If you want to test the token generation manually:

1. Get your JWT token from browser:
   - Open dashboard
   - F12 → Application → Local Storage
   - Find `token` key and copy its value

2. Test token generation:
```bash
curl -X POST https://vcollab-backend.vercel.app/api/livekit/token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"meetingId": "test123"}'
```

**Expected result:**
```json
{
  "success": true,
  "token": "ey...",
  "url": "wss://vcollab-a6y9bamp.livekit.cloud",
  "roomName": "test123",
  "identity": "user-id",
  "name": "Your Name",
  "isHost": false
}
```

---

## ✅ Success Criteria

LiveKit is working when:
- ✅ Backend config returns configured: true
- ✅ You can log in
- ✅ Dashboard loads
- ✅ Meeting room page loads
- ✅ Browser asks for camera/mic permission
- ✅ You see LiveKit meeting interface
- ✅ Video/audio works

---

**Tell me which step fails and I'll help you fix it!** 🚀
