# 🚀 LiveKit Integration Setup Guide

## ✅ What We've Completed

### Backend Setup (DONE)
1. ✅ Installed `livekit-server-sdk`
2. ✅ Created `/backend/src/services/livekitService.js` - Token generation service
3. ✅ Created `/backend/src/routes/livekitRoutes.js` - API routes for tokens
4. ✅ Added LiveKit routes to Express app
5. ✅ Added LiveKit env variables to `.env`

### Frontend Setup (DONE)
1. ✅ Installed `livekit-client` and `@livekit/components-react`

---

## 🔧 Next Steps: Configure LiveKit Cloud

### Step 1: Create LiveKit Cloud Account

1. Go to **https://cloud.livekit.io**
2. Sign up with GitHub or Google
3. Click **"Create Project"**
4. Enter:
   - Project Name: `VCollab`
   - Region: Select closest to your users (e.g., `us-west`, `eu-west`, `ap-southeast`)
5. Click **"Create"**

### Step 2: Get Your Credentials

After creating the project, you'll see:

```
API Key: APK***************
API Secret: ************************
WebSocket URL: wss://vcollab-*********.livekit.cloud
```

⚠️ **IMPORTANT:** Copy these values immediately - the API Secret is only shown once!

### Step 3: Update Backend Environment Variables

Open `c:\Users\HP\Downloads\IITHYB (3)\backend\.env` and replace:

```env
# LiveKit Configuration
LIVEKIT_URL=wss://vcollab-*********.livekit.cloud
LIVEKIT_API_KEY=APK***************
LIVEKIT_API_SECRET=************************
```

With your actual values from LiveKit Cloud.

### Step 4: Deploy Updated Backend

```bash
cd "c:\Users\HP\Downloads\IITHYB (3)\backend"
vercel --prod --yes
```

After deployment, add the environment variables in Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select `vcollab-backend` project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
5. Redeploy the project

---

## 📋 API Endpoints Created

### 1. Generate LiveKit Token
**POST** `/api/livekit/token`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Body:**
```json
{
  "meetingId": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "url": "wss://vcollab-*********.livekit.cloud",
  "roomName": "123456",
  "identity": "user-uuid",
  "name": "John Doe",
  "isHost": true
}
```

### 2. Check LiveKit Configuration
**GET** `/api/livekit/config`

**Response:**
```json
{
  "success": true,
  "configured": true,
  "url": "wss://vcollab-*********.livekit.cloud"
}
```

### 3. LiveKit Webhook (Optional)
**POST** `/api/livekit/webhook`

Used by LiveKit to send events (room started, participant joined, etc.)

---

## 🎯 Frontend Integration (Next)

### Create LiveKit Service

File: `vcollab-react/src/services/livekit.ts`

```typescript
import { Room, RoomEvent, Track } from 'livekit-client'
import api from './api'

export interface LiveKitConfig {
  token: string
  url: string
  roomName: string
  identity: string
  name: string
  isHost: boolean
}

class LiveKitService {
  private room: Room | null = null

  async getToken(meetingId: string): Promise<LiveKitConfig> {
    const response = await api.post('/livekit/token', { meetingId })
    return response.data
  }

  async connect(config: LiveKitConfig): Promise<Room> {
    try {
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: {
            width: 1280,
            height: 720,
            frameRate: 30,
          },
        },
      })

      // Set up event listeners
      this.setupEventListeners()

      // Connect to LiveKit
      await this.room.connect(config.url, config.token)

      console.log('✅ Connected to LiveKit room:', config.roomName)

      return this.room
    } catch (error) {
      console.error('❌ Failed to connect to LiveKit:', error)
      throw error
    }
  }

  private setupEventListeners() {
    if (!this.room) return

    this.room
      .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        console.log('Track subscribed:', track.kind, participant.identity)
      })
      .on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
        console.log('Track unsubscribed:', track.kind, participant.identity)
      })
      .on(RoomEvent.ParticipantConnected, (participant) => {
        console.log('Participant connected:', participant.identity)
      })
      .on(RoomEvent.ParticipantDisconnected, (participant) => {
        console.log('Participant disconnected:', participant.identity)
      })
      .on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room')
      })
  }

  async enableCamera(enabled: boolean) {
    if (!this.room) return
    await this.room.localParticipant.setCameraEnabled(enabled)
  }

  async enableMicrophone(enabled: boolean) {
    if (!this.room) return
    await this.room.localParticipant.setMicrophoneEnabled(enabled)
  }

  async shareScreen(enabled: boolean) {
    if (!this.room) return
    await this.room.localParticipant.setScreenShareEnabled(enabled)
  }

  disconnect() {
    if (this.room) {
      this.room.disconnect()
      this.room = null
    }
  }

  getRoom(): Room | null {
    return this.room
  }
}

export const livekitService = new LiveKitService()
export default livekitService
```

### Update MeetingRoom Component

