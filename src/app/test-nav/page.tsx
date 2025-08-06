"use client";

import { useAuth } from "@/lib/auth-context";

export default function TestNavPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Navigation Test Page
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Authentication Status
              </h2>
              <p className="text-blue-700">
                {user ? (
                  <>
                    ✅ <strong>Logged In</strong><br />
                    User: {user.firstName} {user.lastName}<br />
                    Email: {user.email}<br />
                    Verified: {user.verified ? 'Yes' : 'No'}
                  </>
                ) : (
                  <>
                    ❌ <strong>Not Logged In</strong><br />
                    Please sign in to test dashboard navigation.
                  </>
                )}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                Navigation Links
              </h2>
              <div className="space-y-2">
                <a 
                  href="/" 
                  className="block text-green-700 hover:text-green-900 underline"
                >
                  → Home Page
                </a>
                <a 
                  href="/auth/login" 
                  className="block text-green-700 hover:text-green-900 underline"
                >
                  → Login Page
                </a>
                <a 
                  href="/auth/signup" 
                  className="block text-green-700 hover:text-green-900 underline"
                >
                  → Signup Page
                </a>
                {user && (
                  <a 
                    href="/dashboard" 
                    className="block text-green-700 hover:text-green-900 underline"
                  >
                    → Dashboard
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                Test Instructions
              </h2>
              <ol className="text-yellow-700 space-y-1 list-decimal list-inside">
                <li>Check if the navbar appears at the top of the page</li>
                <li>Try clicking on navigation links</li>
                <li>Test the mobile menu on smaller screens</li>
                <li>If logged in, test the user dropdown</li>
                <li>Test the logout functionality</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 