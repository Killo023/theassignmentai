'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PaymentService } from '@/lib/payment-service';
import { supabase } from '@/lib/supabase-client';

export default function DebugPersistenceIssue() {
  const { user } = useAuth();
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const loadAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        addLog(`❌ Error loading all users: ${error.message}`);
      } else {
        addLog(`✅ Loaded ${data?.length || 0} users from database`);
        setAllUsers(data || []);
      }
    } catch (error) {
      addLog(`❌ Exception loading users: ${error}`);
    }
  };

  const checkUserSubscription = async () => {
    if (!user) return;

    addLog(`🔍 Checking subscription for user: ${user.id}`);
    
    try {
      // Check directly in Supabase
      const { data: supabaseData, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        addLog(`❌ Supabase query error: ${error.message}`);
      } else {
        addLog(`✅ Supabase data: ${JSON.stringify(supabaseData)}`);
      }

      // Check via PaymentService
      const paymentService = PaymentService.getInstance();
      const subscription = await paymentService.checkSubscriptionStatus(user.id);
      
      addLog(`📊 PaymentService status: ${subscription?.status}`);
      addLog(`📊 PaymentService isTrialActive: ${subscription?.isTrialActive}`);
      
      setCurrentStatus({
        supabase: supabaseData,
        paymentService: subscription
      });

    } catch (error) {
      addLog(`❌ Exception checking subscription: ${error}`);
    }
  };

  const performUpgrade = async () => {
    if (!user) return;

    addLog(`🚀 Starting upgrade for user: ${user.id}`);
    
    try {
      const paymentService = PaymentService.getInstance();
      const result = await paymentService.convertTrialToPaid(user.id, {
        cardNumber: '4242424242424242',
        expiryDate: '12/25',
        cvv: '123',
        nameOnCard: 'Test User'
      });

      addLog(`🎉 Upgrade result: ${JSON.stringify(result)}`);
      
      // Wait a moment then check status
      setTimeout(() => {
        checkUserSubscription();
        loadAllUsers();
      }, 2000);

    } catch (error) {
      addLog(`❌ Upgrade exception: ${error}`);
    }
  };

  const forceUpgradeInDatabase = async () => {
    if (!user) return;

    addLog(`🔧 Force upgrading in database for user: ${user.id}`);
    
    try {
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
        addLog(`✅ Force upgrade successful`);
        setTimeout(() => {
          checkUserSubscription();
          loadAllUsers();
        }, 1000);
      }
    } catch (error) {
      addLog(`❌ Force upgrade exception: ${error}`);
    }
  };

  const testUserConsistency = () => {
    if (!user) return;

    addLog(`🆔 Testing user ID consistency`);
    addLog(`Current user ID: ${user.id}`);
    addLog(`Current user email: ${user.email}`);
    
    // Test if user ID generation is consistent
    const testEmails = [
      user.email,
      user.email.toLowerCase(),
      user.email.toUpperCase(),
      user.email.trim()
    ];

    testEmails.forEach(email => {
      // Simple hash function (same as in auth-context)
      let hash = 0;
      for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      const generatedId = `user-${Math.abs(hash)}`;
      addLog(`Email: "${email}" -> ID: ${generatedId} (matches: ${generatedId === user.id})`);
    });
  };

  const clearLogs = () => {
    setDebugLog([]);
  };

  useEffect(() => {
    if (user) {
      addLog(`👤 User loaded: ${user.id} (${user.email})`);
      checkUserSubscription();
      loadAllUsers();
      testUserConsistency();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in first
          </h1>
          <p className="text-gray-600">
            You need to be logged in to debug the persistence issue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Debug Persistence Issue
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

          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            {currentStatus ? (
              <div className="space-y-2 text-sm">
                <p><strong>Supabase Status:</strong> {currentStatus.supabase?.status || 'N/A'}</p>
                <p><strong>PaymentService Status:</strong> {currentStatus.paymentService?.status || 'N/A'}</p>
                <p><strong>Trial Active:</strong> {currentStatus.paymentService?.isTrialActive ? 'Yes' : 'No'}</p>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          {/* Database Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Database Users</h2>
            <div className="space-y-1 text-xs">
              {allUsers.map((userRecord, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <p><strong>ID:</strong> {userRecord.user_id}</p>
                  <p><strong>Status:</strong> {userRecord.status}</p>
                  <p><strong>Plan:</strong> {userRecord.plan}</p>
                </div>
              ))}
              {allUsers.length === 0 && (
                <p className="text-gray-500">No users found</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={checkUserSubscription}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Check Status
            </button>
            
            <button
              onClick={performUpgrade}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Perform Upgrade
            </button>
            
            <button
              onClick={forceUpgradeInDatabase}
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Force Upgrade
            </button>
            
            <button
              onClick={loadAllUsers}
              className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
            >
              Reload Users
            </button>
          </div>
        </div>

        {/* Debug Log */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Debug Log</h2>
            <button
              onClick={clearLogs}
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
      </div>
    </div>
  );
} 