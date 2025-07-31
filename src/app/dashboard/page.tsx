"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, X } from 'lucide-react';
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check if user was redirected from successful upgrade
    const upgradeSuccess = searchParams.get('upgrade');
    if (upgradeSuccess === 'success') {
      setShowSuccessMessage(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
          <Button asChild>
            <a href="/auth/login">Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Upgrade Successful!</h3>
              <p className="text-sm text-green-700">Your subscription has been upgraded to Basic Plan.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your assignments and subscription from your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Status */}
          <div className="lg:col-span-1">
            <SubscriptionStatus userId={user.id} />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild className="h-16 text-lg">
                  <a href="/dashboard/assignments/new">Create New Assignment</a>
                </Button>
                <Button asChild variant="outline" className="h-16 text-lg">
                  <a href="/dashboard/assignments">View All Assignments</a>
                </Button>
                <Button asChild variant="outline" className="h-16 text-lg">
                  <a href="/dashboard/favorites">Favorites</a>
                </Button>
                <Button asChild variant="outline" className="h-16 text-lg">
                  <a href="/dashboard/history">History</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 