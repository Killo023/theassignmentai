# Troubleshooting Guide: Signup Verification & PayPal Payments

## 🚨 Current Issues

### 1. Signup Verification Emails Not Received
**Problem**: Users don't receive verification emails after signing up.

**Root Cause**: 
- `MAILERLITE_API_KEY` is not configured in `.env.local`
- Email service falls back to simulation mode
- Verification emails are only logged to console, not actually sent

**Solution**:
1. **For Development/Testing**: 
   - Check browser console for simulated email logs
   - Look for: `📧 Simulated email sent: { type: 'verification', data: {...} }`
   - The verification code is displayed in the console

2. **For Production**:
   - Set up MailerLite account at https://app.mailerlite.com/
   - Get API key from Integrations → API
   - Add to `.env.local`: `MAILERLITE_API_KEY=ml_your_actual_api_key`

### 2. PayPal Payments Not Working
**Problem**: PayPal payments fail or don't process.

**Root Cause**:
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_SECRET` not configured
- System falls back to demo mode
- Real payments cannot be processed

**Solution**:
1. **For Development/Testing**:
   - System automatically uses demo mode
   - Payments are simulated successfully
   - Check console for: `🎭 PayPal not configured, simulating payment success`

2. **For Production**:
   - Create PayPal Developer account at https://developer.paypal.com/
   - Get Client ID and Secret from your app
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_client_id
     PAYPAL_SECRET=your_actual_secret
     ```

## 🔧 Quick Fix Steps

### Step 1: Check Current Configuration
```bash
# Check if .env.local exists
ls -la .env.local

# If not exists, create it
cp env.template .env.local
```

### Step 2: Configure Email Service (Optional for Development)
1. Go to https://app.mailerlite.com/
2. Create account and get API key
3. Add to `.env.local`:
   ```
   MAILERLITE_API_KEY=ml_your_actual_api_key
   ```

### Step 3: Configure PayPal (Optional for Development)
1. Go to https://developer.paypal.com/
2. Create app and get credentials
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_actual_client_id
   PAYPAL_SECRET=your_actual_secret
   ```

### Step 4: Restart Development Server
```bash
npm run dev
```

## 🎯 Development Mode (Recommended for Testing)

The system is designed to work in **demo mode** when services are not configured:

### Email Verification in Demo Mode:
- ✅ Verification emails are simulated in console
- ✅ Users can still complete signup process
- ✅ Check browser console for verification codes
- ✅ All functionality works for testing

### PayPal Payments in Demo Mode:
- ✅ Payments are simulated successfully
- ✅ Subscription upgrades work
- ✅ No real money is charged
- ✅ Full testing capabilities

## 🔍 Debug Information

### Check Console Logs
Look for these messages in browser console:

**Email Service**:
```
📧 Simulated email sent: { type: 'verification', data: {...} }
📧 Email sent successfully via MailerLite: {...}
```

**PayPal Service**:
```
🎭 PayPal not configured, simulating payment success
💳 PayPal payment result: { success: true, ... }
```

**Database**:
```
💾 Upserting subscription in Supabase for user: user-123
✅ Successfully upserted subscription in Supabase
```

### Environment Variable Status
The system logs configuration status:
```
🔐 PayPal configuration check:
- Client ID set: false
- Secret set: false
🎭 PayPal not configured, simulating payment success
```

## 🚀 Production Setup

### For Real Email Sending:
1. **MailerLite Setup**:
   - Create account at https://app.mailerlite.com/
   - Go to Integrations → API
   - Generate API key
   - Add to `.env.local`: `MAILERLITE_API_KEY=ml_your_key`

2. **Test Email Sending**:
   - Sign up with new email
   - Check if verification email is received
   - Check console for success/error logs

### For Real PayPal Payments:
1. **PayPal Developer Setup**:
   - Create account at https://developer.paypal.com/
   - Create new app
   - Get Client ID and Secret
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
     PAYPAL_SECRET=your_secret
     ```

2. **Test Payments**:
   - Try upgrading subscription
   - Check if real payment is processed
   - Verify subscription status updates

## 📋 Testing Checklist

### Email Verification Testing:
- [ ] Sign up with new email
- [ ] Check console for verification code
- [ ] Enter verification code
- [ ] Verify account is activated
- [ ] Check if welcome email is sent (if configured)

### PayPal Payment Testing:
- [ ] Try to upgrade subscription
- [ ] Check console for payment simulation
- [ ] Verify subscription status updates
- [ ] Test with real PayPal (if configured)

### Database Testing:
- [ ] Check if subscription data is stored
- [ ] Verify assignment limits are updated
- [ ] Test calendar access permissions

## 🆘 Common Issues & Solutions

### Issue: "Verification email not received"
**Solution**: 
- Check console for simulated email logs
- Configure MailerLite for real emails
- Verify email address is correct

### Issue: "PayPal payment failed"
**Solution**:
- Check console for demo mode logs
- Configure PayPal credentials for real payments
- Use sandbox credentials for testing

### Issue: "Database setup incomplete"
**Solution**:
- Run Supabase setup script
- Check database connection
- Verify environment variables

## 📞 Support

If you need help:
1. Check browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Test in demo mode first before configuring real services
4. Review the setup documentation in the project

The system is designed to work in demo mode for development and testing, so you can test all functionality without configuring external services. 