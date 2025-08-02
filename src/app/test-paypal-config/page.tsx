'use client';

import { useState } from 'react';

export default function PayPalConfigTestPage() {
  const [configStatus, setConfigStatus] = useState<{
    clientId: boolean;
    basicPlanId: boolean;
    proPlanId: boolean;
  }>({
    clientId: false,
    basicPlanId: false,
    proPlanId: false
  });

  const checkConfiguration = () => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const basicPlanId = process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID;
    const proPlanId = process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID;

    setConfigStatus({
      clientId: !!(clientId && clientId !== 'your_paypal_client_id_here'),
      basicPlanId: !!(basicPlanId && basicPlanId !== 'P-9YA223448D5519637NCHHMTY'),
      proPlanId: !!(proPlanId && proPlanId !== 'P-8VL08082LX8549907NCDSNXA')
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            PayPal Configuration Test
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page checks your PayPal configuration and helps identify setup issues.
            </p>
            
            <button
              onClick={checkConfiguration}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              🔍 Check PayPal Configuration
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Configuration Status</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {configStatus.clientId ? (
                    <span className="text-green-600">✅</span>
                  ) : (
                    <span className="text-red-600">❌</span>
                  )}
                  <span className={configStatus.clientId ? 'text-green-700' : 'text-red-700'}>
                    PayPal Client ID: {configStatus.clientId ? 'Configured' : 'Not configured'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {configStatus.basicPlanId ? (
                    <span className="text-green-600">✅</span>
                  ) : (
                    <span className="text-red-600">❌</span>
                  )}
                  <span className={configStatus.basicPlanId ? 'text-green-700' : 'text-red-700'}>
                    Basic Plan ID: {configStatus.basicPlanId ? 'Configured' : 'Using default'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {configStatus.proPlanId ? (
                    <span className="text-green-600">✅</span>
                  ) : (
                    <span className="text-red-600">❌</span>
                  )}
                  <span className={configStatus.proPlanId ? 'text-green-700' : 'text-red-700'}>
                    Pro Plan ID: {configStatus.proPlanId ? 'Configured' : 'Using default'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Current Environment Variables</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <code className="bg-blue-100 px-1 rounded">
                    NEXT_PUBLIC_PAYPAL_CLIENT_ID
                  </code>
                  : {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'Not set'}
                </div>
                <div>
                  <code className="bg-blue-100 px-1 rounded">
                    NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID
                  </code>
                  : {process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID || 'Not set'}
                </div>
                <div>
                  <code className="bg-blue-100 px-1 rounded">
                    NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID
                  </code>
                  : {process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || 'Not set'}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Setup Instructions</h3>
              <ol className="list-decimal list-inside text-yellow-800 space-y-1">
                <li>Go to <a href="https://developer.paypal.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PayPal Developer Dashboard</a></li>
                <li>Create a new app or use an existing one</li>
                <li>Copy your Client ID and Secret</li>
                <li>Create subscription plans for Basic ($14.99) and Pro ($29.99)</li>
                <li>Add the credentials to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
                <li>Restart your development server</li>
              </ol>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Test Pages</h3>
              <div className="space-y-2">
                <div>
                  <a href="/test-paypal" className="text-blue-600 hover:underline">
                    🧪 Test Basic Plan Integration
                  </a>
                </div>
                <div>
                  <a href="/test-paypal-pro" className="text-blue-600 hover:underline">
                    🧪 Test Pro Plan Integration
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 