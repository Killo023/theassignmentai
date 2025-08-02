-- Supabase Setup Script for Subscriptions and Assignments Tables
-- Run this in your Supabase SQL Editor

-- 1. Drop the old tables if they exist
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS subscriptions;

-- 2. Create the new subscriptions table with assignment tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    user_id TEXT PRIMARY KEY,
    plan_id TEXT DEFAULT 'free' CHECK (plan_id IN ('free', 'basic', 'pro')),
    status TEXT DEFAULT 'free' CHECK (status IN ('free', 'basic', 'pro', 'cancelled', 'expired')),
    assignments_used INTEGER DEFAULT 0,
    assignment_limit INTEGER DEFAULT 4,
    has_calendar_access BOOLEAN DEFAULT false,
    paypal_subscription_id TEXT,
    upgraded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the assignments table with enhanced fields for visual elements
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Enhanced professional fields
    assignment_type TEXT CHECK (assignment_type IN ('research_paper', 'case_study', 'literature_review', 'business_report', 'comparative_analysis', 'essay', 'thesis', 'lab_report', 'presentation', 'technical_report')),
    academic_level TEXT CHECK (academic_level IN ('undergraduate', 'graduate', 'postgraduate')),
    quality_level TEXT CHECK (quality_level IN ('standard', 'high', 'excellent')),
    
    -- Citation and References
    include_citations BOOLEAN DEFAULT false,
    citation_style TEXT CHECK (citation_style IN ('APA', 'MLA', 'Chicago', 'Harvard')),
    
    -- Structural Elements
    include_cover_page BOOLEAN DEFAULT false,
    include_table_of_contents BOOLEAN DEFAULT false,
    include_executive_summary BOOLEAN DEFAULT false,
    include_appendices BOOLEAN DEFAULT false,
    
    -- Formatting Options
    font_family TEXT DEFAULT 'Times New Roman',
    font_size INTEGER DEFAULT 12,
    line_spacing DECIMAL DEFAULT 1.5,
    margin_size DECIMAL DEFAULT 1.0,
    page_size TEXT DEFAULT 'A4' CHECK (page_size IN ('A4', 'Letter')),
    include_page_numbers BOOLEAN DEFAULT true,
    include_headers BOOLEAN DEFAULT true,
    include_footers BOOLEAN DEFAULT true,
    
    -- Multiple Choice Questions
    include_mcq BOOLEAN DEFAULT false,
    mcq_count INTEGER DEFAULT 5,
    mcq_difficulty TEXT CHECK (mcq_difficulty IN ('easy', 'medium', 'hard')),
    include_answer_key BOOLEAN DEFAULT false,
    include_rubric BOOLEAN DEFAULT false,
    
    -- Quality Assurance
    include_plagiarism_check BOOLEAN DEFAULT true,
    include_quality_indicators BOOLEAN DEFAULT true,
    include_educational_disclaimer BOOLEAN DEFAULT true,
    
    -- Export Options
    export_formats TEXT[] DEFAULT ARRAY['txt', 'docx', 'pdf'],
    
    -- Visual Elements Storage
    tables_data JSONB DEFAULT '[]'::jsonb,
    charts_data JSONB DEFAULT '[]'::jsonb,
    references_data JSONB DEFAULT '[]'::jsonb,
    
    -- Quality Metrics
    quality_metrics JSONB DEFAULT '{}'::jsonb,
    formatting_preferences JSONB DEFAULT '{}'::jsonb
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
CREATE INDEX IF NOT EXISTS idx_subscriptions_paypal_id ON subscriptions(paypal_subscription_id);

CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON assignments(created_at);
CREATE INDEX IF NOT EXISTS idx_assignments_type ON assignments(type);
CREATE INDEX IF NOT EXISTS idx_assignments_subject ON assignments(subject);

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