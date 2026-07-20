# 🔐 Authentication & Database Setup Guide

## Current Status

Your backend authentication is **properly coded** but needs **Supabase configuration**. Here's what you have:

✅ **Working Code:**
- JWT authentication system
- Password hashing with bcrypt
- Auth middleware for protected routes
- Login/Register controllers
- Profile management

❌ **Missing Configuration:**
- Supabase API key not set
- Database tables not created
- .env file needs proper keys

---

## 🚀 Quick Setup (Choose One Option)

### **Option 1: Use Supabase (Recommended)**

Supabase provides a PostgreSQL database with REST API, authentication, and real-time features.

#### **Step 1: Create Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign up with GitHub/Google
4. Create a new project:
   - **Name**: VCollab
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to you
   - Click **"Create new project"**

#### **Step 2: Get API Keys**

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

#### **Step 3: Update .env File**

Open `backend\.env` and replace with your actual keys:

```env
PORT=5002

# Replace these with YOUR actual Supabase credentials
SUPABASE_URL=https://hpokudzqefoylvaahsbd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here

# Keep this or generate a random strong secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

**Important:** Replace the URL and key with YOUR actual values from Supabase!

#### **Step 4: Create Database Tables**

In Supabase dashboard:

1. Go to **SQL Editor**
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id TEXT UNIQUE NOT NULL,
    host_id UUID REFERENCES users(id) ON DELETE CASCADE,
    host_email TEXT,
    title TEXT,
    participants INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_meetings_host ON meetings(host_id);
CREATE INDEX IF NOT EXISTS idx_meetings_id ON meetings(meeting_id);

-- Enable Row Level Security (Optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies (allows users to read their own data)
CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow service role to do everything (for our backend)
CREATE POLICY "Service role has full access to users" ON users
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to meetings" ON meetings
    FOR ALL USING (true);
```

4. Click **"Run"** or press `Ctrl+Enter`
5. Check for success message

#### **Step 5: Test the Setup**

Restart your backend server:

```bash
cd backend
npm start
```

You should see:
```
✅ Supabase client configured successfully
✅ Server running on port 5002
✅ Socket.IO ready for connections
✅ Supabase connected
```

---

### **Option 2: Use MongoDB (Alternative)**

If you prefer MongoDB instead of Supabase:

#### **Step 1: Install MongoDB**

**Option A - MongoDB Atlas (Cloud):**
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up and create free cluster
3. Get connection string

**Option B - Local MongoDB:**
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

#### **Step 2: Modify Backend for MongoDB**

You'll need to:
1. Replace Supabase with Mongoose
2. Create user model
3. Update controllers

Would you like me to provide MongoDB setup code? (Let me know!)

---

## 🧪 Testing Authentication

Once configured, test with these steps:

### **1. Test Registration**

Open browser console and run:

```javascript
fetch('http://localhost:5002/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid-here",
    "fullName": "Test User",
    "email": "test@example.com"
  }
}
```

### **2. Test Login**

```javascript
fetch('http://localhost:5002/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(d => {
  console.log(d);
  // Save token
  localStorage.setItem('token', d.token);
});
```

