#!/usr/bin/env node

/**
 * Test Email Service Directly
 * 
 * This script tests the email service to see if it's working.
 */

// Mock the environment for testing
process.env.MAILERLITE_API_KEY = 'test_key';

console.log('📧 Testing Email Service Directly\n');

// Import the email service
const MailerLiteService = require('../src/lib/mailerlite-service').default;

async function testEmailService() {
  try {
    const emailService = MailerLiteService.getInstance();
    
    console.log('✅ Email service initialized');
    
    // Test verification email
    const result = await emailService.sendVerificationEmail({
      to: 'test@example.com',
      code: '123456',
      firstName: 'Test'
    });
    
    console.log('📧 Email service test result:', result);
    
    if (result) {
      console.log('✅ Email service is working');
    } else {
      console.log('❌ Email service failed');
    }
    
  } catch (error) {
    console.error('❌ Email service error:', error);
  }
}

testEmailService(); 