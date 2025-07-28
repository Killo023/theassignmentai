'use client';

import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function TestLogout() {
  const { user, login, logout } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');

  const handleLogin = async () => {
    const success = await login(testEmail, testPassword);
    if (success) {
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed');
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    logout();
    console.log('✅ Logout completed');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Logout Function
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Logged in:</strong> Yes</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            </div>
          ) : (
            <p className="text-gray-500">Not logged in</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          
          {!user ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email:</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password:</label>
                <input
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Test Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Test Logout
              </button>
              
              <div className="text-sm text-gray-600">
                <p><strong>Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Click "Test Logout"</li>
                  <li>Check the console (F12) for logout messages</li>
                  <li>Verify the user status changes to "Not logged in"</li>
                  <li>Try refreshing the page - you should still be logged out</li>
                  <li>Check localStorage - "ai-assignment-user" should be removed</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>localStorage check:</strong></p>
            <pre className="bg-gray-100 p-2 rounded text-xs">
              {typeof window !== 'undefined' ? 
                localStorage.getItem('ai-assignment-user') || 'null' : 
                'Server side - no localStorage'
              }
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 