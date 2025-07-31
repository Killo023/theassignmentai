"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import PaymentService from "@/lib/payment-service";

export default function DebugAssignmentCount() {
  const { user } = useAuth();
  const [paymentService] = useState(() => PaymentService.getInstance());
  const [usage, setUsage] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const checkStatus = async () => {
    if (!user?.id) {
      addLog("❌ No user ID available");
      return;
    }

    try {
      addLog(`🔍 Checking status for user: ${user.id}`);
      
      const currentUsage = await paymentService.getAssignmentUsage(user.id);
      setUsage(currentUsage);
      addLog(`📊 Current usage: ${JSON.stringify(currentUsage)}`);
      
      const currentSubscription = await paymentService.checkSubscriptionStatus(user.id);
      setSubscription(currentSubscription);
      addLog(`📝 Current subscription: ${JSON.stringify(currentSubscription)}`);
      
    } catch (error) {
      addLog(`❌ Error checking status: ${error}`);
    }
  };

  const testIncrement = async () => {
    if (!user?.id) {
      addLog("❌ No user ID available for increment test");
      return;
    }

    setIsLoading(true);
    try {
      addLog(`🧪 Testing increment for user: ${user.id}`);
      
      // Get usage before
      const beforeUsage = await paymentService.getAssignmentUsage(user.id);
      addLog(`📊 Usage before increment: ${JSON.stringify(beforeUsage)}`);
      
      // Perform increment
      await paymentService.incrementAssignmentCount(user.id);
      addLog(`✅ Increment completed`);
      
      // Get usage after
      const afterUsage = await paymentService.getAssignmentUsage(user.id);
      addLog(`📊 Usage after increment: ${JSON.stringify(afterUsage)}`);
      
      setUsage(afterUsage);
      
    } catch (error) {
      addLog(`❌ Error during increment test: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCanCreate = async () => {
    if (!user?.id) {
      addLog("❌ No user ID available for canCreate test");
      return;
    }

    try {
      const canCreate = await paymentService.canCreateAssignment(user.id);
      addLog(`🤔 Can create assignment: ${canCreate}`);
    } catch (error) {
      addLog(`❌ Error checking canCreate: ${error}`);
    }
  };

  const testCreateSubscription = async () => {
    if (!user?.id) {
      addLog("❌ No user ID available for subscription creation test");
      return;
    }

    try {
      addLog(`🧪 Testing subscription creation for user: ${user.id}`);
      await paymentService.createFreeSubscription(user.id);
      addLog(`✅ Free subscription created for user: ${user.id}`);
      
      // Check status after creation
      await checkStatus();
    } catch (error) {
      addLog(`❌ Error creating subscription: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    if (user?.id) {
      checkStatus();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Assignment Count Debug Tool
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">User Info</h3>
              <div className="bg-gray-100 p-3 rounded">
                <p><strong>User ID:</strong> {user?.id || "Not authenticated"}</p>
                <p><strong>Email:</strong> {user?.email || "N/A"}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Status</h3>
              <div className="bg-gray-100 p-3 rounded">
                {usage && (
                  <>
                    <p><strong>Used:</strong> {usage.used}</p>
                    <p><strong>Limit:</strong> {usage.limit}</p>
                    <p><strong>Remaining:</strong> {usage.remaining}</p>
                  </>
                )}
                {subscription && (
                  <p><strong>Plan:</strong> {subscription.planId}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={checkStatus}>
              🔍 Check Status
            </Button>
            <Button 
              onClick={testIncrement} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? "Testing..." : "🧪 Test Increment"}
            </Button>
                         <Button onClick={testCanCreate} variant="outline">
               🤔 Test Can Create
             </Button>
             <Button onClick={testCreateSubscription} variant="outline">
               📝 Create Subscription
             </Button>
             <Button onClick={clearLogs} variant="outline">
               🗑️ Clear Logs
             </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Debug Logs</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
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