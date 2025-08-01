"use client";

import { motion } from "framer-motion";
import { CheckCircle, Crown, Star, Zap, Shield, Globe, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free Plan",
    price: "$0",
    period: "Forever",
    description: "Perfect for trying out The Assignment AI",
    features: [
      "4 assignments per month",
      "AI-powered assignment generation",
      "Basic formatting options",
      "Email support",
      "Access to core features",
      "Standard AI processing",
      "Basic export options (TXT)",
      "Community support"
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-gray-500 to-gray-600",
    link: "/auth/signup"
  },
  {
    name: "Basic Plan",
    originalPrice: "$19.99",
    price: "$14.99",
    period: "per month",
    description: "Perfect for serious students",
    features: [
      "Unlimited assignments",
      "Professional tables and charts",
      "Priority AI processing",
      "PDF & DOCX export",
      "Priority email/chat support",
      "Version history",
      "Advanced formatting options",
      "Custom templates",
      "Basic usage analytics",
      "Academic citation styles"
    ],
    cta: "Upgrade to Basic",
    popular: true,
    gradient: "from-blue-500 to-purple-600",
    link: "/upgrade"
  },
  {
    name: "Pro Plan",
    originalPrice: "$39.99",
    price: "$29.99",
    period: "per month",
    description: "Perfect for researchers & power users",
    features: [
      "Everything in Basic Plan, PLUS:",
      "Advanced visual data generation",
      "Multiple export formats (PDF, DOCX, TXT, XLSX)",
      "University-level academic standards",
      "Plagiarism-free guarantee",
      "24/7 premium support",
      "Advanced performance analytics",
      "Highest priority AI processing",
      "Advanced collaboration features",
      "Custom branding options"
    ],
    cta: "Upgrade to Pro",
    popular: false,
    gradient: "from-purple-500 to-pink-600",
    link: "/upgrade"
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            🚀 Complete Your Assignments 10x Faster With The Assignment AI
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Choose the perfect plan for you and say goodbye to long, frustrating hours of homework or research papers. With The Assignment AI, you'll get complete assignments with visual data, proper citations, and professional formatting in minutes!
          </motion.p>
          
          {/* Discount Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 px-6 rounded-full inline-block mb-8"
          >
            💰 Limited Time: Save 25% on Basic Plan! Use coupon code STUDENT25
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                plan.popular 
                  ? 'border-purple-200 scale-105 shadow-purple-100' 
                  : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <span className="text-gray-500 line-through text-lg mr-2">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  asChild
                  className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105`}
                >
                  <Link href={plan.link}>
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Enterprise Plan</h3>
            <p className="text-indigo-100 mb-6">Custom solutions for educational institutions and large teams</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-3">Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Bulk user management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Dedicated account manager
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Benefits:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    White-label solutions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Custom training
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    SLA guarantees
                  </li>
                </ul>
              </div>
            </div>
            <Button 
              asChild
              className="mt-6 bg-white text-indigo-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-xl"
            >
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">No credit card required • Cancel anytime • 30-day money-back guarantee</p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>30-Day Money Back</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 