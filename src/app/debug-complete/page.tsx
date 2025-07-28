'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PaymentService } from '@/lib/payment-service';
import { supabase } from '@/lib/supabase-client';

export default function DebugComplete() {
  const { user } = useAuth();
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [stepResults, setStepResults] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState<string>('');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runCompleteDiagnostic = async () => {
    if (!user) return;
    
    setDebugLog([]);
    setStepResults({});
    
    addLog('🚀 Starting complete diagnostic...');
    addLog(`👤 User: ${user.id} (${user.email})`);

    // Step 1: Check current subscription status
    setCurrentStep('Checking current status');
    addLog('📊 Step 1: Checking current subscription status...');
    
    const paymentService = PaymentService.getInstance();
    const currentStatus = await paymentService.checkSubscriptionStatus(user.id);
    addLog(`📊 Current status: ${JSON.stringify(currentStatus, null, 2)}`);
    
    setStepResults(prev => ({ ...prev, currentStatus }));

    // Step 2: Check Supabase directly
    setCurrentStep('Checking Supabase');
    addLog('📊 Step 2: Checking Supabase directly...');
    
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (supabaseError) {
      addLog(`❌ Supabase error: ${supabaseError.message}`);
    } else {
      addLog(`✅ Supabase data: ${JSON.stringify(supabaseData, null, 2)}`);
    }
    
    setStepResults(prev => ({ ...prev, supabaseData, supabaseError }));

    // Step 3: Check all users in database
    setCurrentStep('Checking all users');
    addLog('📊 Step 3: Checking all users in database...');
    
    const { data: allUsers, error: allUsersError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allUsersError) {
      addLog(`❌ All users error: ${allUsersError.message}`);
    } else {
      addLog(`✅ All users: ${JSON.stringify(allUsers, null, 2)}`);
    }
    
    setStepResults(prev => ({ ...prev, allUsers, allUsersError }));

    // Step 4: Perform upgrade
    setCurrentStep('Performing upgrade');
    addLog('📊 Step 4: Performing upgrade...');
    
    const upgradeResult = await paymentService.convertTrialToPaid(user.id, {
      cardNumber: '4242424242424242',
      expiryDate: '12/25',
      cvv: '123',
      nameOnCard: 'Test User'
    });
    
    addLog(`🎉 Upgrade result: ${JSON.stringify(upgradeResult, null, 2)}`);
    setStepResults(prev => ({ ...prev, upgradeResult }));

    // Step 5: Check status after upgrade
    setCurrentStep('Checking after upgrade');
    addLog('📊 Step 5: Checking status after upgrade...');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for async operations
    
    const statusAfterUpgrade = await paymentService.checkSubscriptionStatus(user.id);
    addLog(`📊 Status after upgrade: ${JSON.stringify(statusAfterUpgrade, null, 2)}`);
    
    setStepResults(prev => ({ ...prev, statusAfterUpgrade }));

    // Step 6: Check Supabase after upgrade
    setCurrentStep('Checking Supabase after upgrade');
    addLog('📊 Step 6: Checking Supabase after upgrade...');
    
    const { data: supabaseAfter, error: supabaseAfterError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (supabaseAfterError) {
      addLog(`❌ Supabase after error: ${supabaseAfterError.message}`);
    } else {
      addLog(`✅ Supabase after: ${JSON.stringify(supabaseAfter, null, 2)}`);
    }
    
    setStepResults(prev => ({ ...prev, supabaseAfter, supabaseAfterError }));

    // Step 7: Test user ID consistency
    setCurrentStep('Testing user ID consistency');
    addLog('📊 Step 7: Testing user ID consistency...');
    
    const testEmails = [
      user.email,
      user.email.toLowerCase(),
      user.email.toUpperCase(),
      user.email.trim()
    ];

    testEmails.forEach(email => {
      let hash = 0;
      for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      const generatedId = `user-${Math.abs(hash)}`;
      addLog(`Email: "${email}" -> ID: ${generatedId} (matches: ${generatedId === user.id})`);
    });

    // Step 8: Force refresh and check again
    setCurrentStep('Force refresh check');
    addLog('📊 Step 8: Force refresh and check again...');
    
    // Clear any cached data by creating a new PaymentService instance
    const newPaymentService = PaymentService.getInstance();
    const refreshedStatus = await newPaymentService.checkSubscriptionStatus(user.id);
    addLog(`📊 Refreshed status: ${JSON.stringify(refreshedStatus, null, 2)}`);
    
    setStepResults(prev => ({ ...prev, refreshedStatus }));

    addLog('✅ Complete diagnostic finished!');
    setCurrentStep('Complete');
  };

  const forceUpgradeInDatabase = async () => {
    if (!user) return;
    
    addLog('🔧 Force upgrading in database...');
    
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
      addLog(`❌ Force upgrade failed: ${error.message}`);
    } else {
      addLog('✅ Force upgrade successful');
      setTimeout(() => {
        runCompleteDiagnostic();
      }, 1000);
    }
  };

  const clearDatabase = async () => {
    if (!user) return;
    
    addLog('🗑️ Clearing user from database...');
    
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      addLog(`❌ Clear failed: ${error.message}`);
    } else {
      addLog('✅ Clear successful');
      setTimeout(() => {
        runCompleteDiagnostic();
      }, 1000);
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
            You need to be logged in to run the complete diagnostic.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Complete Diagnostic
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current Step</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {currentStep || 'Ready'}</p>
              <p><strong>Log Entries:</strong> {debugLog.length}</p>
            </div>
          </div>

          {/* Key Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Key Results</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Current Status:</strong> {stepResults.currentStatus?.status || 'N/A'}</p>
              <p><strong>After Upgrade:</strong> {stepResults.statusAfterUpgrade?.status || 'N/A'}</p>
              <p><strong>Supabase Records:</strong> {stepResults.allUsers?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={runCompleteDiagnostic}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Run Complete Diagnostic
            </button>
            
            <button
              onClick={forceUpgradeInDatabase}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Force Upgrade in Database
            </button>
            
            <button
              onClick={clearDatabase}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear User from Database
            </button>
          </div>
        </div>

        {/* Debug Log */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Debug Log</h2>
            <button
              onClick={() => setDebugLog([])}
              className="bg-gray-600 text-white py-1 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-auto">
            <pre className="text-xs">
              {debugLog.join('\n')}
            </pre>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
          <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-auto">
            <pre className="text-xs">
              {JSON.stringify(stepResults, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 