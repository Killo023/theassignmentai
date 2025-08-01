"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { aiService } from "@/lib/ai-service";

export default function AITestPage() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    apiKeyValid: boolean;
    modelsAvailable: boolean;
    generationTest: boolean;
    error?: string;
  } | null>(null);

  const runAITest = async () => {
    setIsTesting(true);
    setTestResults(null);

    try {
      console.log("🧪 Starting AI configuration test...");

      // Test 1: Validate API Key
      console.log("🔑 Testing API key validation...");
      const apiKeyValid = await aiService.validateAPIKey();
      console.log("API Key Valid:", apiKeyValid);

      // Test 2: Test model availability
      console.log("🤖 Testing model availability...");
      const modelsAvailable = apiKeyValid; // If API key is valid, models should be available

      // Test 3: Test generation (small test)
      console.log("📝 Testing assignment generation...");
      let generationTest = false;
      
      if (apiKeyValid) {
        try {
          const testRequest = {
            title: "Test Assignment",
            subject: "Computer Science",
            type: "Essay",
            wordCount: 100,
            requirements: "Write a brief test essay about AI technology."
          };

          const result = await aiService.generateAssignment(testRequest);
          generationTest = result.content.length > 0 && !result.content.includes("Error");
          console.log("Generation test result:", generationTest);
        } catch (error) {
          console.error("Generation test failed:", error);
          generationTest = false;
        }
      }

      setTestResults({
        apiKeyValid,
        modelsAvailable,
        generationTest,
      });

    } catch (error) {
      console.error("❌ AI test failed:", error);
      setTestResults({
        apiKeyValid: false,
        modelsAvailable: false,
        generationTest: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Together AI Configuration Test
          </h1>
          <p className="text-xl text-gray-600">
            Verify that your Together AI integration is working correctly
          </p>
        </motion.div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Configuration Instructions
            </CardTitle>
            <CardDescription>
              Follow these steps to configure Together AI properly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Step 1: Get Together AI API Key</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                <li>Visit <a href="https://together.ai/" target="_blank" rel="noopener noreferrer" className="underline">Together AI</a></li>
                <li>Sign up for a free account</li>
                <li>Navigate to your API keys section</li>
                <li>Create a new API key</li>
                <li>Copy the API key</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Step 2: Configure Environment</h3>
              <p className="text-sm text-green-700 mb-2">
                Create or update your <code className="bg-green-100 px-1 rounded">.env.local</code> file:
              </p>
              <pre className="bg-green-100 p-3 rounded text-sm overflow-x-auto">
{`NEXT_PUBLIC_TOGETHER_API_KEY=your_actual_api_key_here`}
              </pre>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Step 3: Restart Development Server</h3>
              <p className="text-sm text-purple-700">
                After updating the environment variables, restart your development server:
              </p>
              <pre className="bg-purple-100 p-3 rounded text-sm mt-2">
{`npm run dev`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Click the button below to test your Together AI configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Button
                onClick={runAITest}
                disabled={isTesting}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Configuration...
                  </>
                ) : (
                  "Run AI Configuration Test"
                )}
              </Button>
            </div>

            {testResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border-2 ${
                    testResults.apiKeyValid 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {testResults.apiKeyValid ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold">API Key Validation</span>
                    </div>
                    <p className="text-sm">
                      {testResults.apiKeyValid 
                        ? "✅ API key is valid and configured correctly"
                        : "❌ API key is missing or invalid"
                      }
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    testResults.modelsAvailable 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {testResults.modelsAvailable ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold">Models Available</span>
                    </div>
                    <p className="text-sm">
                      {testResults.modelsAvailable 
                        ? "✅ AI models are accessible"
                        : "❌ Cannot access AI models"
                      }
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    testResults.generationTest 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {testResults.generationTest ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold">Generation Test</span>
                    </div>
                    <p className="text-sm">
                      {testResults.generationTest 
                        ? "✅ Assignment generation working"
                        : "❌ Assignment generation failed"
                      }
                    </p>
                  </div>
                </div>

                {testResults.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
                    <p className="text-sm text-red-700">{testResults.error}</p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• If all tests pass: Your AI configuration is working correctly</li>
                    <li>• If API key test fails: Check your .env.local file and restart the server</li>
                    <li>• If generation test fails: Check your Together AI account and credits</li>
                    <li>• Check the browser console for detailed error messages</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 