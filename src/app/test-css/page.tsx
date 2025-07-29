export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
          CSS Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tailwind CSS Working
            </h2>
            <p className="text-gray-600 mb-4">
              If you can see this styled card with proper colors, shadows, and typography,
              then Tailwind CSS is working correctly.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Test Button
            </button>
          </div>

          {/* Test Card 2 */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-2xl font-semibold mb-4">
              Gradient Background
            </h2>
            <p className="mb-4 opacity-90">
              This card has a gradient background to test if CSS gradients are working.
            </p>
            <button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors">
              White Button
            </button>
          </div>

          {/* Test Card 3 */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Color Test
            </h2>
            <p className="text-green-700 mb-4">
              This card tests various color classes and border styles.
            </p>
            <div className="space-y-2">
              <div className="w-full bg-green-200 h-2 rounded-full"></div>
              <div className="w-3/4 bg-green-300 h-2 rounded-full"></div>
              <div className="w-1/2 bg-green-400 h-2 rounded-full"></div>
            </div>
          </div>

          {/* Test Card 4 */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Dark Theme
            </h2>
            <p className="text-gray-300 mb-4">
              Testing dark background with light text and proper contrast.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Blue Button
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">CSS Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-600">Tailwind CSS</span>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-600">Colors</span>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-600">Typography</span>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-600">Responsive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 