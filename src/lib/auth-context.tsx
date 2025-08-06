"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import EmailService from './email-service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAuthenticated: boolean;
  verified: boolean;
  subscription?: {
    status: string;
    plan: string;
    expiresAt?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; needsVerification?: boolean; message?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; message?: string }>;
  resendVerificationCode: (email: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a consistent user ID from email
const generateUserId = (email: string): string => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `user-${Math.abs(hash)}`;
};

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = (password: string): string => {
  return btoa(password + 'salt'); // Simple base64 encoding with salt
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('ai-assignment-user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Check if user is still valid (not expired)
          if (userData.verified && userData.isAuthenticated) {
            setUser(userData);
          } else {
            // Clear invalid session
            localStorage.removeItem('ai-assignment-user');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('ai-assignment-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        return { success: false, message: 'Please enter both email and password' };
      }

      // Check if user exists
      const existingUser = localStorage.getItem(`user-${email}`);
      if (!existingUser) {
        return { success: false, message: 'No account found with this email address. Please sign up first.' };
      }

      const userData = JSON.parse(existingUser);
      
      // Verify password
      if (!verifyPassword(password, userData.password)) {
        return { success: false, message: 'Invalid password. Please try again.' };
      }

      // Check if email is verified
      if (!userData.verified) {
        return { success: false, message: 'Please verify your email address before signing in. Check your inbox for the verification code.' };
      }

      // Create authenticated user object
      const authenticatedUser: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isAuthenticated: true,
        verified: true,
        subscription: userData.subscription
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('ai-assignment-user', JSON.stringify(authenticatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any): Promise<{ success: boolean; needsVerification?: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return { success: false, message: 'Please fill in all required fields' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Validate password strength
      if (userData.password.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters long' };
      }

      // Check if email already exists
      const existingUser = localStorage.getItem(`user-${userData.email}`);
      if (existingUser) {
        const parsedUser = JSON.parse(existingUser);
        if (parsedUser.verified) {
          return { success: false, message: 'An account with this email already exists. Please sign in instead.' };
        } else {
          // User exists but not verified, allow re-signup
          localStorage.removeItem(`temp-user-${userData.email}`);
        }
      }
      
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Hash password
      const hashedPassword = hashPassword(userData.password);
      
      // Store user data temporarily
      const tempUserData = {
        ...userData,
        id: generateUserId(userData.email),
        password: hashedPassword,
        verificationCode,
        verified: false,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(`temp-user-${userData.email}`, JSON.stringify(tempUserData));
      
      // Send verification email
      const emailService = EmailService.getInstance();
      const emailSent = await emailService.sendVerificationEmail({
        to: userData.email,
        code: verificationCode,
        firstName: userData.firstName
      });
      
      if (!emailSent) {
        return { success: false, message: 'Failed to send verification email. Please try again.' };
      }
      
      return { 
        success: true, 
        needsVerification: true,
        message: `Verification email sent to ${userData.email}. Please check your inbox and enter the 6-digit code.`
      };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, message: 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      if (!email || !code || code.length !== 6) {
        return { success: false, message: 'Please enter a valid 6-digit verification code' };
      }
      
      // Get temporary user data
      const tempUserData = localStorage.getItem(`temp-user-${email}`);
      if (!tempUserData) {
        return { success: false, message: 'No pending verification found for this email. Please sign up again.' };
      }
      
      const userData = JSON.parse(tempUserData);
      
      // Check if code is expired (10 minutes)
      const createdAt = new Date(userData.createdAt);
      const now = new Date();
      const timeDiff = now.getTime() - createdAt.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff > 10) {
        localStorage.removeItem(`temp-user-${email}`);
        return { success: false, message: 'Verification code has expired. Please request a new one.' };
      }
      
      // Verify code
      if (userData.verificationCode !== code) {
        return { success: false, message: 'Invalid verification code. Please try again.' };
      }
      
      // Create verified user
      const newUser: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isAuthenticated: true,
        verified: true,
        subscription: {
          status: 'trial',
          plan: 'free',
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
        }
      };
      
      // Store verified user
      setUser(newUser);
      localStorage.setItem('ai-assignment-user', JSON.stringify(newUser));
      localStorage.setItem(`user-${email}`, JSON.stringify(newUser));
      
      // Clean up temporary data
      localStorage.removeItem(`temp-user-${email}`);
      
      // Send welcome email
      const emailService = EmailService.getInstance();
      await emailService.sendWelcomeEmail({
        to: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      
      return { success: true, message: 'Email verified successfully!' };
    } catch (error) {
      console.error('Email verification failed:', error);
      return { success: false, message: 'Verification failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Get temporary user data
      const tempUserData = localStorage.getItem(`temp-user-${email}`);
      if (!tempUserData) {
        return { success: false, message: 'No pending verification found for this email. Please sign up again.' };
      }
      
      const userData = JSON.parse(tempUserData);
      
      // Generate new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update temporary user data with new code
      const updatedUserData = {
        ...userData,
        verificationCode,
        createdAt: new Date().toISOString() // Reset expiration
      };
      
      localStorage.setItem(`temp-user-${email}`, JSON.stringify(updatedUserData));
      
      // Send new verification email
      const emailService = EmailService.getInstance();
      const emailSent = await emailService.sendVerificationEmail({
        to: email,
        code: verificationCode,
        firstName: userData.firstName
      });
      
      if (!emailSent) {
        return { success: false, message: 'Failed to send verification email. Please try again.' };
      }
      
      return { success: true, message: 'New verification code sent!' };
    } catch (error) {
      console.error('Resend verification failed:', error);
      return { success: false, message: 'Failed to resend code. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai-assignment-user');
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      if (!email) {
        return { success: false, message: 'Please enter your email address' };
      }
      
      // Check if user exists
      const existingUser = localStorage.getItem(`user-${email}`);
      if (!existingUser) {
        return { success: false, message: 'No account found with this email address.' };
      }
      
      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://theassignmentai.com'}/reset-password?token=${resetToken}`;
      
      // Store reset token temporarily
      localStorage.setItem(`reset-token-${email}`, JSON.stringify({
        token: resetToken,
        email,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      }));
      
      // Send password reset email
      const emailService = EmailService.getInstance();
      const emailSent = await emailService.sendPasswordResetEmail({
        to: email,
        resetLink,
        firstName: 'User' // In production, get from user data
      });
      
      if (!emailSent) {
        return { success: false, message: 'Failed to send password reset email. Please try again.' };
      }
      
      return { success: true, message: 'Password reset email sent. Please check your inbox.' };
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, message: 'Password reset failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      if (!user) {
        return { success: false, message: 'You must be logged in to change your password.' };
      }
      
      if (!currentPassword || !newPassword) {
        return { success: false, message: 'Please enter both current and new passwords.' };
      }
      
      if (newPassword.length < 8) {
        return { success: false, message: 'New password must be at least 8 characters long.' };
      }
      
      // Get user data
      const userData = localStorage.getItem(`user-${user.email}`);
      if (!userData) {
        return { success: false, message: 'User data not found.' };
      }
      
      const storedUser = JSON.parse(userData);
      
      // Verify current password
      if (!verifyPassword(currentPassword, storedUser.password)) {
        return { success: false, message: 'Current password is incorrect.' };
      }
      
      // Update password
      const hashedNewPassword = hashPassword(newPassword);
      const updatedUser = {
        ...storedUser,
        password: hashedNewPassword
      };
      
      localStorage.setItem(`user-${user.email}`, JSON.stringify(updatedUser));
      
      return { success: true, message: 'Password changed successfully!' };
    } catch (error) {
      console.error('Password change failed:', error);
      return { success: false, message: 'Password change failed. Please try again.' };
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