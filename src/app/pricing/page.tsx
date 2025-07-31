import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      period: "forever",
      description: "Perfect for trying the platform",
      features: [
        "4 assignments per month",
        "AI-powered content creation", 
        "Basic formatting options",
        "Email support",
        "No calendar access",
        "No export functionality"
      ],
      cta: "Start Free",
      href: "/auth/signup",
      popular: false
    },
    {
      name: "Basic Plan",
      price: "$14.99",
      period: "per month",
      description: "Perfect for serious students",
      features: [
        "Unlimited assignments",
        "Full calendar access",
        "Priority AI processing",
        "PDF & DOCX export",
        "Priority email/chat support",
        "Version history",
        "Collaboration tools",
        "Custom templates",
        "Basic usage analytics"
      ],
      cta: "Upgrade to Basic",
      href: "/upgrade",
      popular: true
    },
    {
      name: "Pro Plan",
      price: "$29.99",
      period: "per month", 
      description: "Perfect for researchers & power users",
      features: [
        "Everything in Basic Plan, PLUS:",
        "AI-powered charts and graphs",
        "Advanced export (PDF, DOCX, TXT + more)",
        "University-level academic standards",
        "Plagiarism-free guarantee",
        "24/7 premium support",
        "Advanced performance analytics",
        "Highest priority AI processing"
      ],
      cta: "Upgrade to Pro",
      href: "/upgrade",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              The Assignment AI
            </Link>
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-blue-600"> Pricing</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that works best for you. Start with a free tier and upgrade when you're ready.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow ${
              plan.popular ? 'ring-2 ring-blue-500' : ''
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2 text-sm sm:text-base">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{plan.description}</p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={plan.href} className="block">
                <Button 
                  className={`w-full h-12 sm:h-14 text-base sm:text-lg ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : plan.name === 'Enterprise'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens when I reach my free tier limit?
              </h3>
              <p className="text-gray-600">
                When you reach your 2-assignment limit on the free tier, you can upgrade to the Basic plan for unlimited assignments and additional features.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use industry-standard encryption and security measures to protect your data and assignments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have transformed their academic writing experience.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Free Tier
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 