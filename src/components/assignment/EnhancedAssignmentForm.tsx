"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock,
  CheckCircle,
  Sparkles,
  Table,
  BarChart3
} from "lucide-react";

interface EnhancedAssignmentFormProps {
  onSubmit: (data: any) => void;
  isGenerating: boolean;
}

export default function EnhancedAssignmentForm({ onSubmit, isGenerating }: EnhancedAssignmentFormProps) {
  const [assignmentDetails, setAssignmentDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentDetails.trim()) return;
    
    // Parse the assignment details and create a structured request
    const details = assignmentDetails.toLowerCase();
    
    // Determine assignment type based on content
    let assignmentType = "research_paper";
    if (details.includes('case study')) {
      assignmentType = "case_study";
    } else if (details.includes('literature review')) {
      assignmentType = "literature_review";
    } else if (details.includes('business report')) {
      assignmentType = "business_report";
    } else if (details.includes('lab report')) {
      assignmentType = "lab_report";
    } else if (details.includes('technical report')) {
      assignmentType = "technical_report";
    }
    
    // Determine if tables and charts are required
    const requiresTables = details.includes('table') || details.includes('tables');
    const requiresCharts = details.includes('chart') || details.includes('figure') || details.includes('diagram') || details.includes('map');
    
    // Determine academic level based on content
    let academicLevel = "undergraduate";
    if (details.includes('graduate') || details.includes('masters')) {
      academicLevel = "graduate";
    } else if (details.includes('phd') || details.includes('doctoral')) {
      academicLevel = "postgraduate";
    }
    
    const request = {
      assignmentDetails: assignmentDetails,
      // Enhanced parsing for specific assignment types
      assignmentType: assignmentType,
      academicLevel: academicLevel,
      qualityLevel: "high",
      citations: true,
      citationStyle: "APA",
      includeCoverPage: true,
      includeTableOfContents: true,
      includeExecutiveSummary: false,
      includeAppendices: false,
      fontFamily: "Times New Roman",
      fontSize: 12,
      lineSpacing: 1.5,
      marginSize: 1,
      pageSize: "A4",
      includePageNumbers: true,
      includeHeaders: true,
      includeFooters: true,
      includeMCQ: false,
      mcqCount: 5,
      mcqDifficulty: "medium",
      includeAnswerKey: false,
      includeRubric: false,
      includePlagiarismCheck: true,
      includeQualityIndicators: true,
      includeEducationalDisclaimer: true,
      exportFormats: ["txt", "docx", "pdf"],
      includeTables: requiresTables || true, // Default to true but respect specific requirements
      includeCharts: requiresCharts || true, // Default to true but respect specific requirements
      includeStatisticalAnalysis: true
    };
    
    onSubmit(request);
  };

  const examples = [
    {
      title: "Research Paper",
      description: "Write a 2000-word research paper on the impact of artificial intelligence on modern healthcare",
      icon: <FileText className="w-4 h-4" />
    },
    {
      title: "Case Study",
      description: "Analyze the business strategy of Tesla and its market positioning in the electric vehicle industry",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      title: "Literature Review",
      description: "Review current literature on climate change adaptation strategies in coastal communities",
      icon: <GraduationCap className="w-4 h-4" />
    }
  ];

  const features = [
    { name: "Cover Page", icon: <FileText className="w-3 h-3" /> },
    { name: "References", icon: <BookOpen className="w-3 h-3" /> },
    { name: "Citations", icon: <Award className="w-3 h-3" /> },
    { name: "Professional Formatting", icon: <CheckCircle className="w-3 h-3" /> },
    { name: "Data Tables", icon: <Table className="w-3 h-3" /> },
    { name: "Charts & Graphs", icon: <BarChart3 className="w-3 h-3" /> }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Create Professional Assignment
          </CardTitle>
          <CardDescription>
            Describe your assignment requirements in detail. Our AI will generate a complete, 
            professional assignment with cover page, references, and proper formatting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="assignmentDetails" className="text-base font-medium">
                Assignment Requirements
              </Label>
              <Textarea
                id="assignmentDetails"
                value={assignmentDetails}
                onChange={(e) => setAssignmentDetails(e.target.value)}
                placeholder="Describe your assignment in detail. For example: Write a 2000-word research paper on the impact of artificial intelligence on modern healthcare. Include an introduction, literature review, methodology, results, discussion, and conclusion. Use APA citation style and include at least 10 academic sources."
                rows={8}
                className="resize-none text-base"
                required
              />
              <p className="text-sm text-muted-foreground">
                Be as specific as possible about your topic, word count, structure, and requirements.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">What's Included:</h4>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature.icon}
                      {feature.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Quick Examples:</h4>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setAssignmentDetails(example.description)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {example.icon}
                        <span className="font-medium text-sm">{example.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isGenerating || !assignmentDetails.trim()} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Assignment...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Professional Assignment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 