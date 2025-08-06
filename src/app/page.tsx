"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award,
  BookOpen,
  FileText,
  Brain,
  Zap,
  Shield,
  Globe,
  Sparkles,
  X,
  Table,
  BarChart3,
  GraduationCap,
  Clock,
  Play,
  BookMarked,
  TrendingUp,
  Target,
  Lightbulb,
  Rocket,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";

const comparisonData = [
  {
    feature: "Assignment approach",
    traditional: "Manual research",
    assignmentAI: "AI-powered generation"
  },
  {
    feature: "Time to complete",
    traditional: "Hours/Days",
    assignmentAI: "Minutes"
  },
  {
    feature: "Content quality",
    traditional: "Variable",
    assignmentAI: "University-grade"
  },
  {
    feature: "Citation accuracy",
    traditional: "Manual formatting",
    assignmentAI: "95% accurate"
  },
  {
    feature: "Research depth",
    traditional: "Limited sources",
    assignmentAI: "Comprehensive"
  },
  {
    feature: "Academic standards",
    traditional: "Inconsistent",
    assignmentAI: "APA/MLA/Chicago"
  }
];

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Generation",
    description: "Advanced AI trained on academic standards for university-level assignments",
    highlight: "95% accuracy rate"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Precision Writing",
    description: "Tailored content that meets specific academic requirements and guidelines",
    highlight: "Custom requirements"
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Instant Results",
    description: "Complete assignments generated in minutes, not hours of manual work",
    highlight: "Minutes not hours"
  },
  {
    icon: <BookMarked className="w-8 h-8" />,
    title: "Academic Standards",
    description: "Professional formatting with proper citations and reference management",
    highlight: "Multiple citation styles"
  }
];

const trustLogos = [
  "Harvard University", "MIT", "Stanford", "UC Berkeley", "Yale University"
];

const stats = [
  { number: "2,500+", label: "students already love AI assignments" },
  { number: "95%", label: "citation accuracy" },
  { number: "4.8", label: "user satisfaction" },
  { number: "91%", label: "completion rate" }
];

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 360Learning Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                The assignment platform that{" "}
                <br className="hidden md:block" />
                combines the power of{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI
                </span>{" "}
                with the{" "}
                <br className="hidden md:block" />
                magic of{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  academic excellence
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl"
                >
                  <Link href="/auth/signup">
                    I want a demo
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full"
                >
                  <Link href="/#how-it-works">
                    <Play className="mr-2 w-5 h-5" />
                    See how it works
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">Join 2,500+ students that already love AI assignments</p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                  {trustLogos.map((logo, index) => (
                    <div key={index} className="text-xs font-medium text-gray-500 px-4 py-2 bg-gray-100 rounded-full">
                      {logo}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Designed Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                An assignment platform designed for the  
                <br className="hidden md:block" />
                performance-driven era of education.
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                Generate essays, research papers, and academic content from one comprehensive platform designed to deliver educational impact.
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full"
              >
                <Link href="/#features">
                  Show me the features
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table - 360Learning Style */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                The future of assignments is here.  
                <br className="hidden md:block" />
                And it's powered by AI.
              </h2>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="p-6"></div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold">Assignment AI</h3>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold">Traditional Methods</h3>
                </div>
              </div>

              {comparisonData.map((row, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-3 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="p-6 font-semibold text-gray-900 capitalize">
                    {row.feature}
                  </div>
                  <div className="p-6 text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {row.assignmentAI}
                    </span>
                  </div>
                  <div className="p-6 text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      {row.traditional}
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 text-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full"
                >
                  <Link href="/auth/signup">
                    Book my demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Remove the headache of research,  
                <br className="hidden md:block" />
                writing, and formatting assignments.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <div key={index} className="group hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {feature.highlight}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">
              2,500+ teams have adopted Assignment AI.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover the assignment platform  
              <br className="hidden md:block" />
              powered by AI excellence.
            </h2>
            
            <div className="space-y-4 mb-12">
              <div className="flex items-center justify-center text-white text-lg">
                <CheckCircle className="w-6 h-6 mr-3" />
                A 15-minute discussion with an expert
              </div>
              <div className="flex items-center justify-center text-white text-lg">
                <CheckCircle className="w-6 h-6 mr-3" />
                100% tailored to your needs - with ❤️
              </div>
              <div className="flex items-center justify-center text-white text-lg">
                <CheckCircle className="w-6 h-6 mr-3" />
                No commitment. Free as can be.
              </div>
            </div>

            <Button 
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl"
            >
              <Link href="/auth/signup">
                Book my demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
