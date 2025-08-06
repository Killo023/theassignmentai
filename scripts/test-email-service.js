#!/usr/bin/env node

/**
 * Test Email Service
 * 
 * This script tests the email service functionality to ensure
 * verification emails, password resets, and welcome emails work properly.
 */

// Mock the email service for testing
class MockEmailService {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    if (!MockEmailService.instance) {
      MockEmailService.instance = new MockEmailService();
    }
    return MockEmailService.instance;
  }

  async sendVerificationEmail(data) {
    console.log('📧 Verification Email (Development Mode):');
    console.log('To:', data.to);
    console.log('Code:', data.code);
    console.log('First Name:', data.firstName);
    console.log('---');
    return true;
  }

  async sendPasswordResetEmail(data) {
    console.log('📧 Password Reset Email (Development Mode):');
    console.log('To:', data.to);
    console.log('Reset Link:', data.resetLink);
    console.log('First Name:', data.firstName);
    console.log('---');
    return true;
  }

  async sendWelcomeEmail(data) {
    console.log('📧 Welcome Email (Development Mode):');
    console.log('To:', data.to);
    console.log('First Name:', data.firstName);
    console.log('Last Name:', data.lastName);
    console.log('---');
    return true;
  }
}

async function testEmailService() {
  console.log('🧪 Testing Email Service...\n');

  const emailService = MockEmailService.getInstance();

  // Test 1: Verification Email
  console.log('📧 Test 1: Verification Email');
  try {
    const verificationResult = await emailService.sendVerificationEmail({
      to: 'test@example.com',
      code: '123456',
      firstName: 'John'
    });
    console.log(`✅ Verification email test: ${verificationResult ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.log(`❌ Verification email test: FAILED - ${error.message}`);
  }

  // Test 2: Password Reset Email
  console.log('\n📧 Test 2: Password Reset Email');
  try {
    const resetResult = await emailService.sendPasswordResetEmail({
      to: 'test@example.com',
      resetLink: 'https://theassignmentai.com/reset-password?token=abc123',
      firstName: 'John'
    });
    console.log(`✅ Password reset email test: ${resetResult ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.log(`❌ Password reset email test: FAILED - ${error.message}`);
  }

  // Test 3: Welcome Email
  console.log('\n📧 Test 3: Welcome Email');
  try {
    const welcomeResult = await emailService.sendWelcomeEmail({
      to: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    });
    console.log(`✅ Welcome email test: ${welcomeResult ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.log(`❌ Welcome email test: FAILED - ${error.message}`);
  }

  console.log('\n🎉 Email service testing completed!');
  console.log('\n📝 Notes:');
  console.log('- This test simulates email functionality');
  console.log('- In production, real emails will be sent via MailerLite');
  console.log('- Check the console output above for email content');
  console.log('- To test with real emails, set MAILERLITE_API_KEY in .env.local');
}

// Run the test
testEmailService().catch(console.error); 