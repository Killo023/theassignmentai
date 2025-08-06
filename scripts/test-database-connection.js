const { createClient } = require('@supabase/supabase-js');

// Database connection test script
async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';
  
  console.log('📋 Configuration:');
  console.log('  Supabase URL:', supabaseUrl);
  console.log('  API Key:', supabaseKey ? '✅ Present' : '❌ Missing');
  console.log('');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return false;
  }
  
  // Create client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Basic connection
    console.log('🧪 Test 1: Basic Connection');
    const { data: testData, error: testError } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection failed:', testError.message);
      
      if (testError.code === '42P01') {
        console.log('\n🚨 TABLE NOT FOUND ERROR');
        console.log('This means the Supabase tables haven\'t been created yet.');
        console.log('\n📋 TO FIX THIS:');
        console.log('1. Go to https://supabase.com/');
        console.log('2. Open your project dashboard');
        console.log('3. Go to SQL Editor → New Query');
        console.log('4. Copy and paste the contents of supabase-setup.sql');
        console.log('5. Click Run to create the tables');
        return false;
      }
      
      return false;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Check tables exist
    console.log('\n🧪 Test 2: Checking Required Tables');
    
    // Check subscriptions table
    const { data: subsData, error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (subsError) {
      console.error('❌ Subscriptions table error:', subsError.message);
      return false;
    }
    console.log('✅ Subscriptions table exists');
    
    // Check assignments table
    const { data: assignData, error: assignError } = await supabase
      .from('assignments')
      .select('*')
      .limit(1);
    
    if (assignError) {
      console.error('❌ Assignments table error:', assignError.message);
      return false;
    }
    console.log('✅ Assignments table exists');
    
    // Test 3: Insert test data
    console.log('\n🧪 Test 3: Insert Test Data');
    
    const testUserId = 'test-user-' + Date.now();
    
    // Test subscription insert
    const { data: insertData, error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: testUserId,
        plan_id: 'free',
        status: 'free',
        assignments_used: 0,
        assignment_limit: 4
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      return false;
    }
    
    console.log('✅ Insert test successful');
    
    // Clean up test data
    await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', testUserId);
    
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 ALL TESTS PASSED! Database is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Database connection is working properly!');
      process.exit(0);
    } else {
      console.log('\n❌ Database connection issues detected.');
      console.log('Please follow the setup instructions above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Test script failed:', error);
    process.exit(1);
  });