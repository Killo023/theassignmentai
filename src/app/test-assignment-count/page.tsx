"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";
import AssignmentService from "@/lib/assignment-service";

export default function TestAssignmentCount() {
  const { user } = useAuth();
  const [paymentService] = useState(() => PaymentService.getInstance());
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      addLog(`🧪 Testing assignment creation for user: ${user.id}`);
      
      // Check usage before
      const beforeUsage = await paymentService.getAssignmentUsage(user.id);
      addLog(`📊 Usage before assignment creation: ${JSON.stringify(beforeUsage)}`);
      
      // Create a test assignment
      const assignmentService = new AssignmentService(user.id);
      const testAssignment = {
        title: "Test Assignment",
        subject: "Test Subject",
        type: "essay",
        word_count: 500,
        content: "This is a test assignment content.",
        status: "completed" as const,
        requirements: "Test requirements"
      };
      
      addLog(`📝 Creating test assignment...`);
      await assignmentService.createAssignment(testAssignment);
      addLog(`✅ Test assignment created successfully`);
      
      // Check usage after
      const afterUsage = await paymentService.getAssignmentUsage(user.id);
      addLog(`📊 Usage after assignment creation: ${JSON.stringify(afterUsage)}`);
      
      // Check if count increased
      if (afterUsage.used > beforeUsage.used) {
        addLog(`✅ SUCCESS: Assignment count increased from ${beforeUsage.used} to ${afterUsage.used}`);
      } else {
        addLog(`❌ FAILURE: Assignment count did not increase (${beforeUsage.used} -> ${afterUsage.used})`);
      }
      
    } catch (error) {
      addLog(`❌ Error during assignment creation test: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user?.id) {
      addLog("❌ No user ID available");
      return;
    }

    try {
      addLog(`🔍 Checking subscription status for user: ${user.id}`);
      const subscription = await paymentService.checkSubscriptionStatus(user.id);
      addLog(`📝 Subscription status: ${JSON.stringify(subscription)}`);
    } catch (error) {
      addLog(`❌ Error checking subscription status: ${error}`);
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
            Assignment Count Test Tool
          </h1>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">User Info</h3>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>User ID:</strong> {user?.id || "Not authenticated"}</p>
              <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              onClick={testAssignmentCreation} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Testing..." : "🧪 Test Assignment Creation"}
            </Button>
            <Button onClick={checkSubscriptionStatus} variant="outline">
              🔍 Check Subscription
            </Button>
            <Button onClick={clearLogs} variant="outline">
              🗑️ Clear Logs
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Test Logs</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p>No logs yet. Click a test button to start...</p>
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