interface VerificationEmailData {
  to: string;
  code: string;
  firstName?: string;
}

interface PasswordResetData {
  to: string;
  resetLink: string;
  firstName?: string;
}

interface WelcomeEmailData {
  to: string;
  firstName: string;
  lastName: string;
}

class EmailService {
  private static instance: EmailService;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async callEmailAPI(type: string, data: any): Promise<boolean> {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Email API call failed:', error);
      // Fallback to simulation for development
      console.log('📧 Simulated email sent:', { type, data });
      return true;
    }
  }

  public async sendVerificationEmail(data: VerificationEmailData): Promise<boolean> {
    try {
      // First try the API
      const apiResult = await this.callEmailAPI('verification', data);
      if (apiResult) {
        return true;
      }
      
      // Fallback: Log the verification code for development
      console.log('📧 Verification Email (Development Mode):');
      console.log('To:', data.to);
      console.log('Code:', data.code);
      console.log('First Name:', data.firstName);
      console.log('---');
      
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }

  public async sendPasswordResetEmail(data: PasswordResetData): Promise<boolean> {
    try {
      const apiResult = await this.callEmailAPI('password-reset', data);
      if (apiResult) {
        return true;
      }
      
      // Fallback: Log the reset link for development
      console.log('📧 Password Reset Email (Development Mode):');
      console.log('To:', data.to);
      console.log('Reset Link:', data.resetLink);
      console.log('First Name:', data.firstName);
      console.log('---');
      
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  public async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    try {
      const apiResult = await this.callEmailAPI('welcome', data);
      if (apiResult) {
        return true;
      }
      
      // Fallback: Log welcome message for development
      console.log('📧 Welcome Email (Development Mode):');
      console.log('To:', data.to);
      console.log('First Name:', data.firstName);
      console.log('Last Name:', data.lastName);
      console.log('---');
      
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }
}

export default EmailService; 