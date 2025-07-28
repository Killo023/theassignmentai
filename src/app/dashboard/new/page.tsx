"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  FileText, 
  Download, 
  Copy, 
  RotateCcw,
  Sparkles,
  MessageSquare,
  Settings,
  Save,
  Eye,
  EyeOff,
  Zap,
  ArrowUp,
  AlertTriangle,
  Info,
  Lock
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
import { aiService, type AssignmentRequest } from "@/lib/ai-service";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";
import Paywall from "@/components/Paywall";

// Client-side only time display component to avoid hydration issues
const TimeDisplay = ({ timestamp }: { timestamp: Date }) => {
  const [timeString, setTimeString] = useState<string>("");
  
  useEffect(() => {
    setTimeString(timestamp.toLocaleTimeString());
  }, [timestamp]);
  
  return <span>{timeString}</span>;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  images?: string[]; // Array of image URLs or base64 data
}

interface Assignment {
  title: string;
  subject: string;
  type: string;
  wordCount: number;
  content: string;
  status: "draft" | "in-progress" | "completed";
}

const AssignmentCreator = () => {
  const { user } = useAuth();
  const [hasExpiredTrial, setHasExpiredTrial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const [assignment, setAssignment] = useState<Assignment>({
    title: "",
    subject: "",
    type: "",
    wordCount: 1000,
    content: "",
    status: "draft"
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assignment assistant powered by Together AI. I can help you create university-level academic assignments with comprehensive visual content.\n\n🎓 **Academic Focus Only:**\n• I ONLY assist with academic assignments and educational content\n• Research papers, essays, case studies, and academic writing\n• Subject-specific assignments and academic guidance\n• Writing help, citations, and academic structure\n\n📊 **Visual Elements Included:**\n• Academic charts and graphs\n• Research methodology diagrams\n• Statistical data visualizations\n• Subject-specific diagrams (flowcharts, concept maps)\n• Professional academic formatting\n\n💡 **How to Use:**\n• Describe your assignment requirements in detail\n• Ask about academic writing and structure\n• Request help with citations and references\n• Get subject-specific academic guidance\n• Export your completed assignments\n\n⚠️ **IMPORTANT:** All generated content is for educational purposes and serves as examples only. Users should adapt and personalize content for their specific academic needs.\n\n❌ **I Cannot Help With:**\n• Personal advice or life coaching\n• Entertainment or casual conversation\n• Non-academic topics\n• General chit-chat\n\n🔒 **Copy Protection:**\n• Chat content is copy-protected for academic integrity\n• Use the export function to download your completed assignment",
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiStatus, setAiStatus] = useState<"connected" | "disconnected" | "checking">("checking");
  const [exportStatus, setExportStatus] = useState<string>("");
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Check trial status on component mount
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

  // Get the latest AI content for export
  const getLatestAIContent = () => {
    // First check if assignment.content has content
    if (assignment.content && assignment.content.trim() !== '') {
      return assignment.content;
    }
    
    // Otherwise, get the latest AI message content
    const aiMessages = messages.filter(msg => msg.role === 'assistant' && msg.content.length > 100);
    if (aiMessages.length > 0) {
      return aiMessages[aiMessages.length - 1].content;
    }
    
    return '';
  };

  const getLatestAIImages = () => {
    const aiMessages = messages.filter(msg => msg.role === 'assistant' && msg.images && msg.images.length > 0);
    if (aiMessages.length > 0) {
      return aiMessages[aiMessages.length - 1].images || [];
    }
    return [];
  };

  const validateAssignmentRequest = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Check for non-academic content
    const nonAcademicKeywords = [
      'personal advice', 'life coaching', 'entertainment', 'casual conversation',
      'general chit-chat', 'non-academic', 'personal problems', 'relationship advice',
      'dating advice', 'personal therapy', 'emotional support', 'personal counseling'
    ];
    
    const hasNonAcademicContent = nonAcademicKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (hasNonAcademicContent) {
      alert('I can only help with academic assignments and educational content. Please ask about research papers, essays, case studies, or other academic topics.');
      return false;
    }
    
    return true;
  };

  const checkAIStatus = async () => {
    try {
      setAiStatus("checking");
      const isValid = await aiService.validateAPIKey();
      setAiStatus(isValid ? "connected" : "disconnected");
    } catch (error) {
      setAiStatus("disconnected");
    }
  };

  const generateAIResponse = async (userMessage: string) => {
    if (!validateAssignmentRequest(userMessage)) return;

    setIsGenerating(true);
    
    try {
      const request: AssignmentRequest = {
        title: assignment.title || "Academic Assignment",
        subject: assignment.subject || "General",
        type: assignment.type || "Research Paper",
        wordCount: assignment.wordCount,
        requirements: userMessage
      };

      const response = await aiService.generateAssignment(request);
      
      if (response.content) {
        const exampleDisclaimer = "\n\n---\n\n**📝 EDUCATIONAL EXAMPLE DISCLAIMER:**\nThis content is generated for educational purposes and serves as an example only. Students should adapt and personalize this content for their specific academic requirements, ensuring proper citations and original work.\n\n";
        const contentWithDisclaimer = response.content + exampleDisclaimer;
        
        const newMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: contentWithDisclaimer,
          timestamp: new Date(),
          images: response.images || []
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Update assignment content for export
        setAssignment(prev => ({
          ...prev,
          content: contentWithDisclaimer,
          status: "completed"
        }));
      } else {
        throw new Error('Failed to generate assignment content');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error while generating your assignment. Please try again or rephrase your request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    
    await generateAIResponse(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageKeyDown = (e: React.KeyboardEvent) => {
    // Prevent copy/paste/cut/select-all on message content
    if ((e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
      e.preventDefault();
      return false;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
      const button = document.activeElement as HTMLElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '✓ Copied!';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard. Please use the export function instead.');
    }
  };

  const exportAssignment = (format: "docx" | "pdf" | "txt") => {
    const content = getLatestAIContent();
    const images = getLatestAIImages();
    
    if (!content) {
      alert('No content to export. Please generate an assignment first.');
      return;
    }

    setExportStatus(`Exporting as ${format.toUpperCase()}...`);

    try {
      const disclaimer = "EXAMPLE ASSIGNMENT - FOR EDUCATIONAL PURPOSES ONLY\n\nThis is an example assignment generated for educational purposes. Students should adapt and personalize this content for their specific academic requirements.\n\n";
      
      if (format === "txt") {
        const fullContent = disclaimer + content;
        const blob = new Blob([fullContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assignment_example.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setExportStatus("Example assignment exported as TXT");
      } else if (format === "docx") {
        // Create HTML content for DOCX export
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Example Assignment</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .disclaimer { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
              .disclaimer strong { color: #856404; }
              h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
              h2 { color: #34495e; margin-top: 30px; }
              p { margin-bottom: 15px; }
              img { max-width: 100%; height: auto; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
              .image-caption { text-align: center; font-style: italic; color: #666; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="disclaimer">
              <strong>⚠️ EXAMPLE ASSIGNMENT - FOR EDUCATIONAL PURPOSES ONLY</strong><br>
              This is an example assignment generated for educational purposes. Students should adapt and personalize this content for their specific academic requirements.
            </div>
            ${content.replace(/\n/g, '<br>')}
            ${images.map((img, index) => `
              <img src="${img}" alt="Academic Visualization ${index + 1}" />
              <div class="image-caption">Figure ${index + 1}: Academic Visualization (Example)</div>
            `).join('')}
          </body>
          </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assignment_example.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setExportStatus("Example assignment exported as HTML (DOCX)");
      } else if (format === "pdf") {
        // For PDF, we'll use the browser's print functionality
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Example Assignment</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .disclaimer { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
                .disclaimer strong { color: #856404; }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                h2 { color: #34495e; margin-top: 30px; }
                p { margin-bottom: 15px; }
                img { max-width: 100%; height: auto; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
                .image-caption { text-align: center; font-style: italic; color: #666; margin-top: 5px; }
                @media print {
                  body { margin: 20px; }
                  .disclaimer { page-break-inside: avoid; }
                }
              </style>
            </head>
            <body>
              <div class="disclaimer">
                <strong>⚠️ EXAMPLE ASSIGNMENT - FOR EDUCATIONAL PURPOSES ONLY</strong><br>
                This is an example assignment generated for educational purposes. Students should adapt and personalize this content for their specific academic requirements.
              </div>
              ${content.replace(/\n/g, '<br>')}
              ${images.map((img, index) => `
                <img src="${img}" alt="Academic Visualization ${index + 1}" />
                <div class="image-caption">Figure ${index + 1}: Academic Visualization (Example)</div>
              `).join('')}
            </body>
            </html>
          `;
          
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
          
          setExportStatus("Example assignment exported as PDF");
        }
      }
      
      setTimeout(() => setExportStatus(""), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus("Export failed. Please try again.");
      setTimeout(() => setExportStatus(""), 3000);
    }
  };

  const generateQuickAssignment = async () => {
    const defaultPrompt = `Please create a comprehensive academic assignment with the following requirements:

Title: ${assignment.title || "Research Paper"}
Subject: ${assignment.subject || "General Academic"}
Type: ${assignment.type || "Research Paper"}
Word Count: ${assignment.wordCount} words

Please include:
1. A well-structured academic paper with proper introduction, body, and conclusion
2. Academic citations and references in APA format
3. Professional academic language and tone
4. Clear thesis statement and supporting arguments
5. Visual elements like charts, graphs, or diagrams where appropriate
6. Proper academic formatting and structure

Make sure this is suitable for university-level academic standards.`;

    setInputMessage(defaultPrompt);
    await generateAIResponse(defaultPrompt);
  };

  useEffect(() => {
    checkAIStatus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasExpiredTrial) {
    return (
      <div className="space-y-6">
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
                Your free trial has ended. Upgrade to Pro to continue generating unlimited assignments with AI assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowPaywall(true)}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Upgrade to Pro - $29.99/month
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Limited Content */}
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Assignment Generation Locked</h3>
          <p className="text-muted-foreground mb-4">
            Upgrade to Pro to unlock unlimited AI-powered assignment generation with visual content and export features.
          </p>
          <Button 
            onClick={() => setShowPaywall(true)}
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Lock className="w-4 h-4 mr-2" />
            Unlock Assignment Generation
          </Button>
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
    <div className="h-screen flex flex-col">
      {/* Example Assignment Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 p-3">
        <div className="flex items-center justify-center gap-2 text-yellow-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            📝 EXAMPLE ASSIGNMENTS - All generated content is for educational purposes and serves as examples only
          </span>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">AI Assignment Assistant</h1>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      aiStatus === 'connected' ? 'bg-green-500' : 
                      aiStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-muted-foreground">
                      {aiStatus === 'connected' ? 'AI Connected' : 
                       aiStatus === 'checking' ? 'Checking AI...' : 'AI Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.role === 'user' ? 'U' : <Bot className="w-4 h-4" />}
                      </div>
                      
                      <div className={`rounded-lg p-4 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div 
                          className="prose prose-sm max-w-none"
                          onKeyDown={handleMessageKeyDown}
                          tabIndex={0}
                        >
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0">
                              {line}
                            </p>
                          ))}
                        </div>
                        
                        {message.images && message.images.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {message.images.map((image, imgIndex) => (
                              <div key={imgIndex} className="relative">
                                <img 
                                  src={image} 
                                  alt={`Academic Visualization ${imgIndex + 1}`}
                                  className="rounded-lg border max-w-full h-auto"
                                />
                                <p className="text-xs text-muted-foreground mt-1 text-center">
                                  Figure {imgIndex + 1}: Academic Visualization (Example)
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <TimeDisplay timestamp={message.timestamp} />
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.content)}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Generating assignment...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your assignment requirements..."
                  className="min-h-[60px] max-h-[200px] resize-none"
                  disabled={isGenerating}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isGenerating}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateQuickAssignment}
                  disabled={isGenerating}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Assignment
                </Button>
              </div>
              
              {exportStatus && (
                <div className="text-sm text-muted-foreground">
                  {exportStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Preview Panel */}
        {showPreview && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l bg-muted/30"
          >
            <div className="p-4 h-full overflow-y-auto">
              <h3 className="text-lg font-semibold text-foreground mb-4">Example Assignment Preview</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">Educational Example Only</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  This content is for educational purposes and serves as an example only.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input
                    value={assignment.title}
                    onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Assignment title"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Subject</Label>
                    <Input
                      value={assignment.subject}
                      onChange={(e) => setAssignment(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Subject"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <Input
                      value={assignment.type}
                      onChange={(e) => setAssignment(prev => ({ ...prev, type: e.target.value }))}
                      placeholder="Type"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Word Count</Label>
                  <Input
                    type="number"
                    value={assignment.wordCount}
                    onChange={(e) => setAssignment(prev => ({ ...prev, wordCount: parseInt(e.target.value) || 1000 }))}
                    className="mt-1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Export Options</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportAssignment("txt")}
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      TXT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportAssignment("docx")}
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      DOCX
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportAssignment("pdf")}
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssignmentCreator; 