// Payment service for handling subscriptions and trial periods
import { supabase } from './supabase-client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  trialDays: number;
  features: string[];
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'trial' | 'active' | 'cancelled' | 'expired';
  trialEndDate: Date;
  nextBillingDate: Date;
  isTrialActive: boolean;
  requiresPaymentMethod: boolean;
}

export class PaymentService {
  private static instance: PaymentService;
  private plans: SubscriptionPlan[] = [
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 29.99,
      currency: 'USD',
      trialDays: 14,
      features: [
        'Unlimited assignment generation',
        'AI-powered charts and graphs',
        'Multiple export formats (PDF, DOCX, TXT)',
        'University-level academic standards',
        'Plagiarism-free content',
        'Priority customer support'
      ]
    }
  ];

  // Fallback in-memory storage for when Supabase is not configured
  private fallbackUpgradedUsers: Set<string> = new Set();
  private fallbackSubscriptions: Map<string, any> = new Map();

  // Event listeners for subscription changes
  private subscriptionChangeListeners: Set<() => void> = new Set();

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Add listener for subscription changes
  public addSubscriptionChangeListener(listener: () => void): void {
    this.subscriptionChangeListeners.add(listener);
  }

  // Remove listener
  public removeSubscriptionChangeListener(listener: () => void): void {
    this.subscriptionChangeListeners.delete(listener);
  }

  // Notify all listeners
  private notifySubscriptionChange(): void {
    this.subscriptionChangeListeners.forEach(listener => listener());
  }

  // Check if Supabase is properly configured
  private isSupabaseConfigured(): boolean {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return !!(supabaseUrl && supabaseAnonKey && 
              supabaseUrl !== 'https://your-project.supabase.co' && 
              supabaseAnonKey !== 'your-anon-key');
  }

  /**
   * Get available subscription plans
   */
  getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  /**
   * Get plan by ID
   */
  getPlan(planId: string): SubscriptionPlan | null {
    return this.plans.find(plan => plan.id === planId) || null;
  }

  /**
   * Create a new subscription with trial period (no payment required)
   */
  async createSubscription(userId: string, planId: string): Promise<UserSubscription> {
    const plan = this.getPlan(planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    const now = new Date();
    const trialEndDate = new Date(now.getTime() + (plan.trialDays * 24 * 60 * 60 * 1000));

    if (this.isSupabaseConfigured()) {
      // Create subscription in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userId,
          plan: planId,
          status: 'trial',
          trial_end_date: trialEndDate.toISOString(),
          created_at: now.toISOString()
        }]);

      if (error) {
        console.error('Error creating subscription:', error);
        throw new Error('Failed to create subscription');
      }
    } else {
      // Fallback to in-memory storage
      this.fallbackSubscriptions.set(userId, {
        user_id: userId,
        plan: planId,
        status: 'trial',
        trial_end_date: trialEndDate.toISOString(),
        created_at: now.toISOString()
      });
    }

    const subscription: UserSubscription = {
      userId,
      planId,
      status: 'trial',
      trialEndDate,
      nextBillingDate: trialEndDate,
      isTrialActive: true,
      requiresPaymentMethod: false
    };

    return subscription;
  }

  /**
   * Convert trial to paid subscription using PayPal
   */
  async convertTrialToPaid(userId: string, paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🚀 Starting upgrade process for user: ${userId}`);
      console.log(`🔧 Supabase configured: ${this.isSupabaseConfigured()}`);
      console.log(`💳 Payment data:`, { ...paymentData, cardNumber: '***' });
      
      // Check if PayPal is configured
      const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      const paypalSecret = process.env.PAYPAL_SECRET;
      
      console.log('🔐 PayPal configuration check:');
      console.log('- Client ID set:', !!paypalClientId);
      console.log('- Secret set:', !!paypalSecret);
      
      if (!paypalClientId || paypalClientId === 'your_paypal_client_id_here' || 
          !paypalSecret || paypalSecret === 'your_paypal_secret_here') {
        // PayPal not configured - simulate successful payment for demo
        console.log('🎭 PayPal not configured, simulating payment success');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        
                  if (this.isSupabaseConfigured()) {
            // Upsert subscription in Supabase (create if doesn't exist, update if exists)
            console.log(`💾 Upserting subscription in Supabase for user: ${userId}`);
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                plan: 'pro',
                status: 'active',
                trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                upgraded_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              });

            if (error) {
              console.error(`❌ Error upserting subscription in Supabase:`, error);
              return {
                success: false,
                message: 'Failed to update subscription status'
              };
            }
            console.log(`✅ Successfully upserted subscription in Supabase for user: ${userId}`);
          } else {
          // Fallback to in-memory storage
          console.log(`💾 Updating subscription in fallback storage for user: ${userId}`);
          this.fallbackUpgradedUsers.add(userId);
          const existingSub = this.fallbackSubscriptions.get(userId);
          if (existingSub) {
            this.fallbackSubscriptions.set(userId, {
              ...existingSub,
              status: 'active',
              upgraded_at: new Date().toISOString()
            });
          }
        }

        console.log(`🎉 User ${userId} upgraded to Pro (demo mode)`);
        // Notify all listeners about the subscription change
        this.notifySubscriptionChange();
        
        return {
          success: true,
          message: 'Payment processed successfully (demo mode)'
        };
      }

      // PayPal is configured - try to use it
      try {
        console.log('💳 Attempting PayPal payment...');
        // Import PayPal service dynamically to avoid SSR issues
        const { default: PayPalService } = await import('./paypal');
        const paypalService = PayPalService.getInstance();
        
        // Create PayPal plan if it doesn't exist
        const planData = {
          name: 'AcademiaAI Pro Monthly',
          description: 'Unlimited AI-powered assignment generation',
          price: 29.99,
          currency: 'USD'
        };
        
        // For demo purposes, we'll use a mock plan ID
        // In production, you'd store and retrieve the actual plan ID
        const planId = 'P-5ML4271244454362XMQIZHI'; // Mock PayPal plan ID
        
        // Process payment through PayPal
        const paymentResult = await paypalService.processPayment({
          amount: 29.99,
          currency: 'USD',
          description: 'AcademiaAI Pro Monthly Subscription',
          payerEmail: paymentData.nameOnCard // In real app, get from user data
        });

        console.log('💳 PayPal payment result:', paymentResult);

        if (paymentResult.success) {
          if (this.isSupabaseConfigured()) {
            // Upsert subscription in Supabase (create if doesn't exist, update if exists)
            console.log(`💾 Upserting subscription in Supabase for user: ${userId}`);
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                plan: 'pro',
                status: 'active',
                trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                upgraded_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              });

            if (error) {
              console.error(`❌ Error upserting subscription in Supabase:`, error);
              return {
                success: false,
                message: 'Payment successful but failed to update subscription status'
              };
            }
            console.log(`✅ Successfully upserted subscription in Supabase for user: ${userId}`);
          } else {
            // Fallback to in-memory storage
            console.log(`💾 Updating subscription in fallback storage for user: ${userId}`);
            this.fallbackUpgradedUsers.add(userId);
            const existingSub = this.fallbackSubscriptions.get(userId);
            if (existingSub) {
              this.fallbackSubscriptions.set(userId, {
                ...existingSub,
                status: 'active',
                upgraded_at: new Date().toISOString()
              });
            }
          }

          console.log(`🎉 User ${userId} upgraded to Pro`);
          // Notify all listeners about the subscription change
          this.notifySubscriptionChange();
          return {
            success: true,
            message: 'Successfully converted to paid subscription'
          };
        } else {
          return {
            success: false,
            message: paymentResult.error || 'Payment failed. Please try again.'
          };
        }
      } catch (paypalError) {
        console.error('💳 PayPal payment error:', paypalError);
        // Fallback to demo mode if PayPal fails
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (this.isSupabaseConfigured()) {
          // Update subscription in Supabase
          console.log(`💾 Updating subscription in Supabase for user: ${userId}`);
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              upgraded_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          if (error) {
            console.error(`❌ Error updating subscription in Supabase:`, error);
            return {
              success: false,
              message: 'Failed to update subscription status'
            };
          }
          console.log(`✅ Successfully updated subscription in Supabase for user: ${userId}`);
        } else {
          // Fallback to in-memory storage
          console.log(`💾 Updating subscription in fallback storage for user: ${userId}`);
          this.fallbackUpgradedUsers.add(userId);
          const existingSub = this.fallbackSubscriptions.get(userId);
          if (existingSub) {
            this.fallbackSubscriptions.set(userId, {
              ...existingSub,
              status: 'active',
              upgraded_at: new Date().toISOString()
            });
          }
        }

        console.log(`🎉 User ${userId} upgraded to Pro (demo mode)`);
        return {
          success: true,
          message: 'Payment processed successfully (demo mode - PayPal unavailable)'
        };
      }
    } catch (error) {
      console.error(`❌ Payment processing error for user ${userId}:`, error);
      return {
        success: false,
        message: `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if user has active subscription
   */
  async checkSubscriptionStatus(userId: string): Promise<UserSubscription | null> {
    try {
      console.log(`🔍 Checking subscription status for user: ${userId}`);
      console.log(`🔧 Supabase configured: ${this.isSupabaseConfigured()}`);
      
      let subscription: any = null;
      
      if (this.isSupabaseConfigured()) {
        // Fetch subscription from Supabase
        console.log(`📡 Fetching from Supabase for user: ${userId}`);
        let { data: supabaseData, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log(`📭 No subscription found in Supabase for user: ${userId}`);
          } else {
            console.error(`❌ Supabase error for user ${userId}:`, error);
            return null;
          }
        } else {
          console.log(`✅ Found subscription in Supabase:`, supabaseData);
          subscription = supabaseData;
        }
      } else {
        // Fallback to in-memory storage
        console.log(`💾 Using fallback storage for user: ${userId}`);
        subscription = this.fallbackSubscriptions.get(userId);
        console.log(`📦 Fallback subscription data:`, subscription);
      }

      const now = new Date();
      let trialEndDate: Date;
      let status: 'trial' | 'active' | 'cancelled' | 'expired';
      let isTrialActive: boolean;

      if (!subscription) {
        // No subscription found - create a new trial
        console.log(`🆕 No subscription found for user ${userId}, creating new trial`);
        
        const plan = this.getPlan('pro');
        if (!plan) {
          throw new Error('Pro plan not found');
        }

        trialEndDate = new Date(now.getTime() + (plan.trialDays * 24 * 60 * 60 * 1000));
        
        if (this.isSupabaseConfigured()) {
          // Create new subscription in Supabase
          console.log(`💾 Creating new subscription in Supabase for user: ${userId}`);
          const { error: insertError } = await supabase
            .from('subscriptions')
            .insert([{
              user_id: userId,
              plan: 'pro',
              status: 'trial',
              trial_end_date: trialEndDate.toISOString(),
              created_at: now.toISOString()
            }]);

          if (insertError) {
            console.error(`❌ Error creating subscription in Supabase:`, insertError);
            return null;
          }
          console.log(`✅ Successfully created subscription in Supabase for user: ${userId}`);
        } else {
          // Fallback to in-memory storage
          console.log(`💾 Creating new subscription in fallback storage for user: ${userId}`);
          this.fallbackSubscriptions.set(userId, {
            user_id: userId,
            plan: 'pro',
            status: 'trial',
            trial_end_date: trialEndDate.toISOString(),
            created_at: now.toISOString()
          });
        }

        status = 'trial';
        isTrialActive = true;
      } else {
        // Subscription exists
        console.log(`📋 Processing existing subscription for user: ${userId}`);
        trialEndDate = new Date(subscription.trial_end_date);
        status = subscription.status;
        
        // Check if user has been upgraded (has upgraded_at timestamp)
        const isUpgraded = subscription.upgraded_at != null;
        console.log(`👑 User upgrade status: ${isUpgraded}, upgraded_at: ${subscription.upgraded_at}`);
        
        // Check if trial is still active
        if (status === 'active' && isUpgraded) {
          // User is upgraded but trial might still be active
          isTrialActive = now < trialEndDate;
          console.log(`👑 User is upgraded but trial active: ${isTrialActive}`);
        } else if (status === 'trial') {
          // User is in trial
          isTrialActive = now < trialEndDate;
          console.log(`⏰ User in trial, active: ${isTrialActive}`);
          if (!isTrialActive) {
            // Trial has expired
            status = 'expired';
            console.log(`⏰ Trial expired for user: ${userId}`);
            
            if (this.isSupabaseConfigured()) {
              // Update status in database
              console.log(`💾 Updating status to expired in Supabase for user: ${userId}`);
              await supabase
                .from('subscriptions')
                .update({ status: 'expired' })
                .eq('user_id', userId);
            } else {
              // Update in fallback storage
              console.log(`💾 Updating status to expired in fallback storage for user: ${userId}`);
              const existingSub = this.fallbackSubscriptions.get(userId);
              if (existingSub) {
                this.fallbackSubscriptions.set(userId, {
                  ...existingSub,
                  status: 'expired'
                });
              }
            }
          }
        } else if (status === 'active' && !isUpgraded) {
          // User has active status but no upgrade timestamp - this shouldn't happen
          console.log(`⚠️ User has active status but no upgrade timestamp`);
          isTrialActive = false;
        } else {
          isTrialActive = false;
          console.log(`📊 User status: ${status}, trial active: ${isTrialActive}`);
        }
      }
      
      console.log(`🎯 Final status for user ${userId}:`, status);
      console.log(`⏰ Trial active:`, isTrialActive);
      console.log(`📅 Trial end date:`, trialEndDate);
      
      return {
        userId,
        planId: 'pro',
        status,
        trialEndDate,
        nextBillingDate: trialEndDate,
        isTrialActive,
        requiresPaymentMethod: status === 'expired' || status === 'active'
      };
    } catch (error) {
      console.error(`❌ Error checking subscription status for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Check if user is in trial period
   */
  async isInTrial(userId: string): Promise<boolean> {
    const subscription = await this.checkSubscriptionStatus(userId);
    if (!subscription) return false;

    const now = new Date();
    return subscription.isTrialActive && now < subscription.trialEndDate;
  }

  /**
   * Check if user has expired trial
   */
  async hasExpiredTrial(userId: string): Promise<boolean> {
    const subscription = await this.checkSubscriptionStatus(userId);
    if (!subscription) return false;

    const now = new Date();
    return subscription.status === 'expired' || 
           (subscription.isTrialActive && now > subscription.trialEndDate);
  }

  /**
   * Check if user has active paid subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.checkSubscriptionStatus(userId);
    if (!subscription) return false;

    return subscription.status === 'active';
  }

  /**
   * Get days remaining in trial
   */
  async getTrialDaysRemaining(userId: string): Promise<number> {
    const subscription = await this.checkSubscriptionStatus(userId);
    if (!subscription || !subscription.isTrialActive) return 0;

    const now = new Date();
    const timeRemaining = subscription.trialEndDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));
    
    return Math.max(0, daysRemaining);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<void> {
    if (this.isSupabaseConfigured()) {
      // Update subscription status in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId);

      if (error) {
        console.error('Error cancelling subscription:', error);
        throw new Error('Failed to cancel subscription');
      }
    } else {
      // Update in fallback storage
      const existingSub = this.fallbackSubscriptions.get(userId);
      if (existingSub) {
        this.fallbackSubscriptions.set(userId, {
          ...existingSub,
          status: 'cancelled'
        });
      }
    }

    this.notifySubscriptionChange();
  }

  /**
   * Process payment (for demo purposes)
   */
  async processPayment(paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
    amount: number;
  }): Promise<{ success: boolean; message: string }> {
    // In a real app, you would:
    // 1. Validate payment data
    // 2. Process payment through payment provider
    // 3. Handle success/failure responses

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo, always succeed
    return {
      success: true,
      message: 'Payment processed successfully'
    };
  }

  /**
   * Get subscription features
   */
  getSubscriptionFeatures(planId: string): string[] {
    const plan = this.getPlan(planId);
    return plan?.features || [];
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  /**
   * Check if user can create assignments
   */
  async canCreateAssignment(userId?: string): Promise<boolean> {
    try {
      if (!userId) {
        // If no userId provided, assume user can create assignments
        return true;
      }

      const subscription = await this.checkSubscriptionStatus(userId);
      if (!subscription) {
        // No subscription found, allow creation (trial)
        return true;
      }

      // Allow creation if user has active subscription or is in trial
      return subscription.status === 'active' || subscription.status === 'trial';
    } catch (error) {
      console.error('Error checking assignment creation permission:', error);
      // Default to allowing creation if there's an error
      return true;
    }
  }

  /**
   * Check if user can access calendar feature
   */
  async canAccessCalendar(userId?: string): Promise<boolean> {
    try {
      if (!userId) {
        return false;
      }

      const subscription = await this.checkSubscriptionStatus(userId);
      if (!subscription) {
        return false;
      }

      // Only Pro users can access calendar
      return subscription.status === 'active';
    } catch (error) {
      console.error('Error checking calendar access:', error);
      return false;
    }
  }
}

export default PaymentService; 