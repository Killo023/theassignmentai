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
    return this.callEmailAPI('verification', data);
  }

  public async sendPasswordResetEmail(data: PasswordResetData): Promise<boolean> {
    return this.callEmailAPI('password-reset', data);
  }

  public async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    return this.callEmailAPI('welcome', data);
  }
}

export default EmailService; 