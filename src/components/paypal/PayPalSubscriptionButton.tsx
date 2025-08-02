"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { PaymentService } from "@/lib/payment-service";

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalSubscriptionButtonProps {
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export default function PayPalSubscriptionButton({
  onSuccess,
  onError,
  onCancel
}: PayPalSubscriptionButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if PayPal is configured
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!paypalClientId || paypalClientId === 'your_paypal_client_id_here') {
      setError('PayPal is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment variables.');
      setIsLoading(false);
      return;
    }

    // Load PayPal SDK
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&vault=true&intent=subscription`;
    script.setAttribute("data-sdk-integration-source", "button-factory");
    
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            // Use environment variable for plan ID or fallback to a test plan
            const planId = process.env.NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID || 'P-9YA223448D5519637NCHHMTY';
            console.log('Creating PayPal subscription with plan ID:', planId);
            return actions.subscription.create({
              plan_id: planId
            });
          },
          onApprove: async function(data: any, actions: any) {
            try {
              console.log('PayPal subscription approved:', data.subscriptionID);
              
              // Update user subscription in our system
              const paymentService = PaymentService.getInstance();
              const result = await paymentService.handlePayPalSubscription(
                user?.id || 'unknown',
                data.subscriptionID
              );

              if (result.success) {
                onSuccess?.(data.subscriptionID);
              } else {
                setError(result.message);
                onError?.(result.message);
              }
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Subscription processing failed';
              setError(errorMessage);
              onError?.(errorMessage);
            }
          },
          onError: function(err: any) {
            console.error('PayPal subscription error:', err);
            const errorMessage = 'PayPal subscription failed. Please try again.';
            setError(errorMessage);
            onError?.(errorMessage);
          },
          onCancel: function() {
            console.log('PayPal subscription cancelled');
            onCancel?.();
          }
        }).render('#paypal-button-container-basic');
        
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setError('Failed to load PayPal SDK');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user, onSuccess, onError, onCancel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
        <p className="text-red-500 text-xs mt-2">
          To fix this, add your PayPal Client ID to your .env.local file:
          <br />
          <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_client_id</code>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="paypal-button-container-basic"></div>
    </div>
  );
} 