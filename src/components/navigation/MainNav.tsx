"use client";

import Link from "next/link";
import { GraduationCap, Crown, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import UserDropdown from "@/components/UserDropdown";
import NavLink from "@/components/NavLink";
import MobileNav from "@/components/navigation/MobileNav";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";

const MainNav: React.FC = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isTrialActive: boolean;
    trialDaysRemaining: number;
    status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const paymentService = PaymentService.getInstance();
          const subscription = await paymentService.checkSubscriptionStatus(user.id);
          const trialDaysRemaining = await paymentService.getTrialDaysRemaining(user.id);
          
          setSubscriptionStatus({
            isTrialActive: subscription?.isTrialActive || false,
            trialDaysRemaining: trialDaysRemaining || 0,
            status: subscription?.status || 'trial'
          });
        } catch (error) {
          console.error('Error loading subscription status:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadSubscriptionStatus();

    // Listen for subscription changes
    const paymentService = PaymentService.getInstance();
    paymentService.addSubscriptionChangeListener(loadSubscriptionStatus);

    // Refresh subscription status every 10 seconds as backup
    const interval = setInterval(loadSubscriptionStatus, 10000);
    
    return () => {
      clearInterval(interval);
      paymentService.removeSubscriptionChangeListener(loadSubscriptionStatus);
    };
  }, [user]);

  const getStatusBadge = () => {
    if (!user || isLoading) return null;

    // Check if user is upgraded but trial is still active
    if (subscriptionStatus?.status === 'active' && subscriptionStatus?.isTrialActive && subscriptionStatus.trialDaysRemaining > 0) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Pro ({subscriptionStatus.trialDaysRemaining}d trial left)
        </div>
      );
    }

    if (subscriptionStatus?.isTrialActive && subscriptionStatus.trialDaysRemaining > 0) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
          <Clock className="w-3 h-3" />
          Trial ({subscriptionStatus.trialDaysRemaining}d left)
        </div>
      );
    }

    if (subscriptionStatus?.status === 'active') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Pro
        </div>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gray-900">AcademiaAI Pro</span>
                <p className="text-xs text-gray-500 -mt-1">AI-Powered Academic Assistant</p>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink href="/" className="nav-link">Home</NavLink>
            <NavLink href="/features" className="nav-link">Features</NavLink>
            <NavLink href="/pricing" className="nav-link">Pricing</NavLink>
            {user && <NavLink href="/dashboard" className="nav-link">Dashboard</NavLink>}
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-3">
                {getStatusBadge()}
                <UserDropdown 
                  user={{
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    subscription: {
                      status: subscriptionStatus?.status as "active" | "trial" | "expired" || "trial",
                      plan: subscriptionStatus?.status === 'active' ? "Basic" : "Free"
                    }
                  }} 
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild className="nav-link">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="btn-primary">
                  <Link href="/auth/signup" className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Start Free
                  </Link>
                </Button>
              </div>
            )}
            
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav; 