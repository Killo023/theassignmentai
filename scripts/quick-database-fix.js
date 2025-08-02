#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function quickDatabaseFix() {
  try {
    console.log('🔧 Quick Database Fix - Setting up missing tables...');
    console.log('📡 Connecting to Supabase:', supabaseUrl);
    
    // Test if tables exist
    console.log('\n🔍 Checking if tables exist...');
    
    const { data: assignmentsTest, error: assignmentsError } = await supabase
      .from('assignments')
      .select('count')
      .limit(1);
    
    if (assignmentsError && assignmentsError.code === '42P01') {
      console.log('❌ Assignments table does not exist. Creating it...');
      
      // Create assignments table
      const createAssignmentsSQL = `
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
      `;
      
      console.log('📝 Creating assignments table...');
      console.log('⚠️  Note: This script cannot execute SQL directly due to Supabase limitations.');
      console.log('📋 Please manually execute the following SQL in your Supabase SQL Editor:');
      console.log('\n' + '='.repeat(80));
      console.log(createAssignmentsSQL);
      console.log('='.repeat(80));
      
    } else if (assignmentsError) {
      console.log('❌ Error checking assignments table:', assignmentsError);
    } else {
      console.log('✅ Assignments table exists');
    }
    
    // Check subscriptions table
    const { data: subscriptionsTest, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);
    
    if (subscriptionsError && subscriptionsError.code === '42P01') {
      console.log('❌ Subscriptions table does not exist. Creating it...');
      
      const createSubscriptionsSQL = `
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
      `;
      
      console.log('📝 Creating subscriptions table...');
      console.log('📋 Please manually execute the following SQL in your Supabase SQL Editor:');
      console.log('\n' + '='.repeat(80));
      console.log(createSubscriptionsSQL);
      console.log('='.repeat(80));
      
    } else if (subscriptionsError) {
      console.log('❌ Error checking subscriptions table:', subscriptionsError);
    } else {
      console.log('✅ Subscriptions table exists');
    }
    
    console.log('\n📋 MANUAL SETUP REQUIRED:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Navigate to SQL Editor');
    console.log('4. Copy and paste the SQL commands above');
    console.log('5. Click "Run" to execute');
    console.log('6. After running, test your application again');
    
    console.log('\n🔗 Alternative: Use the full setup script:');
    console.log('1. Copy the contents of supabase-setup.sql');
    console.log('2. Paste it in the Supabase SQL Editor');
    console.log('3. Click "Run"');
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error);
  }
}

// Run the fix
quickDatabaseFix().then(() => {
  console.log('\n✅ Quick database fix completed!');
  console.log('📝 Please follow the manual setup instructions above.');
  process.exit(0);
}); 