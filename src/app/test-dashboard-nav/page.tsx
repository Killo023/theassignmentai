"use client";

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TestDashboardNav() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Navigation Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Auth Status:</h2>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>User: {user ? 'Logged in' : 'Not logged in'}</p>
          {user && (
            <div className="mt-2">
              <p>User ID: {user.id}</p>
              <p>Email: {user.email}</p>
              <p>Name: {user.firstName} {user.lastName}</p>
              <p>Authenticated: {user.isAuthenticated ? 'Yes' : 'No'}</p>
              <p>Verified: {user.verified ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Navigation Test:</h2>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard (Link)</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="/dashboard">Go to Dashboard (a tag)</a>
            </Button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Go to Dashboard (window.location)
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Local Storage Check:</h2>
          <button 
            onClick={() => {
              const savedUser = localStorage.getItem('ai-assignment-user');
              console.log('Saved user:', savedUser);
              alert('Check console for saved user data');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check LocalStorage
          </button>
        </div>
      </div>
    </div>
  );
}