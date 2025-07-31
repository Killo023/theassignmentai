# Quick PayPal Setup Guide

## 🚀 Quick Setup (Demo Mode)

If you want to test the subscription system without PayPal:

1. **Use Demo Mode**: The system will automatically fall back to demo mode when PayPal is not configured
2. **No PayPal Required**: You can test upgrades without setting up PayPal
3. **Database Setup**: Make sure to run the Supabase setup script first

## 🔧 PayPal Setup (Optional)

If you want to use real PayPal payments:

### 1. Create PayPal Developer Account
- Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
- Sign up for a developer account
- Create a new app

### 2. Get Your Credentials
- Copy your **Client ID** and **Secret**
- For testing, use **Sandbox** credentials
- For production, use **Live** credentials

### 3. Update Environment Variables
Create a `.env.local` file in your project root:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_paypal_client_id
PAYPAL_SECRET=your_actual_paypal_secret

# Other required variables
NEXT_PUBLIC_TOGETHER_API_KEY=your_together_ai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Setup
Run the Supabase setup script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase-setup.sql
-- This creates the required tables for subscriptions
```

## 🐛 Troubleshooting Subscription Upgrades

### Issue: "Database setup incomplete"
**Solution**: Run the Supabase setup script in your Supabase SQL Editor

### Issue: "PayPal payment failed"
**Solution**: 
- Check your PayPal credentials in `.env.local`
- Use sandbox credentials for testing
- Make sure your PayPal app is properly configured

### Issue: "Payment failed" with no specific error
**Solution**:
- Check browser console for detailed error messages
- Verify all environment variables are set correctly
- Try the demo mode (no PayPal required)

## 🎯 Demo Mode Features

When PayPal is not configured, the system automatically:
- ✅ Simulates successful payments
- ✅ Updates subscription status in database
- ✅ Provides full access to premium features
- ✅ Works for testing and development

## 📝 Testing Steps

1. **Start the application**: `npm run dev`
2. **Create an account**: Sign up for a free account
3. **Try to upgrade**: Click "Upgrade to Basic" 
4. **Check console**: Look for detailed logs in browser console
5. **Verify upgrade**: Check if subscription status updates

## 🔍 Debug Information

The system logs detailed information to help debug issues:
- PayPal configuration status
- Database connection status
- Payment processing steps
- Error details with codes

Check the browser console for these logs when testing upgrades. 