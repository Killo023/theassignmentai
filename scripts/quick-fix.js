#!/usr/bin/env node

/**
 * Quick Fix Script for Signup Verification & PayPal Issues
 * 
 * This script helps you quickly set up and test the signup verification
 * and PayPal payment functionality.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function quickFix() {
  console.log('🔧 Quick Fix for Dashboard Navigation Issues');
  console.log('============================================');
  
  try {
    // Test database connection
    console.log('\n📡 Testing database connection...');
    const { data, error } = await supabase
      .from('assignments')
      .select('count')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('❌ ISSUE FOUND: Assignments table does not exist!');
      console.log('\n📋 SOLUTION:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy and paste this SQL:');
      console.log('\n' + '='.repeat(80));
      console.log(`
-- Create assignments table
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

-- Create subscriptions table if it doesn't exist
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

-- Enable Row Level Security
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all operations for assignments" ON assignments FOR ALL USING (true);
CREATE POLICY "Enable all operations for subscriptions" ON subscriptions FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
      `);
      console.log('='.repeat(80));
      console.log('\n5. Click "Run" to execute');
      console.log('6. Test your dashboard navigation again');
      
    } else if (error) {
      console.log('❌ Other database error:', error.message);
    } else {
      console.log('✅ Database connection successful!');
    }
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
  }
  
  console.log('\n🔗 Test your navigation at: http://localhost:3000/test-dashboard-nav');
  console.log('📝 After fixing the database, test at: http://localhost:3000/dashboard');
}

quickFix().then(() => {
  console.log('\n✅ Quick fix completed!');
  process.exit(0);
}); 