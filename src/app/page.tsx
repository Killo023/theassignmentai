"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  Award, 
  Star,
  Sparkles,
  TrendingUp,
  FileText,
  Bot,
  MessageSquare,
  Download,
  Eye,
  X
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/landing/HeroSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import PricingCards from "@/components/landing/PricingCards";
import FAQ from "@/components/landing/FAQ";
import UniversityLogos from "@/components/landing/UniversityLogos";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* University Logos */}
      <UniversityLogos />

      {/* Features Section */}
      <FeatureGrid />

      {/* How It Works */}
      <HowItWorks />

      {/* Product Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See AI Assignment Pro in action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real screenshots of our platform helping students create amazing assignments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Dashboard Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
                  alt="AI Assignment Dashboard Interface"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
                
                {/* Floating UI Elements */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-700">Live Dashboard</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Intuitive Dashboard
                </h3>
                <p className="text-gray-600">
                  Manage all your assignments from one beautiful, organized dashboard with real-time progress tracking.
                </p>
              </div>
            </motion.div>

            {/* AI Generation Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="AI Content Generation Interface"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
                
                {/* Floating UI Elements */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-xs text-gray-600">Generation Progress</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full w-4/5"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">80%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI-Powered Generation
                </h3>
                <p className="text-gray-600">
                  Watch as advanced AI creates high-quality academic content tailored to your specific requirements.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Export Formats Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Export in any format you need
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional formatting for every academic requirement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  format: "PDF",
                  image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                  description: "Perfect for submission with professional formatting"
                },
                {
                  format: "DOCX",
                  image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                  description: "Editable Word documents for further customization"
                },
                {
                  format: "Excel",
                  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                  description: "Data analysis and charts in spreadsheet format"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.format}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={`${item.format} Export Format`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                      <span className="text-sm font-semibold text-gray-700">{item.format}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{item.format} Format</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Start with a free tier, then choose the plan that works for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8"
            >
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600 ml-2 text-sm sm:text-base">forever</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Perfect for trying the platform</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">4 assignments per month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">AI-powered content creation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Basic formatting options</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Email support</span>
                </li>
                <li className="flex items-center">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-500 text-sm sm:text-base">Calendar access</span>
                </li>
                <li className="flex items-center">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-500 text-sm sm:text-base">Export functionality</span>
                </li>
              </ul>

              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-12 sm:h-14 text-base sm:text-lg">
                <Link href="/auth/signup">Start Free</Link>
              </Button>
            </motion.div>

            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl border-2 border-blue-500 p-6 sm:p-8 relative transform scale-105"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Basic Plan</h3>
                <div className="mb-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$14.99</span>
                  <span className="text-blue-100 ml-2 text-sm sm:text-base">per month</span>
                </div>
                <p className="text-blue-100 text-sm sm:text-base">Perfect for serious students</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Unlimited assignments</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Full calendar access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Priority AI processing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">PDF & DOCX export</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Priority email/chat support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Version history</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Collaboration tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Custom templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm sm:text-base">Basic usage analytics</span>
                </li>
              </ul>

              <Button asChild className="w-full bg-white text-blue-600 hover:bg-gray-100 h-12 sm:h-14 text-base sm:text-lg">
                <Link href="/upgrade">Upgrade to Basic</Link>
              </Button>

              <p className="text-sm text-blue-100 mt-4 text-center">
                🔒 30-day money-back guarantee
              </p>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 relative"
            >
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">$29.99</span>
                  <span className="text-gray-600 ml-2 text-sm sm:text-base">per month</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Perfect for researchers & power users</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base font-medium">Everything in Basic Plan, PLUS:</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">AI-powered charts and graphs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Advanced export (PDF, DOCX, TXT + more)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">University-level academic standards</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Plagiarism-free guarantee</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">24/7 premium support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Advanced performance analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Highest priority AI processing</span>
                </li>
              </ul>

              <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 sm:h-14 text-base sm:text-lg">
                <Link href="/upgrade">Upgrade to Pro</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <p className="text-sm text-gray-500 mt-4">No credit card required • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to transform your academic writing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using AI Assignment Pro to improve their grades and save time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/upgrade" className="flex items-center">
                  Start Free Plan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/demo" className="flex items-center">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// SVG Components for animations
const Play = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);
