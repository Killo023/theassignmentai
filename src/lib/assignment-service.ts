import { supabase } from './supabase-client';
import PaymentService from './payment-service';
import { TableData, ChartData, Reference } from './ai-service';

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
  
  // Enhanced professional fields
  assignment_type?: string;
  academic_level?: string;
  quality_level?: string;
  
  // Citation and References
  include_citations?: boolean;
  citation_style?: string;
  
  // Structural Elements
  include_cover_page?: boolean;
  include_table_of_contents?: boolean;
  include_executive_summary?: boolean;
  include_appendices?: boolean;
  
  // Formatting Options
  font_family?: string;
  font_size?: number;
  line_spacing?: number;
  margin_size?: number;
  page_size?: string;
  include_page_numbers?: boolean;
  include_headers?: boolean;
  include_footers?: boolean;
  
  // Multiple Choice Questions
  include_mcq?: boolean;
  mcq_count?: number;
  mcq_difficulty?: string;
  include_answer_key?: boolean;
  include_rubric?: boolean;
  
  // Quality Assurance
  include_plagiarism_check?: boolean;
  include_quality_indicators?: boolean;
  include_educational_disclaimer?: boolean;
  
  // Export Options
  export_formats?: string[];
  
  // Visual Elements
  tables_data?: TableData[];
  charts_data?: ChartData[];
  references_data?: Reference[];
  
  // Quality Metrics
  quality_metrics?: any;
  formatting_preferences?: any;
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
  content?: string;
  requirements?: string;
  
  // Enhanced professional fields
  assignment_type?: string;
  academic_level?: string;
  quality_level?: string;
  
  // Citation and References
  include_citations?: boolean;
  citation_style?: string;
  
  // Structural Elements
  include_cover_page?: boolean;
  include_table_of_contents?: boolean;
  include_executive_summary?: boolean;
  include_appendices?: boolean;
  
  // Formatting Options
  font_family?: string;
  font_size?: number;
  line_spacing?: number;
  margin_size?: number;
  page_size?: string;
  include_page_numbers?: boolean;
  include_headers?: boolean;
  include_footers?: boolean;
  
  // Multiple Choice Questions
  include_mcq?: boolean;
  mcq_count?: number;
  mcq_difficulty?: string;
  include_answer_key?: boolean;
  include_rubric?: boolean;
  
  // Quality Assurance
  include_plagiarism_check?: boolean;
  include_quality_indicators?: boolean;
  include_educational_disclaimer?: boolean;
  
  // Export Options
  export_formats?: string[];
  
  // Visual Elements - Stored as JSON strings in database
  tables_data?: string;
  charts_data?: string;
  references_data?: string;
  
  // Quality Metrics - Stored as JSON strings in database
  quality_metrics?: string;
  formatting_preferences?: string;
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
      
      // Parse visual elements from JSONB fields
      const assignments = (data || []).map(assignment => ({
        ...assignment,
        tables_data: assignment.tables_data ? JSON.parse(assignment.tables_data) : [],
        charts_data: assignment.charts_data ? JSON.parse(assignment.charts_data) : [],
        references_data: assignment.references_data ? JSON.parse(assignment.references_data) : [],
        quality_metrics: assignment.quality_metrics ? JSON.parse(assignment.quality_metrics) : {},
        formatting_preferences: assignment.formatting_preferences ? JSON.parse(assignment.formatting_preferences) : {}
      }));
      
      return assignments;
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
        word_count: 100,
        tables_data: JSON.stringify([]),
        charts_data: JSON.stringify([]),
        references_data: JSON.stringify([])
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

      // Parse visual elements from JSONB fields
      const parsedAssignment = {
        ...data,
        tables_data: data.tables_data ? JSON.parse(data.tables_data) : [],
        charts_data: data.charts_data ? JSON.parse(data.charts_data) : [],
        references_data: data.references_data ? JSON.parse(data.references_data) : [],
        quality_metrics: data.quality_metrics ? JSON.parse(data.quality_metrics) : {},
        formatting_preferences: data.formatting_preferences ? JSON.parse(data.formatting_preferences) : {}
      };

      return parsedAssignment;
    } catch (error) {
      console.error('❌ Error in createAssignment:', error);
      throw error;
    }
  }

  async updateAssignment(id: string, updates: Partial<AssignmentWithDates>): Promise<AssignmentWithDates | null> {
    try {
      const mappedUpdates = this.mapAssignmentToDB(updates);
      
      const { data, error } = await supabase
        .from('assignments')
        .update(mappedUpdates)
        .eq('id', id)
        .eq('user_id', this.userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating assignment:', error);
        throw error;
      }

      // Parse visual elements from JSONB fields
      const parsedAssignment = {
        ...data,
        tables_data: data.tables_data ? JSON.parse(data.tables_data) : [],
        charts_data: data.charts_data ? JSON.parse(data.charts_data) : [],
        references_data: data.references_data ? JSON.parse(data.references_data) : [],
        quality_metrics: data.quality_metrics ? JSON.parse(data.quality_metrics) : {},
        formatting_preferences: data.formatting_preferences ? JSON.parse(data.formatting_preferences) : {}
      };

      return parsedAssignment;
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
      content: assignment.content,
      requirements: assignment.requirements,
      
      // Enhanced professional fields
      assignment_type: assignment.assignment_type,
      academic_level: assignment.academic_level,
      quality_level: assignment.quality_level,
      
      // Citation and References
      include_citations: assignment.include_citations,
      citation_style: assignment.citation_style,
      
      // Structural Elements
      include_cover_page: assignment.include_cover_page,
      include_table_of_contents: assignment.include_table_of_contents,
      include_executive_summary: assignment.include_executive_summary,
      include_appendices: assignment.include_appendices,
      
      // Formatting Options
      font_family: assignment.font_family,
      font_size: assignment.font_size,
      line_spacing: assignment.line_spacing,
      margin_size: assignment.margin_size,
      page_size: assignment.page_size,
      include_page_numbers: assignment.include_page_numbers,
      include_headers: assignment.include_headers,
      include_footers: assignment.include_footers,
      
      // Multiple Choice Questions
      include_mcq: assignment.include_mcq,
      mcq_count: assignment.mcq_count,
      mcq_difficulty: assignment.mcq_difficulty,
      include_answer_key: assignment.include_answer_key,
      include_rubric: assignment.include_rubric,
      
      // Quality Assurance
      include_plagiarism_check: assignment.include_plagiarism_check,
      include_quality_indicators: assignment.include_quality_indicators,
      include_educational_disclaimer: assignment.include_educational_disclaimer,
      
      // Export Options
      export_formats: assignment.export_formats,
      
      // Visual Elements - Convert to JSON strings for storage
      tables_data: assignment.tables_data ? JSON.stringify(assignment.tables_data) : '[]',
      charts_data: assignment.charts_data ? JSON.stringify(assignment.charts_data) : '[]',
      references_data: assignment.references_data ? JSON.stringify(assignment.references_data) : '[]',
      
      // Quality Metrics
      quality_metrics: assignment.quality_metrics ? JSON.stringify(assignment.quality_metrics) : JSON.stringify({}),
      formatting_preferences: assignment.formatting_preferences ? JSON.stringify(assignment.formatting_preferences) : JSON.stringify({})
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
      
      // Enhanced professional fields
      assignment_type: data.assignment_type,
      academic_level: data.academic_level,
      quality_level: data.quality_level,
      
      // Citation and References
      include_citations: data.include_citations,
      citation_style: data.citation_style,
      
      // Structural Elements
      include_cover_page: data.include_cover_page,
      include_table_of_contents: data.include_table_of_contents,
      include_executive_summary: data.include_executive_summary,
      include_appendices: data.include_appendices,
      
      // Formatting Options
      font_family: data.font_family,
      font_size: data.font_size,
      line_spacing: data.line_spacing,
      margin_size: data.margin_size,
      page_size: data.page_size,
      include_page_numbers: data.include_page_numbers,
      include_headers: data.include_headers,
      include_footers: data.include_footers,
      
      // Multiple Choice Questions
      include_mcq: data.include_mcq,
      mcq_count: data.mcq_count,
      mcq_difficulty: data.mcq_difficulty,
      include_answer_key: data.include_answer_key,
      include_rubric: data.include_rubric,
      
      // Quality Assurance
      include_plagiarism_check: data.include_plagiarism_check,
      include_quality_indicators: data.include_quality_indicators,
      include_educational_disclaimer: data.include_educational_disclaimer,
      
      // Export Options
      export_formats: data.export_formats,
      
      // Visual Elements - Parse from JSON strings
      tables_data: data.tables_data ? JSON.parse(data.tables_data) : [],
      charts_data: data.charts_data ? JSON.parse(data.charts_data) : [],
      references_data: data.references_data ? JSON.parse(data.references_data) : [],
      
      // Quality Metrics
      quality_metrics: data.quality_metrics ? JSON.parse(data.quality_metrics) : {},
      formatting_preferences: data.formatting_preferences ? JSON.parse(data.formatting_preferences) : {}
    };
  }
}

// Add default export
export default AssignmentService; 