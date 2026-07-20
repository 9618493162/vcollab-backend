# 🎥 VCollab - Video Collaboration Platform

A full-stack video collaboration platform designed to help organizations conduct virtual meetings, collaborate in real-time, and manage team communication efficiently.

The platform provides secure authentication, HD video conferencing using LiveKit, real-time chat, screen sharing, breakout rooms, AI-powered meeting assistance, and comprehensive meeting management.

---

## 🔗 Links

- **GitHub Repository**: [https://github.com/9618493162/vcollab-backend](https://github.com/9618493162/vcollab-backend)
- **Frontend**: [https://vcollab-react.vercel.app](https://vcollab-react.vercel.app)
- **Backend API**: [https://vcollab-backend-production.up.railway.app](https://vcollab-backend-production.up.railway.app)

---

## 📌 Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication with refresh tokens
- OAuth integration (Google, GitHub) via Supabase
- Secure password hashing using bcrypt
- User-specific data access
- Protected routes with middleware
- Profile management and avatar upload

### 📹 Video Conferencing
- HD video and audio using LiveKit WebRTC
- Screen sharing (entire screen or specific windows)
- Virtual backgrounds (blur or custom)
- Meeting recording with cloud storage
- Support for up to 100 participants
- Adaptive bitrate for network conditions
- Multiple video layouts (grid, speaker, custom)

### 💬 Real-time Collaboration
- Live chat with emoji support
- Reactions during meetings (👍 ❤️ 😂 👏)
- Hand raising for orderly participation
- File sharing and document collaboration
- Collaborative whiteboard with drawing tools
- Real-time participant list
- In-meeting notifications

### 🎯 Meeting Management
- Create instant or scheduled meetings
- Generate shareable meeting links
- Meeting ID for easy access
- View meeting history
- Track upcoming meetings
- Host controls:
  - Mute/unmute participants
  - Remove users
  - End meeting for all
  - Lock meeting room
- Waiting room functionality
- Meeting settings customization

### 🤖 AI-Powered Features
- AI Copilot for real-time assistance
- Automatic meeting transcription
- Smart meeting summaries
- Action item extraction
- Meeting insights and analytics
- Participant engagement tracking

### 🎨 Advanced Features
- Breakout rooms for group discussions
- Live polls and voting
- Analytics dashboard
- Dark mode support
- Responsive design for all devices
- Socket.IO for real-time updates

---

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (Build tool)
- Tailwind CSS
- LiveKit React Components
- Axios
- React Router
- Lucide React (Icons)
- Socket.IO Client

### Backend
- Node.js 22+
- Express.js 5
- Socket.IO
- JWT Authentication
- Bcrypt
- Helmet (Security)
- Winston (Logging)
- Express Rate Limit
- CORS

### Cloud Services
- **Supabase** (Database + Auth + Storage)
- **LiveKit Cloud** (Video Infrastructure)
- **Vercel** (Frontend Hosting)
- **Railway** (Backend Hosting)
- **OpenAI** (AI Features - Optional)

### Tools
- Git
- GitHub
- VS Code
- Postman
- Chrome DevTools

---

## 📂 Project Structure

```
VCollab/
│
├── vcollab-react/                  # React Frontend
│   │
│   ├── src/
│   │   │
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreateMeeting.tsx
│   │   │   ├── JoinMeeting.tsx
│   │   │   ├── MeetingRoom.tsx
│   │   │   ├── Breakout.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Whiteboard.tsx
│   │   │   ├── AICopilot.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── Profile.tsx
│   │   │
│   │   ├── services/              # API and business logic
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── meetings.ts
│   │   │   ├── livekit.ts
│   │   │   └── webrtc.ts
│   │   │
│   │   ├── contexts/              # React Context
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json
│
│
└── backend/                        # Node.js Backend
    │
    ├── src/
    │   │
    │   ├── controllers/           # Request handlers
    │   │   ├── authController.js
    │   │   ├── meetingController.js
    │   │   ├── livekitController.js
    │   │   ├── userController.js
    │   │   └── roomController.js
    │   │
    │   ├── middleware/            # Express middleware
    │   │   ├── auth.js
    │   │   ├── security.js
    │   │   ├── errorHandler.js
    │   │   └── validator.js
    │   │
    │   ├── routes/                # API routes
    │   │   ├── auth.js
    │   │   ├── meetings.js
    │   │   ├── livekit.js
    │   │   └── users.js
    │   │
    │   ├── utils/                 # Utilities
    │   │   ├── logger.js
    │   │   ├── supabase.js
    │   │   └── tokenUtils.js
    │   │
    │   ├── app.js
    │   └── server.js
    │
    ├── api/                        # Serverless functions
    ├── logs/
    ├── .env
    ├── .env.example
    ├── .nvmrc
    ├── package.json
    └── vercel.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22 or higher
- npm or yarn
- Git
- Supabase account
- LiveKit Cloud account

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/9618493162/vcollab-backend.git
cd vcollab-backend
```

### Backend Setup

Move into backend:

```bash
cd backend
```

Install packages:

```bash
npm install
```

### Create Environment File

Create `.env` file in `backend/` folder:

```env
# Server Configuration
NODE_ENV=production
PORT=5002

# Supabase Configuration
SUPABASE_URL=https://wwdbdstbbpcmcbzwgunj.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
SESSION_SECRET=your_session_secret_key_min_32_chars

# LiveKit Configuration
LIVEKIT_URL=wss://vcollab-a6y9bamp.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# MongoDB (Optional)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vcollab

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key
```

### ▶️ Run Backend Server

Development mode:

```bash
npm start
```

Server will run at:

```
http://localhost:5002
```

You should see:

```
🚀 =======================================
✅ VCollab Backend Server v1.0
✅ Server running on port 5002
✅ API: http://localhost:5002
✅ Socket.IO ready for connections
✅ Rate limiting enabled
✅ Security middleware active
🚀 =======================================
```

### Frontend Setup

Open a new terminal and move to frontend:

```bash
cd vcollab-react
```

Install packages:

```bash
npm install
```

Create `.env` file in `vcollab-react/` folder:

```env
VITE_API_URL=http://localhost:5002/api
VITE_LIVEKIT_URL=wss://vcollab-a6y9bamp.livekit.cloud
VITE_SUPABASE_URL=https://wwdbdstbbpcmcbzwgunj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 🌐 Run Frontend

Start development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

Open your browser and navigate to `http://localhost:5173`

---

## 🔗 API Endpoints

### Authentication APIs

**Register User**

`POST /api/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Login User**

`POST /api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Refresh Token**

`POST /api/auth/refresh`

Request:
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

---

### 📁 Meeting APIs

All meeting APIs are protected and require JWT token.

**Get All Meetings**

`GET /api/meetings`

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
[
  {
    "id": "meeting_id",
    "title": "Team Standup",
    "meeting_id": "abc-def-ghi",
    "status": "scheduled",
    "scheduled_time": "2026-07-20T10:00:00Z",
    "duration": 30,
    "created_by": "user_id"
  }
]
```

**Create Meeting**

`POST /api/meetings/create`

Headers:
```
Authorization: Bearer <token>
```

Body:
```json
{
  "title": "Project Review",
  "description": "Q3 project review meeting",
  "scheduled_time": "2026-07-20T14:00:00Z",
  "duration": 60
}
```

Response:
```json
{
  "id": "meeting_id",
  "meeting_id": "xyz-123-abc",
  "title": "Project Review",
  "join_url": "https://vcollab-react.vercel.app/meeting/xyz-123-abc"
}
```

**Get Single Meeting**

`GET /api/meetings/:id`

**Update Meeting**

`PUT /api/meetings/:id`

Example:
```json
{
  "title": "Updated Title",
  "status": "completed"
}
```

**Delete Meeting**

`DELETE /api/meetings/:id`

**Join Meeting**

`POST /api/meetings/:id/join`

---

### 🎥 LiveKit APIs

**Generate Access Token**

`POST /api/livekit/token`

Headers:
```
Authorization: Bearer <token>
```

Body:
```json
{
  "meetingId": "abc-def-ghi",
  "userName": "John Doe"
}
```

Response:
```json
{
  "token": "livekit_access_token",
  "url": "wss://vcollab-a6y9bamp.livekit.cloud"
}
```

**Get LiveKit Config**

`GET /api/livekit/config`

Response:
```json
{
  "url": "wss://vcollab-a6y9bamp.livekit.cloud"
}
```

---

### 👤 User APIs

**Get User Profile**

`GET /api/users/profile`

Headers:
```
Authorization: Bearer <token>
```

**Update User Profile**

`PUT /api/users/profile`

Body:
```json
{
  "name": "Jane Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Get Meeting History**

`GET /api/users/meetings`

---

### Health Check

`GET /health`

Response:
```json
{
  "status": "OK",
  "timestamp": "2026-07-19T12:00:00Z"
}
```

---

## 🔐 Authentication Flow

```
User Login/Register
        |
        |
Backend validates credentials
        |
        |
JWT Access Token + Refresh Token Generated
        |
        |
Frontend stores tokens in localStorage
        |
        |
Token sent with every API request (Authorization header)
        |
        |
Middleware verifies JWT token
        |
        |
Access user-specific data
        |
        |
Token expires → Use refresh token to get new access token
```

---

## 🧪 Testing

### Manual Testing

1. **Register User**
   - Navigate to `/register`
   - Create new account with email and password

2. **Login**
   - Go to `/login`
   - Sign in with credentials

3. **Create Meeting**
   - Navigate to `/create-meeting`
   - Fill in meeting details
   - Click "Create Meeting"

4. **Join Meeting**
   - Copy meeting link or ID
   - Open meeting room
   - Enable video and audio

5. **Test Features**:
   - ✅ Video/audio toggle
   - ✅ Screen sharing
   - ✅ Chat messages
   - ✅ Reactions
   - ✅ Hand raising
   - ✅ Whiteboard
   - ✅ Breakout rooms
   - ✅ Polls

### API Testing with Postman

**Register User:**
```bash
POST http://localhost:5002/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Login:**
```bash
POST http://localhost:5002/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy JWT token from response.

**Create Meeting:**
```bash
POST http://localhost:5002/api/meetings/create
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Test Meeting",
  "scheduled_time": "2026-07-20T10:00:00Z",
  "duration": 30
}
```

---

---

## 🐛 Troubleshooting

### Common Issues

**❌ "Network Error" when creating meetings**

**Solution:**
- Verify backend is running at the correct URL
- Check CORS configuration in `backend/src/middleware/security.js`
- Ensure `VITE_API_URL` in frontend `.env` is correct
- Check browser console for detailed error messages

**❌ Video not connecting in meeting room**

**Solution:**
- Verify LiveKit credentials in `.env` files
- Check browser permissions for camera/microphone access
- Test LiveKit connection at `/livekit-config` endpoint
- Ensure firewall allows WebRTC traffic (UDP ports)

**❌ "Failed to connect to Supabase"**

**Solution:**
- Ensure Node.js version is **22 or higher** (`node --version`)
- Verify Supabase URL and anon key are correct
- Check Supabase project status at supabase.com
- Review Supabase connection logs in backend console

**❌ Railway deployment 502 Bad Gateway**

**Solution:**
- Check Railway deployment logs for startup errors
- Verify all environment variables are set correctly
- Ensure `PORT` is not manually set (Railway provides it)
- Test locally with `npm start` before deploying

**❌ JWT token errors or "Unauthorized"**

**Solution:**
- Clear browser localStorage and cookies
- Click "Refresh Login" button in frontend
- Verify JWT secrets are the same on backend
- Check token expiry settings in `backend/src/middleware/auth.js`

---

## 🔒 Security Features

- **Helmet.js**: Secure HTTP headers
- **CORS**: Cross-Origin Resource Sharing protection
- **Rate Limiting**: API endpoint throttling (100 requests/15 min)
- **XSS Protection**: Cross-site scripting prevention
- **MongoDB Sanitization**: NoSQL injection prevention
- **HPP Protection**: HTTP parameter pollution prevention
- **JWT Tokens**: Stateless authentication with short-lived access tokens
- **Bcrypt Hashing**: Password encryption with salt rounds
- **Environment Variables**: Sensitive data in .env files (not in code)
- **Input Validation**: Express-validator for request data

---

## 📈 Performance Optimizations

- **Vite Build**: Lightning-fast builds with code splitting
- **React.lazy**: Component lazy loading for faster initial load
- **CDN Hosting**: Static assets served via Vercel Edge Network
- **Database Indexing**: Optimized Supabase queries
- **Winston Logging**: Efficient log rotation to prevent disk overflow
- **Socket.IO Rooms**: Isolated namespaces for scalable real-time communication
- **LiveKit SFU**: Selective Forwarding Unit for efficient video routing

---

## 🎯 Roadmap

### Version 2.0 (Planned)

- [ ] **Mobile Apps**: React Native for iOS and Android
- [ ] **Desktop App**: Electron wrapper for Windows/Mac/Linux
- [ ] **Calendar Integration**: Google Calendar, Outlook sync
- [ ] **Advanced Analytics**: Detailed meeting insights and reports
- [ ] **Multi-language Support**: i18n internationalization
- [ ] **SIP Integration**: Connect with traditional phone systems
- [ ] **Meeting Templates**: Pre-configured meeting settings
- [ ] **Cloud Recording**: Direct upload to AWS S3 / Google Cloud Storage
- [ ] **End-to-End Encryption**: Enhanced security for sensitive meetings
- [ ] **Custom Branding**: White-label solution for enterprises
- [ ] **Webhooks**: Event notifications for external integrations
- [ ] **REST API v2**: Enhanced API with GraphQL support

---

## 📌 Git Commands

Initialize repository:
```bash
git init
```

Add files:
```bash
git add .
```

Commit:
```bash
git commit -m "Initial commit"
```

Connect remote:
```bash
git remote add origin https://github.com/9618493162/vcollab-backend.git
```

Push code:
```bash
git push origin main
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team & Acknowledgments

**Development Team:**
- Full-stack development and architecture

**Built With:**
- ❤️ React and TypeScript
- ⚡ Vite and Node.js
- 🎥 LiveKit video infrastructure
- 🔐 Supabase authentication and database
- ☁️ Vercel and Railway hosting

**Special Thanks:**
- [LiveKit](https://livekit.io) for excellent video infrastructure
- [Supabase](https://supabase.com) for powerful backend services
- [Vercel](https://vercel.com) and [Railway](https://railway.app) for reliable hosting

---

## 📞 Support & Contact

- **GitHub Repository**: [https://github.com/9618493162/vcollab-backend](https://github.com/9618493162/vcollab-backend)
- **Issues**: [https://github.com/9618493162/vcollab-backend/issues](https://github.com/9618493162/vcollab-backend/issues)
- **Documentation**: [Full Documentation](./PROJECT_DOCUMENTATION.md)
- **Website**: [https://vcollab-react.vercel.app](https://vcollab-react.vercel.app)

---

## 📊 Project Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Production URLs:**
- **Frontend**: https://vcollab-react.vercel.app ✅
- **Backend**: https://vcollab-backend-production.up.railway.app ⚠️ (Deployment in progress)
- **Database**: Supabase (Active) ✅
- **Video**: LiveKit Cloud (Active) ✅

---

<div align="center">

**Made with ❤️ using React, Node.js, LiveKit, and Supabase**

⭐ Star this repository if you find it helpful!

</div>
