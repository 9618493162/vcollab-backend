# 📘 VCollab Backend API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5003/api`  
**Socket.IO URL:** `http://localhost:5003`

---

## 🎯 Table of Contents

1. [Authentication](#authentication)
2. [Meetings](#meetings)
3. [Recordings](#recordings)
4. [Uploads](#uploads)
5. [Rooms](#rooms)
6. [Admin](#admin)
7. [Socket.IO Events](#socketio-events)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Registration successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Refresh Access Token
```http
POST /api/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### Logout
```http
POST /api/auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Profile
```http
GET /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### Update Profile
```http
PUT /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Updated",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

### Change Password
```http
POST /api/auth/change-password
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Forgot Password
```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "If that email exists, a password reset link has been sent"
}
```

**Rate Limit:** 3 requests per hour

---

### Reset Password
```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpass123"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Rate Limit:** 3 requests per hour

---

## 📹 Meetings

### Create Meeting
```http
POST /api/meetings/create
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Team Standup",
  "description": "Daily standup meeting",
  "date": "2025-01-20",
  "time": "10:00",
  "type": "Public",
  "passcode": ""
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Meeting created successfully",
  "meeting": {
    "id": "507f1f77bcf86cd799439012",
    "meetingId": "123456",
    "title": "Team Standup",
    "description": "Daily standup meeting",
    "date": "2025-01-20",
    "time": "10:00",
    "type": "Public"
  }
}
```

**Rate Limit:** 50 requests per hour

---

### Join Meeting
```http
POST /api/meetings/join
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "meetingId": "123456",
  "passcode": "optional-for-private"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Joined meeting successfully",
  "meeting": {
    "id": "507f1f77bcf86cd799439012",
    "meetingId": "123456",
    "title": "Team Standup",
    "description": "Daily standup meeting",
    "date": "2025-01-20",
    "time": "10:00",
    "type": "Public"
  }
}
```

---

### Get User's Meetings
```http
GET /api/meetings/list
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "count": 5,
  "meetings": [
    {
      "id": "507f1f77bcf86cd799439012",
      "meetingId": "123456",
      "title": "Team Standup",
      "date": "2025-01-20",
      "time": "10:00",
      "status": "scheduled"
    }
  ]
}
```

---

### Get Meeting by ID
```http
GET /api/meetings/:meetingId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "meeting": {
    "id": "507f1f77bcf86cd799439012",
    "meetingId": "123456",
    "title": "Team Standup",
    "description": "Daily standup meeting",
    "host": {
      "id": "507f1f77bcf86cd799439011",
      "full_name": "John Doe",
      "email": "john@example.com"
    },
    "date": "2025-01-20",
    "time": "10:00",
    "type": "Public"
  }
}
```

---

## 🎬 Recordings

### Start Recording
```http
POST /api/recordings/start
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "meetingId": "507f1f77bcf86cd799439012",
  "title": "Team Standup Recording"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Recording started",
  "recording": {
    "id": "507f1f77bcf86cd799439013",
    "meetingId": "507f1f77bcf86cd799439012",
    "title": "Team Standup Recording",
    "status": "recording",
    "startedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### Stop Recording
```http
POST /api/recordings/:recordingId/stop
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fileSize": 1048576,
  "duration": 3600
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Recording stopped",
  "recording": {
    "id": "507f1f77bcf86cd799439013",
    "status": "ready",
    "duration": 3600
  }
}
```

---

### Get Recordings
```http
GET /api/recordings/list
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "count": 3,
  "recordings": [
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Team Standup Recording",
      "meetingId": {
        "title": "Team Standup",
        "meeting_id": "123456"
      },
      "duration": 3600,
      "fileSize": 1048576,
      "status": "ready",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Delete Recording
```http
DELETE /api/recordings/:recordingId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Recording deleted successfully"
}
```

---

## 📤 Uploads

### Upload Avatar
```http
POST /api/uploads/avatar
```

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `avatar`: Image file (JPEG, PNG, GIF, WebP, max 10MB)

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "fileUrl": "/uploads/avatars/avatar-123-1234567890.jpg",
  "file": {
    "filename": "avatar-123-1234567890.jpg",
    "size": 204800,
    "mimetype": "image/jpeg"
  }
}
```

**Rate Limit:** 20 uploads per hour

---

### Upload Meeting File
```http
POST /api/uploads/meeting-file
```

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Document/Image (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, images, max 50MB)

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileUrl": "/uploads/meeting-files/file-1234567890-document.pdf",
  "file": {
    "originalName": "document.pdf",
    "filename": "file-1234567890-document.pdf",
    "size": 2048000,
    "mimetype": "application/pdf"
  }
}
```

---

### Upload Recording File
```http
POST /api/uploads/recording
```

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `recording`: Video file (WEBM, MP4, MKV, max 500MB)
- `duration`: Duration in seconds (optional)

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Recording uploaded successfully",
  "fileUrl": "/uploads/recordings/recording-1234567890.webm",
  "file": {
    "filename": "recording-1234567890.webm",
    "size": 104857600,
    "mimetype": "video/webm",
    "duration": 3600
  }
}
```

---

### Delete File
```http
DELETE /api/uploads/file
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "filePath": "/uploads/avatars/avatar-123-1234567890.jpg"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## 🏠 Rooms

### Get Room Status
```http
GET /api/rooms/:roomId/status
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "room": {
    "roomId": "room-123",
    "meetingId": "123456",
    "hostId": "507f1f77bcf86cd799439011",
    "participantCount": 5,
    "participants": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "joinedAt": "2025-01-15T10:30:00.000Z",
        "video": true,
        "audio": true,
        "screenShare": false
      }
    ],
    "settings": {
      "recording": false,
      "locked": false,
      "maxParticipants": 100
    },
    "createdAt": "2025-01-15T10:25:00.000Z"
  }
}
```

---

### Get Room Participants
```http
GET /api/rooms/:roomId/participants
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "count": 5,
  "participants": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "joinedAt": "2025-01-15T10:30:00.000Z",
      "video": true,
      "audio": true,
      "screenShare": false
    }
  ]
}
```

---

### Update Room Settings (Host Only)
```http
PUT /api/rooms/:roomId/settings
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "recording": true,
  "locked": false,
  "maxParticipants": 50
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Room settings updated",
  "settings": {
    "recording": true,
    "locked": false,
    "maxParticipants": 50
  }
}
```

---

### Kick Participant (Host Only)
```http
DELETE /api/rooms/:roomId/participants/:userId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Participant removed from room"
}
```

---

### Get Active Rooms
```http
GET /api/rooms/active
```

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "count": 10,
  "rooms": [
    {
      "roomId": "room-123",
      "meetingId": "123456",
      "hostId": "507f1f77bcf86cd799439011",
      "participantCount": 5,
      "settings": {
        "recording": false,
        "locked": false,
        "maxParticipants": 100
      },
      "createdAt": "2025-01-15T10:25:00.000Z"
    }
  ]
}
```

---

## 👑 Admin

**Note:** All admin routes require authentication AND admin role.

### Get All Users
```http
GET /api/admin/users?page=1&limit=20&search=john
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "totalPages": 8,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get User by ID
```http
GET /api/admin/users/:userId
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### Update User
```http
PUT /api/admin/users/:userId
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "role": "admin"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john.new@example.com",
    "role": "admin"
  }
}
```

---

### Delete User
```http
DELETE /api/admin/users/:userId
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Get All Meetings
```http
GET /api/admin/meetings?page=1&limit=20&status=active
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "count": 20,
  "total": 200,
  "page": 1,
  "totalPages": 10,
  "meetings": [
    {
      "id": "507f1f77bcf86cd799439012",
      "meetingId": "123456",
      "title": "Team Standup",
      "status": "active",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Delete Meeting
```http
DELETE /api/admin/meetings/:meetingId
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Meeting deleted successfully"
}
```

---

### Get System Statistics
```http
GET /api/admin/stats
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** (200 OK)
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1500,
    "totalMeetings": 5000,
    "activeMeetings": 25,
    "totalRecordings": 1200,
    "storageUsed": 104857600000
  },
  "recentUsers": [...],
  "recentMeetings": [...]
}
```

---

## 🔌 Socket.IO Events

Connect to Socket.IO server:
```javascript
const socket = io('http://localhost:5003');
```

### Client → Server Events

#### join-room
```javascript
socket.emit('join-room', roomId, userId, userName);
```

#### offer (WebRTC)
```javascript
socket.emit('offer', { sdp, type }, roomId);
```

#### answer (WebRTC)
```javascript
socket.emit('answer', { sdp, type }, roomId);
```

#### ice-candidate (WebRTC)
```javascript
socket.emit('ice-candidate', { candidate }, roomId);
```

#### toggle-video
```javascript
socket.emit('toggle-video', roomId, enabled);
```

#### toggle-audio
```javascript
socket.emit('toggle-audio', roomId, enabled);
```

#### screen-share-started
```javascript
socket.emit('screen-share-started', roomId, userId);
```

#### screen-share-stopped
```javascript
socket.emit('screen-share-stopped', roomId, userId);
```

#### send-message
```javascript
socket.emit('send-message', {
  userId,
  userName,
  message: 'Hello!'
}, roomId);
```

#### file-shared
```javascript
socket.emit('file-shared', {
  name: 'document.pdf',
  size: 1024,
  url: '/uploads/...',
  userId,
  userName
}, roomId);
```

#### hand-raised
```javascript
socket.emit('hand-raised', {
  userId,
  userName,
  raised: true
}, roomId);
```

#### reaction-sent
```javascript
socket.emit('reaction-sent', {
  userId,
  userName,
  reaction: '👍'
}, roomId);
```

#### mute-participant (Host)
```javascript
socket.emit('mute-participant', {
  userId,
  muted: true
}, roomId);
```

#### remove-participant (Host)
```javascript
socket.emit('remove-participant', {
  userId
}, roomId);
```

#### recording-started
```javascript
socket.emit('recording-started', roomId);
```

#### recording-stopped
```javascript
socket.emit('recording-stopped', roomId);
```

#### whiteboard-draw
```javascript
socket.emit('whiteboard-draw', {
  type: 'line',
  points: [x1, y1, x2, y2],
  color: '#000000'
}, roomId);
```

#### whiteboard-clear
```javascript
socket.emit('whiteboard-clear', roomId);
```

#### poll-created
```javascript
socket.emit('poll-created', {
  question: 'Do you agree?',
  options: ['Yes', 'No'],
  createdBy: userId
}, roomId);
```

#### poll-vote
```javascript
socket.emit('poll-vote', {
  pollId,
  optionIndex: 0,
  userId
}, roomId);
```

#### leave-room
```javascript
socket.emit('leave-room', roomId);
```

---

### Server → Client Events

#### user-connected
```javascript
socket.on('user-connected', (userId, userName) => {
  console.log(`${userName} joined`);
});
```

#### user-disconnected
```javascript
socket.on('user-disconnected', (userId) => {
  console.log(`User ${userId} left`);
});
```

#### participant-count
```javascript
socket.on('participant-count', (count) => {
  console.log(`${count} participants in room`);
});
```

#### offer (WebRTC)
```javascript
socket.on('offer', (data, socketId) => {
  // Handle WebRTC offer
});
```

#### answer (WebRTC)
```javascript
socket.on('answer', (data, socketId) => {
  // Handle WebRTC answer
});
```

#### ice-candidate (WebRTC)
```javascript
socket.on('ice-candidate', (data, socketId) => {
  // Handle ICE candidate
});
```

#### user-video-toggle
```javascript
socket.on('user-video-toggle', (socketId, enabled) => {
  console.log(`User ${socketId} video: ${enabled}`);
});
```

#### user-audio-toggle
```javascript
socket.on('user-audio-toggle', (socketId, enabled) => {
  console.log(`User ${socketId} audio: ${enabled}`);
});
```

#### user-screen-share-started
```javascript
socket.on('user-screen-share-started', (userId) => {
  console.log(`${userId} started screen sharing`);
});
```

#### user-screen-share-stopped
```javascript
socket.on('user-screen-share-stopped', (userId) => {
  console.log(`${userId} stopped screen sharing`);
});
```

#### receive-message
```javascript
socket.on('receive-message', (message) => {
  console.log(`${message.userName}: ${message.message}`);
});
```

#### file-shared
```javascript
socket.on('file-shared', (fileData) => {
  console.log(`${fileData.userName} shared ${fileData.name}`);
});
```

#### hand-raised
```javascript
socket.on('hand-raised', (data) => {
  console.log(`${data.userName} ${data.raised ? 'raised' : 'lowered'} hand`);
});
```

#### reaction-sent
```javascript
socket.on('reaction-sent', (data) => {
  console.log(`${data.userName} sent ${data.reaction}`);
});
```

#### mute-participant
```javascript
socket.on('mute-participant', (data) => {
  if (data.userId === myUserId) {
    muteMyAudio();
  }
});
```

#### remove-participant
```javascript
socket.on('remove-participant', (data) => {
  if (data.userId === myUserId) {
    leaveMeeting();
  }
});
```

#### recording-started
```javascript
socket.on('recording-started', () => {
  showRecordingIndicator();
});
```

#### recording-stopped
```javascript
socket.on('recording-stopped', () => {
  hideRecordingIndicator();
});
```

#### whiteboard-draw
```javascript
socket.on('whiteboard-draw', (data) => {
  drawOnCanvas(data);
});
```

#### whiteboard-clear
```javascript
socket.on('whiteboard-clear', () => {
  clearCanvas();
});
```

#### poll-created
```javascript
socket.on('poll-created', (poll) => {
  displayPoll(poll);
});
```

#### poll-vote
```javascript
socket.on('poll-vote', (data) => {
  updatePollResults(data);
});
```

---

## ❌ Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### Common HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input/validation failed
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Validation Errors

When validation fails (400 status):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## ⏱️ Rate Limiting

Different rate limits apply to different endpoints:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Authentication | 5 requests | 15 minutes |
| File Uploads | 20 requests | 1 hour |
| Meeting Creation | 50 requests | 1 hour |
| Password Reset | 3 requests | 1 hour |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642348800
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

---

## 🔒 Security Features

1. **Helmet.js** - Security headers enabled
2. **CORS** - Cross-origin requests configured
3. **Rate Limiting** - DDoS protection
4. **Input Validation** - Request validation with express-validator
5. **JWT Tokens** - Secure authentication
6. **Refresh Token Rotation** - Token security
7. **Password Hashing** - bcrypt with 10 rounds
8. **File Upload Validation** - Type and size limits

---

## 🚀 Getting Started

1. **Install Dependencies:**
```bash
cd backend
npm install
```

2. **Configure Environment:**
Edit `.env` file with your settings

3. **Start Server:**
```bash
npm start
```

4. **Server Running:**
```
✅ VCollab Backend Server v1.0
✅ Server running on port 5003
✅ API: http://localhost:5003
✅ Socket.IO ready for connections
```

5. **Test API:**
```bash
curl http://localhost:5003
```

---

## 📞 Support

For questions or issues:
- Check this documentation first
- Review error messages and status codes
- Ensure valid authentication tokens
- Verify request format matches examples

**API Version:** 1.0.0  
**Last Updated:** January 2025
