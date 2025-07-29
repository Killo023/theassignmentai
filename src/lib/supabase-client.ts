import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibhrkjbcpxyjfbkepgwd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliaHJramJjcHh5amZia2VwZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTY4MzksImV4cCI6MjA2OTM3MjgzOX0.Nt5V0DblrtW_XX0rVoM__1zGqv7p0cO_5tJmC9u-L60';

console.log('🔧 Supabase configured:', !!supabaseUrl && !!supabaseAnonKey);
console.log('🔧 Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection with better error handling
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('subscriptions').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      console.error('❌ Error details:', error);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (err) {
    console.error('❌ Supabase connection test failed with exception:', err);
  }
};

// Test connection on client side only
if (typeof window !== 'undefined') {
  testConnection();
}

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          user_id: string;
          plan: 'free' | 'basic' | 'pro';
          status: 'free' | 'basic' | 'pro' | 'cancelled' | 'expired';
          trial_end_date: string | null;
          upgraded_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          plan?: 'free' | 'basic' | 'pro';
          status?: 'free' | 'basic' | 'pro' | 'cancelled' | 'expired';
          trial_end_date?: string | null;
          upgraded_at?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          plan?: 'free' | 'basic' | 'pro';
          status?: 'free' | 'basic' | 'pro' | 'cancelled' | 'expired';
          trial_end_date?: string | null;
          upgraded_at?: string | null;
          created_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subject: string;
          type: string;
          status: 'draft' | 'in-progress' | 'completed';
          word_count: number;
          is_favorite: boolean;
          due_date: string | null;
          created_at: string;
          updated_at: string;
          // Enhanced professional fields
          assignment_type?: 'research_paper' | 'case_study' | 'literature_review' | 'business_report' | 'comparative_analysis' | 'essay' | 'thesis' | 'lab_report' | 'presentation' | 'technical_report';
          academic_level?: 'undergraduate' | 'graduate' | 'postgraduate';
          quality_level?: 'standard' | 'high' | 'excellent';
          // Citation and References
          include_citations?: boolean;
          citation_style?: 'APA' | 'MLA' | 'Chicago' | 'Harvard';
          // Structural Elements
          include_cover_page?: boolean;
          include_table_of_contents?: boolean;
          include_executive_summary?: boolean;
          include_appendices?: boolean;
          // Formatting Options
          font_family?: string;
          font_size?: number;
          line_spacing?: number;
          margin_size?: number;
          page_size?: 'A4' | 'Letter';
          include_page_numbers?: boolean;
          include_headers?: boolean;
          include_footers?: boolean;
          // Multiple Choice Questions
          include_mcq?: boolean;
          mcq_count?: number;
          mcq_difficulty?: 'easy' | 'medium' | 'hard';
          include_answer_key?: boolean;
          include_rubric?: boolean;
          // Quality Assurance
          include_plagiarism_check?: boolean;
          include_quality_indicators?: boolean;
          include_educational_disclaimer?: boolean;
          // Export Options
          export_formats?: string[];
          // Content and Metadata
          content?: string;
          requirements?: string;
          quality_metrics?: any;
          formatting_preferences?: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          subject: string;
          type: string;
          status?: 'draft' | 'in-progress' | 'completed';
          word_count?: number;
          is_favorite?: boolean;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          // Enhanced professional fields
          assignment_type?: 'research_paper' | 'case_study' | 'literature_review' | 'business_report' | 'comparative_analysis' | 'essay' | 'thesis' | 'lab_report' | 'presentation' | 'technical_report';
          academic_level?: 'undergraduate' | 'graduate' | 'postgraduate';
          quality_level?: 'standard' | 'high' | 'excellent';
          // Citation and References
          include_citations?: boolean;
          citation_style?: 'APA' | 'MLA' | 'Chicago' | 'Harvard';
          // Structural Elements
          include_cover_page?: boolean;
          include_table_of_contents?: boolean;
          include_executive_summary?: boolean;
          include_appendices?: boolean;
          // Formatting Options
          font_family?: string;
          font_size?: number;
          line_spacing?: number;
          margin_size?: number;
          page_size?: 'A4' | 'Letter';
          include_page_numbers?: boolean;
          include_headers?: boolean;
          include_footers?: boolean;
          // Multiple Choice Questions
          include_mcq?: boolean;
          mcq_count?: number;
          mcq_difficulty?: 'easy' | 'medium' | 'hard';
          include_answer_key?: boolean;
          include_rubric?: boolean;
          // Quality Assurance
          include_plagiarism_check?: boolean;
          include_quality_indicators?: boolean;
          include_educational_disclaimer?: boolean;
          // Export Options
          export_formats?: string[];
          // Content and Metadata
          content?: string;
          requirements?: string;
          quality_metrics?: any;
          formatting_preferences?: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          subject?: string;
          type?: string;
          status?: 'draft' | 'in-progress' | 'completed';
          word_count?: number;
          is_favorite?: boolean;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          // Enhanced professional fields
          assignment_type?: 'research_paper' | 'case_study' | 'literature_review' | 'business_report' | 'comparative_analysis' | 'essay' | 'thesis' | 'lab_report' | 'presentation' | 'technical_report';
          academic_level?: 'undergraduate' | 'graduate' | 'postgraduate';
          quality_level?: 'standard' | 'high' | 'excellent';
          // Citation and References
          include_citations?: boolean;
          citation_style?: 'APA' | 'MLA' | 'Chicago' | 'Harvard';
          // Structural Elements
          include_cover_page?: boolean;
          include_table_of_contents?: boolean;
          include_executive_summary?: boolean;
          include_appendices?: boolean;
          // Formatting Options
          font_family?: string;
          font_size?: number;
          line_spacing?: number;
          margin_size?: number;
          page_size?: 'A4' | 'Letter';
          include_page_numbers?: boolean;
          include_headers?: boolean;
          include_footers?: boolean;
          // Multiple Choice Questions
          include_mcq?: boolean;
          mcq_count?: number;
          mcq_difficulty?: 'easy' | 'medium' | 'hard';
          include_answer_key?: boolean;
          include_rubric?: boolean;
          // Quality Assurance
          include_plagiarism_check?: boolean;
          include_quality_indicators?: boolean;
          include_educational_disclaimer?: boolean;
          // Export Options
          export_formats?: string[];
          // Content and Metadata
          content?: string;
          requirements?: string;
          quality_metrics?: any;
          formatting_preferences?: any;
        };
      };
    };
  };
} 