```typescript
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LiveKitRoom } from '@livekit/components-react'
import livekitService from '../services/livekit'
import '@livekit/components-styles'

export default function MeetingRoom() {
  const { meetingId } = useParams()
  const [token, setToken] = useState('')
  const [serverUrl, setServerUrl] = useState('')

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const config = await livekitService.getToken(meetingId!)
        setToken(config.token)
        setServerUrl(config.url)
      } catch (error) {
        console.error('Failed to get LiveKit token:', error)
      }
    }

    fetchToken()
  }, [meetingId])

  if (!token || !serverUrl) {
    return <div>Loading...</div>
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={() => console.log('Disconnected from LiveKit')}
    >
      {/* Your meeting UI components */}
    </LiveKitRoom>
  )
}
```

---

## 🎨 UI Components Available

LiveKit provides pre-built React components:

```typescript
import {
  VideoConference,
  ParticipantTile,
  ControlBar,
  GridLayout,
  FocusLayout,
  Chat,
  AudioConference,
} from '@livekit/components-react'
```

### Quick Start - Full Meeting UI

```typescript
<LiveKitRoom token={token} serverUrl={serverUrl}>
  <VideoConference />
</LiveKitRoom>
```

This gives you:
- ✅ Gallery/Speaker view
- ✅ Camera controls
- ✅ Microphone controls
- ✅ Screen sharing
- ✅ Participant list
- ✅ Chat
- ✅ Settings

---

## 🔗 Migration Path

### Current Setup (WebRTC Mesh)
- Works for 2-10 participants
- Peer-to-peer connections
- Limited scalability

### New Setup (LiveKit SFU)
- Works for 2-1000+ participants
- Server-forwarded connections
- Scalable and reliable
- Better quality

### Recommended Approach

**Phase 1: Parallel Implementation**
- Keep existing WebRTC code
- Add LiveKit as option
- Let users choose (or auto-detect)

**Phase 2: LiveKit as Primary**
- Make LiveKit the default
- Fall back to WebRTC for small meetings
- Deprecate old WebRTC code

**Phase 3: LiveKit Only**
- Remove WebRTC mesh code
- LiveKit for all meetings
- Simplify codebase

---

## 📊 Cost Estimate (LiveKit Cloud)

**Free Tier:**
- 10,000 participant minutes/month
- Up to 50 concurrent participants
- Perfect for testing and small deployments

**Pro Tier ($99/month):**
- 50,000 participant minutes included
- $0.80 per 1,000 minutes after
- Up to 500 concurrent participants

**Example:**
- 100 users × 30 minutes/day × 20 days = 60,000 minutes/month
- Cost: $99 (includes 50,000) + $8 (for extra 10,000) = **~$107/month**

**Compare to Twilio Video:** ~$500-1000/month for same usage

---

## 🚀 Testing Your Setup

### 1. Check Backend

```bash
curl https://vcollab-backend.vercel.app/api/livekit/config
```

Expected response:
```json
{
  "success": true,
  "configured": true,
  "url": "wss://vcollab-*********.livekit.cloud"
}
```

### 2. Test Token Generation

```bash
curl -X POST https://vcollab-backend.vercel.app/api/livekit/token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"meetingId": "test123"}'
```

### 3. Test in Browser

1. Create a meeting on https://vcollab-react.vercel.app
2. Open browser console
3. Check for LiveKit connection logs
4. Verify video/audio streams

---

## 🐛 Troubleshooting

### Error: "LiveKit is not configured"
- Check environment variables are set correctly
- Verify backend has been redeployed
- Check Vercel dashboard for env vars

### Error: "Failed to connect to LiveKit"
- Verify WebSocket URL is correct
- Check firewall/network isn't blocking WebSockets
- Ensure token hasn't expired (2-hour TTL)

### Error: "Invalid token"
- Regenerate token from backend
- Check API Key and Secret are correct
- Verify room name matches meeting ID

### No video/audio streams
- Check browser permissions (camera/microphone)
- Verify HTTPS connection (required for WebRTC)
- Check browser console for errors

---

## 📚 Resources

- **LiveKit Docs:** https://docs.livekit.io
- **React Components:** https://docs.livekit.io/reference/components/react
- **Examples:** https://github.com/livekit/livekit-react
- **Pricing:** https://livekit.io/pricing

---

## ✅ Checklist

- [ ] Create LiveKit Cloud account
- [ ] Get API Key, Secret, and WebSocket URL
- [ ] Update backend `.env` file
- [ ] Deploy backend to Vercel
- [ ] Add env vars in Vercel dashboard
- [ ] Test `/api/livekit/config` endpoint
- [ ] Create frontend LiveKit service
- [ ] Update MeetingRoom component
- [ ] Test video call with 2+ participants
- [ ] Implement chat, screen share, and controls
- [ ] Replace old WebRTC code
- [ ] Test in production

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
