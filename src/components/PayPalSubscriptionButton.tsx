"use client";

import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import PayPalService from "@/lib/paypal";

interface PayPalSubscriptionButtonProps {
  planId: string;
  amount: number;
  currency: string;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  disabled?: boolean;
  className?: string;
}

const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  planId,
  amount,
  currency,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const createSubscription = async (data: any, actions: any) => {
    try {
      setIsLoading(true);
      
      const paypalService = PayPalService.getInstance();
      const subscription = await paypalService.createSubscription(planId, {
        name: data.payer.name.given_name + " " + data.payer.name.surname,
        email: data.payer.email_address,
      });

      return subscription.id;
    } catch (error) {
      console.error('PayPal subscription creation error:', error);
      onError('Failed to create subscription. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      setIsLoading(true);
      
      // The subscription is automatically approved by PayPal
      onSuccess(data.subscriptionID);
    } catch (error) {
      console.error('PayPal subscription approval error:', error);
      onError('Subscription approval failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('PayPal error:', err);
    onError('Payment failed. Please try again.');
  };

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  
  if (!clientId || clientId === 'your_paypal_client_id_here') {
    return (
      <div className={`w-full ${className}`}>
        <Button 
          disabled 
          className="w-full"
          variant="outline"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          PayPal not configured
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Use the credit card option above for demo payments
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Processing subscription...
        </div>
      )}
      
      <PayPalButtons
        createSubscription={createSubscription}
        onApprove={onApprove}
        onError={handlePayPalError}
        onCancel={onCancel}
        disabled={disabled || isLoading}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "subscribe",
        }}
      />
    </div>
  );
};

export default PayPalSubscriptionButton; 