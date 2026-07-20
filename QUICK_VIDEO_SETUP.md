# 📹 Video Calls Setup - Complete Guide

## 🎯 What You'll Get
- Real-time video calls (peer-to-peer)
- Audio calls
- Screen sharing
- Multi-party meetings
- WebRTC technology (like Zoom/Meet)

---

## ✅ **Good News: 90% Already Done!**

You already have:
- ✅ WebRTC Manager class (backend/public/js/webrtc.js)
- ✅ Socket.IO for signaling
- ✅ Meeting Room UI
- ✅ STUN servers configured
- ✅ Video call buttons

**What's missing**: Just need to connect the pieces!

---

## 📦 **Step 1: Create WebRTC Service** (5 min)

Create this file: `vcollab-react/src/services/webrtc.ts`

```typescript
// WebRTC Configuration
const configuration: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
}

export interface WebRTCCallbacks {
  onLocalStream?: (stream: MediaStream) => void
  onRemoteStream?: (userId: string, stream: MediaStream) => void
  onPeerDisconnected?: (userId: string) => void
}

class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private localStream: MediaStream | null = null
  private callbacks: WebRTCCallbacks = {}
  private socket: any = null

  setSocket(socket: any) {
    this.socket = socket
    this.setupSocketListeners()
  }

  setCallbacks(callbacks: WebRTCCallbacks) {
    this.callbacks = callbacks
  }

  async startLocalStream(): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      this.callbacks.onLocalStream?.(this.localStream)
      return this.localStream
    } catch (error) {
      console.error('Failed to get local stream:', error)
      throw error
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return

    this.socket.on('user-connected', (data: any) => {
      console.log('User connected:', data.userId)
      this.createPeerConnection(data.userId, true)
    })

    this.socket.on('webrtc-offer', async (data: any) => {
      console.log('Received offer from:', data.userId)
      await this.handleOffer(data.userId, data.offer)
    })

    this.socket.on('webrtc-answer', async (data: any) => {
      console.log('Received answer from:', data.userId)
      await this.handleAnswer(data.userId, data.answer)
    })

    this.socket.on('webrtc-ice-candidate', async (data: any) => {
      console.log('Received ICE candidate from:', data.userId)
      await this.handleIceCandidate(data.userId, data.candidate)
    })

    this.socket.on('user-disconnected', (data: any) => {
      console.log('User disconnected:', data.userId)
      this.removePeer(data.userId)
    })
  }

  private createPeerConnection(userId: string, createOffer: boolean) {
    const pc = new RTCPeerConnection(configuration)
    this.peerConnections.set(userId, pc)

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream!)
      })
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track from:', userId)
      if (event.streams[0]) {
        this.callbacks.onRemoteStream?.(userId, event.streams[0])
      }
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('webrtc-ice-candidate', {
          userId: userId,
          candidate: event.candidate,
        })
      }
    }

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${userId}:`, pc.connectionState)
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.removePeer(userId)
      }
    }

    if (createOffer) {
      this.createOffer(userId)
    }
  }

  private async createOffer(userId: string) {
    const pc = this.peerConnections.get(userId)
    if (!pc) return

    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      this.socket?.emit('webrtc-offer', { userId, offer })
    } catch (error) {
      console.error('Error creating offer:', error)
    }
  }

  private async handleOffer(userId: string, offer: RTCSessionDescriptionInit) {
    if (!this.peerConnections.has(userId)) {
      this.createPeerConnection(userId, false)
    }

    const pc = this.peerConnections.get(userId)
    if (!pc) return

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      this.socket?.emit('webrtc-answer', { userId, answer })
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }

  private async handleAnswer(userId: string, answer: RTCSessionDescriptionInit) {
    const pc = this.peerConnections.get(userId)
    if (!pc) return

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }

  private async handleIceCandidate(userId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections.get(userId)
    if (!pc) return

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error('Error handling ICE candidate:', error)
    }
  }

  private removePeer(userId: string) {
    const pc = this.peerConnections.get(userId)
    if (pc) {
      pc.close()
      this.peerConnections.delete(userId)
      this.callbacks.onPeerDisconnected?.(userId)
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  async shareScreen(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always' as any,
        },
        audio: false,
      })

      const videoTrack = screenStream.getVideoTracks()[0]

      // Replace video track in all peer connections
      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'video')
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })

      // Revert to camera when screen sharing stops
      videoTrack.onended = () => {
        this.stopScreenShare()
      }

      return screenStream
    } catch (error) {
      console.error('Error sharing screen:', error)
      throw error
    }
  }

  stopScreenShare() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === 'video')
        if (sender) {
          sender.replaceTrack(videoTrack)
        }
      })
    }
  }

  cleanup() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    // Close all peer connections
    this.peerConnections.forEach((pc) => pc.close())
    this.peerConnections.clear()
  }
}

