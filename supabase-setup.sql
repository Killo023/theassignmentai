-- Supabase Setup Script for Subscriptions Table
-- Run this in your Supabase SQL Editor

-- 1. Drop the old subscriptions table if it exists
DROP TABLE IF EXISTS subscriptions;

-- 2. Create the new subscriptions table with assignment tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    user_id TEXT PRIMARY KEY,
    plan_id TEXT DEFAULT 'free' CHECK (plan_id IN ('free', 'basic', 'pro')),
    status TEXT DEFAULT 'free' CHECK (status IN ('free', 'basic', 'pro', 'cancelled', 'expired')),
    assignments_used INTEGER DEFAULT 0,
    assignment_limit INTEGER DEFAULT 4,
    has_calendar_access BOOLEAN DEFAULT false,
    upgraded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Create policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Enable all operations for subscriptions" ON subscriptions
    FOR ALL USING (true);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

-- 6. Insert a test record (optional - for testing)
-- INSERT INTO subscriptions (user_id, plan_id, status, assignments_used, assignment_limit, has_calendar_access, created_at)
-- VALUES (
--     'test-user-123',
--     'free',
--     'free',
--     0,
--     4,
--     false,
--     NOW()
-- );

-- 7. View the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position; 