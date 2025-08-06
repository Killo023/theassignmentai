# MailerLite Email Service Setup Guide

This guide will help you set up MailerLite for sending verification emails, password resets, and welcome emails in production.

## Prerequisites

1. A MailerLite account (free tier available)
2. Access to your application's environment variables

## Step 1: Create MailerLite Account

1. Go to [MailerLite](https://app.mailerlite.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to your MailerLite dashboard
2. Go to **Integrations** → **API**
3. Copy your API key
4. Keep this key secure - never share it publicly

## Step 3: Configure Environment Variables

Add your MailerLite API key to your `.env.local` file:

```bash
# MailerLite Configuration
MAILERLITE_API_KEY=your_mailerlite_api_key_here
```

## Step 4: Test Email Functionality

The application includes a test script to verify email functionality:

```bash
npm run test:email
```

Or run the test manually:

```bash
node scripts/test-email-service.js
```

## Step 5: Production Deployment

### Vercel Deployment

1. Add your environment variables in Vercel:
   - Go to your project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add `MAILERLITE_API_KEY` with your API key
   - Deploy to production

### Other Platforms

Add the environment variable to your hosting platform's configuration.

## Email Templates

The application uses three email templates:

### 1. Verification Email
- **Purpose**: Verify new user email addresses
- **Content**: 6-digit verification code
- **Expiration**: 10 minutes

### 2. Password Reset Email
- **Purpose**: Reset user passwords
- **Content**: Secure reset link
- **Expiration**: 1 hour

### 3. Welcome Email
- **Purpose**: Welcome new verified users
- **Content**: Welcome message and dashboard link

## Development Mode

When `MAILERLITE_API_KEY` is not set, the application will:
- Log email content to the console
- Simulate successful email sending
- Allow testing without actual email delivery

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check if API key is correctly set
   - Verify MailerLite account is active
   - Check browser console for errors

2. **Verification codes not received**
   - Check spam folder
   - Verify email address is correct
   - Check MailerLite sending limits

3. **API errors**
   - Verify API key format
   - Check MailerLite account status
   - Review API usage limits

### Testing Without MailerLite

For development, you can test without setting up MailerLite:

1. Leave `MAILERLITE_API_KEY` unset
2. Check browser console for email logs
3. Use the verification codes shown in console

### Alternative Email Services

If you prefer a different email service:

1. **SendGrid**
   ```bash
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

2. **Resend**
   ```bash
   RESEND_API_KEY=your_resend_api_key
   ```

3. **AWS SES**
   ```bash
   AWS_SES_ACCESS_KEY=your_aws_access_key
   AWS_SES_SECRET_KEY=your_aws_secret_key
   ```

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all secrets**
3. **Rotate API keys regularly**
4. **Monitor email sending logs**
5. **Set up email authentication (SPF, DKIM, DMARC)**

## Rate Limiting

MailerLite free tier limits:
- 1,000 emails per month
- 100 emails per hour
- 10 emails per second

For higher limits, consider upgrading to a paid plan.

## Monitoring

Monitor your email delivery:
1. Check MailerLite dashboard for delivery reports
2. Monitor bounce rates
3. Track open rates and engagement
4. Set up alerts for failed deliveries

## Support

If you need help:
1. Check MailerLite documentation
2. Review application logs
3. Test with the provided test scripts
4. Contact support with specific error messages 