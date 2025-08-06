const { createClient } = require('@supabase/supabase-js');

// Use the same configuration as the app
const supabaseUrl = 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
    console.log('🔧 Testing Supabase Connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
    
    try {
        // Test 1: Basic connection
        console.log('\n📡 Test 1: Basic connection test...');
        const { data: healthData, error: healthError } = await supabase
            .from('subscriptions')
            .select('count')
            .limit(1);
        
        if (healthError) {
            console.error('❌ Basic connection failed:', healthError);
            console.error('Error code:', healthError.code);
            console.error('Error message:', healthError.message);
            console.error('Error details:', healthError.details);
        } else {
            console.log('✅ Basic connection successful');
        }
        
        // Test 2: Check assignments table
        console.log('\n📋 Test 2: Checking assignments table...');
        const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('assignments')
            .select('count')
            .limit(1);
        
        if (assignmentsError) {
            console.error('❌ Assignments table check failed:', assignmentsError);
            console.error('Error code:', assignmentsError.code);
            console.error('Error message:', assignmentsError.message);
            
            if (assignmentsError.code === '42P01') {
                console.error('🚨 TABLE DOES NOT EXIST: assignments table is missing!');
                console.log('💡 You need to run the database setup script: npm run setup-database');
            }
        } else {
            console.log('✅ Assignments table exists and accessible');
        }
        
        // Test 3: List all available tables
        console.log('\n📊 Test 3: Listing available tables...');
        const { data: tablesData, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');
        
        if (tablesError) {
            console.error('❌ Could not list tables:', tablesError);
        } else {
            console.log('✅ Available tables:', tablesData?.map(t => t.table_name) || []);
        }
        
        // Test 4: Try to fetch any existing assignments
        console.log('\n🔍 Test 4: Attempting to fetch assignments...');
        const { data: allAssignments, error: fetchError } = await supabase
            .from('assignments')
            .select('*')
            .limit(5);
        
        if (fetchError) {
            console.error('❌ Could not fetch assignments:', fetchError);
        } else {
            console.log('✅ Successfully fetched assignments:', allAssignments?.length || 0);
            if (allAssignments?.length > 0) {
                console.log('📋 Sample assignment:', allAssignments[0]);
            }
        }
        
        // Test 5: Check RLS policies
        console.log('\n🔒 Test 5: Testing Row Level Security...');
        const testUserId = 'test-user-123';
        const { data: rlsData, error: rlsError } = await supabase
            .from('assignments')
            .select('*')
            .eq('user_id', testUserId)
            .limit(1);
        
        if (rlsError) {
            console.error('❌ RLS test failed:', rlsError);
            if (rlsError.code === '42501') {
                console.error('🚨 PERMISSION DENIED: RLS policies might be too restrictive');
            }
        } else {
            console.log('✅ RLS test passed (no data returned is expected)');
        }
        
    } catch (error) {
        console.error('❌ Unexpected error during testing:', error);
    }
}

// Test the connection
testSupabaseConnection().then(() => {
    console.log('\n🏁 Testing complete');
    process.exit(0);
}).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});