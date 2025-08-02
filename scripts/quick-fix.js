#!/usr/bin/env node

/**
 * Quick Fix Script for Signup Verification & PayPal Issues
 * 
 * This script helps you quickly set up and test the signup verification
 * and PayPal payment functionality.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Quick Fix for Signup Verification & PayPal Issues\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📁 Creating .env.local file...');
  try {
    execSync('copy env.template .env.local', { stdio: 'inherit' });
    console.log('✅ .env.local created successfully');
  } catch (error) {
    console.log('❌ Failed to create .env.local');
    console.log('   Please run: copy env.template .env.local');
    process.exit(1);
  }
} else {
  console.log('✅ .env.local already exists');
}

// Read current environment
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

console.log('\n🎯 Current Status:');

// Check email service
const emailConfigured = envContent.includes('MAILERLITE_API_KEY=') && 
                       !envContent.includes('MAILERLITE_API_KEY=your_') &&
                       !envContent.includes('MAILERLITE_API_KEY=ml_your_');

if (emailConfigured) {
  console.log('   📧 Email Service: ✅ Configured');
} else {
  console.log('   📧 Email Service: 🎭 Demo Mode (emails simulated)');
}

// Check PayPal service
const paypalConfigured = envContent.includes('NEXT_PUBLIC_PAYPAL_CLIENT_ID=') && 
                        !envContent.includes('NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_') &&
                        envContent.includes('PAYPAL_SECRET=') &&
                        !envContent.includes('PAYPAL_SECRET=your_');

if (paypalConfigured) {
  console.log('   💳 PayPal Service: ✅ Configured');
} else {
  console.log('   💳 PayPal Service: 🎭 Demo Mode (payments simulated)');
}

console.log('\n🔧 Quick Test Instructions:');

console.log('\n📧 Email Verification Test:');
console.log('   1. Start the server: npm run dev');
console.log('   2. Open: http://localhost:3000/auth/signup');
console.log('   3. Sign up with a new email');
console.log('   4. Check browser console for verification code');
console.log('   5. Enter the code to complete signup');
console.log('   6. Look for: "📧 Simulated email sent: { type: \'verification\', data: {...} }"');

console.log('\n💳 PayPal Payment Test:');
console.log('   1. After signup, try upgrading subscription');
console.log('   2. Check console for: "🎭 PayPal not configured, simulating payment success"');
console.log('   3. Verify subscription status updates');

console.log('\n🎭 Demo Mode Benefits:');
console.log('   ✅ All functionality works for testing');
console.log('   ✅ No real emails sent (simulated in console)');
console.log('   ✅ No real payments charged (simulated)');
console.log('   ✅ Full testing capabilities');

console.log('\n🔧 To Enable Real Services (Optional):');

if (!emailConfigured) {
  console.log('\n📧 For Real Email Sending:');
  console.log('   1. Go to https://app.mailerlite.com/');
  console.log('   2. Create account and get API key');
  console.log('   3. Edit .env.local and replace:');
  console.log('      MAILERLITE_API_KEY=your_actual_api_key_here');
  console.log('   4. Restart the server');
}

if (!paypalConfigured) {
  console.log('\n💳 For Real PayPal Payments:');
  console.log('   1. Go to https://developer.paypal.com/');
  console.log('   2. Create app and get credentials');
  console.log('   3. Edit .env.local and replace:');
  console.log('      NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_client_id');
  console.log('      PAYPAL_SECRET=your_actual_secret');
  console.log('   4. Restart the server');
}

console.log('\n🚀 Ready to Test!');
console.log('   The system works in demo mode for development and testing.');
console.log('   All functionality can be tested without external services.\n');

// Ask if user wants to start the server
console.log('Would you like to start the development server now? (y/n)');
process.stdin.once('data', (data) => {
  const answer = data.toString().trim().toLowerCase();
  if (answer === 'y' || answer === 'yes') {
    console.log('\n🚀 Starting development server...');
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      console.log('❌ Failed to start server');
      console.log('   Please run: npm run dev');
    }
  } else {
    console.log('\n✅ Setup complete! Run "npm run dev" when ready to test.');
  }
}); 