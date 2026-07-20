# 🗄️ SUPABASE DATABASE SETUP - COMPLETE GUIDE

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Go to Supabase
Open: https://supabase.com/dashboard

### 1.2 Sign In or Create Account
- Click "Start your project"
- Sign in with GitHub (recommended) or Email

### 1.3 Create New Project
1. Click "New Project"
2. Fill in details:
   - **Name**: `vcollab-database` (or any name)
   - **Database Password**: Choose a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., Asia Pacific (Mumbai))
   - **Pricing Plan**: Select "Free" (perfect for starting)

3. Click "Create new project"
4. ⏳ Wait 2-3 minutes for project to initialize

---

## Step 2: Get Your Credentials

### 2.1 Go to Project Settings
1. Click on your project name
2. Click ⚙️ "Settings" in sidebar (bottom left)
3. Click "API" under Project Settings

### 2.2 Copy These Values:

#### Project URL:
Look for **Project URL** section
```
Example: https://abcdefghijklmnop.supabase.co
```
📋 Copy this entire URL

#### Anon (public) Key:
Look for **Project API keys** section
Find the **anon** **public** key
```
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjI4MjAwMCwiZXhwIjoxOTMxODU4MDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
📋 Copy this ENTIRE key (it's very long - around 200+ characters)

---

## Step 3: Create Database Tables

### 3.1 Go to SQL Editor
1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "+ New query"

### 3.2 Paste and Run This SQL:

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- Meetings table
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    meeting_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    host_id TEXT NOT NULL,
    host_name TEXT NOT NULL,
    scheduled_date TEXT,
    scheduled_time TEXT,
    passcode TEXT,
    type TEXT CHECK (type IN ('instant', 'scheduled')) DEFAULT 'instant',
    status TEXT CHECK (status IN ('waiting', 'active', 'ended')) DEFAULT 'waiting',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster meeting_id lookups
CREATE INDEX idx_meetings_meeting_id ON meetings(meeting_id);
CREATE INDEX idx_meetings_host_id ON meetings(host_id);

-- Participants table (who joined which meeting)
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    is_host BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id) ON DELETE CASCADE
);

-- Index for faster participant lookups
CREATE INDEX idx_participants_meeting_id ON participants(meeting_id);
CREATE INDEX idx_participants_user_id ON participants(user_id);

-- Recordings table (for future use)
CREATE TABLE recordings (
    id SERIAL PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id) ON DELETE CASCADE
);

-- Chat messages table (for future use)
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS) - IMPORTANT FOR SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to access their own data
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Allow anyone to create users (for registration)
CREATE POLICY "Anyone can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Meetings policies
CREATE POLICY "Users can view meetings" ON meetings
    FOR SELECT USING (true);

CREATE POLICY "Users can create meetings" ON meetings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Hosts can update their meetings" ON meetings
    FOR UPDATE USING (host_id = auth.uid()::text);

-- Participants policies
CREATE POLICY "Users can view participants" ON participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join meetings" ON participants
    FOR INSERT WITH CHECK (true);

-- Recordings policies
CREATE POLICY "Users can view recordings" ON recordings
    FOR SELECT USING (true);

CREATE POLICY "Hosts can create recordings" ON recordings
    FOR INSERT WITH CHECK (true);

-- Chat messages policies
CREATE POLICY "Users can view chat messages" ON chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Users can send chat messages" ON chat_messages
    FOR INSERT WITH CHECK (true);
```

### 3.3 Run the SQL
1. Click "Run" button (or press Ctrl+Enter)
2. ✅ You should see "Success. No rows returned"
3. 🎉 Database tables created!

---

## Step 4: Update Backend Configuration

### 4.1 Get Your Credentials Ready

You should have:
- ✅ **Project URL**: `https://xxxxx.supabase.co`
- ✅ **Anon Key**: `eyJhbG...` (very long key)

### 4.2 Paste Them Here:

Once you have them, paste them in the chat and I'll update your `.env` file automatically!

Format:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-very-long-key-here
```

---

## Step 5: Test the Connection

After updating .env, I'll:
1. ✅ Restart the backend server
2. ✅ Test database connection
3. ✅ Create a test user in Supabase
4. ✅ Verify data is persisted

---

## 🎯 What You'll Get:

✅ **Persistent Storage** - Data survives server restarts
✅ **Real Database** - PostgreSQL (production-grade)
✅ **Automatic Backups** - Supabase handles it
✅ **Free Tier** - 500MB database, 1GB file storage
✅ **API Access** - Auto-generated REST API
✅ **Real-time** - Built-in real-time subscriptions
✅ **Authentication** - Supabase Auth (we're using custom JWT)

---

## 📋 Quick Checklist:

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL
- [ ] Copied Anon Key
- [ ] Ran SQL script to create tables
- [ ] Pasted credentials in chat

---

## ⏱️ Time Required:
- Creating project: 2-3 minutes
- Getting credentials: 1 minute  
- Running SQL: 1 minute
- **Total: ~5 minutes**

---

## 🆘 Need Help?

If you get stuck:
1. Screenshot the error/issue
2. Paste it in chat
3. I'll help you fix it immediately

---

**Ready? Let's do this! 🚀**

Once you have the credentials, paste them here and I'll configure everything automatically!
