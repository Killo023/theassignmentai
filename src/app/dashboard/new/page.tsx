"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Copy, 
  Eye,
  EyeOff,
  Wand2,
  Settings,
  Save,
  ArrowLeft,
  Plus,
  Crown,
  Lock,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  BookOpen,
  CheckSquare,
  Type,
  Ruler,
  Palette,
  Award,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aiService, type AssignmentRequest, type TableData, type ChartData, type Reference } from "@/lib/ai-service";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";
import Paywall from "@/components/Paywall";
import { AssignmentService } from "@/lib/assignment-service";
import { EnhancedExportService } from "@/lib/enhanced-export-service";
import EnhancedAssignmentForm from "@/components/assignment/EnhancedAssignmentForm";
import ProfessionalAssignmentDisplay from "@/components/assignment/ProfessionalAssignmentDisplay";
import Link from "next/link";

interface Assignment {
  title: string;
  subject: string;
  type: string;
  wordCount: number;
  content: string;
  status: "draft" | "in-progress" | "completed";
  requirements?: string;
  
  // Professional Assignment Features
  assignmentType?: 'research_paper' | 'case_study' | 'literature_review' | 'business_report' | 'comparative_analysis' | 'essay' | 'thesis' | 'lab_report' | 'presentation' | 'technical_report';
  academicLevel?: 'undergraduate' | 'graduate' | 'postgraduate';
  qualityLevel?: 'standard' | 'high' | 'excellent';
  
  // Citation and References
  citations?: boolean;
  citationStyle?: 'APA' | 'MLA' | 'Chicago' | 'Harvard';
  
  // Structural Elements
  includeCoverPage?: boolean;
  includeTableOfContents?: boolean;
  includeExecutiveSummary?: boolean;
  includeAppendices?: boolean;
  
  // Formatting Options
  fontFamily?: string;
  fontSize?: number;
  lineSpacing?: number;
  marginSize?: number;
  pageSize?: 'A4' | 'Letter';
  includePageNumbers?: boolean;
  includeHeaders?: boolean;
  includeFooters?: boolean;
  
  // Multiple Choice Questions
  includeMCQ?: boolean;
  mcqCount?: number;
  mcqDifficulty?: 'easy' | 'medium' | 'hard';
  includeAnswerKey?: boolean;
  includeRubric?: boolean;
  
  // Quality Assurance
  includePlagiarismCheck?: boolean;
  includeQualityIndicators?: boolean;
  includeEducationalDisclaimer?: boolean;
  
  // Export Options
  exportFormats?: ('txt' | 'docx' | 'pdf' | 'xlsx')[];
}

