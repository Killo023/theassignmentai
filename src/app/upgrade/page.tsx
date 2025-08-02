"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Paywall from '@/components/Paywall';
import PaymentService from '@/lib/payment-service';
import { Loader2 } from 'lucide-react';

export default function UpgradePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showPaywall, setShowPaywall] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to signup if not authenticated
        router.push('/auth/signup');
      } else {
        // Show paywall for authenticated users
        setShowPaywall(true);
      }
    }
  }, [user, isLoading, router]);

  const handleUpgrade = async (paymentData: any) => {
    if (!user) return false;
    
    setIsProcessing(true);
    try {
      console.log('🚀 Starting upgrade process...');
      console.log('👤 User ID:', user.id);
      console.log('💳 Payment data:', { ...paymentData, cardNumber: '***' });
      
      const paymentService = PaymentService.getInstance();
      // Determine plan based on payment data or default to basic
      const plan = paymentData.plan || 'basic';
      const result = await paymentService.convertToPaid(user.id, plan, paymentData);
      
      console.log('📊 Payment result:', result);
      
      if (result.success) {
        console.log('✅ Payment successful!');
        // Redirect to dashboard after successful upgrade
        router.push('/dashboard?upgrade=success');
        return true;
      } else {
        console.error('❌ Payment failed:', result.message);
        alert('Payment failed: ' + result.message);
        return false;
      }
    } catch (error) {
      console.error('💥 Upgrade error:', error);
      alert('Upgrade failed. Please try again. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signup
  }

  return (
    <div className="min-h-screen bg-background">
      <Paywall
        isVisible={showPaywall}
        onUpgrade={handleUpgrade}
        onClose={handleClose}
      />
    </div>
  );
} 