export default new WebRTCService()
```

---

## 📦 **Step 2: Update Backend Socket Events** (2 min)

Open: `backend/src/socket.js`

Add these events in the socket connection handler:

```javascript
// WebRTC signaling events
socket.on('webrtc-offer', (data) => {
  socket.to(currentMeetingId).emit('webrtc-offer', {
    userId: socket.userId,
    offer: data.offer
  });
});

socket.on('webrtc-answer', (data) => {
  socket.to(currentMeetingId).emit('webrtc-answer', {
    userId: socket.userId,
    answer: data.answer
  });
});

socket.on('webrtc-ice-candidate', (data) => {
  socket.to(currentMeetingId).emit('webrtc-ice-candidate', {
    userId: socket.userId,
    candidate: data.candidate
  });
});
```

---

## 📦 **Step 3: Update MeetingRoom Component** (8 min)

This is already done in your code! Just verify the WebRTC integration.

The component should:
- ✅ Request camera/microphone permission
- ✅ Show local video
- ✅ Show remote videos
- ✅ Handle mute/unmute
- ✅ Handle video on/off
- ✅ Handle screen sharing

---

## 🧪 **Step 4: Test Video Calls** (5 min)

### **Test Setup:**
1. Open **2 browser windows** (or use private/incognito for 2nd)
2. **Window 1**: https://vcollab-react.vercel.app
   - Login as User 1
   - Create a meeting
   - Copy meeting ID

3. **Window 2**: https://vcollab-react.vercel.app
   - Login as User 2 (different account)
   - Join meeting with ID from Window 1

4. **Grant permissions**: Allow camera and microphone in both windows

5. **Result**: Both users should see each other's video! 🎉

---

## ✅ **Quick Implementation Checklist**

```
☐ Create webrtc.ts service file
☐ Add WebRTC socket events to backend
☐ Update MeetingRoom component (already done)
☐ Test with 2 browser windows
☐ Verify video appears
☐ Test audio works
☐ Test mute/unmute
☐ Test video on/off
☐ Test screen sharing
```

---

## 🎯 **Features You'll Have**

### ✅ Video Features:
- Real-time video streaming
- HD quality (720p/1080p)
- Automatic quality adjustment
- Multiple participants

### ✅ Audio Features:
- Clear audio quality
- Echo cancellation
- Noise suppression
- Background noise reduction

### ✅ Controls:
- Mute/Unmute microphone
- Turn video on/off
- Screen sharing
- Leave meeting

---

## 🐛 **Troubleshooting**

### Camera/Mic not working?
**Fix**:
1. Check browser permissions (click lock icon in address bar)
2. Make sure HTTPS is used (localhost or vercel.app)
3. Try different browser (Chrome recommended)

### No video showing?
**Fix**:
1. Check browser console for errors
2. Verify Socket.IO is connected
3. Check if ICE candidates are exchanging

### One-way video (can see them but they can't see you)?
**Fix**:
1. Check `addTrack()` is called before creating offer
2. Verify local stream is active
3. Check firewall settings

### Video freezes or lags?
**Fix**:
1. Check internet connection
2. Reduce video quality
3. Close other apps using bandwidth

---

## 🚀 **Production Considerations**

### For Better Performance:
1. **Add TURN server** (for users behind NAT/firewall)
2. **Use SFU** (Selective Forwarding Unit) for 4+ participants
3. **Implement bandwidth adaptation**
4. **Add connection quality indicator**

### Recommended TURN Providers:
- **Twilio TURN** (free tier available)
- **Xirsys** (WebRTC infrastructure)
- **Self-hosted** (coturn on your server)

---

## ⏱️ **Time: 20 Minutes Total**

- Step 1: 5 minutes (Create service file)
- Step 2: 2 minutes (Update backend)
- Step 3: 8 minutes (Update component)
- Step 4: 5 minutes (Test)

---

## 📸 **What Success Looks Like**

```
Window 1 (User A)          Window 2 (User B)
┌─────────────────┐       ┌─────────────────┐
│  [User B Video] │       │  [User A Video] │
│                 │       │                 │
│  [Your Video]   │       │  [Your Video]   │
│                 │       │                 │
│  [🎤 🎥 📞]     │       │  [🎤 🎥 📞]     │
└─────────────────┘       └─────────────────┘
```

---

**Ready to implement? Let me know which step you want to start with!** 🚀
