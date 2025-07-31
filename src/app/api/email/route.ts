import { NextRequest, NextResponse } from 'next/server';
import MailerLiteService from '@/lib/mailerlite-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    const mailerLiteService = MailerLiteService.getInstance();

    switch (type) {
      case 'verification':
        const success = await mailerLiteService.sendVerificationEmail({
          to: data.to,
          code: data.code,
          firstName: data.firstName
        });
        return NextResponse.json({ success });

      case 'password-reset':
        const resetSuccess = await mailerLiteService.sendPasswordResetEmail({
          to: data.to,
          resetLink: data.resetLink,
          firstName: data.firstName
        });
        return NextResponse.json({ success: resetSuccess });

      case 'welcome':
        const welcomeSuccess = await mailerLiteService.sendWelcomeEmail({
          to: data.to,
          firstName: data.firstName,
          lastName: data.lastName
        });
        return NextResponse.json({ success: welcomeSuccess });

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 