"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Paywall from "@/components/Paywall";
import PaymentService from "@/lib/payment-service";

export default function TestUpgradePage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (paymentData: any) => {
    try {
      setIsLoading(true);
      setResult("Processing payment...");
      
      console.log("Payment data received:", paymentData);
      
      const paymentService = PaymentService.getInstance();
      const result = await paymentService.convertTrialToPaid("test-user", paymentData);
      
      console.log("Payment result:", result);
      setResult(JSON.stringify(result, null, 2));
      
      if (result.success) {
        setShowPaywall(false);
        alert("✅ Upgrade successful! You are now a Pro user.");
        return true;
      } else {
        alert('❌ Payment failed: ' + result.message);
        return false;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      setResult(`Error: ${error}`);
      alert('❌ Upgrade failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Test Upgrade to Pro</h1>
      
      <div className="space-y-4">
        <Button 
          onClick={() => setShowPaywall(true)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Test Upgrade to Pro"}
        </Button>
        
        {result && (
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Result:</h3>
            <pre className="text-sm">{result}</pre>
          </div>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2 text-blue-900">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Click "Test Upgrade to Pro" to open the paywall</li>
          <li>Fill in the credit card form with test data:
            <ul className="list-disc list-inside ml-4 mt-1 text-blue-700">
              <li>Name: John Doe</li>
              <li>Card: 4242 4242 4242 4242</li>
              <li>Expiry: 12/25</li>
              <li>CVV: 123</li>
            </ul>
          </li>
          <li>Click "Upgrade to Pro" to process the payment</li>
          <li>Check the result below and browser console for details</li>
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