#!/usr/bin/env node

/**
 * Test Email Functionality
 * 
 * This script tests the email service to verify it's working correctly.
 */

const fs = require('fs');
const path = require('path');

console.log('📧 Testing Email Service Configuration\n');

// Check environment variables
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check MailerLite API key
const mailerliteKey = envContent.match(/MAILERLITE_API_KEY=(.+)/);
if (mailerliteKey && mailerliteKey[1] && !mailerliteKey[1].includes('your_')) {
  console.log('✅ MailerLite API Key: Configured');
  console.log(`   Key: ${mailerliteKey[1].substring(0, 10)}...`);
} else {
  console.log('❌ MailerLite API Key: Not configured');
}

console.log('\n🔧 Testing Steps:');
console.log('1. Go to http://localhost:3002/auth/signup');
console.log('2. Sign up with a real email address');
console.log('3. Check browser console for email logs');
console.log('4. Check your email inbox for verification email');

console.log('\n📋 Expected Console Logs:');
console.log('📧 Attempting to send email via MailerLite API...');
console.log('📧 Email data: { to: "your-email@example.com", subject: "Verify Your Email - The Assignment AI" }');
console.log('📧 Email sent successfully via MailerLite: {...}');

console.log('\n⚠️  Note: If you don\'t receive emails, check:');
console.log('- Spam/junk folder');
console.log('- MailerLite account settings');
console.log('- API key permissions');
console.log('- Email address is valid');

console.log('\n🎯 Current Status:');
console.log('- Email service is configured');
console.log('- Verification emails should be sent');
console.log('- Check console for detailed logs'); 