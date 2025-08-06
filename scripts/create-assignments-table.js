const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAssignmentsTable() {
    console.log('🔧 Attempting to create assignments table...');
    
    try {
        // Try method 1: Simple table creation with basic fields
        console.log('📋 Method 1: Creating basic assignments table structure...');
        
        const basicCreateSQL = `
        -- Create basic assignments table
        CREATE TABLE IF NOT EXISTS public.assignments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT DEFAULT 'draft',
            word_count INTEGER DEFAULT 0,
            is_favorite BOOLEAN DEFAULT false,
            content TEXT,
            requirements TEXT,
            due_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.assignments(user_id);
        CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON public.assignments(created_at);
        
        -- Enable RLS and create permissive policy
        ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable all operations for assignments" ON public.assignments FOR ALL USING (true);
        `;
        
        // Try to execute via a potential RPC function
        try {
            const { data, error } = await supabase.rpc('exec_sql', { query: basicCreateSQL });
            if (error) {
                console.log('❌ RPC method failed:', error.message);
                throw error;
            }
            console.log('✅ Table created successfully via RPC!');
            return true;
        } catch (rpcError) {
            console.log('❌ RPC method not available');
        }
        
        // Try method 2: Insert a test record to trigger table creation
        console.log('📋 Method 2: Testing if we can insert directly...');
        
        const testAssignment = {
            user_id: 'test-user-setup',
            title: 'Test Assignment Setup',
            subject: 'Test',
            type: 'Test',
            status: 'draft',
            word_count: 100,
            content: 'This is a test assignment to verify table creation.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('assignments')
            .insert(testAssignment)
            .select()
            .single();
        
        if (insertError) {
            console.log('❌ Insert failed:', insertError.message);
            if (insertError.code === '42P01') {
                console.log('🚨 Table definitely does not exist - manual setup required');
                return false;
            }
            throw insertError;
        }
        
        console.log('✅ Successfully inserted test record!');
        console.log('📋 Test record:', insertData);
        
        // Clean up test record
        if (insertData?.id) {
            await supabase
                .from('assignments')
                .delete()
                .eq('id', insertData.id);
            console.log('✅ Cleaned up test record');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Failed to create assignments table:', error.message);
        return false;
    }
}

async function testAssignmentsTable() {
    console.log('🔍 Testing assignments table access...');
    
    const { data, error } = await supabase
        .from('assignments')
        .select('count')
        .limit(1);
    
    if (error) {
        console.log('❌ Assignments table test failed:', error.message);
        return false;
    }
    
    console.log('✅ Assignments table is accessible!');
    return true;
}

async function main() {
    console.log('🚀 Starting Assignments Table Setup...\n');
    
    // First test if table exists
    const tableExists = await testAssignmentsTable();
    
    if (tableExists) {
        console.log('🎉 Assignments table already exists and is working!');
        process.exit(0);
    }
    
    // Try to create the table
    const created = await createAssignmentsTable();
    
    if (created) {
        console.log('🎉 Successfully set up assignments table!');
        
        // Test again
        const finalTest = await testAssignmentsTable();
        if (finalTest) {
            console.log('✅ Final verification passed - assignments can now be saved!');
        } else {
            console.log('❌ Final verification failed');
        }
    } else {
        console.log('\n🚨 AUTOMATIC SETUP FAILED');
        console.log('📋 Manual setup required:');
        console.log('1. Go to https://supabase.com and sign in');
        console.log('2. Open your project: https://supabase.com/dashboard/project/ibhrkjbcpxyjfbkepgwd');
        console.log('3. Click "SQL Editor" in the left sidebar');
        console.log('4. Click "New Query"');
        console.log('5. Copy the contents of supabase-setup.sql file');
        console.log('6. Paste it into the SQL editor');
        console.log('7. Click "Run" to execute the script');
        console.log('\n📁 The SQL file is located at: supabase-setup.sql');
        console.log('⚡ After running the script, test with: npm run test:db');
    }
}

main().catch(console.error);