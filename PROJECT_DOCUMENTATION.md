# VCollab - Video Collaboration Platform
Project Documentation

**Course:** B.Tech (Computer Science & Engineering)

**Project Link:** [VCollab Frontend](https://vcollab-react.vercel.app) | [VCollab Backend](https://vcollab-backend-production.up.railway.app)

---

## 1. Project Overview & Objectives

VCollab is a full-stack video collaboration platform that enables organizations to conduct virtual meetings, collaborate in real-time, and manage team communication efficiently. The platform integrates LiveKit for high-quality video/audio streaming and provides features like screen sharing, chat, breakout rooms, and AI-powered meeting assistance.

### Main Objectives:

- **Secure Authentication**: Provide user authentication using Supabase Auth with JWT tokens and OAuth support (Google, GitHub)
- **Real-time Video Collaboration**: Enable HD video conferencing using LiveKit Cloud infrastructure with support for up to 100 participants
- **Meeting Management**: Enable users to create, schedule, join, and manage meetings with shareable links
- **Interactive Features**: Support screen sharing, chat, reactions, hand raising, polls, and whiteboard collaboration
- **AI-Powered Features**: Meeting transcription, AI copilot assistance, and smart summaries
- **Cloud Deployment**: Fully deployed on Vercel (frontend) and Railway (backend) for production use

---

## 2. Features Implemented

### Authentication & User Management
- User signup and login with email/password
- OAuth integration (Google, GitHub) for social login
- JWT-based session management with refresh tokens
- Secure password hashing using bcrypt
- Profile management and avatar upload

### Meeting Features
- **Create & Schedule Meetings**: Users can create instant or scheduled meetings with custom settings
- **Join Meetings**: Join via meeting ID or shareable link
- **Video & Audio**: HD quality video/audio with LiveKit WebRTC infrastructure
- **Screen Sharing**: Share entire screen or specific application windows
- **Recording**: Record meetings with cloud storage integration
- **Virtual Backgrounds**: Blur or replace backgrounds during calls

### Real-time Collaboration
- **Live Chat**: In-meeting text chat with emoji support
- **Reactions**: Quick emoji reactions during meetings
- **Hand Raising**: Virtual hand raise for orderly participation
- **Polls**: Create and vote on polls during meetings
- **Whiteboard**: Collaborative drawing and annotation
- **File Sharing**: Share documents and files during meetings

### Advanced Features
- **Breakout Rooms**: Split participants into smaller discussion groups
- **AI Copilot**: Real-time meeting assistance and note-taking
- **Transcription**: Automatic speech-to-text transcription
- **Meeting Insights**: Analytics and participation tracking
- **Host Controls**: Mute participants, remove users, end meetings

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **Video SDK**: LiveKit React Components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **Authentication**: JWT, Supabase Auth
- **Video Infrastructure**: LiveKit Cloud
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Socket.IO for signaling
- **Security**: Helmet, CORS, Rate Limiting, XSS Protection
- **Logging**: Winston with daily rotation
- **Deployment**: Railway

### Cloud Services
- **Database & Auth**: Supabase (wwdbdstbbpcmcbzwgunj.supabase.co)
- **Video Infrastructure**: LiveKit Cloud (wss://vcollab-a6y9bamp.livekit.cloud)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway

### Development Tools
- Git & GitHub for version control
- VS Code as primary IDE
- Postman for API testing
- Chrome DevTools for debugging

---

## 4. Project Folder Structure

```
IITHYB (3)/
├── vcollab-react/                    # React Frontend Application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Layout.tsx          # Main layout wrapper
│   │   │   ├── Navbar.tsx          # Navigation bar
│   │   │   └── ProtectedRoute.tsx  # Auth guard component
│   │   ├── pages/                  # Page components
│   │   │   ├── Login.tsx           # Login page
│   │   │   ├── Register.tsx        # Registration page
│   │   │   ├── Dashboard.tsx       # User dashboard
│   │   │   ├── CreateMeeting.tsx   # Meeting creation form
│   │   │   ├── JoinMeeting.tsx     # Join meeting interface
│   │   │   ├── MeetingRoom.tsx     # Live meeting room with video
│   │   │   ├── Breakout.tsx        # Breakout rooms management
│   │   │   ├── Chat.tsx            # In-meeting chat
│   │   │   ├── Whiteboard.tsx      # Collaborative whiteboard
│   │   │   ├── AICopilot.tsx       # AI assistant interface
│   │   │   ├── AdminDashboard.tsx  # Admin panel
│   │   │   └── Profile.tsx         # User profile page
│   │   ├── services/               # API and business logic
│   │   │   ├── api.ts             # Axios HTTP client setup
│   │   │   ├── auth.ts            # Authentication service
│   │   │   ├── meetings.ts        # Meeting CRUD operations
│   │   │   ├── livekit.ts         # LiveKit token management
│   │   │   └── webrtc.ts          # WebRTC signaling logic
│   │   ├── contexts/              # React Context providers
│   │   │   └── AuthContext.tsx    # Global auth state
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # App entry point
│   │   └── index.css              # Global styles
│   ├── public/                    # Static assets
│   ├── .env.example               # Environment variables template
│   ├── package.json               # Frontend dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   ├── vite.config.ts             # Vite build configuration
│   └── vercel.json                # Vercel deployment config
│
└── backend/                       # Node.js Backend Application
    ├── src/
    │   ├── controllers/          # Request handlers
    │   │   ├── authController.js       # Login/register logic
    │   │   ├── meetingController.js    # Meeting CRUD operations
    │   │   ├── livekitController.js    # LiveKit token generation
    │   │   ├── userController.js       # User profile management
    │   │   └── roomController.js       # Socket.IO room coordination
    │   ├── middleware/          # Express middleware
    │   │   ├── auth.js                # JWT verification
    │   │   ├── security.js            # CORS, Helmet, Rate limiting
    │   │   ├── errorHandler.js        # Global error handler
    │   │   └── validator.js           # Input validation
    │   ├── routes/              # API route definitions
    │   │   ├── auth.js               # /api/auth routes
    │   │   ├── meetings.js           # /api/meetings routes
    │   │   ├── livekit.js            # /api/livekit routes
    │   │   └── users.js              # /api/users routes
    │   ├── utils/               # Utility functions
    │   │   ├── logger.js            # Winston logger setup
    │   │   ├── supabase.js          # Supabase client
    │   │   └── tokenUtils.js        # JWT helpers
    │   ├── app.js               # Express app setup
    │   └── server.js            # HTTP server and Socket.IO
    ├── api/                     # Serverless function handlers (legacy)
    ├── logs/                    # Application logs (gitignored)
    ├── .env                     # Environment variables (gitignored)
    ├── .env.example             # Environment template
    ├── .nvmrc                   # Node version specification
    ├── package.json             # Backend dependencies
    └── vercel.json              # Vercel config (legacy)
```

---

## 5. How to Run the Project

### Prerequisites

Before running the project, ensure you have:
- Node.js 22 or higher installed
- npm or yarn package manager
- Git for version control
- Supabase account with project created
- LiveKit Cloud account with credentials

### Which File to Execute First

You must run the **backend/src/server.js** file first. The backend must be active to handle API requests and Socket.IO connections before the frontend can function properly.

### Step-by-Step Instructions

#### 1. Clone the Project

```bash
git clone https://github.com/9618493162/vcollab-backend.git
cd vcollab-backend
```

#### 2. Configure Backend Environment Variables

Create a file named `.env` in the `backend/` folder:

```env
# Server Configuration
NODE_ENV=production
PORT=5002

# Supabase Configuration
SUPABASE_URL=https://wwdbdstbbpcmcbzwgunj.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
SESSION_SECRET=your_session_secret_here

# LiveKit Configuration
LIVEKIT_URL=wss://vcollab-a6y9bamp.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# MongoDB (Optional - for room coordination)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vcollab

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=your_openai_api_key
```

#### 3. Configure Frontend Environment Variables

Create a file named `.env` in the `vcollab-react/` folder:

```env
VITE_API_URL=http://localhost:5002/api
VITE_LIVEKIT_URL=wss://vcollab-a6y9bamp.livekit.cloud
VITE_SUPABASE_URL=https://wwdbdstbbpcmcbzwgunj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 5. Start Backend Server

```bash
npm start
```

The backend will now be running at `http://localhost:5002`

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

#### 6. Install Frontend Dependencies

Open a new terminal:

```bash
cd vcollab-react
npm install
```

#### 7. Start Frontend Development Server

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`

#### 8. Access the Application

Open your browser and navigate to `http://localhost:5173`

---

## 6. API Endpoints Map

### Authentication Endpoints

| Method | Endpoint | Description | Payload Example |
|--------|----------|-------------|-----------------|
| POST | `/api/auth/register` | Register new user | `{"email":"user@example.com","password":"password123","name":"John Doe"}` |
| POST | `/api/auth/login` | Login user | `{"email":"user@example.com","password":"password123"}` |
| POST | `/api/auth/logout` | Logout user | Requires JWT Token |
| POST | `/api/auth/refresh` | Refresh access token | `{"refreshToken":"..."}` |
| GET | `/api/auth/verify` | Verify JWT token | Requires JWT Token |

### Meeting Endpoints

| Method | Endpoint | Description | Payload Example |
|--------|----------|-------------|-----------------|
| GET | `/api/meetings` | Get user's meetings | Requires JWT Token |
| POST | `/api/meetings/create` | Create new meeting | `{"title":"Team Standup","scheduled_time":"2026-07-20T10:00:00Z","duration":30}` |
| GET | `/api/meetings/:id` | Get meeting details | Requires JWT Token |
| PUT | `/api/meetings/:id` | Update meeting | `{"title":"Updated Title","status":"completed"}` |
| DELETE | `/api/meetings/:id` | Delete meeting | Requires JWT Token |
| POST | `/api/meetings/:id/join` | Join meeting | Requires JWT Token |

### LiveKit Endpoints

| Method | Endpoint | Description | Payload Example |
|--------|----------|-------------|-----------------|
| POST | `/api/livekit/token` | Generate access token | `{"meetingId":"abc123","userName":"John Doe"}` |
| GET | `/api/livekit/config` | Get LiveKit configuration | Public endpoint |

### User Endpoints

| Method | Endpoint | Description | Payload Example |
|--------|----------|-------------|-----------------|
| GET | `/api/users/profile` | Get user profile | Requires JWT Token |
| PUT | `/api/users/profile` | Update user profile | `{"name":"Jane Doe","avatar":"https://..."}` |
| GET | `/api/users/meetings` | Get meeting history | Requires JWT Token |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

---

## 7. Deployment Guide

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy Frontend**:
```bash
cd vcollab-react
vercel --prod
```

4. **Configure Environment Variables** in Vercel Dashboard:
- `VITE_API_URL` = `https://vcollab-backend-production.up.railway.app/api`
- `VITE_LIVEKIT_URL` = `wss://vcollab-a6y9bamp.livekit.cloud`
- `VITE_SUPABASE_URL` = Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

**Production URL**: https://vcollab-react.vercel.app

### Backend Deployment (Railway)

1. **Create Railway Account** at https://railway.app

2. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

3. **Login to Railway**:
```bash
railway login
```

4. **Link Project**:
```bash
cd backend
railway link
```

5. **Set Environment Variables**:
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secret
railway variables set SUPABASE_URL=your_url
railway variables set SUPABASE_ANON_KEY=your_key
railway variables set LIVEKIT_URL=your_livekit_url
railway variables set LIVEKIT_API_KEY=your_key
railway variables set LIVEKIT_API_SECRET=your_secret
```

6. **Deploy**:
```bash
git push origin main
```

Railway will auto-deploy from GitHub.

**Production URL**: https://vcollab-backend-production.up.railway.app

---

## 8. Testing the Application

### Manual Testing Steps

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in with your credentials at `/login`
3. **Create Meeting**: Navigate to `/create-meeting` and create a new meeting
4. **Join Meeting**: Copy the meeting link and join the video call
5. **Test Features**:
   - Enable/disable video and audio
   - Share screen
   - Send chat messages
   - Raise hand
   - Create polls
   - Use whiteboard

### API Testing with Postman

Import the following collection to test all endpoints:

```json
{
  "info": {
    "name": "VCollab API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\"}",
          "options": {"raw": {"language": "json"}}
        },
        "url": {
          "raw": "https://vcollab-backend-production.up.railway.app/api/auth/register"
        }
      }
    }
  ]
}
```

---

## 9. Troubleshooting

### Common Issues

**Issue**: "Network Error" when creating meetings
- **Solution**: Check if backend is running and CORS is configured correctly
- Verify `VITE_API_URL` points to correct backend URL
- Check browser console for CORS errors

**Issue**: Video not connecting in meeting room
- **Solution**: Verify LiveKit credentials are correct
- Check browser permissions for camera/microphone
- Test LiveKit connection at `/livekit-config`

**Issue**: "Failed to connect to Supabase"
- **Solution**: Ensure Node.js version is 22 or higher
- Verify Supabase URL and keys are correct
- Check network connectivity to Supabase

**Issue**: 502 Bad Gateway on Railway
- **Solution**: Check Railway deployment logs
- Verify all environment variables are set
- Ensure `npm start` command works locally

---

## 10. Future Enhancements

- **Mobile App**: React Native version for iOS and Android
- **Desktop App**: Electron wrapper for desktop installation
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Advanced Analytics**: Detailed meeting insights and reports
- **Language Support**: Multi-language interface
- **SIP Integration**: Connect with traditional phone systems
- **Meeting Templates**: Pre-configured meeting settings
- **Cloud Recording**: Direct upload to cloud storage
- **E2E Encryption**: Enhanced security for sensitive meetings

---

## 11. Team & Credits

**Team Members:**
- Developer Team (Frontend & Backend)

**Technologies Used:**
- React, TypeScript, Node.js, Express
- LiveKit, Supabase, Socket.IO
- Vercel, Railway

**Special Thanks:**
- LiveKit for video infrastructure
- Supabase for database and authentication
- Vercel and Railway for hosting

---

## 12. License & Contact

**License**: MIT License

**Contact Information:**
- Project Repository: [https://github.com/9618493162/vcollab-backend](https://github.com/9618493162/vcollab-backend)
- Issues/Support: [https://github.com/9618493162/vcollab-backend/issues](https://github.com/9618493162/vcollab-backend/issues)
- Documentation: This file

---

## Appendix: Environment Variables Reference

### Backend Required Variables
```
NODE_ENV=production
PORT=5002
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
JWT_REFRESH_SECRET=
SESSION_SECRET=
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```

### Frontend Required Variables
```
VITE_API_URL=
VITE_LIVEKIT_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

**Document Version**: 1.0  
**Last Updated**: July 19, 2026  
**Status**: Production Ready

