"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Crown, Clock, CheckCircle, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const MobileNav: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useAuth();
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
          const usage = await paymentService.getAssignmentUsage(user.id);
          
          setSubscriptionStatus({
            isTrialActive: subscription?.status === 'free',
            trialDaysRemaining: usage.remaining,
            status: subscription?.status || 'free'
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

    // Check if user is upgraded but still in free plan
    if (subscriptionStatus?.status === 'basic' || subscriptionStatus?.status === 'pro') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle className="w-3 h-3" />
          {subscriptionStatus.status === 'basic' ? 'Basic' : 'Pro'}
        </div>
      );
    }

    if (subscriptionStatus?.status === 'free' && subscriptionStatus?.trialDaysRemaining > 0) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
          <Clock className="w-3 h-3" />
          Free ({subscriptionStatus.trialDaysRemaining} assignments left)
        </div>
      );
    }

    return null;
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-background border-l border-border flex flex-col p-6"
          >
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <ul className="flex flex-col gap-6 mt-8 text-lg">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)} className="block w-full py-2">
                    {link.label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="block w-full py-2">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
            
            {user ? (
              <div className="mt-8 space-y-4">
                {/* User Info */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>
                
                {/* User Actions */}
                <div className="space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  {subscriptionStatus?.status === 'free' && (
                    <Button variant="outline" asChild className="w-full justify-start">
                      <Link href="/upgrade" onClick={() => setOpen(false)}>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Basic
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login" onClick={() => setOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-purple-600">
                  <Link href="/upgrade" onClick={() => setOpen(false)} className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Start Free Plan
                  </Link>
                </Button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav; 