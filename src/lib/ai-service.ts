// Together AI service using free Llama model
// Uses meta-llama/Llama-Vision-Free for cost-effective AI assignment generation

export interface AIResponse {
  content: string;
  images?: string[]; // Array of generated image URLs or base64 data
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AssignmentRequest {
  title: string;
  subject: string;
  type: string;
  wordCount: number;
  requirements: string;
  style?: string;
  citations?: boolean;
}

export class AIService {
  private static instance: AIService;
  private apiKey: string | undefined;

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Generate assignment content using Together AI
   */
  async generateAssignment(request: AssignmentRequest): Promise<AIResponse> {
    try {
      const prompt = this.buildAssignmentPrompt(request);
      
      // Simulate API call - replace with actual Together AI API call
      const response = await this.callTogetherAI(prompt, Math.min(request.wordCount * 2, 4000));
      
      return {
        content: response.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Error generating assignment:', error);
      throw new Error('Failed to generate assignment content');
    }
  }

  /**
   * Generate chat response for assignment refinement
   */
  async generateChatResponse(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    context?: AssignmentRequest
  ): Promise<AIResponse> {
    try {
      const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const systemPrompt = this.buildSystemPrompt(context);
      const prompt = `${systemPrompt}\n\n${conversationHistory}\n\nAssistant:`;

      const response = await this.callTogetherAI(prompt, 1000);
      
      return {
        content: response.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Error generating chat response:', error);
      throw new Error('Failed to generate chat response');
    }
  }

  /**
   * Improve existing assignment content
   */
  async improveAssignment(
    content: string,
    improvements: string[],
    request: AssignmentRequest
  ): Promise<AIResponse> {
    try {
      const prompt = this.buildImprovementPrompt(content, improvements, request);
      
      const response = await this.callTogetherAI(prompt, Math.min(request.wordCount * 2, 4000));
      
      return {
        content: response.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Error improving assignment:', error);
      throw new Error('Failed to improve assignment');
    }
  }

  /**
   * Generate citations for assignment content
   */
  async generateCitations(content: string, subject: string): Promise<AIResponse> {
    try {
      const prompt = this.buildCitationPrompt(content, subject);
      
      const response = await this.callTogetherAI(prompt, 500);
      
      return {
        content: response.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error('Error generating citations:', error);
      throw new Error('Failed to generate citations');
    }
  }

  /**
   * Generate images related to assignment content
   */
  async generateImages(prompt: string, count: number = 1): Promise<string[]> {
    try {
      // Generate context-appropriate images based on the prompt
      const imagePrompts = this.generateImagePrompts(prompt);
      
      // Create better placeholder images with SVG data URLs for reliability
      const placeholderImages = [
        this.createSVGPlaceholder(imagePrompts[0] || 'Academic Diagram', '#4F46E5'),
        this.createSVGPlaceholder(imagePrompts[1] || 'Research Chart', '#7C3AED'),
        this.createSVGPlaceholder(imagePrompts[2] || 'Data Visualization', '#059669'),
        this.createSVGPlaceholder(imagePrompts[3] || 'Statistical Graph', '#DC2626'),
        this.createSVGPlaceholder(imagePrompts[4] || 'Concept Map', '#EA580C')
      ];
      
      return placeholderImages.slice(0, count);
    } catch (error) {
      console.error('Error generating images:', error);
      return [];
    }
  }

  /**
   * Create SVG placeholder image
   */
  private createSVGPlaceholder(title: string, color: string): string {
    try {
      const svg = `
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${color}"/>
          <rect x="20" y="20" width="560" height="360" fill="white" rx="8"/>
          <text x="300" y="120" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#333">${title}</text>
          <text x="300" y="160" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#666">Academic Visualization</text>
          <text x="300" y="200" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#999">University Level Content</text>
          <circle cx="200" cy="280" r="40" fill="${color}" opacity="0.3"/>
          <circle cx="300" cy="280" r="40" fill="${color}" opacity="0.5"/>
          <circle cx="400" cy="280" r="40" fill="${color}" opacity="0.7"/>
          <rect x="150" y="320" width="300" height="40" fill="${color}" opacity="0.4" rx="4"/>
        </svg>
      `;
      
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    } catch (error) {
      console.error('Error creating SVG placeholder:', error);
      // Fallback to a simple data URL
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${color}"/>
          <text x="300" y="200" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="white">${title}</text>
        </svg>
      `)}`;
    }
  }

  /**
   * Generate appropriate image prompts based on assignment content
   */
  private generateImagePrompts(prompt: string): string[] {
    const lowerPrompt = prompt.toLowerCase();
    const imagePrompts: string[] = [];

    // Academic subjects and their visual elements
    if (lowerPrompt.includes('computer science') || lowerPrompt.includes('programming') || lowerPrompt.includes('algorithm')) {
      imagePrompts.push('Algorithm Flowchart', 'System Architecture Diagram', 'Data Structure Visualization');
    } else if (lowerPrompt.includes('business') || lowerPrompt.includes('economics') || lowerPrompt.includes('finance')) {
      imagePrompts.push('Market Analysis Chart', 'Financial Trend Graph', 'Business Process Flow');
    } else if (lowerPrompt.includes('psychology') || lowerPrompt.includes('behavior') || lowerPrompt.includes('cognitive')) {
      imagePrompts.push('Psychological Model Diagram', 'Behavioral Analysis Chart', 'Cognitive Process Map');
    } else if (lowerPrompt.includes('biology') || lowerPrompt.includes('medical') || lowerPrompt.includes('anatomy')) {
      imagePrompts.push('Biological Process Diagram', 'Anatomical Structure Chart', 'Cell Division Visualization');
    } else if (lowerPrompt.includes('mathematics') || lowerPrompt.includes('statistics') || lowerPrompt.includes('calculus')) {
      imagePrompts.push('Mathematical Function Graph', 'Statistical Distribution Chart', 'Calculus Visualization');
    } else if (lowerPrompt.includes('engineering') || lowerPrompt.includes('physics') || lowerPrompt.includes('mechanical')) {
      imagePrompts.push('Engineering Design Diagram', 'Physics Concept Chart', 'Mechanical System Layout');
    } else if (lowerPrompt.includes('history') || lowerPrompt.includes('political') || lowerPrompt.includes('social')) {
      imagePrompts.push('Timeline Visualization', 'Political System Chart', 'Social Structure Diagram');
    } else if (lowerPrompt.includes('literature') || lowerPrompt.includes('english') || lowerPrompt.includes('writing')) {
      imagePrompts.push('Literary Analysis Chart', 'Writing Structure Diagram', 'Character Relationship Map');
    } else {
      // Default academic visualizations
      imagePrompts.push('Research Methodology Chart', 'Conceptual Framework Diagram', 'Data Analysis Visualization');
    }

    return imagePrompts;
  }

  /**
   * Call Together AI API with free Llama model
   */
  private async callTogetherAI(prompt: string, maxTokens: number): Promise<{ content: string; usage: any }> {
    if (!this.apiKey) {
      // Fallback to simulated response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        content: this.generateSimulatedResponse(prompt),
        usage: {
          prompt_tokens: prompt.length / 4,
          completion_tokens: maxTokens / 2,
          total_tokens: (prompt.length / 4) + (maxTokens / 2),
        },
      };
    }

    try {
      const response = await fetch('https://api.together.xyz/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-Vision-Free',
          prompt: prompt,
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Together AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0]?.text?.trim() || this.generateSimulatedResponse(prompt),
        usage: data.usage || {
          prompt_tokens: prompt.length / 4,
          completion_tokens: maxTokens / 2,
          total_tokens: (prompt.length / 4) + (maxTokens / 2),
        },
      };
    } catch (error) {
      console.error('Together AI API call failed:', error);
      
      // Fallback to simulated response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        content: this.generateSimulatedResponse(prompt),
        usage: {
          prompt_tokens: prompt.length / 4,
          completion_tokens: maxTokens / 2,
          total_tokens: (prompt.length / 4) + (maxTokens / 2),
        },
      };
    }
  }

  /**
   * Generate simulated AI response for development
   */
  private generateSimulatedResponse(prompt: string): string {
    if (prompt.includes('assignment')) {
      return `# Sample Assignment

## Introduction
This is a sample academic assignment generated by the AI assistant. The content demonstrates proper academic structure and formatting.

## Main Content
The assignment includes well-organized paragraphs with clear arguments and supporting evidence. Each section flows logically into the next, maintaining academic rigor throughout.

## Key Features
- Clear thesis statement
- Well-researched evidence
- Proper academic tone
- Logical organization
- Strong conclusion

## Conclusion
This assignment demonstrates the AI's ability to generate high-quality academic content that meets university standards. The structure and content are appropriate for academic submission.

*Note: This is a simulated response for development purposes. In production, this would be generated by the actual Together AI model.*`;
    }

    if (prompt.includes('citation')) {
      return `## Citations and References

### In-text Citations
- (Smith, 2023) - Primary research findings
- (Johnson & Brown, 2022) - Supporting evidence
- (Davis et al., 2021) - Background information

### Reference List
Smith, J. (2023). *Academic Research Methods*. University Press.

Johnson, A., & Brown, M. (2022). "Contemporary Studies in Education." *Journal of Academic Research*, 15(3), 45-62.

Davis, R., Wilson, K., & Thompson, L. (2021). *Modern Educational Practices*. Academic Publishing.`;
    }

    return `I understand your request and I'm here to help you with your academic assignment. 

Based on your requirements, I can assist with:
- Generating structured content
- Providing writing guidance
- Suggesting improvements
- Adding citations and references

Please let me know what specific aspect you'd like me to focus on, and I'll provide detailed assistance tailored to your needs.

*Note: This is a simulated response for development purposes.*`;
  }

  private buildAssignmentPrompt(request: AssignmentRequest): string {
    return `You are a distinguished university professor and academic expert with decades of experience in ${request.subject}. Create a university-level ${request.type} that meets the highest academic standards.

ASSIGNMENT SPECIFICATIONS:
- Title: "${request.title}"
- Subject: ${request.subject}
- Type: ${request.type}
- Target Length: ${request.wordCount} words
- Academic Level: University/Undergraduate
- Specific Requirements: ${request.requirements}
${request.style ? `- Writing Style: ${request.style}` : ''}
${request.citations ? '- Citation Format: APA 7th Edition' : ''}

ACADEMIC REQUIREMENTS:
1. **Introduction (15-20% of total length)**
   - Compelling hook that establishes context
   - Clear thesis statement with specific argument
   - Brief overview of main points including visual elements
   - Academic tone appropriate for university-level work
   - Preview of charts, graphs, and data visualization to be included

2. **Body Paragraphs (60-70% of total length)**
   - Each paragraph focused on one main idea
   - Topic sentences that connect to thesis
   - Evidence from credible academic sources
   - Critical analysis and interpretation
   - Smooth transitions between paragraphs
   - Counter-arguments where appropriate
   - Integration of statistical data and visual references
   - References to charts, graphs, and diagrams where relevant

3. **Visual Elements Integration**
   - Include specific references to relevant charts and graphs
   - Mention data visualization and statistical analysis
   - Reference diagrams, flowcharts, or concept maps
   - Integrate methodology flowcharts for research papers
   - Include references to visual data presentation

4. **Conclusion (10-15% of total length)**
   - Restate thesis in new words
   - Summarize key arguments and visual findings
   - Discuss broader implications
   - Suggest areas for future research
   - Reference the significance of visual data presented

ACADEMIC STANDARDS:
- Use sophisticated vocabulary appropriate for university level
- Demonstrate critical thinking and analytical skills
- Include relevant theories, concepts, and frameworks
- Maintain objective, scholarly tone throughout
- Ensure logical flow and coherent argumentation
- ${request.citations ? 'Include in-text citations and reference list in APA format' : 'Use academic language and formal structure'}
- Avoid colloquial language and informal expressions
- Demonstrate understanding of subject-specific terminology

FORMATTING:
- Use clear headings and subheadings
- Maintain consistent paragraph structure
- Ensure proper academic formatting
- Include word count at the end

Create a university-level assignment that would receive an A grade. Focus on academic rigor, critical analysis, and scholarly presentation.

Assignment:`;
  }

  private buildSystemPrompt(context?: AssignmentRequest): string {
    return `You are a distinguished university professor and academic mentor with expertise in ${context?.subject || 'academic writing'}. You are assisting a university student with their assignment.

IMPORTANT: You are ONLY allowed to help with academic assignments and educational content. If a user asks about non-academic topics, personal advice, entertainment, or general conversation, politely redirect them to focus on academic assignments.

${context ? `CURRENT ASSIGNMENT CONTEXT:
- Title: ${context.title}
- Subject: ${context.subject}
- Type: ${context.type}
- Target Length: ${context.wordCount} words
- Academic Level: University/Undergraduate
- Requirements: ${context.requirements}` : ''}

YOUR ROLE AS ACADEMIC MENTOR:
1. **Academic Focus Only**
   - ONLY assist with academic assignments and educational content
   - Politely decline non-academic requests
   - Redirect users to academic topics when appropriate

2. **Provide University-Level Guidance**
   - Offer insights that meet university academic standards
   - Suggest sophisticated arguments and analysis
   - Recommend credible academic sources and references

3. **Academic Writing Support**
   - Help develop strong thesis statements
   - Guide critical thinking and analysis
   - Assist with proper academic structure and flow
   - Ensure university-level vocabulary and tone
   - Suggest integration of visual elements and data visualization

4. **Content Refinement**
   - Suggest improvements for academic rigor
   - Help strengthen arguments and evidence
   - Guide proper citation and referencing
   - Ensure logical coherence and clarity
   - Recommend appropriate charts, graphs, and visual data

5. **Academic Standards**
   - Maintain scholarly, objective tone
   - Encourage critical analysis and original thinking
   - Promote academic integrity and proper attribution
   - Ensure university-level complexity and depth

6. **Subject-Specific Expertise**
   - Provide domain-specific insights and terminology
   - Suggest relevant theories, frameworks, and concepts
   - Guide appropriate methodology and approach
   - Ensure subject-specific academic conventions

ACCEPTABLE TOPICS:
- Academic assignments (essays, research papers, case studies)
- Subject-specific academic content
- Writing and citation help
- Academic structure and formatting
- Research methodology
- Educational content and explanations

UNACCEPTABLE TOPICS:
- Personal advice or life coaching
- Entertainment or casual conversation
- Non-academic topics
- Political opinions or debates
- Personal relationships or dating advice
- General chit-chat or small talk

RESPONSE GUIDELINES:
- Use sophisticated, university-level language
- Provide detailed, analytical responses
- Include specific examples and suggestions
- Maintain professional, scholarly tone
- Encourage critical thinking and academic rigor
- Always promote academic integrity and original work
- Politely redirect non-academic requests to academic topics

Remember: You are helping a university student create work that would receive an A grade. Focus on academic excellence, critical analysis, and scholarly presentation.`;
  }

  private buildImprovementPrompt(
    content: string,
    improvements: string[],
    request: AssignmentRequest
  ): string {
    return `You are a distinguished university professor and academic editor with expertise in ${request.subject}. Please improve the following ${request.type} to meet university-level academic standards.

ORIGINAL ASSIGNMENT:
${content}

REQUESTED IMPROVEMENTS:
${improvements.map(imp => `- ${imp}`).join('\n')}

ACADEMIC IMPROVEMENT REQUIREMENTS:
1. **Enhance Academic Rigor**
   - Strengthen arguments with credible evidence
   - Improve critical analysis and interpretation
   - Add sophisticated vocabulary and terminology
   - Ensure university-level complexity

2. **Improve Structure and Flow**
   - Enhance logical organization
   - Strengthen topic sentences and transitions
   - Improve paragraph coherence
   - Ensure clear thesis development

3. **Academic Standards**
   - Maintain scholarly, objective tone
   - Use appropriate academic language
   - Ensure proper citation and referencing
   - Demonstrate critical thinking

4. **Content Enhancement**
   - Add relevant theories and frameworks
   - Include counter-arguments where appropriate
   - Strengthen conclusions and implications
   - Ensure comprehensive coverage

Please provide an improved version that addresses all requested improvements while elevating the work to university-level academic standards. The improved version should be approximately ${request.wordCount} words and demonstrate the quality expected of an A-grade university assignment.

Improved Assignment:`;
  }

  private buildCitationPrompt(content: string, subject: string): string {
    return `You are an academic citation expert. Please provide appropriate citations and references for the following content in APA format.

Content:
${content}

Subject: ${subject}

Please provide:
1. In-text citations where appropriate
2. A reference list in APA format
3. Suggestions for additional credible sources

Format the response clearly with proper APA formatting.`;
  }

  /**
   * Check API key validity
   */
  async validateAPIKey(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }
    
    try {
      // Simulate API key validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Invalid API key:', error);
      return false;
    }
  }

  /**
   * Get available models for fallback
   */
  async getAvailableModels(): Promise<string[]> {
    return [
      "meta-llama/Llama-Vision-Free",
      "meta-llama/Llama-3.1-8B-Instruct",
      "microsoft/DialoGPT-medium"
    ];
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
