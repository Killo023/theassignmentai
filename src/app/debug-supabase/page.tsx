'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function DebugSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [tableStatus, setTableStatus] = useState<string>('Testing...');
  const [testUserId] = useState('test-user-' + Date.now());
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      // Test 1: Check if we can connect to Supabase
      setConnectionStatus('Testing connection...');
      const { data, error } = await supabase.from('subscriptions').select('count').limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          setConnectionStatus('✅ Connected to Supabase (table exists but no data)');
        } else if (error.message.includes('relation "subscriptions" does not exist')) {
          setConnectionStatus('❌ Connected to Supabase but subscriptions table does not exist');
          setTableStatus('❌ Table needs to be created');
        } else {
          setConnectionStatus(`❌ Connection error: ${error.message}`);
          setTableStatus('❌ Cannot test table');
        }
      } else {
        setConnectionStatus('✅ Connected to Supabase');
        setTableStatus('✅ Table exists and accessible');
      }

      // Test 2: Try to insert a test record
      setTestResult('Testing insert...');
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: testUserId,
          plan: 'pro',
          status: 'trial',
          trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        setTestResult(`❌ Insert failed: ${insertError.message}`);
      } else {
        setTestResult('✅ Insert successful');
        
        // Test 3: Try to read the record back
        const { data: readData, error: readError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', testUserId)
          .single();

        if (readError) {
          setTestResult(prev => prev + `\n❌ Read failed: ${readError.message}`);
        } else {
          setTestResult(prev => prev + `\n✅ Read successful: ${JSON.stringify(readData, null, 2)}`);
        }
      }

    } catch (error) {
      setConnectionStatus(`❌ Unexpected error: ${error}`);
    }
  };

  const createTestSubscription = async () => {
    try {
      setTestResult('Creating test subscription...');
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: testUserId,
          plan: 'pro',
          status: 'trial',
          trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }]);

      if (error) {
        setTestResult(`❌ Failed to create subscription: ${error.message}`);
      } else {
        setTestResult('✅ Test subscription created successfully');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const upgradeTestSubscription = async () => {
    try {
      setTestResult('Upgrading test subscription...');
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          upgraded_at: new Date().toISOString()
        })
        .eq('user_id', testUserId);

      if (error) {
        setTestResult(`❌ Failed to upgrade subscription: ${error.message}`);
      } else {
        setTestResult('✅ Test subscription upgraded successfully');
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Supabase Debug Page
          </h1>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
              <p className="text-sm">{connectionStatus}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Table Status</h2>
              <p className="text-sm">{tableStatus}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Test Operations</h2>
              <div className="space-y-2 mb-4">
                <button
                  onClick={createTestSubscription}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Test Subscription
                </button>
                <button
                  onClick={upgradeTestSubscription}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-2"
                >
                  Upgrade Test Subscription
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto max-h-64">
                <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
              <div className="space-y-2 text-sm">
                <p><strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}</p>
                <p><strong>SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
                <p><strong>Test User ID:</strong> {testUserId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 