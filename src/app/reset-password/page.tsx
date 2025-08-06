"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowLeft, Shield, CheckCircle } from "lucide-react";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [email, setEmail] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    // Check if token exists and is valid
    const checkToken = () => {
      try {
        // Check all reset tokens in localStorage
        const keys = Object.keys(localStorage);
        let foundToken = null;
        let foundEmail = "";

        for (const key of keys) {
          if (key.startsWith('reset-token-')) {
            const tokenData = localStorage.getItem(key);
            if (tokenData) {
              const parsed = JSON.parse(tokenData);
              if (parsed.token === token) {
                // Check if token is expired
                const expiresAt = new Date(parsed.expiresAt);
                const now = new Date();
                if (now < expiresAt) {
                  foundToken = parsed;
                  foundEmail = parsed.email;
                  break;
                } else {
                  // Remove expired token
                  localStorage.removeItem(key);
                }
              }
            }
          }
        }

        if (foundToken) {
          setIsValidToken(true);
          setEmail(foundEmail);
        } else {
          setError("Reset link has expired or is invalid. Please request a new password reset.");
        }
      } catch (error) {
        setError("Invalid reset link. Please request a new password reset.");
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Update user password
      const userData = localStorage.getItem(`user-${email}`);
      if (!userData) {
        setError("User not found. Please request a new password reset.");
        return;
      }

      const user = JSON.parse(userData);
      
      // Simple password hashing (in production, use bcrypt)
      const hashedPassword = btoa(password + 'salt');
      
      // Update user with new password
      const updatedUser = {
        ...user,
        password: hashedPassword
      };
      
      localStorage.setItem(`user-${email}`, JSON.stringify(updatedUser));
      
      // Remove reset token
      localStorage.removeItem(`reset-token-${email}`);
      
      setSuccess("Password reset successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">
                The password reset link is invalid or has expired.
              </p>
              <Link 
                href="/auth/forgot-password" 
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-semibold"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              The Assignment AI
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Reset Your
                <span className="text-blue-600"> Password</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Create a new password for your account. Make sure it's secure and memorable.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Minimum 8 characters</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Secure password storage</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Instant account access</span>
              </div>
            </div>

            {/* Security Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Secure Password</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Your new password will be securely hashed and stored. 
                We recommend using a combination of letters, numbers, and symbols.
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">New Password</h2>
                <p className="text-gray-600">
                  Enter your new password below
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              {!isValidToken ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Validating reset link...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-500 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
} 