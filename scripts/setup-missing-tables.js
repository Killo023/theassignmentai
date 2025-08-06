const { createClient } = require('@supabase/supabase-js');

// Setup script to create missing database tables
async function setupMissingTables() {
  console.log('🔧 Setting Up Missing Database Tables...\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('📋 Checking which tables need to be created...');
    
    // Check subscriptions table
    const { error: subsError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);
    
    if (subsError) {
      console.log('❌ Subscriptions table missing');
    } else {
      console.log('✅ Subscriptions table exists');
    }
    
    // Check assignments table
    const { error: assignError } = await supabase
      .from('assignments')
      .select('count')
      .limit(1);
    
    if (assignError) {
      console.log('❌ Assignments table missing');
    } else {
      console.log('✅ Assignments table exists');
    }
    
    console.log('\n🚨 MANUAL ACTION REQUIRED:');
    console.log('The missing tables need to be created through the Supabase dashboard.');
    console.log('\n📋 STEP-BY-STEP INSTRUCTIONS:');
    console.log('1. Go to: https://supabase.com/');
    console.log('2. Sign in and open your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Copy the contents of supabase-setup.sql file');
    console.log('6. Paste it into the SQL editor');
    console.log('7. Click "Run" to execute the script');
    console.log('\n📁 The supabase-setup.sql file is in your project root directory.');
    console.log('\n⚡ After running the script, run this test again:');
    console.log('   npm run test:db');
    
  } catch (error) {
    console.error('❌ Setup check failed:', error.message);
  }
}

setupMissingTables();