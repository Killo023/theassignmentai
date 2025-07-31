import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Brain, 
  Download, 
  Shield, 
  Zap, 
  Users,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Advanced AI that creates professional, university-level assignments with proper academic standards."
    },
    {
      icon: FileText,
      title: "Multiple Assignment Types",
      description: "Research papers, case studies, literature reviews, business reports, and more."
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Export as TXT, DOCX, PDF, or XLSX with professional formatting."
    },
    {
      icon: Shield,
      title: "Academic Integrity",
      description: "Plagiarism-free content with educational disclaimers and quality indicators."
    },
    {
      icon: Zap,
      title: "Advanced Formatting",
      description: "Professional formatting with custom fonts, spacing, margins, and page layouts."
    },
    {
      icon: Users,
      title: "Collaboration Tools",
      description: "Share and collaborate on assignments with team members in real-time."
    }
  ];

  const benefits = [
    "Save 25+ hours weekly on assignment creation",
    "35% increase in academic performance",
    "Professional university-level standards",
    "Multiple citation styles (APA, MLA, Chicago, Harvard)",
    "Cover pages, table of contents, and appendices",
    "Multiple choice questions with answer keys",
    "Real-time collaboration features",
    "Priority customer support"
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
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-blue-600"> Academic Excellence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your academic writing with AI-powered tools designed for university-level assignments. 
              Create professional, well-researched content in minutes, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/upgrade" className="flex items-center gap-2">
                  Start Free Plan
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80" 
                alt="AI-powered assignment generation interface"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">AI Generation</h3>
                  <p className="text-sm text-gray-600">Create professional content instantly</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Academic Success
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of features is designed to elevate your academic writing 
            and help you achieve excellence in your studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose The Assignment AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students and educators who have transformed their academic writing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-6">
              {benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Multiple export formats available"
                  className="w-64 h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                  <p className="text-sm font-semibold">Export to</p>
                  <p className="text-xs">PDF, DOCX, TXT, XLSX</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {benefits.slice(4).map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Testimonials */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">What Students Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Student testimonial"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Chen</p>
                    <p className="text-sm text-gray-600">Harvard University</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"Saved me 20+ hours per week on research papers. The quality is incredible!"</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                    alt="Student testimonial"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Marcus Johnson</p>
                    <p className="text-sm text-gray-600">Stanford University</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"The AI understands academic writing better than any tool I've used."</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Student testimonial"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Emma Wilson</p>
                    <p className="text-sm text-gray-600">MIT</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"Professional formatting and citations make my work look polished."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Academic Writing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your free plan today and experience the power of AI-driven academic writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/upgrade" className="flex items-center gap-2">
                Start Free Plan
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 