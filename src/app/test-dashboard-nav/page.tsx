"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TestDashboardNav() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const runTests = async () => {
      const results: any = {};

      // Test 1: Check if user is authenticated
      results.auth = {
        user: !!user,
        isLoading,
        userData: user
      };

      // Test 2: Check if dashboard pages exist
      const pages = [
        '/dashboard',
        '/dashboard/new',
        '/dashboard/assignments',
        '/dashboard/calendar',
        '/dashboard/history',
        '/dashboard/favorites',
        '/dashboard/settings'
      ];

      results.pages = {};
      for (const page of pages) {
        try {
          const response = await fetch(page, { method: 'HEAD' });
          results.pages[page] = response.ok;
        } catch (error) {
          results.pages[page] = false;
        }
      }

      // Test 3: Check localStorage
      results.localStorage = {
        hasUser: !!localStorage.getItem('ai-assignment-user'),
        userData: localStorage.getItem('ai-assignment-user')
      };

      setTestResults(results);
    };

    runTests();
  }, [user, isLoading]);

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const simulateLogin = () => {
    const testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isAuthenticated: true
    };
    localStorage.setItem('ai-assignment-user', JSON.stringify(testUser));
    window.location.reload();
  };

  const clearAuth = () => {
    localStorage.removeItem('ai-assignment-user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Navigation Test</h1>

        {/* Quick Actions */}
        <div className="mb-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={navigateToDashboard}>
              Navigate to Dashboard
            </Button>
            <Button onClick={simulateLogin} variant="outline">
              Simulate Login
            </Button>
            <Button onClick={clearAuth} variant="outline">
              Clear Auth
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Direct Link to Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults.auth, null, 2)}
            </pre>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Page Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.pages && Object.entries(testResults.pages).map(([page, available]) => (
                <div key={page} className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm font-mono">{page}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {available ? 'Available' : 'Not Found'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults.localStorage, null, 2)}
            </pre>
          </div>

          {/* Navigation Links Test */}
          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Navigation Links Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard" className="p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                Dashboard Home
              </Link>
              <Link href="/dashboard/new" className="p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                New Assignment
              </Link>
              <Link href="/dashboard/assignments" className="p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                My Assignments
              </Link>
              <Link href="/dashboard/calendar" className="p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                Calendar
              </Link>
              <Link href="/dashboard/history" className="p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                History
              </Link>
              <Link href="/dashboard/favorites" className="p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                Favorites
              </Link>
              <Link href="/dashboard/settings" className="p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 