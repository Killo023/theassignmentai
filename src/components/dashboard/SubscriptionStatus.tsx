"use client";

import { useState, useEffect } from "react";
import { CreditCard, Calendar, AlertTriangle, CheckCircle, Crown, ArrowUp } from "lucide-react";
import PaymentService, { UserSubscription } from "@/lib/payment-service";
import Paywall from "@/components/Paywall";

interface SubscriptionStatusProps {
  userId: string;
}

export default function SubscriptionStatus({ userId }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
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
      const daysRemaining = await paymentService.getTrialDaysRemaining(userId);
      
      setSubscription(sub);
      setTrialDaysRemaining(daysRemaining);
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
      const result = await paymentService.convertTrialToPaid(userId, paymentData);
      
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
          Start Free Trial
        </a>
      </div>
    );
  }

  // Updated logic to handle upgraded users who are still in trial period
  const isTrialActive = subscription.status === 'trial' && trialDaysRemaining > 0;
  const isActive = subscription.status === 'active';
  const isUpgradedButInTrial = subscription.status === 'active' && trialDaysRemaining > 0;
  const isExpired = subscription.status === 'expired' || subscription.status === 'cancelled';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {isTrialActive ? (
            <Crown className="w-5 h-5 text-yellow-500 mr-2" />
          ) : isUpgradedButInTrial ? (
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          ) : isActive ? (
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            {isTrialActive ? 'Free Trial Active' : isUpgradedButInTrial ? 'Pro Plan (Trial Active)' : isActive ? 'Pro Subscription' : 'Subscription Expired'}
          </h3>
        </div>
        <div className="text-sm text-gray-500">
          {subscription.planId === 'pro' && 'Pro Plan'}
        </div>
      </div>

      {isTrialActive && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-medium">Trial Period</p>
              <p className="text-yellow-700 text-sm">
                {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
              </p>
            </div>
            <div className="text-right">
              <p className="text-yellow-800 font-medium">$29.99/month</p>
              <p className="text-yellow-700 text-sm">After trial</p>
            </div>
          </div>
          {/* Upgrade button for trial users */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Upgrade to Pro Now
          </button>
        </div>
      )}

      {isUpgradedButInTrial && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Pro Plan Active</p>
              <p className="text-green-700 text-sm">
                {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} of trial remaining
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-800 font-medium">$29.99/month</p>
              <p className="text-green-700 text-sm">Pro Plan</p>
            </div>
          </div>
        </div>
      )}

      {isActive && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Active Subscription</p>
              <p className="text-green-700 text-sm">
                Next billing: {subscription.nextBillingDate.toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-800 font-medium">$29.99/month</p>
              <p className="text-green-700 text-sm">Pro Plan</p>
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
            isTrialActive ? 'text-yellow-600' : 
            isUpgradedButInTrial ? 'text-green-600' :
            isActive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isUpgradedButInTrial ? 'Pro (Trial Active)' : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>

        {isTrialActive && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Trial Ends</span>
            <span className="font-medium text-gray-900">
              {subscription.trialEndDate.toLocaleDateString()}
            </span>
          </div>
        )}

        {isActive && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Billing</span>
            <span className="font-medium text-gray-900">
              {subscription.nextBillingDate.toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Plan</span>
          <span className="font-medium text-gray-900">Pro Plan</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Price</span>
          <span className="font-medium text-gray-900">$29.99/month</span>
        </div>
      </div>

      {(isActive || isTrialActive) && (
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
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upgrade to Pro
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade now to continue enjoying all premium features after your trial ends.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">Pro Plan Benefits:</p>
              <ul className="text-blue-700 text-sm mt-2 space-y-1">
                <li>• Unlimited assignment generation</li>
                <li>• AI-powered charts and graphs</li>
                <li>• Multiple export formats</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Trial
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // In a real app, this would redirect to payment form
                  alert('Payment form would open here in a real implementation');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
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