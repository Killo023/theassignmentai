'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase-client';

export default function ForceUpgradePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const forceUpgrade = async () => {
    if (!user) {
      setMessage('Please log in first');
      return;
    }

    setIsLoading(true);
    setMessage('Force upgrading...');

    try {
      // First, check if subscription exists
      const { data: existingSub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        setMessage(`Error fetching subscription: ${fetchError.message}`);
        return;
      }

      if (!existingSub) {
        // Create new subscription
        const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{
            user_id: user.id,
            plan: 'pro',
            status: 'active', // Start as active
            trial_end_date: trialEndDate.toISOString(),
            upgraded_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }]);

        if (insertError) {
          setMessage(`Error creating subscription: ${insertError.message}`);
          return;
        }
      } else {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            upgraded_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) {
          setMessage(`Error updating subscription: ${updateError.message}`);
          return;
        }
      }

      setMessage(`✅ Successfully upgraded user ${user.id} to Pro!`);
      
      // Clear any cached data
      localStorage.removeItem('subscription-status');
      
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!user) {
      setMessage('Please log in first');
      return;
    }

    setIsLoading(true);
    setMessage('Checking status...');

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(`Current status: ${data.status}, Upgraded: ${data.upgraded_at ? 'Yes' : 'No'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold mb-6">Force Upgrade Tool</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">User Info</h2>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={forceUpgrade}
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 text-lg font-semibold"
            >
              {isLoading ? 'Upgrading...' : 'Force Upgrade to Pro'}
            </button>
            
            <button
              onClick={checkStatus}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold ml-4"
            >
              {isLoading ? 'Checking...' : 'Check Current Status'}
            </button>
          </div>

          {message && (
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Click "Force Upgrade to Pro" to upgrade your account</li>
              <li>2. Go to your dashboard and refresh the page</li>
              <li>3. The status should now persist as "Pro"</li>
              <li>4. If it still shows "Trial", check the console logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 