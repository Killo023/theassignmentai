"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Clock, 
  Star, 
  TrendingUp,
  Plus,
  Bot,
  MessageSquare,
  Download,
  Eye,
  Lock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";
import Paywall from "@/components/Paywall";

const stats = [
  { name: "Total Assignments", value: "24", icon: FileText, change: "+12%", changeType: "positive" },
  { name: "Time Saved", value: "47hrs", icon: Clock, change: "+8hrs", changeType: "positive" },
  { name: "Average Grade", value: "A-", icon: Star, change: "+0.3", changeType: "positive" },
  { name: "AI Interactions", value: "156", icon: Bot, change: "+23", changeType: "positive" },
];

const recentAssignments = [
  {
    id: 1,
    title: "Research Paper on AI Ethics",
    subject: "Computer Science",
    status: "completed",
    grade: "A+",
    date: "2 days ago",
    wordCount: 2500
  },
  {
    id: 2,
    title: "Business Case Study Analysis",
    subject: "Business Administration",
    status: "draft",
    grade: null,
    date: "1 week ago",
    wordCount: 1800
  },
  {
    id: 3,
    title: "Literature Review: Modern Poetry",
    subject: "English Literature",
    status: "in-progress",
    grade: null,
    date: "3 days ago",
    wordCount: 1200
  },
  {
    id: 4,
    title: "Statistical Analysis Report",
    subject: "Statistics",
    status: "completed",
    grade: "A",
    date: "5 days ago",
    wordCount: 3200
  }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [hasExpiredTrial, setHasExpiredTrial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const checkTrialStatus = async () => {
    if (user) {
      try {
        const paymentService = PaymentService.getInstance();
        const subscription = await paymentService.checkSubscriptionStatus(user.id);
        // Only show expired trial if user is not Pro
        const expired = subscription?.status !== 'active' && await paymentService.hasExpiredTrial(user.id);
        setHasExpiredTrial(expired);
      } catch (error) {
        console.error('Error checking trial status:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkTrialStatus();
  }, [user]);

  const handleUpgrade = async (paymentData: any) => {
    try {
      const paymentService = PaymentService.getInstance();
      const result = await paymentService.convertTrialToPaid(user!.id, paymentData);
      
      if (result.success) {
        setShowPaywall(false);
        setHasExpiredTrial(false);
        // Refresh subscription status
        await checkTrialStatus();
        return true;
      } else {
        alert('Payment failed: ' + result.message);
        return false;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (hasExpiredTrial) {
    return (
      <div className="space-y-8">
        {/* Expired Trial Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-red-800 mb-1">Trial Expired</h2>
              <p className="text-red-700 mb-4">
                Your free trial has ended. Upgrade to Pro to continue using all features and generate unlimited assignments.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowPaywall(true)}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Upgrade to Basic - $14.99/month
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Limited Dashboard Content */}
        <div className="space-y-6">
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Access Restricted</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Pro to unlock all dashboard features and continue generating assignments.
            </p>
            <Button 
              onClick={() => setShowPaywall(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              <Lock className="w-4 h-4 mr-2" />
              Unlock Pro Features
            </Button>
          </div>
        </div>

        {/* Paywall Modal */}
        <Paywall
          isVisible={showPaywall}
          onUpgrade={handleUpgrade}
          onClose={() => setShowPaywall(false)}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your assignments.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600">
            <Link href="/dashboard/new" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Assignment
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground ml-1">from last month</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Subscription Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SubscriptionStatus userId={user?.id || ''} />
      </motion.div>

      {/* Recent Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Assignments</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/assignments">View All</Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{assignment.status}</p>
                  <p className="text-xs text-muted-foreground">{assignment.date}</p>
                </div>
                {assignment.grade && (
                  <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    {assignment.grade}
                  </div>
                )}
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Get help with your assignments using our AI assistant.
          </p>
          <Button variant="outline" className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Chat
          </Button>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Export Data</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Download your assignments and data in various formats.
          </p>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage; 