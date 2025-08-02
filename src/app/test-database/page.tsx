'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { AssignmentService } from '@/lib/assignment-service';

export default function TestDatabasePage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDatabaseTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔧 Starting database connection tests...');
      
      // Test 1: Basic Supabase connection
      addResult('📡 Testing basic Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('assignments')
        .select('count')
        .limit(1);
      
      if (testError) {
        addResult(`❌ Basic connection failed: ${testError.message}`);
        if (testError.code === '42P01') {
          addResult('❌ Assignments table does not exist. Please run the Supabase setup script.');
        }
      } else {
        addResult('✅ Basic connection successful');
      }
      
      // Test 2: Check if tables exist
      addResult('📋 Checking if tables exist...');
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['assignments', 'subscriptions']);
      
      if (tablesError) {
        addResult(`❌ Error checking tables: ${tablesError.message}`);
      } else {
        const tableNames = tables?.map(t => t.table_name) || [];
        addResult(`📊 Found tables: ${tableNames.join(', ')}`);
        
        if (tableNames.includes('assignments')) {
          addResult('✅ Assignments table exists');
        } else {
          addResult('❌ Assignments table missing');
        }
        
        if (tableNames.includes('subscriptions')) {
          addResult('✅ Subscriptions table exists');
        } else {
          addResult('❌ Subscriptions table missing');
        }
      }
      
      // Test 3: Test assignment service
      addResult('🧪 Testing AssignmentService...');
      const assignmentService = new AssignmentService('test-user-123');
      const connectionTest = await assignmentService.testDatabaseConnection();
      
      if (connectionTest) {
        addResult('✅ AssignmentService connection test passed');
      } else {
        addResult('❌ AssignmentService connection test failed');
      }
      
      // Test 4: Try to create a test assignment
      addResult('📝 Testing assignment creation...');
      try {
        const testAssignment = await assignmentService.createAssignment({
          title: 'Test Assignment',
          subject: 'Test Subject',
          type: 'Test Type',
          word_count: 100
        });
        
        if (testAssignment) {
          addResult('✅ Test assignment created successfully');
          
          // Clean up test assignment
          await assignmentService.deleteAssignment(testAssignment.id);
          addResult('🧹 Test assignment cleaned up');
        } else {
          addResult('❌ Failed to create test assignment');
        }
      } catch (error: any) {
        addResult(`❌ Assignment creation error: ${error.message}`);
      }
      
      addResult('🎉 Database tests completed!');
      
    } catch (error: any) {
      addResult(`❌ Test suite failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Database Connection Test
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page tests your Supabase database connection and helps diagnose any issues.
            </p>
            
            <button
              onClick={runDatabaseTests}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {isLoading ? '🔄 Running Tests...' : '🧪 Run Database Tests'}
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
            <div className="mb-2 text-gray-400">Console Output:</div>
            {testResults.length === 0 ? (
              <div className="text-gray-500">No tests run yet. Click the button above to start testing.</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What to do if tests fail:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to SQL Editor</li>
              <li>Copy and paste the contents of <code className="bg-blue-100 px-1 rounded">supabase-setup.sql</code></li>
              <li>Click "Run" to execute the script</li>
              <li>Refresh this page and run the tests again</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 