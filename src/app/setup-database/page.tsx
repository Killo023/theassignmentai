"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';

export default function SetupDatabase() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const createTablesDirectly = async () => {
    setIsRunning(true);
    setResults([]);
    setError(null);
    
    try {
      addResult('🔧 Starting database setup...');

      // First, let's check what tables currently exist
      addResult('📋 Checking existing tables...');
      
      // Test subscriptions table
      const { error: subsError } = await supabase
        .from('subscriptions')
        .select('count')
        .limit(1);
      
      if (subsError) {
        addResult('❌ Subscriptions table missing');
      } else {
        addResult('✅ Subscriptions table exists');
      }

      // Test assignments table
      const { error: assignError } = await supabase
        .from('assignments')
        .select('count')
        .limit(1);
      
      if (assignError) {
        addResult('❌ Assignments table missing - this is the main issue!');
        
        // Try to create the assignments table using RPC if available
        addResult('🔧 Attempting to create assignments table...');
        
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
          assignment_type TEXT,
          academic_level TEXT,
          quality_level TEXT,
          
          -- Citation and References
          include_citations BOOLEAN DEFAULT false,
          citation_style TEXT,
          
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
          page_size TEXT DEFAULT 'A4',
          include_page_numbers BOOLEAN DEFAULT true,
          include_headers BOOLEAN DEFAULT true,
          include_footers BOOLEAN DEFAULT true,
          
          -- Multiple Choice Questions
          include_mcq BOOLEAN DEFAULT false,
          mcq_count INTEGER DEFAULT 5,
          mcq_difficulty TEXT,
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
        
        try {
          const { error: createError } = await supabase.rpc('exec', { sql: createAssignmentsSQL });
          if (createError) {
            addResult('❌ Cannot create table with this method: ' + createError.message);
            addResult('🚨 Manual action required - see instructions below');
          } else {
            addResult('✅ Successfully created assignments table!');
          }
        } catch (err) {
          addResult('❌ RPC method not available, manual setup required');
        }
        
      } else {
        addResult('✅ Assignments table exists');
      }
      
      // Test the assignments table again
      addResult('🔍 Re-testing assignments table...');
      const { error: finalTest } = await supabase
        .from('assignments')
        .select('count')
        .limit(1);
      
      if (finalTest) {
        addResult('❌ Assignments table still missing');
        addResult('');
        addResult('🚨 MANUAL SETUP REQUIRED:');
        addResult('1. Go to https://supabase.com and sign in');
        addResult('2. Open your project dashboard');
        addResult('3. Click "SQL Editor" in the left sidebar');
        addResult('4. Click "New Query"');
        addResult('5. Copy the SQL from supabase-setup.sql file (in project root)');
        addResult('6. Paste it into the SQL editor and click "Run"');
        addResult('');
        addResult('📁 The complete SQL script is in: supabase-setup.sql');
      } else {
        addResult('✅ Assignments table is now working!');
        addResult('🎉 Database setup complete - you can now save assignments!');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Setup failed: ' + errorMessage);
      addResult('❌ Setup failed: ' + errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Setup</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Fix Supabase Database Issues</h2>
          <p className="text-gray-600 mb-4">
            This tool will check your database configuration and attempt to create missing tables.
            If automatic setup fails, it will provide manual instructions.
          </p>
          
          <Button 
            onClick={createTablesDirectly}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? 'Running Setup...' : 'Check & Setup Database'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Setup Results:</h3>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm space-y-1">
              {results.map((result, index) => (
                <div key={index} className={
                  result.includes('✅') ? 'text-green-600' :
                  result.includes('❌') ? 'text-red-600' :
                  result.includes('🚨') ? 'text-red-700 font-bold' :
                  result.includes('🔧') ? 'text-blue-600' :
                  'text-gray-700'
                }>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <h3 className="text-red-800 font-semibold">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="text-yellow-800 font-semibold mb-2">Manual Setup Instructions:</h3>
          <div className="text-yellow-700 space-y-1">
            <p>If automatic setup fails, follow these steps:</p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Go to <a href="https://supabase.com" target="_blank" className="text-blue-600 underline">https://supabase.com</a></li>
              <li>Sign in and open your project</li>
              <li>Click "SQL Editor" in the left sidebar</li>
              <li>Click "New Query"</li>
              <li>Copy the contents of <code className="bg-yellow-100 px-1 rounded">supabase-setup.sql</code> from your project root</li>
              <li>Paste it into the SQL editor</li>
              <li>Click "Run" to execute the script</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}