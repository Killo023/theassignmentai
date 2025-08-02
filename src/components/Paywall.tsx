"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Crown, 
  Lock, 
  CheckCircle, 
  Star, 
  Zap, 
  Shield,
  CreditCard,
  ArrowRight,
  X,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PayPalSubscriptionButton from "@/components/paypal/PayPalSubscriptionButton";
import PayPalProSubscriptionButton from "@/components/paypal/PayPalProSubscriptionButton";

interface PaywallProps {
  onUpgrade: (paymentData: any) => Promise<boolean>;
  onClose?: () => void;
  isVisible: boolean;
}

const Paywall: React.FC<PaywallProps> = ({ onUpgrade, onClose, isVisible }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
  const [paypalError, setPaypalError] = useState<string | null>(null);

  const basicFeatures = [
    "Unlimited assignments",
    "Full calendar access",
    "Priority AI processing",
    "PDF & DOCX export",
    "Priority email/chat support",
    "Version history",
    "Collaboration tools",
    "Custom templates",
    "Basic usage analytics"
  ];

  const proFeatures = [
    "Everything in Basic Plan, PLUS:",
    "AI-powered charts and graphs",
    "Advanced export (PDF, DOCX, TXT + more)",
    "University-level academic standards",
    "Plagiarism-free guarantee",
    "24/7 premium support",
    "Advanced performance analytics",
    "Highest priority AI processing",
    "Custom branding options",
    "API access",
    "White-label solutions"
  ];

  const features = selectedPlan === 'basic' ? basicFeatures : proFeatures;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentData.cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (paymentData.cardNumber.length < 13) {
      newErrors.cardNumber = "Invalid card number";
    }
    
    if (!paymentData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = "Use MM/YY format";
    }
    
    if (!paymentData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = "Invalid CVV";
    }
    
    if (!paymentData.nameOnCard) {
      newErrors.nameOnCard = "Name on card is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    try {
      const success = await onUpgrade(paymentData);
      if (success) {
        // Payment successful - component will be unmounted by parent
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = async (subscriptionId: string) => {
    console.log('PayPal subscription successful:', subscriptionId);
    setIsProcessing(true);
    try {
      // The PayPal subscription is already handled in the PayPalSubscriptionButton component
      // We just need to notify the parent that the upgrade was successful
      const success = true; // PayPal subscription was successful
      if (success) {
        // Payment successful - component will be unmounted by parent
        // The subscription is already updated in the database
      }
    } catch (error) {
      console.error('PayPal payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (error: string) => {
    console.error('PayPal error:', error);
    setPaypalError(error);
  };

  const handlePayPalCancel = () => {
    console.log('PayPal payment cancelled');
    setPaypalError(null);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Upgrade to {selectedPlan === 'basic' ? 'Basic' : 'Pro'}
              </h2>
              <p className="text-muted-foreground">
                Upgrade to continue with unlimited access and advanced features.
              </p>
            </div>
          </div>
          
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Basic Plan Benefits
              </h3>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">30-Day Money-Back Guarantee</span>
                </div>
                <p className="text-sm text-blue-700">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => setSelectedPlan('basic')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedPlan === 'basic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Basic - $14.99
                  </button>
                  <button
                    onClick={() => setSelectedPlan('pro')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedPlan === 'pro'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Pro - $29.99
                  </button>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  ${selectedPlan === 'basic' ? '14.99' : '29.99'}
                </div>
                <div className="text-muted-foreground">per month</div>
                <div className="text-sm text-muted-foreground mt-1">Cancel anytime</div>
              </div>

              {/* Payment Method Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H5.777c-.681 0-1.352-.163-1.844-.478C3.441 11.316 3.089 10.806 3.089 10.153c0-.653.352-1.163.844-1.478.492-.315 1.163-.478 1.844-.478h12.446c.681 0 1.352.163 1.844.478z"/>
                  </svg>
                  PayPal
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="plan" value={selectedPlan} />
                <div>
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    value={paymentData.nameOnCard}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, nameOnCard: e.target.value }))}
                    placeholder="John Doe"
                    className={errors.nameOnCard ? "border-red-500" : ""}
                  />
                  {errors.nameOnCard && (
                    <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData(prev => ({ 
                      ...prev, 
                      cardNumber: formatCardNumber(e.target.value) 
                    }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData(prev => ({ 
                        ...prev, 
                        expiryDate: formatExpiryDate(e.target.value) 
                      }))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData(prev => ({ 
                        ...prev, 
                        cvv: e.target.value.replace(/\D/g, '') 
                      }))}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cvv ? "border-red-500" : ""}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-12 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Upgrade to Basic - $14.99/month
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By upgrading, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
                              ) : (
                  <div className="space-y-4">
                    {paypalError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{paypalError}</p>
                      </div>
                    )}
                    
                    {selectedPlan === 'basic' ? (
                      <PayPalSubscriptionButton
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                        onCancel={handlePayPalCancel}
                      />
                    ) : (
                      <PayPalProSubscriptionButton
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                        onCancel={handlePayPalCancel}
                      />
                    )}
                    
                    <p className="text-xs text-muted-foreground text-center">
                      By upgrading, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Paywall; 