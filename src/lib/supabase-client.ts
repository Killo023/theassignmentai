import { createClient } from '@supabase/supabase-js';

// Temporarily hardcode the values for testing
const supabaseUrl = 'https://zhovjlnatfkdsphbtoju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpob3ZqbG5hdGZrZHNwaGJ0b2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMjE1MTQsImV4cCI6MjA2ODc5NzUxNH0.keXWxxyiJPGQNCOZ2RnUaecXtgVjDYuk8D7nq-Pjn5A';

console.log('🔧 Using hardcoded Supabase credentials for testing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
supabase.from('subscriptions').select('count').limit(1).then(({ error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message);
  } else {
    console.log('✅ Supabase connection successful');
  }
});

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          user_id: string;
          plan: string;
          status: 'trial' | 'active' | 'expired';
          trial_end_date: string;
          upgraded_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          plan?: string;
          status?: 'trial' | 'active' | 'expired';
          trial_end_date: string;
          upgraded_at?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          plan?: string;
          status?: 'trial' | 'active' | 'expired';
          trial_end_date?: string;
          upgraded_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
