// Payment service for handling subscriptions and trial periods
import { supabase } from './supabase-client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  assignmentLimit: number;
  hasCalendarAccess: boolean;
  features: string[];
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'free' | 'basic' | 'pro' | 'cancelled' | 'expired';
  assignmentsUsed: number;
  assignmentLimit: number;
  hasCalendarAccess: boolean;
  nextBillingDate?: Date;
  requiresPaymentMethod: boolean;
}

export class PaymentService {
  private static instance: PaymentService;
  private plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      currency: 'USD',
      assignmentLimit: 4,
      hasCalendarAccess: false,
      features: [
        '4 assignments per month',
        'AI-powered content creation',
        'Basic formatting options',
        'Email support'
      ]
    },
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 14.99,
      currency: 'USD',
      assignmentLimit: -1, // Unlimited
      hasCalendarAccess: true,
      features: [
        'Unlimited assignments',
        'Full calendar access',
        'Priority AI processing',
        'PDF & DOCX export',
        'Priority email/chat support',
        'Version history',
        'Collaboration tools',
        'Custom templates',
        'Basic usage analytics'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 29.99,
      currency: 'USD',
      assignmentLimit: -1, // Unlimited
      hasCalendarAccess: true,
      features: [
        'Everything in Basic Plan, PLUS:',
        'AI-powered charts and graphs',
        'Advanced export (PDF, DOCX, TXT + more)',
        'University-level academic standards',
        'Plagiarism-free guarantee',
        '24/7 premium support',
        'Advanced performance analytics',
        'Highest priority AI processing'
      ]
    }
  ];

  // Fallback in-memory storage for when Supabase is not configured
  private fallbackUpgradedUsers: Set<string> = new Set();
  private fallbackSubscriptions: Map<string, any> = new Map();
  private fallbackAssignmentCounts: Map<string, number> = new Map();

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

  // Check if Supabase is actually reachable
  private async isSupabaseReachable(): Promise<boolean> {
    try {
      if (!this.isSupabaseConfigured()) {
        return false;
      }

      // Try a simple query to test connectivity
      const { error } = await supabase
        .from('subscriptions')
        .select('count')
        .limit(1);

      // If we get any response (even an error), the connection is working
      return true;
    } catch (error) {
      console.error('Supabase connectivity test failed:', error);
      return false;
    }
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
   * Create a new free subscription
   */
  async createFreeSubscription(userId: string): Promise<UserSubscription> {
    const plan = this.getPlan('free');
    if (!plan) {
      throw new Error('Free plan not found');
    }

    if (this.isSupabaseConfigured()) {
      // Create subscription in Supabase
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userId,
          plan: 'free',
          status: 'free',
          assignments_used: 0,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error creating free subscription:', error);
        throw new Error('Failed to create subscription');
      }
    } else {
      // Fallback to in-memory storage
      this.fallbackSubscriptions.set(userId, {
        user_id: userId,
        plan: 'free',
        status: 'free',
        assignments_used: 0,
        created_at: new Date().toISOString()
      });
      this.fallbackAssignmentCounts.set(userId, 0);
    }

    const subscription: UserSubscription = {
      userId,
      planId: 'free',
      status: 'free',
      assignmentsUsed: 0,
      assignmentLimit: plan.assignmentLimit,
      hasCalendarAccess: plan.hasCalendarAccess,
      requiresPaymentMethod: false
    };

    return subscription;
  }

  /**
   * Convert free to paid subscription using PayPal
   */
  async convertToPaid(userId: string, planId: string, paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🚀 Starting upgrade process for user: ${userId} to plan: ${planId}`);
      console.log(`🔧 Supabase configured: ${this.isSupabaseConfigured()}`);
      console.log(`💳 Payment data:`, { ...paymentData, cardNumber: '***' });
      
      const plan = this.getPlan(planId);
      if (!plan) {
        console.error('❌ Invalid plan ID:', planId);
        return { success: false, message: 'Invalid plan selected' };
      }
      
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
        
        try {
          if (this.isSupabaseConfigured()) {
            // Upsert subscription in Supabase (create if doesn't exist, update if exists)
            console.log(`💾 Upserting subscription in Supabase for user: ${userId}`);
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                plan_id: planId,
                status: planId,
                assignments_used: 0,
                assignment_limit: plan.assignmentLimit,
                has_calendar_access: plan.hasCalendarAccess,
                upgraded_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              });

            if (error) {
              console.error(`❌ Error upserting subscription in Supabase:`, error);
              console.error(`❌ Error details:`, JSON.stringify(error, null, 2));
              
              // Check if it's a table not found error
              if (error.code === '42P01') {
                return {
                  success: false,
                  message: 'Database setup incomplete. Please run the Supabase setup script first.'
                };
              }
              
              return {
                success: false,
                message: 'Failed to update subscription status: ' + (error.message || 'Database error')
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
                plan_id: planId,
                status: planId,
                assignment_limit: plan.assignmentLimit,
                has_calendar_access: plan.hasCalendarAccess,
                upgraded_at: new Date().toISOString()
              });
            } else {
              // Create new subscription in fallback storage
              this.fallbackSubscriptions.set(userId, {
                user_id: userId,
                plan_id: planId,
                status: planId,
                assignments_used: 0,
                assignment_limit: plan.assignmentLimit,
                has_calendar_access: plan.hasCalendarAccess,
                upgraded_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              });
            }
          }

          console.log(`🎉 User ${userId} upgraded to ${planId} (demo mode)`);
          // Notify all listeners about the subscription change
          this.notifySubscriptionChange();
          
          return {
            success: true,
            message: `Payment processed successfully - upgraded to ${plan.name} (demo mode)`
          };
        } catch (demoError) {
          console.error('❌ Demo payment simulation failed:', demoError);
          return {
            success: false,
            message: 'Demo payment failed: ' + (demoError instanceof Error ? demoError.message : 'Unknown error')
          };
        }
      }

      // PayPal is configured - try to use it
      try {
        console.log('💳 Attempting PayPal payment...');
        // Import PayPal service dynamically to avoid SSR issues
        const { default: PayPalService } = await import('./paypal');
        const paypalService = PayPalService.getInstance();
        
        // Process payment through PayPal
        const paymentResult = await paypalService.processPayment({
          amount: plan.price,
          currency: plan.currency,
          description: `${plan.name} Subscription`,
          payerEmail: paymentData.nameOnCard // In real app, get from user data
        });

        console.log('💳 PayPal payment result:', paymentResult);

        if (paymentResult.success) {
          if (this.isSupabaseConfigured()) {
            // Upsert subscription in Supabase
            console.log(`💾 Upserting subscription in Supabase for user: ${userId}`);
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                plan_id: planId,
                status: planId,
                assignments_used: 0,
                assignment_limit: plan.assignmentLimit,
                has_calendar_access: plan.hasCalendarAccess,
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
                plan_id: planId,
                status: planId,
                assignment_limit: plan.assignmentLimit,
                has_calendar_access: plan.hasCalendarAccess,
                upgraded_at: new Date().toISOString()
              });
            }
          }

          console.log(`🎉 User ${userId} upgraded to ${planId}`);
          // Notify all listeners about the subscription change
          this.notifySubscriptionChange();
          return {
            success: true,
            message: `Successfully upgraded to ${plan.name}`
          };
        } else {
          return {
            success: false,
            message: paymentResult.error || 'Payment failed. Please try again.'
          };
        }
      } catch (paypalError) {
        console.error('💳 PayPal payment error:', paypalError);
        return {
          success: false,
          message: 'PayPal payment failed: ' + (paypalError instanceof Error ? paypalError.message : 'Unknown error')
        };
      }
    } catch (error) {
      console.error('💥 Unexpected error in convertToPaid:', error);
      return {
        success: false,
        message: 'Upgrade failed: ' + (error instanceof Error ? error.message : 'Unknown error')
      };
    }
  }

  /**
   * Check if user has active subscription
   */
  async checkSubscriptionStatus(userId: string): Promise<UserSubscription | null> {
    // Ensure user has a subscription record first
    await this.ensureUserHasSubscription(userId);
    
    try {
      console.log(`🔍 Checking subscription status for user: ${userId}`);
      console.log(`🔧 Supabase configured: ${this.isSupabaseConfigured()}`);
      
      let subscription: any = null;
      
      if (this.isSupabaseConfigured()) {
        // Check if Supabase is actually reachable
        const isReachable = await this.isSupabaseReachable();
        console.log(`🌐 Supabase reachable: ${isReachable}`);
        
        if (isReachable) {
          try {
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
                // Fall back to in-memory storage on error
                console.log(`🔄 Falling back to in-memory storage due to Supabase error`);
                subscription = this.fallbackSubscriptions.get(userId);
              }
            } else {
              console.log(`✅ Found subscription in Supabase:`, supabaseData);
              subscription = supabaseData;
            }
          } catch (supabaseError) {
            console.error(`❌ Supabase connection failed for user ${userId}:`, supabaseError);
            // Fall back to in-memory storage on connection failure
            console.log(`🔄 Falling back to in-memory storage due to connection failure`);
            subscription = this.fallbackSubscriptions.get(userId);
          }
        } else {
          console.log(`🌐 Supabase not reachable, using fallback storage for user: ${userId}`);
          subscription = this.fallbackSubscriptions.get(userId);
        }
      } else {
        // Fallback to in-memory storage
        console.log(`💾 Using fallback storage for user: ${userId}`);
        subscription = this.fallbackSubscriptions.get(userId);
        console.log(`📦 Fallback subscription data:`, subscription);
      }

      if (!subscription) {
        // No subscription found - create a new free subscription
        console.log(`🆕 No subscription found for user ${userId}, creating new free subscription`);
        
        const plan = this.getPlan('free');
        if (!plan) {
          throw new Error('Free plan not found');
        }
        
        if (this.isSupabaseConfigured()) {
          // Create new subscription in Supabase
          console.log(`💾 Creating new subscription in Supabase for user: ${userId}`);
          const { error: insertError } = await supabase
            .from('subscriptions')
            .insert([{
              user_id: userId,
              plan_id: 'free',
              status: 'free',
              assignments_used: 0,
              assignment_limit: 4,
              has_calendar_access: false,
              created_at: new Date().toISOString()
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
            plan_id: 'free',
            status: 'free',
            assignments_used: 0,
            assignment_limit: 4,
            has_calendar_access: false,
            created_at: new Date().toISOString()
          });
          this.fallbackAssignmentCounts.set(userId, 0);
        }

        return {
          userId,
          planId: 'free',
          status: 'free',
          assignmentsUsed: 0,
          assignmentLimit: plan.assignmentLimit,
          hasCalendarAccess: plan.hasCalendarAccess,
          requiresPaymentMethod: false
        };
      }

      // Subscription exists - get the plan details
      const plan = this.getPlan(subscription.plan_id || 'free');
      if (!plan) {
        throw new Error('Plan not found');
      }

      const assignmentsUsed = subscription.assignments_used || 0;
      
      console.log(`🎯 Final status for user ${userId}:`, subscription.status);
      console.log(`📊 Assignments used: ${assignmentsUsed}/${plan.assignmentLimit}`);
      console.log(`📅 Calendar access: ${plan.hasCalendarAccess}`);
      
      return {
        userId,
        planId: subscription.plan_id || 'free',
        status: subscription.status || 'free',
        assignmentsUsed,
        assignmentLimit: plan.assignmentLimit,
        hasCalendarAccess: plan.hasCalendarAccess,
        requiresPaymentMethod: subscription.status === 'free' && assignmentsUsed >= plan.assignmentLimit
      };
    } catch (error) {
      console.error(`❌ Error checking subscription status for user ${userId}:`, error);
      return null;
    }
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
        // No subscription found, allow creation (free tier)
        return true;
      }

      // Check if user has unlimited assignments or still has assignments left
      if (subscription.assignmentLimit === -1) {
        // Unlimited plan
        return true;
      }

      // Check if user has assignments remaining
      return subscription.assignmentsUsed < subscription.assignmentLimit;
    } catch (error) {
      console.error('Error checking assignment creation permission:', error);
      // Default to allowing creation if there's an error
      return true;
    }
  }

  /**
   * Increment assignment count for user
   */
  async incrementAssignmentCount(userId: string): Promise<void> {
    try {
      console.log(`🔢 Incrementing assignment count for user: ${userId}`);
      
      if (!userId) {
        console.error('❌ Cannot increment assignment count: userId is empty');
        return;
      }
      
      if (this.isSupabaseConfigured()) {
        console.log(`💾 Using Supabase to increment count for user: ${userId}`);
        
        // First, ensure user has a subscription record
        await this.ensureUserHasSubscription(userId);
        
        // Get current count first, then update
        const { data: currentData, error: fetchError } = await supabase
          .from('subscriptions')
          .select('assignments_used')
          .eq('user_id', userId)
          .single();

        if (fetchError) {
          console.error('❌ Error fetching current assignment count:', fetchError);
          throw fetchError;
        }

        const currentCount = currentData?.assignments_used || 0;
        const newCount = currentCount + 1;
        
        console.log(`📊 Updating assignment count from ${currentCount} to ${newCount}`);

        // Update assignment count in Supabase
        const { error } = await supabase
          .from('subscriptions')
          .update({ assignments_used: newCount })
          .eq('user_id', userId);

        if (error) {
          console.error('❌ Error incrementing assignment count in Supabase:', error);
          throw error;
        }
        
        console.log(`✅ Successfully incremented assignment count for user: ${userId}`);
      } else {
        console.log(`💾 Using fallback storage to increment count for user: ${userId}`);
        
        // Update in fallback storage
        const currentCount = this.fallbackAssignmentCounts.get(userId) || 0;
        const newCount = currentCount + 1;
        
        console.log(`📊 Updating fallback assignment count from ${currentCount} to ${newCount}`);
        
        this.fallbackAssignmentCounts.set(userId, newCount);
        
        const existingSub = this.fallbackSubscriptions.get(userId);
        if (existingSub) {
          this.fallbackSubscriptions.set(userId, {
            ...existingSub,
            assignments_used: newCount
          });
          console.log(`✅ Successfully incremented assignment count in fallback storage for user: ${userId}`);
        } else {
          console.warn(`⚠️ No existing subscription found in fallback storage for user: ${userId}`);
        }
      }
    } catch (error) {
      console.error('❌ Error incrementing assignment count:', error);
      throw error; // Re-throw to surface the issue
    }
  }

  /**
   * Ensure user has a subscription record, create one if they don't
   */
  private async ensureUserHasSubscription(userId: string): Promise<void> {
    try {
      console.log(`🔍 Checking if user ${userId} has a subscription record...`);
      
      const { data: existingSub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        // No subscription found, create one
        console.log(`📝 Creating free subscription for user: ${userId}`);
        await this.createFreeSubscription(userId);
        console.log(`✅ Created free subscription for user: ${userId}`);
      } else if (fetchError) {
        console.error('❌ Error checking subscription:', fetchError);
        throw fetchError;
      } else {
        console.log(`✅ User ${userId} already has a subscription record`);
      }
    } catch (error) {
      console.error('❌ Error ensuring user has subscription:', error);
      throw error;
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

      // Only paid users can access calendar
      return subscription.hasCalendarAccess;
    } catch (error) {
      console.error('Error checking calendar access:', error);
      // Default to false for calendar access on error
      return false;
    }
  }

  /**
   * Get assignment usage for user
   */
  async getAssignmentUsage(userId: string): Promise<{ used: number; limit: number; remaining: number }> {
    // Ensure user has a subscription record first
    await this.ensureUserHasSubscription(userId);
    
    try {
      const subscription = await this.checkSubscriptionStatus(userId);
      if (!subscription) {
        return { used: 0, limit: 4, remaining: 4 }; // Default free tier
      }

      const remaining = subscription.assignmentLimit === -1 
        ? -1 // Unlimited
        : Math.max(0, subscription.assignmentLimit - subscription.assignmentsUsed);

      return {
        used: subscription.assignmentsUsed,
        limit: subscription.assignmentLimit,
        remaining
      };
    } catch (error) {
      console.error('Error getting assignment usage:', error);
      return { used: 0, limit: 4, remaining: 4 }; // Default free tier
    }
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
}

export default PaymentService; 