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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          <GraduationCap className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-xl">AcademiaAI Pro</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          {user && <NavLink href="/dashboard">Dashboard</NavLink>}
        </nav>
        
        <div className="ml-auto flex items-center space-x-4">
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
                    plan: subscriptionStatus?.status === 'active' ? "Pro" : "Trial"
                  }
                }} 
              />
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-purple-600">
                <Link href="/auth/signup" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Start Free Trial
                </Link>
              </Button>
            </>
          )}
          
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default MainNav; 