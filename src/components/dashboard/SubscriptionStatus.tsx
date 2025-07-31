"use client";

import { useState, useEffect } from "react";
import { CreditCard, Calendar, AlertTriangle, CheckCircle, Crown, ArrowUp, FileText } from "lucide-react";
import PaymentService, { UserSubscription } from "@/lib/payment-service";
import Paywall from "@/components/Paywall";

interface SubscriptionStatusProps {
  userId: string;
}

export default function SubscriptionStatus({ userId }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [assignmentUsage, setAssignmentUsage] = useState<{ used: number; limit: number; remaining: number }>({ used: 0, limit: 4, remaining: 4 });
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
    
    // Listen for subscription changes
    const paymentService = PaymentService.getInstance();
    paymentService.addSubscriptionChangeListener(loadSubscriptionStatus);
    
    // Cleanup listener on unmount
    return () => {
      paymentService.removeSubscriptionChangeListener(loadSubscriptionStatus);
    };
  }, [userId]);

  const loadSubscriptionStatus = async () => {
    try {
      const paymentService = PaymentService.getInstance();
      const sub = await paymentService.checkSubscriptionStatus(userId);
      const usage = await paymentService.getAssignmentUsage(userId);
      
      setSubscription(sub);
      setAssignmentUsage(usage);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const paymentService = PaymentService.getInstance();
      await paymentService.cancelSubscription(userId);
      setShowCancelModal(false);
      await loadSubscriptionStatus();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const handleUpgrade = async (paymentData: any) => {
    try {
      const paymentService = PaymentService.getInstance();
      const result = await paymentService.convertToPaid(userId, 'basic', paymentData);
      
      if (result.success) {
        setShowUpgradeModal(false);
        await loadSubscriptionStatus();
        return true;
      } else {
        alert('Payment failed: ' + result.message);
        return false;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">No Active Subscription</h3>
        </div>
        <p className="text-gray-600 mb-4">
          You don't have an active subscription. Subscribe to start generating assignments.
        </p>
        <a
          href="/auth/signup"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Crown className="w-4 h-4 mr-2" />
          Start Free Plan
        </a>
      </div>
    );
  }

  const isFree = subscription.status === 'free';
  const isActive = subscription.status === 'basic' || subscription.status === 'pro';
  const isExpired = subscription.status === 'expired' || subscription.status === 'cancelled';
  const hasCalendarAccess = subscription.hasCalendarAccess;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {isFree ? (
            <FileText className="w-5 h-5 text-blue-500 mr-2" />
          ) : isActive ? (
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {isFree ? 'Free Plan' : isActive ? `${subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)} Plan` : 'Subscription Expired'}
          </h3>
        </div>
        <div className="text-sm text-gray-500">
          {subscription.planId === 'free' ? 'Free' : subscription.planId === 'basic' ? 'Basic' : 'Pro'}
        </div>
      </div>

      {/* Assignment Usage */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FileText className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Assignment Usage</span>
          </div>
          <span className="text-blue-600 font-medium">
            {assignmentUsage.used}/{assignmentUsage.limit === -1 ? '∞' : assignmentUsage.limit}
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${assignmentUsage.limit === -1 ? 100 : Math.min(100, (assignmentUsage.used / assignmentUsage.limit) * 100)}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-blue-700 mt-1">
          <span>Used</span>
          <span>{assignmentUsage.remaining === -1 ? 'Unlimited' : `${assignmentUsage.remaining} remaining`}</span>
        </div>
      </div>

      {isFree && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-medium">Free Plan</p>
              <p className="text-yellow-700 text-sm">
                {assignmentUsage.remaining} assignment{assignmentUsage.remaining !== 1 ? 's' : ''} remaining this month
              </p>
            </div>
            <div className="text-right">
              <p className="text-yellow-800 font-medium">$14.99/month</p>
              <p className="text-yellow-700 text-sm">Upgrade to Basic</p>
            </div>
          </div>
          {/* Upgrade button for free users */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Upgrade to Basic
          </button>
        </div>
      )}

      {isActive && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Active Subscription</p>
              <p className="text-green-700 text-sm">
                Unlimited assignments available
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-800 font-medium">
                {subscription.planId === 'basic' ? '$14.99' : '$29.99'}/month
              </p>
              <p className="text-green-700 text-sm">
                {subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)} Plan
              </p>
            </div>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-medium">Subscription Expired</p>
              <p className="text-red-700 text-sm">
                Your subscription has ended. Renew to continue using all features.
              </p>
            </div>
            <div className="text-right">
              <a
                href="/auth/signup"
                className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Renew
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span className={`font-medium ${
            isFree ? 'text-blue-600' : 
            isActive ? 'text-green-600' : 'text-red-600'
          }`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Plan</span>
          <span className="font-medium text-gray-900">
            {subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)} Plan
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Price</span>
          <span className="font-medium text-gray-900">
            {subscription.planId === 'free' ? 'Free' : subscription.planId === 'basic' ? '$14.99/month' : '$29.99/month'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Calendar Access</span>
          <span className={`font-medium ${hasCalendarAccess ? 'text-green-600' : 'text-gray-500'}`}>
            {hasCalendarAccess ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      {(isActive) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Subscription
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to all premium features.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <Paywall
        isVisible={showUpgradeModal}
        onUpgrade={handleUpgrade}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
} 