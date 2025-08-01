"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aiService, type AssignmentRequest } from "@/lib/ai-service";

export default function TestAssignmentImproved() {
  const [assignmentDetails, setAssignmentDetails] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleTest = async () => {
    if (!assignmentDetails.trim()) return;
    
    setIsGenerating(true);
    setError("");
    setResult(null);
    
    try {
      // Parse the assignment details
      const lines = assignmentDetails.split('\n');
      const firstLine = lines[0] || '';
      
      let title = firstLine;
      let subject = "Archaeology";
      let type = "Research Report";
      let wordCount = 2000;
      
      // Extract word count if mentioned
      const wordCountMatch = assignmentDetails.match(/(\d+)[-\s]*word/i);
      if (wordCountMatch) {
        wordCount = parseInt(wordCountMatch[1]);
      }
      
      const request: AssignmentRequest = {
        title: title,
        subject: subject,
        type: type,
        wordCount: wordCount,
        requirements: assignmentDetails,
        assignmentType: "research_paper",
        academicLevel: "undergraduate",
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
        includeTables: true,
        includeCharts: true,
        includeStatisticalAnalysis: true
      };

      const response = await aiService.generateAssignment(request);
      
      setResult({
        content: response.content,
        tables: response.tables,
        charts: response.charts,
        references: response.references,
        usage: response.usage
      });
      
    } catch (error) {
      console.error("Error testing assignment generation:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Test Improved Assignment Generation
          </h1>
          <p className="text-gray-600">
            Test the improved AI service with specific assignment requirements to ensure complete and well-structured output.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Requirements</CardTitle>
              <CardDescription>
                Enter the specific assignment requirements to test the improved AI generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assignmentDetails">Assignment Details</Label>
                <Textarea
                  id="assignmentDetails"
                  value={assignmentDetails}
                  onChange={(e) => setAssignmentDetails(e.target.value)}
                  placeholder="Enter assignment requirements here. For example: Archaeological Findings Report Module: Archaeology Task: Analyze artifact data (e.g., bone measurements, material composition). Deliverable: Tables: Catalog artifact details (e.g., dimensions, carbon-dating results). Figures: Include maps or diagrams of excavation sites"
                  rows={8}
                  className="mt-2"
                />
              </div>
              
              <Button 
                onClick={handleTest} 
                disabled={isGenerating || !assignmentDetails.trim()}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Test Assignment Generation"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Generated assignment content and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {result && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Content Analysis:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <p><strong>Content Length:</strong> {result.content.length} characters</p>
                      <p><strong>Word Count:</strong> ~{Math.round(result.content.split(' ').length)} words</p>
                      <p><strong>Tables Generated:</strong> {result.tables.length}</p>
                      <p><strong>Charts Generated:</strong> {result.charts.length}</p>
                      <p><strong>References:</strong> {result.references.length}</p>
                      <p><strong>Has Introduction:</strong> {result.content.toLowerCase().includes('introduction') ? 'Yes' : 'No'}</p>
                      <p><strong>Has Conclusion:</strong> {result.content.toLowerCase().includes('conclusion') ? 'Yes' : 'No'}</p>
                      <p><strong>Has Tables:</strong> {result.content.toLowerCase().includes('table') ? 'Yes' : 'No'}</p>
                      <p><strong>Has Figures/Charts:</strong> {(result.content.toLowerCase().includes('figure') || result.content.toLowerCase().includes('chart')) ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Generated Content:</h3>
                    <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{result.content}</pre>
                    </div>
                  </div>
                  
                  {result.tables.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Generated Tables:</h3>
                      <div className="space-y-2">
                        {result.tables.map((table: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium">{table.title}</p>
                            <p className="text-sm text-gray-600">{table.caption}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.charts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Generated Charts:</h3>
                      <div className="space-y-2">
                        {result.charts.map((chart: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium">{chart.title}</p>
                            <p className="text-sm text-gray-600">Type: {chart.type}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 