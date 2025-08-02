"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import PayPalSubscriptionButton from "@/components/paypal/PayPalSubscriptionButton";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function TestPayPalPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSuccess = (subscriptionId: string) => {
    setStatus('success');
    setMessage(`PayPal subscription successful! Subscription ID: ${subscriptionId}`);
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(`PayPal subscription failed: ${error}`);
  };

  const handleCancel = () => {
    setStatus('idle');
    setMessage('PayPal subscription was cancelled');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to test PayPal subscriptions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PayPal Subscription Test</h1>
          <p className="text-xl text-gray-600">
            Test the $14.99/month subscription integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Plan Information</h3>
                  <p className="text-gray-600">Basic Plan - $14.99/month</p>
                  <p className="text-gray-600">PayPal Plan ID: P-9YA223448D5519637NCHHMTY</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">User Information</h3>
                  <p className="text-gray-600">User ID: {user.id}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Features Included</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Unlimited assignments</li>
                    <li>• Full calendar access</li>
                    <li>• Priority AI processing</li>
                    <li>• PDF & DOCX export</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status Display */}
            {status !== 'idle' && (
              <div className={`p-4 rounded-lg border ${
                status === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    status === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {status === 'success' ? 'Success' : 'Error'}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${
                  status === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {message}
                </p>
              </div>
            )}
          </div>

          {/* PayPal Button */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PayPal Subscription</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to test the PayPal subscription integration.
            </p>
            
            <PayPalSubscriptionButton
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 