"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { aiService, type AssignmentRequest } from "@/lib/ai-service";
import ProfessionalAssignmentDisplay from "@/components/assignment/ProfessionalAssignmentDisplay";

export default function TestAssignmentPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [assignment, setAssignment] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [charts, setCharts] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const testAssignment = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
      // Check current usage before assignment creation
      const paymentService = (await import("@/lib/payment-service")).default.getInstance();
      const beforeUsage = await paymentService.getAssignmentUsage("test-user-id");
      console.log("Usage before assignment:", beforeUsage);
      
      // Test increment function directly
      await paymentService.incrementAssignmentCount("test-user-id");
      const afterIncrement = await paymentService.getAssignmentUsage("test-user-id");
      console.log("Usage after direct increment:", afterIncrement);
      const request: AssignmentRequest = {
        title: "The Impact of Digital Transformation on Business Strategy",
        subject: "Business Management",
        type: "Research Paper",
        wordCount: 2000,
        requirements: "Analyze how digital transformation affects business strategy, include case studies, and provide recommendations for organizations.",
        assignmentType: "research_paper",
        academicLevel: "undergraduate",
        qualityLevel: "high",
        citations: true,
        citationStyle: "APA",
        includeTables: true,
        includeCharts: true,
        includeStatisticalAnalysis: true,
        includeCoverPage: true,
        includeTableOfContents: true,
        includeExecutiveSummary: true,
        fontFamily: "Times New Roman",
        fontSize: 12,
        lineSpacing: 1.5,
        marginSize: 1,
        pageSize: "A4",
        includePageNumbers: true,
        includeHeaders: true,
        includeFooters: true,
        includePlagiarismCheck: true,
        includeQualityIndicators: true,
        includeEducationalDisclaimer: true,
        exportFormats: ["pdf", "docx"]
      };

      const response = await aiService.generateAssignment(request);
      
      console.log("AI Response:", response);
      console.log("Content length:", response.content.length);
      console.log("Tables:", response.tables.length);
      console.log("Charts:", response.charts.length);
      console.log("References:", response.references.length);
      
      setAssignment({
        title: request.title,
        subject: request.subject,
        type: request.type,
        wordCount: request.wordCount,
        content: response.content,
        status: "completed",
        requirements: request.requirements,
        assignmentType: request.assignmentType,
        academicLevel: request.academicLevel,
        qualityLevel: request.qualityLevel,
        citations: request.citations,
        citationStyle: request.citationStyle,
        includeCoverPage: request.includeCoverPage,
        includeTableOfContents: request.includeTableOfContents,
        includeExecutiveSummary: request.includeExecutiveSummary,
        fontFamily: request.fontFamily,
        fontSize: request.fontSize,
        lineSpacing: request.lineSpacing,
        marginSize: request.marginSize,
        pageSize: request.pageSize,
        includePageNumbers: request.includePageNumbers,
        includeHeaders: request.includeHeaders,
        includeFooters: request.includeFooters,
        includePlagiarismCheck: request.includePlagiarismCheck,
        includeQualityIndicators: request.includeQualityIndicators,
        includeEducationalDisclaimer: request.includeEducationalDisclaimer,
        exportFormats: request.exportFormats,
      });
      
      setTables(response.tables);
      setCharts(response.charts);
      setReferences(response.references);
      
    } catch (error) {
      console.error("Error generating test assignment:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Assignment Generation Test
          </h1>
          <p className="text-gray-600 mb-4">
            This page tests the assignment generation functionality to ensure it produces complete, university-standard assignments.
          </p>
          
          <Button 
            onClick={testAssignment} 
            disabled={isGenerating}
            className="mb-4"
          >
            {isGenerating ? "Generating..." : "Generate Test Assignment"}
          </Button>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}
        </div>

        {assignment && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Test Results
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Content Length:</span>
                  <br />
                  {assignment.content.length} characters
                </div>
                <div>
                  <span className="font-medium">Expected Words:</span>
                  <br />
                  {assignment.wordCount} words
                </div>
                <div>
                  <span className="font-medium">Tables Generated:</span>
                  <br />
                  {tables.length} tables
                </div>
                <div>
                  <span className="font-medium">Charts Generated:</span>
                  <br />
                  {charts.length} charts
                </div>
              </div>
            </div>
            
            <ProfessionalAssignmentDisplay
              assignment={assignment}
              tables={tables}
              charts={charts}
              references={references}
              onExport={(format) => console.log(`Export as ${format}`)}
              onCopy={() => console.log("Copy content")}
              onSave={() => console.log("Save assignment")}
            />
          </div>
        )}
      </div>
    </div>
  );
} 