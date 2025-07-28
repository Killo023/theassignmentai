'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PaymentService } from '@/lib/payment-service';
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus';

export default function TestDashboardStatus() {
  const { user } = useAuth();
  const [paymentServiceStatus, setPaymentServiceStatus] = useState<any>(null);
  const [componentStatus, setComponentStatus] = useState<any>(null);

  const checkStatus = async () => {
    if (!user) return;

    console.log('🔍 Checking status for user:', user.id);
    
    // Check PaymentService directly
    const paymentService = PaymentService.getInstance();
    const status = await paymentService.checkSubscriptionStatus(user.id);
    setPaymentServiceStatus(status);
    
    console.log('📊 PaymentService status:', status);
  };

  useEffect(() => {
    checkStatus();
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
          Test Dashboard Status
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* PaymentService Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">PaymentService Status</h2>
            {paymentServiceStatus ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {paymentServiceStatus.status}</p>
                <p><strong>Trial Active:</strong> {paymentServiceStatus.isTrialActive ? 'Yes' : 'No'}</p>
                <p><strong>Plan:</strong> {paymentServiceStatus.planId}</p>
                <p><strong>Trial End:</strong> {paymentServiceStatus.trialEndDate?.toLocaleDateString()}</p>
                <p><strong>Requires Payment:</strong> {paymentServiceStatus.requiresPaymentMethod ? 'Yes' : 'No'}</p>
              </div>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={checkStatus}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Status
            </button>
          </div>
        </div>

        {/* SubscriptionStatus Component */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">SubscriptionStatus Component</h2>
          <div className="border rounded-lg p-4">
            <SubscriptionStatus userId={user.id} />
          </div>
        </div>

        {/* Raw Data */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Raw PaymentService Data</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(paymentServiceStatus, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 