'use client';

import { useState, useEffect } from 'react';
import PaymentService from '@/lib/payment-service';
import { supabase } from '@/lib/supabase-client';

export default function TestSupabasePage() {
  const [userId, setUserId] = useState('test-user-' + Date.now());
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const paymentService = PaymentService.getInstance();

  const loadSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await paymentService.checkSubscriptionStatus(userId);
      setSubscriptionStatus(status);
      
      // Also fetch directly from Supabase for comparison
      const { data: supabaseData, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setDebugInfo(prev => prev + `\n\n--- Subscription Check ---\n` +
        `PaymentService Status: ${JSON.stringify(status, null, 2)}\n` +
        `Supabase Direct Query: ${error ? 'Error: ' + error.message : JSON.stringify(supabaseData, null, 2)}\n` +
        `Timestamp: ${new Date().toLocaleString()}`);
    } catch (error) {
      console.error('Error loading subscription status:', error);
      setDebugInfo(prev => prev + `\nError: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      setDebugInfo(prev => prev + `\n\n--- Starting Upgrade ---\nTimestamp: ${new Date().toLocaleString()}`);
      
      const result = await paymentService.convertTrialToPaid(userId, {
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        nameOnCard: 'Test User'
      });
      
      setDebugInfo(prev => prev + `\nUpgrade Result: ${JSON.stringify(result, null, 2)}`);
      
      if (result.success) {
        // Reload status after upgrade
        await loadSubscriptionStatus();
      }
    } catch (error) {
      console.error('Error during upgrade:', error);
      setDebugInfo(prev => prev + `\nUpgrade Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setDebugInfo('');
    loadSubscriptionStatus();
  };

  useEffect(() => {
    loadSubscriptionStatus();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Supabase Integration Test
          </h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID:
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={loadSubscriptionStatus}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Check Status'}
            </button>
            
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Upgrading...' : 'Upgrade to Pro'}
            </button>
            
            <button
              onClick={handleRefresh}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Clear & Refresh
            </button>
          </div>

          {subscriptionStatus && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Current Subscription Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>User ID:</strong> {subscriptionStatus.userId}</p>
                  <p><strong>Plan:</strong> {subscriptionStatus.planId}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      subscriptionStatus.status === 'active' ? 'bg-green-100 text-green-800' :
                      subscriptionStatus.status === 'trial' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {subscriptionStatus.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p><strong>Trial Active:</strong> {subscriptionStatus.isTrialActive ? 'Yes' : 'No'}</p>
                  <p><strong>Trial End Date:</strong> {subscriptionStatus.trialEndDate?.toLocaleString()}</p>
                  <p><strong>Requires Payment:</strong> {subscriptionStatus.requiresPaymentMethod ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm whitespace-pre-wrap">{debugInfo || 'No debug information yet...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 