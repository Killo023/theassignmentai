"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<{ success: boolean; needsVerification?: boolean; message?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a consistent user ID from email
const generateUserId = (email: string): string => {
  // Create a simple hash of the email to ensure consistent user IDs
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `user-${Math.abs(hash)}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // In a real app, you would check with your backend
        const savedUser = localStorage.getItem('ai-assignment-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid email/password
      if (email && password) {
        const userId = generateUserId(email);
        const userData: User = {
          id: userId,
          email,
          firstName: 'Demo',
          lastName: 'User',
          isAuthenticated: true
        };
        
        setUser(userData);
        localStorage.setItem('ai-assignment-user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      // Simulate API call for signup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      const existingUser = localStorage.getItem(`user-${userData.email}`);
      if (existingUser) {
        return { 
          success: false, 
          message: 'An account with this email already exists. Please sign in instead.' 
        };
      }
      
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store user data temporarily (not authenticated yet)
      const tempUserData = {
        ...userData,
        verificationCode,
        verified: false,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(`temp-user-${userData.email}`, JSON.stringify(tempUserData));
      
      // Simulate sending verification email
      console.log(`📧 Verification email sent to ${userData.email}`);
      console.log(`🔑 Verification code: ${verificationCode}`); // In real app, this would be sent via email
      
      return { 
        success: true, 
        needsVerification: true,
        message: `Verification email sent to ${userData.email}. Please check your inbox and enter the 6-digit code.`
      };
    } catch (error) {
      console.error('Signup failed:', error);
      return { 
        success: false, 
        message: 'Signup failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get temporary user data
      const tempUserData = localStorage.getItem(`temp-user-${email}`);
      if (!tempUserData) {
        return false;
      }
      
      const userData = JSON.parse(tempUserData);
      
      // Verify code
      if (userData.verificationCode !== code) {
        return false;
      }
      
      // Create verified user
      const userId = generateUserId(email);
      const newUser: User = {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isAuthenticated: true
      };
      
      // Create trial subscription automatically
      const PaymentService = (await import('./payment-service')).default;
      const paymentService = PaymentService.getInstance();
      await paymentService.createFreeSubscription(newUser.id);
      
      // Store verified user
      setUser(newUser);
      localStorage.setItem('ai-assignment-user', JSON.stringify(newUser));
      localStorage.setItem(`user-${email}`, JSON.stringify(newUser));
      
      // Clean up temporary data
      localStorage.removeItem(`temp-user-${email}`);
      
      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async (email: string): Promise<boolean> => {
    try {
      // Get temporary user data
      const tempUserData = localStorage.getItem(`temp-user-${email}`);
      if (!tempUserData) {
        return false;
      }
      
      const userData = JSON.parse(tempUserData);
      
      // Generate new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update temporary user data with new code
      const updatedUserData = {
        ...userData,
        verificationCode,
        resendAt: new Date().toISOString()
      };
      
      localStorage.setItem(`temp-user-${email}`, JSON.stringify(updatedUserData));
      
      // Simulate sending new verification email
      console.log(`📧 New verification email sent to ${email}`);
      console.log(`🔑 New verification code: ${verificationCode}`); // In real app, this would be sent via email
      
      return true;
    } catch (error) {
      console.error('Resend verification failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai-assignment-user');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your backend to send reset email
      console.log('Password reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would verify current password and update
      console.log('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Password change failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerificationCode,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 