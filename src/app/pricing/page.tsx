"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  FileText,
  BarChart3,
  Globe,
  Clock,
  Award,
  Sparkles
} from "lucide-react";
import PayPalSubscriptionButton from "@/components/paypal/PayPalSubscriptionButton";
import PayPalProSubscriptionButton from "@/components/paypal/PayPalProSubscriptionButton";

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleBasicSuccess = (subscriptionId: string) => {
    setStatus('success');
    setMessage(`Basic plan subscription successful! Subscription ID: ${subscriptionId}`);
    setTimeout(() => {
      router.push('/dashboard?upgrade=success');
    }, 2000);
  };

  const handleProSuccess = (subscriptionId: string) => {
    setStatus('success');
    setMessage(`Pro plan subscription successful! Subscription ID: ${subscriptionId}`);
    setTimeout(() => {
      router.push('/dashboard?upgrade=success');
    }, 2000);
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(`Subscription failed: ${error}`);
  };

  const handleCancel = () => {
    setStatus('idle');
    setMessage('Subscription was cancelled');
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 14.99,
      description: 'Perfect for students and individual users',
      features: [
        'Unlimited assignments',
        'Full calendar access',
        'Priority AI processing',
        'PDF & DOCX export',
        'Priority email/chat support',
        'Version history',
        'Collaboration tools',
        'Custom templates',
        'Basic usage analytics'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 29.99,
      description: 'Advanced features for power users and professionals',
      features: [
        'Everything in Basic Plan, PLUS:',
        'AI-powered charts and graphs',
        'Advanced export (PDF, DOCX, TXT + more)',
        'University-level academic standards',
        'Plagiarism-free guarantee',
        '24/7 premium support',
        'Advanced performance analytics',
        'Highest priority AI processing',
        'Custom branding options',
        'API access',
        'White-label solutions'
      ],
      popular: true
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to view pricing and subscribe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with our Basic plan or unlock advanced features with Pro. 
              Both plans include unlimited assignments and priority support.
            </p>
          </motion.div>
        </div>

        {/* Status Display */}
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-md mx-auto mb-8 p-4 rounded-lg border ${
              status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Shield className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                status === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {status === 'success' ? 'Success' : 'Error'}
              </span>
            </div>
            <p className={`mt-2 text-sm ${
              status === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {message}
            </p>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-white rounded-2xl shadow-xl border-2 p-8 ${
                plan.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500">Cancel anytime</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + featureIndex * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                {selectedPlan === plan.id ? (
                  <div className="space-y-4">
                    {plan.id === 'basic' ? (
                      <PayPalSubscriptionButton
                        onSuccess={handleBasicSuccess}
                        onError={handleError}
                        onCancel={handleCancel}
                      />
                    ) : (
                      <PayPalProSubscriptionButton
                        onSuccess={handleProSuccess}
                        onError={handleError}
                        onCancel={handleCancel}
                      />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedPlan(plan.id as 'basic' | 'pro')}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Select {plan.name}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose The Assignment AI?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                <p className="text-gray-600 text-sm">Generate assignments in minutes, not hours</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">100% Secure</h4>
                <p className="text-gray-600 text-sm">Bank-level security for your data</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">50,000+ Users</h4>
                <p className="text-gray-600 text-sm">Trusted by students worldwide</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">30-Day Money-Back Guarantee</span>
              </div>
              <p className="text-blue-700 text-sm">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 