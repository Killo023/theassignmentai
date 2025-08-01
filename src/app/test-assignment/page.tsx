"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AssignmentService } from "@/lib/assignment-service";
import { aiService } from "@/lib/ai-service";

export default function TestAssignmentPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>("Ready to test");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const testAssignmentCreation = async () => {
    if (!user?.id) {
      addLog("❌ No user ID available");
      return;
    }

    try {
      addLog("🧪 Starting assignment creation test...");
      
      const assignmentService = new AssignmentService(user.id);
      
      // Test database connection
      addLog("🔍 Testing database connection...");
      const connectionOk = await assignmentService.testDatabaseConnection();
      if (!connectionOk) {
        addLog("❌ Database connection failed");
        return;
      }
      addLog("✅ Database connection successful");
      
      // Test AI service
      addLog("🤖 Testing AI service...");
      const aiOk = await aiService.validateAPIKey();
      if (!aiOk) {
        addLog("❌ AI service not available");
        return;
      }
      addLog("✅ AI service available");
      
      // Generate a test assignment
      addLog("📝 Generating test assignment...");
      const testRequest = {
        title: "Test Research Paper",
        subject: "Computer Science",
        type: "Research Paper",
        wordCount: 1000,
        requirements: "Write a research paper on artificial intelligence in healthcare. Include tables and charts with data.",
        assignmentType: "research_paper",
        academicLevel: "undergraduate",
        qualityLevel: "high",
        citations: true,
        citationStyle: "APA",
        includeTables: true,
        includeCharts: true,
        includeStatisticalAnalysis: true
      };
      
      const aiResponse = await aiService.generateAssignment(testRequest);
      addLog(`✅ AI generated assignment with ${aiResponse.tables.length} tables, ${aiResponse.charts.length} charts, ${aiResponse.references.length} references`);
      
      // Save to database
      addLog("💾 Saving assignment to database...");
      const savedAssignment = await assignmentService.createAssignment({
        user_id: user.id,
        title: testRequest.title,
        subject: testRequest.subject,
        type: testRequest.type,
        word_count: testRequest.wordCount,
        content: aiResponse.content,
        status: "completed",
        requirements: testRequest.requirements,
        assignment_type: testRequest.assignmentType,
        academic_level: testRequest.academicLevel,
        quality_level: testRequest.qualityLevel,
        include_citations: testRequest.citations,
        citation_style: testRequest.citationStyle,
        include_tables: testRequest.includeTables,
        include_charts: testRequest.includeCharts,
        include_statistical_analysis: testRequest.includeStatisticalAnalysis,
        tables_data: aiResponse.tables,
        charts_data: aiResponse.charts,
        references_data: aiResponse.references
      });
      
      if (savedAssignment) {
        addLog("✅ Assignment saved successfully!");
        addLog(`📊 Saved assignment ID: ${savedAssignment.id}`);
        addLog(`📊 Tables: ${savedAssignment.tables_data?.length || 0}`);
        addLog(`📊 Charts: ${savedAssignment.charts_data?.length || 0}`);
        addLog(`📊 References: ${savedAssignment.references_data?.length || 0}`);
      } else {
        addLog("❌ Failed to save assignment");
      }
      
      // Fetch assignments to verify
      addLog("📋 Fetching assignments to verify...");
      const assignments = await assignmentService.getAssignments();
      addLog(`✅ Found ${assignments.length} assignments for user`);
      
      if (assignments.length > 0) {
        const latest = assignments[0];
        addLog(`📊 Latest assignment: ${latest.title}`);
        addLog(`📊 Has tables: ${latest.tables_data?.length || 0}`);
        addLog(`📊 Has charts: ${latest.charts_data?.length || 0}`);
        addLog(`📊 Has references: ${latest.references_data?.length || 0}`);
      }
      
    } catch (error) {
      addLog(`❌ Error during test: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Assignment Creation Test
          </h1>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">User Info</h3>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>User ID:</strong> {user?.id || "Not authenticated"}</p>
              <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button onClick={testAssignmentCreation}>
              🧪 Test Assignment Creation
            </Button>
            <Button onClick={clearLogs} variant="outline">
              🗑️ Clear Logs
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Test Logs</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p>No logs yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 