"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Paywall from "@/components/Paywall";
import PaymentService from "@/lib/payment-service";

export default function DebugUpgradePage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userId] = useState("debug-user-" + Date.now());

  const handleUpgrade = async (paymentData: any) => {
    try {
      setDebugInfo("Starting upgrade process...");
      console.log("Payment data received:", paymentData);
      
      // Check environment variables
      const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      const paypalSecret = process.env.PAYPAL_SECRET;
      
      setDebugInfo(prev => prev + "\n\nEnvironment check:");
      setDebugInfo(prev => prev + `\nPayPal Client ID: ${paypalClientId ? 'Set' : 'Not set'}`);
      setDebugInfo(prev => prev + `\nPayPal Secret: ${paypalSecret ? 'Set' : 'Not set'}`);
      
      const paymentService = PaymentService.getInstance();
      setDebugInfo(prev => prev + "\n\nPayment service initialized");
      
      // Check status before upgrade
      const statusBefore = await paymentService.checkSubscriptionStatus(userId);
      setDebugInfo(prev => prev + `\n\nStatus BEFORE upgrade: ${JSON.stringify(statusBefore, null, 2)}`);
      
      const result = await paymentService.convertTrialToPaid(userId, paymentData);
      
      setDebugInfo(prev => prev + "\n\nPayment result:");
      setDebugInfo(prev => prev + `\nSuccess: ${result.success}`);
      setDebugInfo(prev => prev + `\nMessage: ${result.message}`);
      
      console.log("Payment result:", result);
      
      if (result.success) {
        // Check status after upgrade
        const statusAfter = await paymentService.checkSubscriptionStatus(userId);
        setDebugInfo(prev => prev + `\n\nStatus AFTER upgrade: ${JSON.stringify(statusAfter, null, 2)}`);
        
        setShowPaywall(false);
        setDebugInfo(prev => prev + "\n\n✅ Upgrade successful!");
        return true;
      } else {
        setError(result.message);
        setDebugInfo(prev => prev + `\n\n❌ Upgrade failed: ${result.message}`);
        return false;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      setError(`Error: ${error}`);
      setDebugInfo(prev => prev + `\n\n❌ Exception: ${error}`);
      return false;
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Debug Upgrade Process</h1>
      
      <div className="space-y-4">
        <Button onClick={() => setShowPaywall(true)}>
          Test Upgrade to Pro
        </Button>
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded">
            <h3 className="font-bold text-red-800 mb-2">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {debugInfo && (
          <div className="p-4 bg-blue-100 border border-blue-300 rounded">
            <h3 className="font-bold text-blue-800 mb-2">Debug Info:</h3>
            <pre className="text-sm text-blue-700 whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}
      </div>

      <Paywall
        isVisible={showPaywall}
        onUpgrade={handleUpgrade}
        onClose={() => setShowPaywall(false)}
      />
    </div>
  );
} 