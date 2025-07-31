"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, Crown, Lock, FileText, Calendar, Download, Shield, Award, Zap } from "lucide-react";
import PaymentService, { UserSubscription } from "@/lib/payment-service";

interface SubscriptionFeaturesProps {
  userId: string;
}

export default function SubscriptionFeatures({ userId }: SubscriptionFeaturesProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setSubscription(sub);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeaturesForPlan = (planId: string) => {
    const paymentService = PaymentService.getInstance();
    return paymentService.getSubscriptionFeatures(planId);
  };

  const getUpgradeFeatures = (currentPlanId: string) => {
    const paymentService = PaymentService.getInstance();
    const plans = paymentService.getPlans();
    const currentPlan = plans.find(p => p.id === currentPlanId);
    const nextPlan = plans.find(p => p.id === 'basic');
    
    if (!nextPlan) return [];
    
    // Return features that are in the next plan but not in current plan
    const currentFeatures = currentPlan?.features || [];
    const nextFeatures = nextPlan.features;
    
    return nextFeatures.filter(feature => !currentFeatures.includes(feature));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <X className="w-5 h-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">No Subscription Found</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Please create an account to access features.
        </p>
      </div>
    );
  }

  const currentFeatures = getFeaturesForPlan(subscription.planId);
  const upgradeFeatures = subscription.planId === 'free' ? getUpgradeFeatures('free') : [];
  const isFree = subscription.planId === 'free';
  const isBasic = subscription.planId === 'basic';
  const isPro = subscription.planId === 'pro';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Crown className="w-5 h-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          {subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)} Plan Features
        </h3>
      </div>

      {/* Current Features */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Your Available Features</h4>
        <div className="space-y-2">
          {currentFeatures.map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Assignment Limits */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <FileText className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Assignments</span>
          </div>
          <p className="text-sm text-blue-700">
            {subscription.assignmentLimit === -1 
              ? 'Unlimited assignments' 
              : `${subscription.assignmentLimit} assignments per month`}
          </p>
        </div>

        {/* Calendar Access */}
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">Calendar Access</span>
          </div>
          <p className="text-sm text-green-700">
            {subscription.hasCalendarAccess ? 'Full access available' : 'Not available'}
          </p>
        </div>

        {/* Export Features */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Download className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">Export Options</span>
          </div>
          <p className="text-sm text-purple-700">
            {isFree ? 'Basic export' : isBasic ? 'PDF & DOCX export' : 'Advanced export formats'}
          </p>
        </div>

        {/* Support Level */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-orange-800">Support</span>
          </div>
          <p className="text-sm text-orange-700">
            {isFree ? 'Email support' : isBasic ? 'Priority email/chat' : '24/7 premium support'}
          </p>
        </div>
      </div>

      {/* Upgrade Features (for free users) */}
      {isFree && upgradeFeatures.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Zap className="w-4 h-4 text-yellow-600 mr-2" />
            <h4 className="text-md font-medium text-yellow-800">Upgrade to Basic Plan</h4>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            Get access to these additional features:
          </p>
          <div className="space-y-1">
            {upgradeFeatures.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Lock className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0" />
                <span className="text-sm text-yellow-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Features (for basic users) */}
      {isBasic && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Award className="w-4 h-4 text-purple-600 mr-2" />
            <h4 className="text-md font-medium text-purple-800">Upgrade to Pro Plan</h4>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Unlock advanced features for researchers and power users:
          </p>
          <div className="space-y-1">
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-purple-700">AI-powered charts and graphs</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-purple-700">Advanced export (PDF, DOCX, TXT + more)</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-purple-700">University-level academic standards</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-purple-700">Plagiarism-free guarantee</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-purple-700">24/7 premium support</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-purple-700">Advanced performance analytics</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-purple-700">Highest priority AI processing</span>
            </div>
          </div>
        </div>
      )}

      {/* Plan Status */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Plan</span>
          <span className="text-sm font-medium text-gray-900">
            {subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)} Plan
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">Status</span>
          <span className={`text-sm font-medium ${
            subscription.status === 'free' ? 'text-blue-600' : 
            subscription.status === 'basic' ? 'text-green-600' : 
            subscription.status === 'pro' ? 'text-purple-600' : 'text-red-600'
          }`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
} 