-- ============================================================================
-- VCollab Database Setup Script
-- Run this in Supabase SQL Editor: https://app.supabase.com
-- ============================================================================

-- Drop existing tables if they exist (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS meetings CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings table for video conference tracking
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id TEXT UNIQUE NOT NULL,
    host_id UUID REFERENCES users(id) ON DELETE CASCADE,
    host_email TEXT,
    title TEXT DEFAULT 'Untitled Meeting',
    description TEXT,
    participants INTEGER DEFAULT 0,
    max_participants INTEGER DEFAULT 100,
    duration INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('scheduled', 'active', 'ended')),
    is_recording BOOLEAN DEFAULT FALSE,
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

-- Chat messages table (optional - for persistent chat)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meeting participants table (optional - track who joined)
CREATE TABLE IF NOT EXISTS meeting_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    duration_minutes INTEGER,
    UNIQUE(meeting_id, user_id)
);

-- ============================================================================
-- CREATE INDEXES for better performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_meetings_host ON meetings(host_id);
CREATE INDEX IF NOT EXISTS idx_meetings_id ON meetings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_created ON meetings(created_at);

CREATE INDEX IF NOT EXISTS idx_chat_meeting ON chat_messages(meeting_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON meeting_participants(user_id);

-- ============================================================================
-- CREATE FUNCTIONS for auto-updating timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE POLICIES
-- ============================================================================

-- Users policies
DROP POLICY IF EXISTS "Users can read their own data" ON users;
CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role has full access to users" ON users;
CREATE POLICY "Service role has full access to users" ON users
    FOR ALL USING (true);

-- Meetings policies
DROP POLICY IF EXISTS "Anyone can read meetings" ON meetings;
CREATE POLICY "Anyone can read meetings" ON meetings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to meetings" ON meetings;
CREATE POLICY "Service role has full access to meetings" ON meetings
    FOR ALL USING (true);

-- Chat messages policies
DROP POLICY IF EXISTS "Anyone can read chat in their meetings" ON chat_messages;
CREATE POLICY "Anyone can read chat in their meetings" ON chat_messages
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to chat" ON chat_messages;
CREATE POLICY "Service role has full access to chat" ON chat_messages
    FOR ALL USING (true);

-- Participants policies
DROP POLICY IF EXISTS "Anyone can read participants" ON meeting_participants;
CREATE POLICY "Anyone can read participants" ON meeting_participants
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role has full access to participants" ON meeting_participants;
CREATE POLICY "Service role has full access to participants" ON meeting_participants
    FOR ALL USING (true);

-- ============================================================================
-- INSERT SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Sample user (password: password123)
-- Note: In production, passwords should be hashed by the backend
-- INSERT INTO users (full_name, email, password, role) VALUES
-- ('Admin User', 'admin@vcollab.com', '$2b$10$encrypted_password_here', 'admin'),
-- ('Test User', 'test@vcollab.com', '$2b$10$encrypted_password_here', 'user');

-- ============================================================================
-- VERIFY SETUP
-- ============================================================================

-- Check tables were created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('users', 'meetings', 'chat_messages', 'meeting_participants')
ORDER BY table_name;

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'meetings', 'chat_messages', 'meeting_participants')
ORDER BY tablename, indexname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE '✅ Tables created: users, meetings, chat_messages, meeting_participants';
    RAISE NOTICE '✅ Indexes created for performance';
    RAISE NOTICE '✅ Row Level Security enabled';
    RAISE NOTICE '✅ Policies configured';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '1. Update backend/.env with your Supabase credentials';
    RAISE NOTICE '2. Restart backend server: npm start';
    RAISE NOTICE '3. Test registration: http://127.0.0.1:3000/register-new.html';
    RAISE NOTICE '4. Test login: http://127.0.0.1:3000/login-new.html';
END $$;
