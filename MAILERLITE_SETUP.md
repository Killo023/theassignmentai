# MailerLite Email Service Setup

This guide will help you set up MailerLite as the email service for The Assignment AI application.

## What MailerLite Provides

MailerLite is used to send the following types of emails:
- **Verification emails** - Sent when users sign up to verify their email address
- **Password reset emails** - Sent when users request to reset their password
- **Welcome emails** - Sent after successful email verification

## Setup Instructions

### 1. Create a MailerLite Account

1. Go to [MailerLite](https://www.mailerlite.com/) and create a free account
2. Verify your email address and complete the account setup

### 2. Get Your API Key

1. Log in to your MailerLite account
2. Go to **Integrations** → **API**
3. Click **Generate API Key**
4. Copy the API key (it will look something like `ml_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### 3. Configure Environment Variables

1. Copy the `env.template` file to `.env.local`:
   ```bash
   cp env.template .env.local
   ```

2. Add your MailerLite API key to `.env.local`:
   ```
   MAILERLITE_API_KEY=ml_your_actual_api_key_here
   ```

3. Set your app URL (for password reset links):
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try signing up with a new email address
3. Check the console logs to see if the email is being sent
4. If the API key is not set, emails will be simulated in the console

## Email Templates

The application includes beautiful, responsive email templates for:

### Verification Email
- Clean, modern design with gradient header
- Large, easy-to-read verification code
- 10-minute expiration notice
- Branded with The Assignment AI colors

### Password Reset Email
- Secure reset link with 1-hour expiration
- Clear call-to-action button
- Security notice for unintended requests

### Welcome Email
- Warm welcome message
- List of available features
- Direct link to dashboard
- Support information

## Development vs Production

### Development Mode
- If no API key is provided, emails are simulated in the console
- You'll see logs like: `📧 Simulated email sent: { type: 'verification', data: {...} }`
- This allows development without a MailerLite account

### Production Mode
- Requires valid MailerLite API key
- Real emails are sent to users
- All email templates are fully functional

## Troubleshooting

### Common Issues

1. **"MailerLite API key not found"**
   - Make sure you've added `MAILERLITE_API_KEY` to your `.env.local` file
   - Restart your development server after adding the environment variable

2. **"Email sending failed"**
   - Check that your API key is valid
   - Verify your MailerLite account is active
   - Check the console for detailed error messages

3. **Emails not being sent**
   - In development, emails are simulated by default
   - Add a valid API key to send real emails
   - Check the browser console for simulation logs

### API Rate Limits

MailerLite has the following limits on their free plan:
- 1,000 emails per month
- 100 emails per hour
- 10 emails per second

For higher limits, consider upgrading to a paid plan.

## Security Considerations

- Never commit your API key to version control
- Use environment variables for all sensitive data
- The API key is only used server-side in the `/api/email` route
- Password reset tokens are stored locally (in production, use a database)

## Customization

You can customize the email templates by editing the HTML and text generation methods in `src/lib/mailerlite-service.ts`:

- `generateVerificationEmailHtml()` - Verification email template
- `generatePasswordResetEmailHtml()` - Password reset email template  
- `generateWelcomeEmailHtml()` - Welcome email template

Each method has both HTML and text versions for email client compatibility.

## Support

If you need help with MailerLite integration:
1. Check the [MailerLite API Documentation](https://developers.mailerlite.com/)
2. Review the console logs for error messages
3. Ensure your API key has the necessary permissions 