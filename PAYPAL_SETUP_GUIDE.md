# PayPal Setup Guide - Fix PayPal Button Issues

## 🚨 Current Issues
Your PayPal buttons are not working because:
- PayPal Client ID is not configured
- PayPal subscription plans are not set up
- Environment variables are missing

## 🔧 Quick Fix Steps

### Step 1: Create PayPal Developer Account
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in with your PayPal account
3. Create a new app or use an existing one

### Step 2: Get Your PayPal Credentials
1. In your PayPal Developer Dashboard, go to **My Apps & Credentials**
2. Find your app and click on it
3. Copy the **Client ID** (you'll need this for the frontend)
4. Copy the **Secret** (you'll need this for the backend)

### Step 3: Create PayPal Subscription Plans
1. Go to **Products** → **Subscriptions**
2. Click **Create Plan**
3. Create two plans:

#### Basic Plan ($14.99/month)
- **Name**: Basic Plan
- **Price**: $14.99 USD
- **Billing Cycle**: Monthly
- **Plan ID**: Copy this ID (starts with P-)

#### Pro Plan ($29.99/month)
- **Name**: Pro Plan
- **Price**: $29.99 USD
- **Billing Cycle**: Monthly
- **Plan ID**: Copy this ID (starts with P-)

### Step 4: Configure Environment Variables
1. Create or update your `.env.local` file:
```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_client_id_here
PAYPAL_SECRET=your_actual_secret_here

# PayPal Subscription Plan IDs
NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID=P-your_basic_plan_id_here
NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID=P-your_pro_plan_id_here
```

### Step 5: Test the Integration
1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/test-paypal`
3. Try the PayPal subscription button

## 🧪 Testing PayPal Integration

### Test Page
Visit `http://localhost:3000/test-paypal` to test the basic plan integration.

### Test Pro Page
Visit `http://localhost:3000/test-paypal-pro` to test the pro plan integration.

## 📋 What I've Fixed

### 1. Environment Variable Support
- ✅ PayPal buttons now use `NEXT_PUBLIC_PAYPAL_CLIENT_ID` from environment
- ✅ Plan IDs are configurable via environment variables
- ✅ Better error handling for missing configuration

### 2. Improved Error Handling
- ✅ Clear error messages when PayPal is not configured
- ✅ Instructions on how to fix configuration issues
- ✅ Graceful fallbacks for missing environment variables

### 3. Database Schema Updates
- ✅ Added `paypal_subscription_id` field to subscriptions table
- ✅ Added index for PayPal subscription ID lookups
- ✅ Updated SQL setup script

### 4. Better Button Implementation
- ✅ Fixed script loading and cleanup
- ✅ Improved error handling and user feedback
- ✅ Added configuration validation

## 🔍 Troubleshooting

### If you get "PayPal is not configured" error:
1. Check your `.env.local` file has the correct PayPal Client ID
2. Make sure the Client ID is not the placeholder value
3. Restart your development server after updating environment variables

### If PayPal buttons don't appear:
1. Check browser console for JavaScript errors
2. Verify PayPal Client ID is valid
3. Make sure you're using HTTPS in production

### If subscription creation fails:
1. Verify PayPal plan IDs are correct
2. Check PayPal Developer Dashboard for plan status
3. Ensure plans are active and properly configured

### If database errors occur:
1. Run the updated `supabase-setup.sql` script
2. Check that the `paypal_subscription_id` field exists
3. Verify database connection is working

## 🎯 PayPal Sandbox vs Production

### For Testing (Sandbox)
- Use sandbox credentials from PayPal Developer Dashboard
- Test with sandbox PayPal accounts
- No real money is charged

### For Production
- Use live credentials from PayPal Developer Dashboard
- Real PayPal accounts required
- Real money will be charged

## ✅ Success Indicators

After successful setup, you should see:
- ✅ PayPal buttons load without errors
- ✅ Subscription creation works
- ✅ Database updates properly
- ✅ User subscription status updates
- ✅ No console errors

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check the browser console** for specific error messages
2. **Verify PayPal credentials** in your Developer Dashboard
3. **Test with sandbox accounts** first
4. **Check the test pages** at `/test-paypal` and `/test-paypal-pro`

## 🎯 Next Steps

Once PayPal is working:
1. Test both basic and pro subscriptions
2. Verify subscription status updates in your app
3. Test subscription cancellation
4. Set up webhook handling for subscription events

---

**Need help?** Check the PayPal Developer documentation or the console logs for specific error messages. 