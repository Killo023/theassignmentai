'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PaymentService } from '@/lib/payment-service';
import { supabase } from '@/lib/supabase-client';

export default function TestCacheBust() {
  const { user } = useAuth();
  const [results, setResults] = useState<any>({});
  const [timestamp, setTimestamp] = useState<string>('');

  const runTest = async () => {
    if (!user) return;

    const now = new Date().toLocaleTimeString();
    setTimestamp(now);
    
    console.log(`🕐 Test run at: ${now}`);
    console.log(`👤 User: ${user.id}`);

    // Test 1: Direct Supabase query
    const { data: supabaseData, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    console.log('📊 Supabase data:', supabaseData);
    console.log('❌ Supabase error:', error);

    // Test 2: PaymentService query
    const paymentService = PaymentService.getInstance();
    const paymentStatus = await paymentService.checkSubscriptionStatus(user.id);
    
    console.log('📊 PaymentService status:', paymentStatus);

    // Test 3: Force new PaymentService instance
    const newPaymentService = PaymentService.getInstance();
    const newStatus = await newPaymentService.checkSubscriptionStatus(user.id);
    
    console.log('📊 New PaymentService status:', newStatus);

    setResults({
      timestamp: now,
      supabaseData,
      supabaseError: error,
      paymentStatus,
      newStatus
    });
  };

  useEffect(() => {
    runTest();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in first
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Cache Bust Test
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Test Time:</strong> {timestamp}</p>
            <p><strong>Results:</strong> {Object.keys(results).length > 0 ? 'Available' : 'None'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Supabase Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Supabase Data</h2>
            {results.supabaseData ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {results.supabaseData.status}</p>
                <p><strong>Plan:</strong> {results.supabaseData.plan}</p>
                <p><strong>Upgraded At:</strong> {results.supabaseData.upgraded_at}</p>
                <p><strong>Trial End:</strong> {results.supabaseData.trial_end_date}</p>
              </div>
            ) : (
              <p className="text-red-500">Error: {results.supabaseError?.message}</p>
            )}
          </div>

          {/* PaymentService Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">PaymentService Status</h2>
            {results.paymentStatus ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {results.paymentStatus.status}</p>
                <p><strong>Trial Active:</strong> {results.paymentStatus.isTrialActive ? 'Yes' : 'No'}</p>
                <p><strong>Plan:</strong> {results.paymentStatus.planId}</p>
                <p><strong>Requires Payment:</strong> {results.paymentStatus.requiresPaymentMethod ? 'Yes' : 'No'}</p>
              </div>
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </div>

          {/* New PaymentService Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">New PaymentService Status</h2>
            {results.newStatus ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {results.newStatus.status}</p>
                <p><strong>Trial Active:</strong> {results.newStatus.isTrialActive ? 'Yes' : 'No'}</p>
                <p><strong>Plan:</strong> {results.newStatus.planId}</p>
                <p><strong>Requires Payment:</strong> {results.newStatus.requiresPaymentMethod ? 'Yes' : 'No'}</p>
              </div>
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={runTest}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Run Test Again
            </button>
          </div>
        </div>

        {/* Raw Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Raw Results</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 