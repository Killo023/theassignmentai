"use client";

import Link from "next/link";
import Image from "next/image";
import { Crown, Clock, CheckCircle } from "lucide-react";
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
    status: string;
    plan: string;
    assignmentsUsed: number;
    assignmentLimit: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const paymentService = PaymentService.getInstance();
          const subscription = await paymentService.checkSubscriptionStatus(user.id);
          const usage = await paymentService.getAssignmentUsage(user.id);
          
          setSubscriptionStatus({
            status: subscription?.status || 'free',
            plan: subscription?.planId || 'free',
            assignmentsUsed: usage.used,
            assignmentLimit: usage.limit
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

    // Refresh subscription status every 10 seconds as backup
    const interval = setInterval(loadSubscriptionStatus, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const getStatusBadge = () => {
    if (!user || isLoading) return null;

    if (subscriptionStatus?.status === 'active' && subscriptionStatus?.plan === 'pro') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
          <CheckCircle className="w-3 h-3" />
          Pro
        </div>
      );
    }

    if (subscriptionStatus?.status === 'active' && subscriptionStatus?.plan === 'basic') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Basic
        </div>
      );
    }

    if (subscriptionStatus?.status === 'free') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium border border-gray-200">
          <Clock className="w-3 h-3" />
          Free ({subscriptionStatus.assignmentLimit - subscriptionStatus.assignmentsUsed} left)
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 overflow-hidden">
                <Image 
                  src="/logo.svg" 
                  alt="The Assignment AI Logo" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gray-900">The Assignment AI</span>
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