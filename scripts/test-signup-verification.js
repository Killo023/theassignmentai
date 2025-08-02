#!/usr/bin/env node

/**
 * Test Script for Signup Verification and PayPal Payments
 * 
 * This script helps you test the current functionality and identify issues.
 * Run this script to check your configuration and test the signup process.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Signup Verification & PayPal Configuration\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log('📁 Environment Configuration:');
console.log(`   .env.local exists: ${envExists ? '✅ Yes' : '❌ No'}`);

if (!envExists) {
  console.log('\n⚠️  .env.local not found!');
  console.log('   Run: cp env.template .env.local');
  console.log('   Then configure your environment variables.\n');
} else {
  console.log('   ✅ Environment file found');
}

// Check environment variables
let envContent = '';
if (envExists) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

const checkEnvVar = (name, description) => {
  const hasVar = envContent.includes(name);
  const isConfigured = hasVar && !envContent.includes(`${name}=your_`) && !envContent.includes(`${name}=ml_your_`);
  
  console.log(`   ${name}: ${isConfigured ? '✅ Configured' : '❌ Not configured'}`);
  if (!isConfigured && hasVar) {
    console.log(`      ⚠️  ${description}`);
  }
};

console.log('\n🔧 Environment Variables Status:');
checkEnvVar('MAILERLITE_API_KEY', 'Email verification will be simulated');
checkEnvVar('NEXT_PUBLIC_PAYPAL_CLIENT_ID', 'PayPal payments will be simulated');
checkEnvVar('PAYPAL_SECRET', 'PayPal payments will be simulated');
checkEnvVar('NEXT_PUBLIC_TOGETHER_API_KEY', 'AI features may not work');

console.log('\n🎯 Current System Status:');

// Email Service Status
const emailConfigured = envContent.includes('MAILERLITE_API_KEY=') && 
                       !envContent.includes('MAILERLITE_API_KEY=your_') &&
                       !envContent.includes('MAILERLITE_API_KEY=ml_your_');

if (emailConfigured) {
  console.log('   📧 Email Service: ✅ Configured (real emails will be sent)');
} else {
  console.log('   📧 Email Service: 🎭 Demo Mode (emails simulated in console)');
}

// PayPal Service Status
const paypalConfigured = envContent.includes('NEXT_PUBLIC_PAYPAL_CLIENT_ID=') && 
                        !envContent.includes('NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_') &&
                        envContent.includes('PAYPAL_SECRET=') &&
                        !envContent.includes('PAYPAL_SECRET=your_');

if (paypalConfigured) {
  console.log('   💳 PayPal Service: ✅ Configured (real payments will be processed)');
} else {
  console.log('   💳 PayPal Service: 🎭 Demo Mode (payments simulated)');
}

console.log('\n📋 Testing Instructions:');

if (!emailConfigured) {
  console.log('\n📧 Email Verification Testing:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Go to http://localhost:3000/auth/signup');
  console.log('   3. Sign up with a new email address');
  console.log('   4. Check browser console for verification code');
  console.log('   5. Enter the verification code to complete signup');
  console.log('   6. Look for: "📧 Simulated email sent: { type: \'verification\', data: {...} }"');
}

if (!paypalConfigured) {
  console.log('\n💳 PayPal Payment Testing:');
  console.log('   1. After signup, try to upgrade your subscription');
  console.log('   2. Check browser console for payment simulation');
  console.log('   3. Look for: "🎭 PayPal not configured, simulating payment success"');
  console.log('   4. Verify subscription status updates');
}

console.log('\n🔧 To Enable Real Services:');

if (!emailConfigured) {
  console.log('\n📧 For Real Email Sending:');
  console.log('   1. Go to https://app.mailerlite.com/');
  console.log('   2. Create account and get API key');
  console.log('   3. Add to .env.local: MAILERLITE_API_KEY=ml_your_actual_key');
}

if (!paypalConfigured) {
  console.log('\n💳 For Real PayPal Payments:');
  console.log('   1. Go to https://developer.paypal.com/');
  console.log('   2. Create app and get credentials');
  console.log('   3. Add to .env.local:');
  console.log('      NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id');
  console.log('      PAYPAL_SECRET=your_secret');
}

console.log('\n✅ The system is designed to work in demo mode for testing!');
console.log('   All functionality can be tested without configuring external services.');
console.log('   Check browser console for detailed logs and simulation messages.\n'); 