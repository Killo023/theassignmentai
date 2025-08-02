const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('🔧 Setting up Supabase database...');
    console.log('📡 Connecting to Supabase:', supabaseUrl);
    
    // Read the SQL setup script
    const sqlPath = path.join(__dirname, '..', 'supabase-setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 SQL script loaded, executing...');
    
    // Execute the SQL script
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error executing SQL script:', error);
      console.log('\n📋 Manual Setup Instructions:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase-setup.sql');
      console.log('4. Click "Run" to execute the script');
      return false;
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - subscriptions');
    console.log('   - assignments');
    console.log('   - Row Level Security enabled');
    console.log('   - Indexes created for performance');
    
    // Test the connection
    console.log('\n🧪 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('assignments')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database test failed:', testError);
      return false;
    }
    
    console.log('✅ Database connection test successful!');
    console.log('\n🎉 Your database is ready to use!');
    console.log('🚀 You can now create and save assignments.');
    
    return true;
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-setup.sql');
    console.log('4. Click "Run" to execute the script');
    return false;
  }
}

// Run the setup
setupDatabase().then(success => {
  if (success) {
    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Database setup failed. Please follow the manual instructions above.');
    process.exit(1);
  }
}); 