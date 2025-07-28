'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { PaymentService } from '@/lib/payment-service';

export default function TestSupabaseConnection() {
  const [status, setStatus] = useState<string>('Ready to test');
  const [userId] = useState<string>('test-user-123');

  const testConnection = async () => {
    setStatus('Testing connection...');
    
    try {
      // Test 1: Basic connection
      const { data, error } = await supabase.from('subscriptions').select('count').limit(1);
      
      if (error) {
        setStatus(`❌ Connection failed: ${error.message}`);
        return;
      }
      
      setStatus('✅ Connection successful! Table exists.');
      
      // Test 2: Try to insert a test record
      const testRecord = {
        user_id: userId,
        plan: 'pro',
        status: 'trial',
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([testRecord]);
      
      if (insertError) {
        setStatus(`❌ Insert failed: ${insertError.message}`);
        return;
      }
      
      setStatus('✅ Insert successful! Database is working.');
      
      // Test 3: Try to read the record
      const { data: readData, error: readError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (readError) {
        setStatus(`❌ Read failed: ${readError.message}`);
        return;
      }
      
      setStatus(`✅ Read successful! Found record: ${JSON.stringify(readData, null, 2)}`);
      
      // Test 4: Test PaymentService
      const paymentService = PaymentService.getInstance();
      const subscription = await paymentService.checkSubscriptionStatus(userId);
      
      if (subscription) {
        setStatus(`✅ PaymentService working! Status: ${subscription.status}, Trial active: ${subscription.isTrialActive}`);
      } else {
        setStatus('❌ PaymentService failed to get subscription');
      }
      
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    }
  };

  const cleanup = async () => {
    setStatus('Cleaning up test data...');
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        setStatus(`❌ Cleanup failed: ${error.message}`);
      } else {
        setStatus('✅ Cleanup successful! Test data removed.');
      }
    } catch (error) {
      setStatus(`❌ Cleanup error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Supabase Connection Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Status</h2>
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <pre className="text-sm">{status}</pre>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={testConnection}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Test Supabase Connection & PaymentService
            </button>
            
            <button
              onClick={cleanup}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Cleanup Test Data
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">What This Tests</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Supabase connection and authentication</li>
            <li>✅ Table existence and structure</li>
            <li>✅ Insert operations (CREATE)</li>
            <li>✅ Read operations (SELECT)</li>
            <li>✅ PaymentService integration</li>
            <li>✅ Delete operations (cleanup)</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 