const AssignmentCreator = () => {
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment>({
    title: "",
    subject: "",
    type: "",
    wordCount: 1000,
    content: "",
    status: "draft",
    requirements: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isBasic, setIsBasic] = useState(false);
  const [assignmentUsage, setAssignmentUsage] = useState(0);
  const [canCreateAssignment, setCanCreateAssignment] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [aiStatus, setAiStatus] = useState<"checking" | "available" | "unavailable">("checking");
  const [tables, setTables] = useState<TableData[]>([]);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);

  const paymentService = PaymentService.getInstance();
  // Only create assignment service when we have a valid user
  const getAssignmentService = () => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    return new AssignmentService(user.id);
  };

  useEffect(() => {
    checkSubscriptionStatus();
    checkAIStatus();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      if (!user?.id) return;
      
      const status = await paymentService.checkSubscriptionStatus(user.id);
      const usage = await paymentService.getAssignmentUsage(user.id);
      
      setIsPro(status?.planId === "pro");
      setIsBasic(status?.planId === "basic");
      setAssignmentUsage(usage.used);
      
      // Check if user can create assignments
      const canCreate = await paymentService.canCreateAssignment(user.id);
      setCanCreateAssignment(canCreate);
      
      if (!canCreate) {
        setShowPaywall(true);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  const handleUpgrade = async (paymentData: any): Promise<boolean> => {
    try {
      if (!user?.id) return false;
      
      const result = await paymentService.convertToPaid(user.id, 'basic', paymentData);
      if (result.success) {
        await checkSubscriptionStatus();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Payment error:", error);
      return false;
    }
  };

  const checkAIStatus = async () => {
    try {
      setAiStatus("checking");
      const isAvailable = await aiService.validateAPIKey();
      setAiStatus(isAvailable ? "available" : "unavailable");
    } catch (error) {
      console.error("Error checking AI status:", error);
      setAiStatus("unavailable");
    }
  };

  const generateAssignment = async (formData: any) => {
    if (!canCreateAssignment) {
      setShowPaywall(true);
      return;
    }

    if (!user?.id) {
      console.error("No user ID available for assignment creation");
      return;
    }

    setIsGenerating(true);
    try {
      // Log current usage before assignment creation
      const currentUsage = await paymentService.getAssignmentUsage(user.id);
      console.log("Assignment usage before creation:", currentUsage);
      
      // Extract title, subject, and type from the assignment details
      const assignmentDetails = formData.assignmentDetails;
      const lines = assignmentDetails.split('\n');
      const firstLine = lines[0] || '';
      
      // Try to extract basic info from the first line
      let title = firstLine;
      let subject = "General";
      let type = "Research Paper";
      let wordCount = 2000;
      
      // Extract word count if mentioned
      const wordCountMatch = assignmentDetails.match(/(\d+)[-\s]*word/i);
      if (wordCountMatch) {
        wordCount = parseInt(wordCountMatch[1]);
      }
      
      // Extract assignment type if mentioned
      if (assignmentDetails.toLowerCase().includes('research paper')) {
        type = "Research Paper";
      } else if (assignmentDetails.toLowerCase().includes('case study')) {
        type = "Case Study";
      } else if (assignmentDetails.toLowerCase().includes('literature review')) {
        type = "Literature Review";
      } else if (assignmentDetails.toLowerCase().includes('essay')) {
        type = "Essay";
      } else if (assignmentDetails.toLowerCase().includes('report')) {
        type = "Report";
      }
      
      // Extract subject if mentioned
      if (assignmentDetails.toLowerCase().includes('business')) {
        subject = "Business Administration";
      } else if (assignmentDetails.toLowerCase().includes('computer science') || assignmentDetails.toLowerCase().includes('ai') || assignmentDetails.toLowerCase().includes('artificial intelligence')) {
        subject = "Computer Science";
      } else if (assignmentDetails.toLowerCase().includes('healthcare') || assignmentDetails.toLowerCase().includes('medical')) {
        subject = "Healthcare";
      } else if (assignmentDetails.toLowerCase().includes('climate') || assignmentDetails.toLowerCase().includes('environment')) {
        subject = "Environmental Science";
      }
      
      const request: AssignmentRequest = {
        title: title,
        subject: subject,
        type: type,
        wordCount: wordCount,
        requirements: assignmentDetails,
        style: formData.citationStyle,
        citations: formData.citations,
        
        // Enhanced professional fields
        assignmentType: formData.assignmentType,
        academicLevel: formData.academicLevel,
        qualityLevel: formData.qualityLevel,
        citationStyle: formData.citationStyle,
        includeCoverPage: formData.includeCoverPage,
        includeTableOfContents: formData.includeTableOfContents,
        includeExecutiveSummary: formData.includeExecutiveSummary,
        includeAppendices: formData.includeAppendices,
        fontFamily: formData.fontFamily,
        fontSize: formData.fontSize,
        lineSpacing: formData.lineSpacing,
        marginSize: formData.marginSize,
        pageSize: formData.pageSize,
        includePageNumbers: formData.includePageNumbers,
        includeHeaders: formData.includeHeaders,
        includeFooters: formData.includeFooters,
        includeMCQ: formData.includeMCQ,
        mcqCount: formData.mcqCount,
        mcqDifficulty: formData.mcqDifficulty,
        includeAnswerKey: formData.includeAnswerKey,
        includeRubric: formData.includeRubric,
        includePlagiarismCheck: formData.includePlagiarismCheck,
        includeQualityIndicators: formData.includeQualityIndicators,
        includeEducationalDisclaimer: formData.includeEducationalDisclaimer,
        exportFormats: formData.exportFormats,
      };

      const response = await aiService.generateAssignment(request);
      
      // Update the parsed data
      setTables(response.tables);
      setCharts(response.charts);
      setReferences(response.references);
      
      setAssignment({
        ...assignment,
        title: title,
        subject: subject,
        type: type,
        wordCount: wordCount,
        content: response.content,
        status: "completed",
        requirements: assignmentDetails,
        assignmentType: formData.assignmentType,
        academicLevel: formData.academicLevel,
        qualityLevel: formData.qualityLevel,
        citations: formData.citations,
        citationStyle: formData.citationStyle,
        includeCoverPage: formData.includeCoverPage,
        includeTableOfContents: formData.includeTableOfContents,
        includeExecutiveSummary: formData.includeExecutiveSummary,
        includeAppendices: formData.includeAppendices,
        fontFamily: formData.fontFamily,
        fontSize: formData.fontSize,
        lineSpacing: formData.lineSpacing,
        marginSize: formData.marginSize,
        pageSize: formData.pageSize,
        includePageNumbers: formData.includePageNumbers,
        includeHeaders: formData.includeHeaders,
        includeFooters: formData.includeFooters,
        includeMCQ: formData.includeMCQ,
        mcqCount: formData.mcqCount,
        mcqDifficulty: formData.mcqDifficulty,
        includeAnswerKey: formData.includeAnswerKey,
        includeRubric: formData.includeRubric,
        includePlagiarismCheck: formData.includePlagiarismCheck,
        includeQualityIndicators: formData.includeQualityIndicators,
        includeEducationalDisclaimer: formData.includeEducationalDisclaimer,
        exportFormats: formData.exportFormats,
      });

      // Save to database
      console.log("Creating assignment with user ID:", user.id);
      const assignmentService = getAssignmentService();
      
      try {
        const savedAssignment = await assignmentService.createAssignment({
          ...assignment,
          title: title,
          subject: subject,
          type: type,
          word_count: wordCount,
          content: response.content,
          status: "completed",
          requirements: assignmentDetails,
        });
        
        console.log("✅ Assignment saved successfully:", savedAssignment);
      } catch (error) {
        console.error("❌ Failed to save assignment:", error);
        // Show user-friendly error message
        alert("Assignment generated successfully but failed to save. Please try again.");
      }

      // Log usage after assignment creation
      const updatedUsage = await paymentService.getAssignmentUsage(user.id);
      console.log("Assignment usage after creation:", updatedUsage);

      // Ensure user has subscription record
      try {
        await paymentService.createFreeSubscription(user.id);
        console.log("✅ Ensured user has subscription record");
      } catch (error) {
        console.log("ℹ️ User already has subscription record or error:", error);
      }

      await checkSubscriptionStatus();
    } catch (error) {
      console.error("Error generating assignment:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const exportAssignment = async (format: string) => {
    if (!assignment.content) return;

    const options = {
      format: format as "txt" | "docx" | "pdf" | "xlsx",
      includeCoverPage: assignment.includeCoverPage || false,
      includeTableOfContents: assignment.includeTableOfContents || false,
      includeExecutiveSummary: assignment.includeExecutiveSummary || false,
      includeAppendices: assignment.includeAppendices || false,
      fontFamily: assignment.fontFamily || "Times New Roman",
      fontSize: assignment.fontSize || 12,
      lineSpacing: assignment.lineSpacing || 1.5,
      marginSize: assignment.marginSize || 1,
      pageSize: assignment.pageSize || "A4",
      includePageNumbers: assignment.includePageNumbers || true,
      includeHeaders: assignment.includeHeaders || true,
      includeFooters: assignment.includeFooters || true,
    };

    try {
      switch (format) {
        case "txt":
          await EnhancedExportService.exportAsTXT(assignment.content, options);
          break;
        case "docx":
          await EnhancedExportService.exportAsDOCX(assignment.content, options);
          break;
        case "pdf":
          await EnhancedExportService.exportAsPDF(assignment.content, options);
          break;
        case "xlsx":
          await EnhancedExportService.exportAsXLSX(assignment.content, options);
          break;
      }
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
    }
  };

  if (showPaywall) {
    return (
      <Paywall
        isVisible={showPaywall}
        onUpgrade={handleUpgrade}
        onClose={() => setShowPaywall(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Create Professional Assignment
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Generate high-quality, university-level assignments with advanced formatting and export options.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 min-h-0">
          {/* Left Panel - Enhanced Assignment Form */}
          <div className="w-full xl:w-1/2 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 sm:p-6">
              <EnhancedAssignmentForm
                onSubmit={generateAssignment}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Right Panel - Assignment Preview and Export */}
          <div className="w-full xl:w-1/2 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Assignment Preview</h2>
                <div className="flex items-center space-x-2">
                  {aiStatus === "checking" && (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-xs sm:text-sm">Checking AI...</span>
                    </div>
                  )}
                  {aiStatus === "available" && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs sm:text-sm">AI Available</span>
                    </div>
                  )}
                  {aiStatus === "unavailable" && (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span className="text-xs sm:text-sm">AI Unavailable</span>
                    </div>
                  )}
                </div>
              </div>

              {assignment.content ? (
                <div className="max-h-[60vh] overflow-y-auto">
                  <ProfessionalAssignmentDisplay
                    assignment={assignment}
                    tables={tables}
                    charts={charts}
                    references={references}
                    onExport={exportAssignment}
                    onCopy={() => copyToClipboard(assignment.content)}
                    onSave={() => {
                      // Save functionality
                      console.log('Saving assignment...');
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Create
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Describe your assignment requirements to generate a professional assignment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCreator; 