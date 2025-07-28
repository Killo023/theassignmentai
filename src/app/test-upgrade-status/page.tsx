"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Paywall from "@/components/Paywall";
import PaymentService from "@/lib/payment-service";

export default function TestUpgradeStatusPage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [userId] = useState("test-user-" + Date.now());

  const loadSubscriptionStatus = async () => {
    try {
      const paymentService = PaymentService.getInstance();
      const status = await paymentService.checkSubscriptionStatus(userId);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  };

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const handleUpgrade = async (paymentData: any) => {
    try {
      console.log("Processing upgrade for user:", userId);
      
      const paymentService = PaymentService.getInstance();
      const result = await paymentService.convertTrialToPaid(userId, paymentData);
      
      console.log("Upgrade result:", result);
      
      if (result.success) {
        setShowPaywall(false);
        // Refresh subscription status
        await loadSubscriptionStatus();
        alert("✅ Upgrade successful! Check the status below.");
        return true;
      } else {
        alert('❌ Payment failed: ' + result.message);
        return false;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('❌ Upgrade failed. Please try again.');
      return false;
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Test Upgrade Status Update</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold text-blue-900 mb-2">Current Status:</h3>
          <pre className="text-sm text-blue-800 bg-white p-2 rounded">
            {JSON.stringify(subscriptionStatus, null, 2)}
          </pre>
        </div>

        <Button 
          onClick={() => setShowPaywall(true)}
          className="bg-gradient-to-r from-primary to-purple-600"
        >
          Test Upgrade to Pro
        </Button>

        <Button 
          onClick={loadSubscriptionStatus}
          variant="outline"
        >
          Refresh Status
        </Button>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold text-yellow-900 mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
          <li>Check the current status above (should show trial)</li>
          <li>Click "Test Upgrade to Pro" and complete the payment</li>
          <li>After upgrade, click "Refresh Status"</li>
          <li>Verify the status shows "active" instead of "trial"</li>
        </ol>
      </div>

      <Paywall
        isVisible={showPaywall}
        onUpgrade={handleUpgrade}
        onClose={() => setShowPaywall(false)}
      />
    </div>
  );
} 