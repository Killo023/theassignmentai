-- Supabase Setup Script for Subscriptions and Assignments Tables
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

-- 3. Create the assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed')),
    word_count INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT false,
    content TEXT,
    requirements TEXT,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for subscriptions table
CREATE POLICY "Enable all operations for subscriptions" ON subscriptions
    FOR ALL USING (true);

-- 6. Create policies for assignments table
CREATE POLICY "Enable all operations for assignments" ON assignments
    FOR ALL USING (true);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);

CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON assignments(created_at);

-- 8. Insert a test record (optional - for testing)
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

-- 9. View the table structures
SELECT 
    'subscriptions' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position

UNION ALL

SELECT 
    'assignments' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'assignments'
ORDER BY ordinal_position; 