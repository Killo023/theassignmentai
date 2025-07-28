'use client';

export default function EnvTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6">Environment Variables Test</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Supabase Configuration</h2>
              <div className="space-y-2">
                <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
                <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">PayPal Configuration</h2>
              <div className="space-y-2">
                <p><strong>NEXT_PUBLIC_PAYPAL_CLIENT_ID:</strong> {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? 'Set (hidden)' : 'Not set'}</p>
                <p><strong>PAYPAL_SECRET:</strong> {process.env.PAYPAL_SECRET ? 'Set (hidden)' : 'Not set'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Other Configuration</h2>
              <div className="space-y-2">
                <p><strong>NEXT_PUBLIC_TOGETHER_API_KEY:</strong> {process.env.NEXT_PUBLIC_TOGETHER_API_KEY ? 'Set (hidden)' : 'Not set'}</p>
                <p><strong>NEXT_PUBLIC_BASE_URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <p className="text-sm text-blue-700">
              If the environment variables show "Not set", restart the development server with: <code>npm run dev</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 