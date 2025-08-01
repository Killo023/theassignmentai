import { supabase } from './supabase-client';
import PaymentService from './payment-service';

export interface AssignmentWithDates {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  type: string;
  status: 'draft' | 'in-progress' | 'completed';
  word_count: number;
  is_favorite: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  content?: string;
  requirements?: string;
}

export interface AssignmentInsert {
  user_id: string;
  title: string;
  subject: string;
  type: string;
  status?: 'draft' | 'in-progress' | 'completed';
  word_count?: number;
  is_favorite?: boolean;
  due_date?: string | null;
}

export class AssignmentService {
  private userId: string;
  private paymentService: PaymentService;

  constructor(userId: string) {
    this.userId = userId;
    this.paymentService = PaymentService.getInstance();
    console.log('🔧 AssignmentService initialized with user ID:', userId);
  }

  async getAssignments(): Promise<AssignmentWithDates[]> {
    try {
      console.log('📋 Fetching assignments for user:', this.userId);
      
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching assignments:', error);
        if (error.code === '42P01') {
          console.error('❌ Assignments table does not exist. Please run the Supabase setup script.');
          return [];
        }
        throw error;
      }

      console.log('✅ Successfully fetched assignments:', data?.length || 0);
      console.log('📊 Assignment data:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Error in getAssignments:', error);
      return [];
    }
  }

  async testDatabaseConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing database connection...');
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('assignments')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Database connection test failed:', testError);
        return false;
      }
      
      console.log('✅ Database connection successful');
      
      // Test if we can insert a test record
      const testAssignment = {
        user_id: this.userId,
        title: 'Test Assignment',
        subject: 'Test',
        type: 'Test',
        status: 'draft' as const,
        word_count: 100
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('assignments')
        .insert(testAssignment)
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Test insert failed:', insertError);
        return false;
      }
      
      console.log('✅ Test insert successful:', insertData);
      
      // Clean up test record
      if (insertData?.id) {
        await supabase
          .from('assignments')
          .delete()
          .eq('id', insertData.id);
        console.log('✅ Test record cleaned up');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
  }

  async createAssignment(assignment: Partial<AssignmentWithDates>): Promise<AssignmentWithDates | null> {
    try {
      console.log('🚀 Starting assignment creation...');
      console.log('👤 User ID:', this.userId);
      console.log('📝 Assignment data:', assignment);
      
      // Check if user can create assignments based on their subscription
      const canCreate = await this.paymentService.canCreateAssignment(this.userId);
      console.log('✅ Can create assignment:', canCreate);
      
      if (!canCreate) {
        throw new Error('You have reached your assignment limit. Please upgrade your plan to create more assignments.');
      }

      const assignmentData = this.mapAssignmentToDB(assignment);
      console.log('🗄️ Mapped assignment data for DB:', assignmentData);
      
      const { data, error } = await supabase
        .from('assignments')
        .insert(assignmentData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating assignment:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ Assignment created successfully:', data);

      // Increment assignment count for the user
      console.log(`📝 Assignment created successfully, incrementing count for user: ${this.userId}`);
      await this.paymentService.incrementAssignmentCount(this.userId);
      console.log(`✅ Assignment count incremented for user: ${this.userId}`);

      return data;
    } catch (error) {
      console.error('❌ Error in createAssignment:', error);
      throw error;
    }
  }

  async updateAssignment(id: string, updates: Partial<AssignmentWithDates>): Promise<AssignmentWithDates | null> {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', id)
        .eq('user_id', this.userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating assignment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateAssignment:', error);
      return null;
    }
  }

  async deleteAssignment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id)
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error deleting assignment:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteAssignment:', error);
      return false;
    }
  }

  async toggleFavorite(id: string): Promise<boolean> {
    try {
      const { data: currentAssignment } = await supabase
        .from('assignments')
        .select('is_favorite')
        .eq('id', id)
        .eq('user_id', this.userId)
        .single();

      if (!currentAssignment) {
        throw new Error('Assignment not found');
      }

      const { error } = await supabase
        .from('assignments')
        .update({ is_favorite: !currentAssignment.is_favorite })
        .eq('id', id)
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error toggling favorite:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return false;
    }
  }

  private mapAssignmentToDB(assignment: Partial<AssignmentWithDates>): AssignmentInsert {
    return {
      user_id: this.userId,
      title: assignment.title!,
      subject: assignment.subject!,
      type: assignment.type!,
      status: assignment.status || 'draft',
      word_count: assignment.word_count || 0,
      is_favorite: assignment.is_favorite || false,
      due_date: assignment.due_date || null,
    };
  }

  private mapAssignmentFromDB(data: any): AssignmentWithDates {
    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      subject: data.subject,
      type: data.type,
      status: data.status,
      word_count: data.word_count,
      is_favorite: data.is_favorite,
      due_date: data.due_date,
      created_at: data.created_at,
      updated_at: data.updated_at,
      content: data.content,
      requirements: data.requirements,
    };
  }
} 