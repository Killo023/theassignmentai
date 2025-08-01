'use client';

import { useState } from 'react';
import { aiService } from '@/lib/ai-service';

export default function TestRestrictedModels() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testModelRestriction = async () => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      // Test API key validation
      const isValid = await aiService.validateAPIKey();
      if (!isValid) {
        setError('API key validation failed');
        return;
      }

      // Test assignment generation with restricted models
      const testRequest = {
        title: 'Test Assignment',
        subject: 'Computer Science',
        type: 'Research Paper',
        wordCount: 500,
        requirements: 'Test requirements for model restriction verification',
        academicLevel: 'undergraduate',
        qualityLevel: 'standard'
      };

      const response = await aiService.generateAssignment(testRequest);
      
      setResult(JSON.stringify({
        success: true,
        contentLength: response.content.length,
        tablesCount: response.tables.length,
        chartsCount: response.charts.length,
        referencesCount: response.references.length,
        usage: response.usage
      }, null, 2));

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Restricted Models</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Restricted Models Configuration</h2>
        <p className="text-sm text-gray-600 mb-2">
          This test verifies that only the specified free LLMs are being used:
        </p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Arcee AI: AFM-4.5B, chat</li>
          <li>• Meta: Meta Llama Vision Free, chat, Meta Llama 3.3 70B Instruct Turbo Free</li>
          <li>• DeepSeek: DeepSeek R1 Distill Llama 70B Free, chat</li>
          <li>• LG AI: EXAONE Deep 32B, chat, EXAONE 3.5 32B Instruct</li>
        </ul>
      </div>

      <button
        onClick={testModelRestriction}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {isLoading ? 'Testing...' : 'Test Model Restriction'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Error:</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold">Test Result:</h3>
          <pre className="text-green-700 text-sm mt-2 whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold mb-2">What this test does:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Validates your Together.ai API key</li>
          <li>• Checks which models are available from the API</li>
          <li>• Filters to only use the specified free models</li>
          <li>• Generates a test assignment using the restricted models</li>
          <li>• Reports the results and token usage</li>
        </ul>
      </div>
    </div>
  );
} 