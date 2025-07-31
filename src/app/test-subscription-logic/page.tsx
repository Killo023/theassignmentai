'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PaymentService } from '@/lib/payment-service';
import { supabase } from '@/lib/supabase-client';

export default function TestSubscriptionLogic() {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [supabaseData, setSupabaseData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const loadData = async () => {
    if (!user) return;

    console.log('🔍 Testing subscription logic for user:', user.id);

    // Test 1: PaymentService
    const paymentService = PaymentService.getInstance();
    const subscription = await paymentService.checkSubscriptionStatus(user.id);
    const usage = await paymentService.getAssignmentUsage(user.id);
    const canCreate = await paymentService.canCreateAssignment(user.id);

    setSubscriptionData({
      subscription,
      usage,
      canCreate
    });

    // Test 2: Direct Supabase query
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setSupabaseData({ data, error });

    // Test 3: Logic analysis
    const logicAnalysis = {
      status: subscription?.status,
      planId: subscription?.planId,
      assignmentsUsed: subscription?.assignmentsUsed,
      assignmentLimit: subscription?.assignmentLimit,
      hasCalendarAccess: subscription?.hasCalendarAccess,
      canCreateAssignment: canCreate,
      shouldShowPro: subscription?.status === 'basic' || subscription?.status === 'pro',
      shouldShowFree: subscription?.status === 'free'
    };

    setDebugInfo(`
=== SUBSCRIPTION LOGIC TEST ===

User ID: ${user.id}
User Email: ${user.email}

=== PaymentService Results ===
Status: ${subscription?.status}
Plan ID: ${subscription?.planId}
Assignments Used: ${subscription?.assignmentsUsed}
Assignment Limit: ${subscription?.assignmentLimit}
Has Calendar Access: ${subscription?.hasCalendarAccess}
Can Create Assignment: ${canCreate}

=== Assignment Usage ===
Used: ${usage.used}
Limit: ${usage.limit}
Remaining: ${usage.remaining}

=== Logic Analysis ===
Status: ${logicAnalysis.status}
Plan ID: ${logicAnalysis.planId}
Assignments Used: ${logicAnalysis.assignmentsUsed}
Assignment Limit: ${logicAnalysis.assignmentLimit}
Has Calendar Access: ${logicAnalysis.hasCalendarAccess}
Can Create Assignment: ${logicAnalysis.canCreateAssignment}
Should Show Pro: ${logicAnalysis.shouldShowPro}
Should Show Free: ${logicAnalysis.shouldShowFree}

=== Supabase Direct Query ===
Error: ${error ? error.message : 'None'}
Data: ${JSON.stringify(data, null, 2)}

=== Expected Behavior ===
- If status is 'free': Show "Free Plan" with 4 assignments limit
- If status is 'basic': Show "Basic Plan" with unlimited assignments
- If status is 'pro': Show "Pro Plan" with unlimited assignments
- Calendar access only for paid plans
    `);
  };

  const forceUpgrade = async () => {
    if (!user) return;

    console.log('🔧 Force upgrading user:', user.id);
    
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
        loadData();
      }, 1000);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in first
          </h1>
          <p className="text-gray-600">
            You need to be logged in to test subscription logic.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Subscription Logic
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* PaymentService Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">PaymentService Results</h2>
            {subscriptionData ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {subscriptionData.subscription?.status}</p>
                <p><strong>Is Trial Active:</strong> {subscriptionData.subscription?.isTrialActive ? 'Yes' : 'No'}</p>
                <p><strong>Trial Days:</strong> {subscriptionData.trialDays}</p>
                <p><strong>Has Active Sub:</strong> {subscriptionData.hasActiveSub ? 'Yes' : 'No'}</p>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          {/* Supabase Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Supabase Results</h2>
            {supabaseData ? (
              <div className="space-y-2 text-sm">
                <p><strong>Error:</strong> {supabaseData.error ? supabaseData.error.message : 'None'}</p>
                <p><strong>Data:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(supabaseData.data, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={loadData}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
            
            <button
              onClick={forceUpgrade}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Force Upgrade in Supabase
            </button>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-xs overflow-auto max-h-96">{debugInfo}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 