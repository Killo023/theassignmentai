'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PaymentService } from '@/lib/payment-service';
import { supabase } from '@/lib/supabase-client';
import Paywall from '@/components/Paywall';

export default function DebugUpgradePersistence() {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const loadSubscriptionStatus = async () => {
    if (!user) return;

    const paymentService = PaymentService.getInstance();
    const status = await paymentService.checkSubscriptionStatus(user.id);
    setSubscriptionStatus(status);

    // Also check directly in Supabase
    const { data: supabaseData, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    setDebugInfo(`
User ID: ${user.id}
User Email: ${user.email}
Auth Context User: ${JSON.stringify(user, null, 2)}

PaymentService Status: ${JSON.stringify(status, null, 2)}

Supabase Direct Query:
- Error: ${error ? error.message : 'None'}
- Data: ${JSON.stringify(supabaseData, null, 2)}
    `);
  };

  useEffect(() => {
    loadSubscriptionStatus();
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) return;

    console.log('🚀 Starting upgrade for user:', user.id);
    
    const paymentService = PaymentService.getInstance();
    const result = await paymentService.convertTrialToPaid(user.id, {
      cardNumber: '4242424242424242',
      expiryDate: '12/25',
      cvv: '123',
      nameOnCard: 'Test User'
    });

    console.log('🎉 Upgrade result:', result);
    
    // Reload status after upgrade
    setTimeout(() => {
      loadSubscriptionStatus();
    }, 1000);
  };

  const forceUpgradeInSupabase = async () => {
    if (!user) return;

    console.log('🔧 Force upgrading in Supabase for user:', user.id);
    
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan: 'pro',
        status: 'active',
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        upgraded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Force upgrade failed:', error);
    } else {
      console.log('✅ Force upgrade successful');
      setTimeout(() => {
        loadSubscriptionStatus();
      }, 1000);
    }
  };

  const checkAllUsers = async () => {
    console.log('🔍 Checking all users in Supabase...');
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*');

    if (error) {
      console.error('❌ Error fetching all users:', error);
    } else {
      console.log('📋 All users in database:', data);
      setDebugInfo(prev => prev + `\n\nAll Users in Database:\n${JSON.stringify(data, null, 2)}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in first
          </h1>
          <p className="text-gray-600">
            You need to be logged in to debug the upgrade persistence.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Debug Upgrade Persistence
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            {subscriptionStatus ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {subscriptionStatus.status}</p>
                <p><strong>Trial Active:</strong> {subscriptionStatus.isTrialActive ? 'Yes' : 'No'}</p>
                <p><strong>Days Remaining:</strong> {subscriptionStatus.getTrialDaysRemaining ? subscriptionStatus.getTrialDaysRemaining() : 'N/A'}</p>
                <p><strong>Trial End:</strong> {subscriptionStatus.trialEndDate?.toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleUpgrade}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Upgrade via PaymentService
            </button>
            
            <button
              onClick={forceUpgradeInSupabase}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Force Upgrade in Supabase
            </button>
            
            <button
              onClick={checkAllUsers}
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Check All Users
            </button>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-xs overflow-auto max-h-96">{debugInfo}</pre>
          </div>
        </div>

        {/* Paywall Modal */}
        {showPaywall && (
          <Paywall
            isVisible={showPaywall}
            onClose={() => setShowPaywall(false)}
            onUpgrade={async (paymentData: any) => {
              await handleUpgrade();
              return true;
            }}
          />
        )}
      </div>
    </div>
  );
} 