### **3. Test Protected Route**

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5002/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log(d));
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "fullName": "Test User",
    "email": "test@example.com",
    "createdAt": "2026-01-15T..."
  }
}
```

---

## 🔧 Troubleshooting

### **Issue: "Missing SUPABASE_URL or SUPABASE_ANON_KEY"**

**Solution:** 
1. Check `.env` file exists in `backend/` folder
2. Verify keys are not placeholder text
3. Restart the server after updating `.env`

### **Issue: "Invalid API key"**

**Solution:**
1. Double-check you copied the **anon public** key, not the service role key
2. Make sure there are no extra spaces or quotes around the key
3. Verify the Supabase URL is correct (should end in `.supabase.co`)

### **Issue: "Table does not exist"**

**Solution:**
1. Run the SQL queries in Supabase SQL Editor
2. Refresh the Tables view to see if they appear
3. Check for any SQL errors in the query results

### **Issue: "Login returns 401 Unauthorized"**

**Solution:**
1. Verify user exists in database (check Supabase Table Editor)
2. Password might be wrong
3. Check server logs for detailed error

### **Issue: "CORS errors"**

**Solution:**
The backend already has CORS enabled in `app.js`:
```javascript
app.use(cors());
```

If you still get CORS errors, update to:
```javascript
app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true
}));
```

---

## 📊 Database Schema

### **Users Table**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `full_name` | TEXT | User's full name |
| `email` | TEXT | Email (unique, for login) |
| `password` | TEXT | Hashed password (bcrypt) |
| `created_at` | TIMESTAMPTZ | Registration date |
| `updated_at` | TIMESTAMPTZ | Last update date |

### **Meetings Table**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `meeting_id` | TEXT | Human-readable ID (e.g., "vco-xyz") |
| `host_id` | UUID | References users(id) |
| `host_email` | TEXT | Host's email |
| `title` | TEXT | Meeting title |
| `participants` | INTEGER | Number of participants |
| `duration` | INTEGER | Duration in minutes |
| `status` | TEXT | active/ended |
| `created_at` | TIMESTAMPTZ | Created date |
| `ended_at` | TIMESTAMPTZ | End date |

---

## 🔐 Security Features

Your authentication system includes:

✅ **Password Hashing** - bcrypt with salt rounds
✅ **JWT Tokens** - 7-day expiration
✅ **Protected Routes** - Middleware checks authentication
✅ **Error Handling** - Proper error messages
✅ **Token Verification** - Validates JWT on each request
✅ **User Authorization** - Only access own data

**Security Best Practices Applied:**
- Passwords never stored in plain text
- Tokens have expiration
- Sensitive data excluded from responses
- HTTPS recommended for production
- Environment variables for secrets

---

## 🌐 API Endpoints

### **Public Endpoints** (No auth required)

```
POST /api/auth/register
POST /api/auth/login
```

### **Protected Endpoints** (Require JWT token)

```
GET  /api/auth/profile
POST /api/meetings/create
POST /api/meetings/join
GET  /api/meetings/list
GET  /api/meetings/:meetingId
```

### **Request Format**

**Register:**
```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Protected Request:**
```
GET /api/auth/profile
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Quick Start Checklist

- [ ] Create Supabase account
- [ ] Create new Supabase project
- [ ] Copy Project URL and API key
- [ ] Update `backend/.env` with real values
- [ ] Run SQL queries to create tables
- [ ] Restart backend server
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test protected profile endpoint
- [ ] Register via frontend UI
- [ ] Login via frontend UI
- [ ] Check localStorage for token

---

## 📝 Current .env Template

```env
# Server Configuration
PORT=5002

# Supabase Configuration
# Get these from: https://app.supabase.com/project/_/settings/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# JWT Secret
# Generate a random secret: openssl rand -hex 32
JWT_SECRET=your_jwt_secret_change_this

# Optional: Node Environment
NODE_ENV=development
```

---

## 💡 Tips

1. **Never commit .env file** - Add to `.gitignore`
2. **Use strong JWT secret** - Generate random string
3. **Test in Postman** - Easier than browser console
4. **Check Supabase logs** - Real-time monitoring in dashboard
5. **Enable RLS** - Row Level Security for production
6. **Use HTTPS in production** - Required for secure auth

---

## 🆘 Need Help?

**Check these first:**
1. Server logs in terminal
2. Browser console for frontend errors
3. Supabase dashboard → Logs
4. Network tab in browser DevTools

**Common issues:**
- ❌ Wrong API keys → Check Supabase dashboard
- ❌ Table not found → Run SQL queries
- ❌ CORS errors → Backend CORS already configured
- ❌ Token invalid → Check JWT_SECRET matches

---

## ✅ Verification Steps

**After setup, verify:**

1. ✅ Backend starts without errors
2. ✅ Supabase connection confirmed
3. ✅ Tables visible in Supabase dashboard
4. ✅ Can register new user via frontend
5. ✅ Can login with credentials
6. ✅ Token saved to localStorage
7. ✅ Profile page loads user data
8. ✅ Protected routes work

---

**Ready to set up?** Follow Option 1 (Supabase) steps above! 🚀
