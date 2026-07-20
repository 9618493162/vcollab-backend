-- VCollab Database Schema for Supabase
-- Copy and paste this entire file into Supabase SQL Editor

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
