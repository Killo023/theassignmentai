"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { PaymentService } from "@/lib/payment-service";

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalProSubscriptionButtonProps {
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export default function PayPalProSubscriptionButton({
  onSuccess,
  onError,
  onCancel
}: PayPalProSubscriptionButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AaCE9oXQW0CbpRM3y1uqYemvuMQlBHR0NYD_TmirJtGEIjVDFM5VDf4_ibt2fwO1Vug4CrZh3Gvy7zyk&vault=true&intent=subscription";
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
            return actions.subscription.create({
              plan_id: 'P-8VL08082LX8549907NCDSNXA'
            });
          },
          onApprove: async function(data: any, actions: any) {
            try {
              console.log('PayPal Pro subscription approved:', data.subscriptionID);
              
              // Update user subscription in our system
              const paymentService = PaymentService.getInstance();
              const result = await paymentService.handlePayPalProSubscription(
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
            console.error('PayPal Pro subscription error:', err);
            const errorMessage = 'PayPal subscription failed. Please try again.';
            setError(errorMessage);
            onError?.(errorMessage);
          },
          onCancel: function() {
            console.log('PayPal Pro subscription cancelled');
            onCancel?.();
          }
        }).render('#paypal-button-container-P-8VL08082LX8549907NCDSNXA');
        
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      setError('Failed to load PayPal SDK');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
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
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="paypal-button-container-P-8VL08082LX8549907NCDSNXA"></div>
    </div>
  );
} 