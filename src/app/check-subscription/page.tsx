'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import PaymentService from '@/lib/payment-service';
import { supabase } from '@/lib/supabase-client';

export default function CheckSubscriptionPage() {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [supabaseData, setSupabaseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const checkStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setDebugInfo(`Checking status for user: ${user.id} (${user.email})\n`);
    
    try {
      // Check via PaymentService
      const paymentService = PaymentService.getInstance();
      const status = await paymentService.checkSubscriptionStatus(user.id);
      setSubscriptionStatus(status);
      
      setDebugInfo(prev => prev + `PaymentService Status: ${JSON.stringify(status, null, 2)}\n`);
      
      // Check directly in Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        setDebugInfo(prev => prev + `Supabase Error: ${error.message}\n`);
      } else {
        setSupabaseData(data);
        setDebugInfo(prev => prev + `Supabase Data: ${JSON.stringify(data, null, 2)}\n`);
      }
      
    } catch (error) {
      setDebugInfo(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  const forceUpgrade = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setDebugInfo(`Force upgrading user: ${user.id}\n`);
    
    try {
      // Directly update in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          upgraded_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        setDebugInfo(prev => prev + `Upgrade Error: ${error.message}\n`);
      } else {
        setDebugInfo(prev => prev + `✅ Successfully upgraded in Supabase\n`);
        // Recheck status
        await checkStatus();
      }
    } catch (error) {
      setDebugInfo(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkStatus();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Please log in first</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Subscription Status Check</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">User Info</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">PaymentService Status</h2>
              {subscriptionStatus ? (
                <div className="space-y-2">
                  <p><strong>Status:</strong> {subscriptionStatus.status}</p>
                  <p><strong>Plan:</strong> {subscriptionStatus.planId}</p>
                  <p><strong>Trial Active:</strong> {subscriptionStatus.isTrialActive ? 'Yes' : 'No'}</p>
                  <p><strong>Trial End:</strong> {subscriptionStatus.trialEndDate?.toLocaleString()}</p>
                </div>
              ) : (
                <p>No status available</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Supabase Data</h2>
              {supabaseData ? (
                <div className="space-y-2">
                  <p><strong>Status:</strong> {supabaseData.status}</p>
                  <p><strong>Plan:</strong> {supabaseData.plan}</p>
                  <p><strong>Upgraded At:</strong> {supabaseData.upgraded_at ? new Date(supabaseData.upgraded_at).toLocaleString() : 'Not upgraded'}</p>
                  <p><strong>Trial End:</strong> {new Date(supabaseData.trial_end_date).toLocaleString()}</p>
                </div>
              ) : (
                <p>No data in Supabase</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={checkStatus}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh Status'}
            </button>
            
            <button
              onClick={forceUpgrade}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Upgrading...' : 'Force Upgrade'}
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 