"use client";

import { useState, useEffect } from "react";
import { Lock, Crown, CheckCircle, AlertTriangle } from "lucide-react";
import PaymentService, { UserSubscription } from "@/lib/payment-service";

interface FeatureRestrictionProps {
  userId: string;
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function FeatureRestriction({ userId, feature, children, fallback }: FeatureRestrictionProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [userId]);

  const loadSubscriptionStatus = async () => {
    try {
      const paymentService = PaymentService.getInstance();
      const sub = await paymentService.checkSubscriptionStatus(userId);
      setSubscription(sub);
      
      // Check if user has access to the specific feature
      const hasFeatureAccess = checkFeatureAccess(sub, feature);
      setHasAccess(hasFeatureAccess);
    } catch (error) {
      console.error('Error loading subscription status:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFeatureAccess = (sub: UserSubscription | null, featureName: string): boolean => {
    if (!sub) return false;

    switch (featureName) {
      case 'calendar':
        return sub.hasCalendarAccess;
      case 'unlimited_assignments':
        return sub.assignmentLimit === -1;
      case 'advanced_export':
        return sub.planId === 'basic' || sub.planId === 'pro';
      case 'pro_features':
        return sub.planId === 'pro';
      case 'basic_features':
        return sub.planId === 'basic' || sub.planId === 'pro';
      default:
        return false;
    }
  };

  const getUpgradeMessage = (featureName: string): string => {
    switch (featureName) {
      case 'calendar':
        return 'Upgrade to Basic Plan for calendar access';
      case 'unlimited_assignments':
        return 'Upgrade to Basic Plan for unlimited assignments';
      case 'advanced_export':
        return 'Upgrade to Basic Plan for advanced export options';
      case 'pro_features':
        return 'Upgrade to Pro Plan for advanced features';
      case 'basic_features':
        return 'Upgrade to Basic Plan for additional features';
      default:
        return 'Upgrade your plan to access this feature';
    }
  };

  if (isLoading) {
    return (
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center rounded-lg">
        <div className="text-center p-4">
          <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            {getUpgradeMessage(feature)}
          </p>
          <button
            onClick={() => window.location.href = '/upgrade'}
            className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
          >
            <Crown className="w-3 h-3 mr-1" />
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}

// Feature indicator component
export function FeatureIndicator({ userId, feature }: { userId: string; feature: string }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [userId]);

  const loadSubscriptionStatus = async () => {
    try {
      const paymentService = PaymentService.getInstance();
      const sub = await paymentService.checkSubscriptionStatus(userId);
      setSubscription(sub);
      
      // Check if user has access to the specific feature
      const hasFeatureAccess = checkFeatureAccess(sub, feature);
      setHasAccess(hasFeatureAccess);
    } catch (error) {
      console.error('Error loading subscription status:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFeatureAccess = (sub: UserSubscription | null, featureName: string): boolean => {
    if (!sub) return false;

    switch (featureName) {
      case 'calendar':
        return sub.hasCalendarAccess;
      case 'unlimited_assignments':
        return sub.assignmentLimit === -1;
      case 'advanced_export':
        return sub.planId === 'basic' || sub.planId === 'pro';
      case 'pro_features':
        return sub.planId === 'pro';
      case 'basic_features':
        return sub.planId === 'basic' || sub.planId === 'pro';
      default:
        return false;
    }
  };

  if (isLoading) {
    return <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-1">
      {hasAccess ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Lock className="w-4 h-4 text-gray-400" />
      )}
    </div>
  );
}

// Feature status component
export function FeatureStatus({ userId, feature }: { userId: string; feature: string }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [userId]);

  const loadSubscriptionStatus = async () => {
    try {
      const paymentService = PaymentService.getInstance();
      const sub = await paymentService.checkSubscriptionStatus(userId);
      setSubscription(sub);
      
      // Check if user has access to the specific feature
      const hasFeatureAccess = checkFeatureAccess(sub, feature);
      setHasAccess(hasFeatureAccess);
    } catch (error) {
      console.error('Error loading subscription status:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFeatureAccess = (sub: UserSubscription | null, featureName: string): boolean => {
    if (!sub) return false;

    switch (featureName) {
      case 'calendar':
        return sub.hasCalendarAccess;
      case 'unlimited_assignments':
        return sub.assignmentLimit === -1;
      case 'advanced_export':
        return sub.planId === 'basic' || sub.planId === 'pro';
      case 'pro_features':
        return sub.planId === 'pro';
      case 'basic_features':
        return sub.planId === 'basic' || sub.planId === 'pro';
      default:
        return false;
    }
  };

  if (isLoading) {
    return <span className="text-gray-400 text-sm">Loading...</span>;
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${
      hasAccess 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-600'
    }`}>
      {hasAccess ? 'Available' : 'Upgrade Required'}
    </span>
  );
} 