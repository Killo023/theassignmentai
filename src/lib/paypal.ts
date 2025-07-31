// PayPal integration for subscription management
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export interface PayPalSubscription {
  id: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED';
  plan_id: string;
  start_time: string;
  next_billing_time: string;
  subscriber: {
    payer_id: string;
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
  };
  billing_info: {
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
      current_pricing_scheme_version_id: string;
    }>;
    last_payment: {
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
    };
    next_billing_time: string;
    failed_payments_count: number;
  };
}

export interface PayPalPlan {
  id: string;
  name: string;
  description: string;
  type: 'FIXED';
  payment_definitions: Array<{
    id: string;
    name: string;
    type: 'REGULAR';
    frequency: 'MONTH';
    frequency_interval: string;
    amount: {
      currency: string;
      value: string;
    };
    cycles: string;
    charge_models: Array<{
      id: string;
      type: 'SHIPPING' | 'TAX';
      amount: {
        currency: string;
        value: string;
      };
    }>;
  }>;
  merchant_preferences: {
    setup_fee: {
      currency: string;
      value: string;
    };
    cancel_url: string;
    return_url: string;
    max_fail_attempts: string;
    auto_bill_amount: 'YES' | 'NO';
    initial_fail_amount_action: 'CONTINUE' | 'CANCEL';
    accepted_payment_type: 'INSTANT';
    char_set: string;
  };
}

export class PayPalService {
  private static instance: PayPalService;
  private clientId: string;
  private baseUrl: string;

  private constructor() {
    this.clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  public static getInstance(): PayPalService {
    if (!PayPalService.instance) {
      PayPalService.instance = new PayPalService();
    }
    return PayPalService.instance;
  }

  /**
   * Get PayPal access token for API calls
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.clientId}:${process.env.PAYPAL_SECRET || ''}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error('Failed to get PayPal access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('PayPal access token error:', error);
      throw new Error('PayPal authentication failed');
    }
  }

  /**
   * Create a subscription plan
   */
  async createPlan(planData: {
    name: string;
    description: string;
    price: number;
    currency: string;
  }): Promise<PayPalPlan> {
    try {
      const accessToken = await this.getAccessToken();
      
      const plan = {
        name: planData.name,
        description: planData.description,
        type: 'FIXED',
        payment_definitions: [
          {
            id: `payment-def-${Date.now()}`,
            name: 'Regular Payment',
            type: 'REGULAR',
            frequency: 'MONTH',
            frequency_interval: '1',
            amount: {
              currency: planData.currency,
              value: planData.price.toString(),
            },
            cycles: '0',
            charge_models: [
              {
                id: `charge-model-${Date.now()}`,
                type: 'SHIPPING',
                amount: {
                  currency: planData.currency,
                  value: '0',
                },
              },
            ],
          },
        ],
        merchant_preferences: {
          setup_fee: {
            currency: planData.currency,
            value: '0',
          },
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=subscription`,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=subscription`,
          max_fail_attempts: '3',
          auto_bill_amount: 'YES',
          initial_fail_amount_action: 'CONTINUE',
          accepted_payment_type: 'INSTANT',
          char_set: 'UTF-8',
        },
      };

      const response = await fetch(`${this.baseUrl}/v1/payments/billing-plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal plan');
      }

      const createdPlan = await response.json();
      
      // Activate the plan
      await this.activatePlan(createdPlan.id);
      
      return createdPlan;
    } catch (error) {
      console.error('PayPal plan creation error:', error);
      throw new Error('Failed to create subscription plan');
    }
  }

  /**
   * Activate a subscription plan
   */
  private async activatePlan(planId: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v1/payments/billing-plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            op: 'replace',
            path: '/',
            value: {
              state: 'ACTIVE',
            },
          },
        ]),
      });

      if (!response.ok) {
        throw new Error('Failed to activate PayPal plan');
      }
    } catch (error) {
      console.error('PayPal plan activation error:', error);
      throw new Error('Failed to activate subscription plan');
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(planId: string, userData: {
    name: string;
    email: string;
  }): Promise<PayPalSubscription> {
    try {
      const accessToken = await this.getAccessToken();
      
      const subscription = {
        plan_id: planId,
        start_time: new Date().toISOString(),
        subscriber: {
          name: {
            given_name: userData.name.split(' ')[0] || userData.name,
            surname: userData.name.split(' ').slice(1).join(' ') || '',
          },
          email_address: userData.email,
        },
        application_context: {
          brand_name: 'The Assignment AI',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=subscription&success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=subscription&cancelled=true`,
        },
      };

      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('PayPal subscription creation error:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<PayPalSubscription> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get PayPal subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('PayPal subscription retrieval error:', error);
      throw new Error('Failed to get subscription details');
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, reason: string = 'User requested cancellation'): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel PayPal subscription');
      }
    } catch (error) {
      console.error('PayPal subscription cancellation error:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Suspend a subscription
   */
  async suspendSubscription(subscriptionId: string, reason: string = 'Payment failure'): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to suspend PayPal subscription');
      }
    } catch (error) {
      console.error('PayPal subscription suspension error:', error);
      throw new Error('Failed to suspend subscription');
    }
  }

  /**
   * Reactivate a suspended subscription
   */
  async reactivateSubscription(subscriptionId: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate PayPal subscription');
      }
    } catch (error) {
      console.error('PayPal subscription reactivation error:', error);
      throw new Error('Failed to reactivate subscription');
    }
  }

  /**
   * Get subscription list for a user
   */
  async getUserSubscriptions(payerId: string): Promise<PayPalSubscription[]> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions?payer_id=${payerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user subscriptions');
      }

      const data = await response.json();
      return data.subscriptions || [];
    } catch (error) {
      console.error('PayPal user subscriptions error:', error);
      throw new Error('Failed to get user subscriptions');
    }
  }

  /**
   * Process a one-time payment
   */
  async processPayment(paymentData: {
    amount: number;
    currency: string;
    description: string;
    payerEmail: string;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const accessToken = await this.getAccessToken();
      
      const payment = {
        intent: 'CAPTURE',
        payer: {
          payment_method: 'PAYPAL',
          payer_info: {
            email: paymentData.payerEmail,
          },
        },
        transactions: [
          {
            amount: {
              currency: paymentData.currency,
              total: paymentData.amount.toString(),
            },
            description: paymentData.description,
          },
        ],
        redirect_urls: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=subscription&payment=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/settings?tab=subscription&payment=cancelled`,
        },
      };

      const response = await fetch(`${this.baseUrl}/v1/payments/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal payment');
      }

      const paymentResult = await response.json();
      
      // Capture the payment
      const captureResponse = await fetch(`${this.baseUrl}/v1/payments/payment/${paymentResult.id}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payer_id: paymentResult.payer.payer_info.payer_id,
        }),
      });

      if (!captureResponse.ok) {
        throw new Error('Failed to capture PayPal payment');
      }

      const captureResult = await captureResponse.json();
      
      return {
        success: true,
        transactionId: captureResult.id,
      };
    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        error: 'Payment processing failed',
      };
    }
  }
}

export default PayPalService;

