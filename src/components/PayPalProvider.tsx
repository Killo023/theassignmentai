"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

interface PayPalProviderProps {
  children: ReactNode;
}

const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  
  // If no PayPal client ID is configured, render children without PayPal provider
  if (!clientId || clientId === 'your_paypal_client_id_here') {
    console.warn('PayPal client ID not configured. PayPal features will be disabled.');
    return <>{children}</>;
  }

  const paypalOptions = {
    clientId,
    currency: "USD",
    intent: "subscription" as const,
    components: ["buttons"],
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider; 