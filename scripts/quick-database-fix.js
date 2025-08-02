#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔧 Database Quick Fix Tool');
console.log('========================');
console.log('');

async function checkDatabaseStatus() {
  try {
    console.log('📡 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('assignments')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      
      if (error.code === '42P01') {
        console.log('');
        console.log('🚨 ISSUE FOUND: Assignments table does not exist!');
        console.log('');
        console.log('📋 SOLUTION:');
        console.log('1. Go to your Supabase dashboard: https://supabase.com/');
        console.log('2. Open your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Copy and paste the contents of supabase-setup.sql');
        console.log('5. Click "Run" to execute');
        console.log('');
        console.log('📄 SQL file location:', path.join(__dirname, '..', 'supabase-setup.sql'));
        console.log('');
        
        // Show the SQL content
        try {
          const sqlPath = path.join(__dirname, '..', 'supabase-setup.sql');
          const sqlContent = fs.readFileSync(sqlPath, 'utf8');
          console.log('📋 SQL Script Content:');
          console.log('=====================');
          console.log(sqlContent);
          console.log('=====================');
        } catch (readError) {
          console.log('❌ Could not read SQL file:', readError.message);
        }
        
        return false;
      } else {
        console.log('❌ Other connection error:', error);
        return false;
      }
    }
    
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    console.log('📋 Checking tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['assignments', 'subscriptions']);
    
    if (tablesError) {
      console.log('❌ Error checking tables:', tablesError.message);
      return false;
    }
    
    const tableNames = tables?.map(t => t.table_name) || [];
    console.log('📊 Found tables:', tableNames.join(', '));
    
    if (tableNames.includes('assignments') && tableNames.includes('subscriptions')) {
      console.log('✅ All required tables exist!');
      console.log('🎉 Your database is properly configured.');
      return true;
    } else {
      console.log('❌ Missing required tables');
      console.log('📋 Please run the Supabase setup script');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the check
checkDatabaseStatus().then(success => {
  console.log('');
  if (success) {
    console.log('✅ Database is ready to use!');
    console.log('🚀 You can now create and save assignments.');
  } else {
    console.log('❌ Database needs setup. Follow the instructions above.');
  }
  console.log('');
  console.log('💡 Test your setup at: http://localhost:3000/test-database');
  process.exit(success ? 0 : 1);
}); 