-- Sprint 5 Database Setup (FIXED for TEXT user IDs)
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Add password column to meetings table (for password-protected meetings)
ALTER TABLE meetings 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 2. Create user_settings table (with TEXT user_id to match users table)
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT true,
    sound_notifications BOOLEAN DEFAULT true,
    desktop_notifications BOOLEAN DEFAULT true,
    meeting_reminders BOOLEAN DEFAULT true,
    
    -- Devices
    audio_device VARCHAR(255) DEFAULT 'default',
    video_device VARCHAR(255) DEFAULT 'default',
    speaker_device VARCHAR(255) DEFAULT 'default',
    
    -- Appearance
    theme VARCHAR(50) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    
    -- Privacy
    show_online_status BOOLEAN DEFAULT true,
    allow_recording BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- 3. Create chat_messages table (with TEXT user_id to match users table)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add analytics fields to meeting_participants table
ALTER TABLE meeting_participants 
ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS left_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS video_on_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS audio_on_duration INTEGER DEFAULT 0;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_meeting_id ON chat_messages(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_joined_at ON meeting_participants(joined_at);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for user_settings
CREATE POLICY "Users can view their own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 8. Create RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their meetings"
    ON chat_messages FOR SELECT
    USING (
        meeting_id IN (
            SELECT meeting_id FROM meeting_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in their meetings"
    ON chat_messages FOR INSERT
    WITH CHECK (
        meeting_id IN (
            SELECT meeting_id FROM meeting_participants 
            WHERE user_id = auth.uid()
        )
    );

-- 9. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger for user_settings
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Done! Sprint 5 database setup complete.
