"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import PayPalProSubscriptionButton from "@/components/paypal/PayPalProSubscriptionButton";
import { CheckCircle, AlertCircle, Crown, Sparkles } from "lucide-react";

export default function TestPayPalProPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSuccess = (subscriptionId: string) => {
    setStatus('success');
    setMessage(`PayPal Pro subscription successful! Subscription ID: ${subscriptionId}`);
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(`PayPal Pro subscription failed: ${error}`);
  };

  const handleCancel = () => {
    setStatus('idle');
    setMessage('PayPal Pro subscription was cancelled');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to test PayPal Pro subscriptions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">PayPal Pro Subscription Test</h1>
          </div>
          <p className="text-xl text-gray-600">
            Test the $29.99/month Pro tier subscription integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Pro Plan Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Plan Information</h3>
                  <p className="text-gray-600">Pro Plan - $29.99/month</p>
                  <p className="text-gray-600">PayPal Plan ID: P-8VL08082LX8549907NCDSNXA</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">User Information</h3>
                  <p className="text-gray-600">User ID: {user.id}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Pro Features Included</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Everything in Basic Plan, PLUS:</li>
                    <li>• AI-powered charts and graphs</li>
                    <li>• Advanced export (PDF, DOCX, TXT + more)</li>
                    <li>• University-level academic standards</li>
                    <li>• Plagiarism-free guarantee</li>
                    <li>• 24/7 premium support</li>
                    <li>• Advanced performance analytics</li>
                    <li>• Highest priority AI processing</li>
                    <li>• Custom branding options</li>
                    <li>• API access</li>
                    <li>• White-label solutions</li>
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

          {/* PayPal Pro Button */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">PayPal Pro Subscription</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Click the button below to test the PayPal Pro subscription integration.
            </p>
            
            <PayPalProSubscriptionButton
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCancel}
            />
          </div>
        </div>

        {/* Additional Pro Benefits */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Pro?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Advanced AI</h4>
              <p className="text-gray-600 text-sm">Highest priority processing and advanced features</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Support</h4>
              <p className="text-gray-600 text-sm">24/7 dedicated support for Pro users</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Guaranteed Quality</h4>
              <p className="text-gray-600 text-sm">Plagiarism-free guarantee and academic standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 