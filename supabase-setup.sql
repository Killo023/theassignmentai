-- Supabase Setup Script for Subscriptions Table
-- Run this in your Supabase SQL Editor

-- 1. Create the subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    user_id TEXT PRIMARY KEY,
    plan TEXT DEFAULT 'pro',
    status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'expired', 'cancelled')),
    trial_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    upgraded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Enable all operations for subscriptions" ON subscriptions
    FOR ALL USING (true);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 5. Insert a test record (optional - for testing)
-- INSERT INTO subscriptions (user_id, plan, status, trial_end_date, created_at)
-- VALUES (
--     'test-user-123',
--     'pro',
--     'trial',
--     NOW() + INTERVAL '14 days',
--     NOW()
-- );

-- 6. View the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position; 