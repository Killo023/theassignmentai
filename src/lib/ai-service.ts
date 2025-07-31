export interface AIResponse {
  content: string;
  tables: TableData[];
  charts: ChartData[];
  references: Reference[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  caption?: string;
  source?: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'histogram';
  data: any;
  options: any;
  caption?: string;
  source?: string;
}

export interface Reference {
  id: string;
  citation: string;
  fullReference: string;
  url?: string;
  doi?: string;
}

export interface AssignmentRequest {
  title: string;
  subject: string;
  type: string;
  wordCount: number;
  requirements: string;
  style?: string;
  citations?: boolean;
  citationStyle?: 'APA' | 'MLA' | 'Chicago' | 'Harvard';
  includeCoverPage?: boolean;
  includeTableOfContents?: boolean;
  includeExecutiveSummary?: boolean;
  includeAppendices?: boolean;
  fontFamily?: string;
  fontSize?: number;
  lineSpacing?: number;
  marginSize?: number;
  includeMCQ?: boolean;
  mcqCount?: number;
  mcqDifficulty?: 'easy' | 'medium' | 'hard';
  includeAnswerKey?: boolean;
  includeRubric?: boolean;
  qualityLevel?: 'standard' | 'high' | 'excellent';
  assignmentType?: 'research_paper' | 'case_study' | 'literature_review' | 'business_report' | 'comparative_analysis' | 'essay' | 'thesis' | 'lab_report' | 'presentation' | 'technical_report';
  academicLevel?: 'undergraduate' | 'graduate' | 'postgraduate';
  includePlagiarismCheck?: boolean;
  includeQualityIndicators?: boolean;
  includeEducationalDisclaimer?: boolean;
  pageSize?: 'A4' | 'Letter';
  includePageNumbers?: boolean;
  includeHeaders?: boolean;
  includeFooters?: boolean;
  exportFormats?: ('txt' | 'docx' | 'pdf' | 'xlsx')[];
  includeTables?: boolean;
  includeCharts?: boolean;
  includeStatisticalAnalysis?: boolean;
}

class AIService {
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

  async generateAssignment(request: AssignmentRequest): Promise<AIResponse> {
    try {
      const prompt = this.buildAssignmentPrompt(request);
      const response = await this.callTogetherAI(prompt, request.wordCount * 3);
      
      // Parse the response to extract tables, charts, and references
      const parsedContent = this.parseAssignmentContent(response.content, request);
      
      return {
        content: parsedContent.content,
        tables: parsedContent.tables,
        charts: parsedContent.charts,
        references: parsedContent.references,
        usage: response.usage
      };
    } catch (error) {
      console.error('Error generating assignment:', error);
      return {
        content: 'Error generating assignment. Please try again.',
        tables: [],
        charts: [],
        references: [],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    }
  }

  async validateAPIKey(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false;
      }
      
      const response = await fetch('https://api.together.xyz/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }

  private buildAssignmentPrompt(request: AssignmentRequest): string {
    const academicStandards = this.getAcademicStandards(request.academicLevel);
    const formattingGuidelines = this.getFormattingGuidelines(request);
    const dataRequirements = this.getDataRequirements(request);
    const assignmentType = request.assignmentType || 'research_paper';
    const academicLevel = request.academicLevel || 'undergraduate';
    const qualityLevel = request.qualityLevel || 'standard';

    return `You are an expert academic writer with extensive experience in university-level assignments. Generate a comprehensive, publication-ready ${assignmentType} that meets the highest academic standards.

ASSIGNMENT DETAILS:
- Title: "${request.title}"
- Subject: ${request.subject}
- Type: ${request.type}
- Academic Level: ${academicLevel}
- Quality Level: ${qualityLevel}
- Word Count: ${request.wordCount} words
- Citation Style: ${request.citationStyle || 'APA'}

ACADEMIC STANDARDS (${academicLevel.toUpperCase()} LEVEL):
${academicStandards}

FORMATTING REQUIREMENTS:
${formattingGuidelines}

DATA AND ANALYSIS REQUIREMENTS:
${dataRequirements}

UNIVERSITY-LEVEL STRUCTURE REQUIREMENTS:

1. TITLE PAGE (if cover page requested):
   - Professional title formatting
   - Student information
   - Course and instructor details
   - Submission date

2. EXECUTIVE SUMMARY (if requested):
   - Concise overview of key findings
   - Main conclusions and recommendations
   - Professional executive summary format

3. TABLE OF CONTENTS (if requested):
   - Complete section listing with page numbers
   - Professional formatting

4. INTRODUCTION:
   - Clear research problem statement
   - Specific research objectives and questions
   - Significance and scope of the study
   - Brief overview of methodology
   - Professional academic tone throughout

5. LITERATURE REVIEW:
   - Comprehensive critical analysis of existing research
   - Identification of research gaps
   - Theoretical framework development
   - Synthesis of key findings from multiple sources
   - Critical evaluation of methodologies used in previous studies

6. METHODOLOGY (if applicable):
   - Detailed research design description
   - Clear justification for chosen methods
   - Data collection procedures
   - Analysis approach with statistical methods
   - Ethical considerations
   - Limitations and validity measures

7. RESULTS AND ANALYSIS:
   - Systematic presentation of findings
   - ${request.includeTables ? 'Professional tables with proper formatting, headers, and captions' : ''}
   - ${request.includeCharts ? 'Publication-quality charts and graphs with clear labels and legends' : ''}
   - ${request.includeStatisticalAnalysis ? 'Comprehensive statistical analysis with p-values, confidence intervals, and effect sizes' : ''}
   - Clear interpretation of results
   - Statistical significance discussion

8. DISCUSSION:
   - Critical analysis of findings in context of literature
   - Implications for theory and practice
   - Limitations and future research directions
   - Practical applications and recommendations

9. CONCLUSION:
   - Summary of key findings
   - Restatement of research contribution
   - Practical implications
   - Recommendations for future research

10. REFERENCES:
    - Complete reference list in ${request.citationStyle || 'APA'} format
    - All sources properly cited
    - Academic sources only (peer-reviewed journals, books, reputable websites)

QUALITY REQUIREMENTS:
- Use sophisticated academic vocabulary appropriate for ${academicLevel} level
- Maintain consistent professional tone throughout
- Ensure logical flow and coherence between sections
- Include critical analysis and original insights
- Provide evidence-based arguments with proper citations
- Use clear, concise, and precise language
- Avoid colloquialisms and informal language
- Ensure all claims are supported by evidence
- Include proper transitions between sections
- Maintain academic objectivity and neutrality

ADDITIONAL REQUIREMENTS:
${request.requirements || 'Focus on producing a high-quality, university-standard assignment that demonstrates deep understanding of the subject matter and critical thinking skills.'}

${request.citations ? `CITATION REQUIREMENTS: Include proper ${request.citationStyle || 'APA'} in-text citations and a comprehensive reference list with at least 10-15 academic sources.` : ''}

IMPORTANT: This assignment must meet university-level standards with professional presentation, rigorous analysis, and academic excellence. Write as if this will be submitted to a university professor for grading.`;
  }

  private getAcademicStandards(level?: string): string {
    switch (level) {
      case 'graduate':
        return `- Advanced theoretical framework with sophisticated conceptual models
- Comprehensive literature review with critical analysis and synthesis of 20+ sources
- Sophisticated methodology with statistical rigor and advanced research design
- Original research contribution with novel insights and theoretical advancement
- Peer-reviewed sources only (minimum 15-20 academic sources)
- Advanced statistical analysis with multivariate techniques, regression analysis, and significance testing
- Critical evaluation of existing research methodologies and findings
- Clear identification of research gaps and theoretical contributions
- Professional academic writing with sophisticated vocabulary and complex sentence structures
- Rigorous argumentation with multiple supporting evidence sources
- Comprehensive discussion of limitations and future research directions`;
      case 'postgraduate':
        return `- Doctoral-level theoretical framework with innovative conceptual development
- Extensive literature review with comprehensive gap analysis and theoretical synthesis
- Rigorous methodology with advanced statistics, mixed-methods approaches, and sophisticated research design
- Significant original contribution with substantial theoretical and practical implications
- High-impact peer-reviewed sources (minimum 25-30 academic sources from top-tier journals)
- Advanced statistical modeling with complex analyses, structural equation modeling, and advanced techniques
- Critical evaluation of existing paradigms and theoretical frameworks
- Clear identification of significant research gaps and theoretical contributions
- Exceptional academic writing with sophisticated vocabulary and complex argumentation
- Rigorous critical analysis with multiple evidence streams and theoretical perspectives
- Comprehensive discussion of limitations, implications, and future research directions
- Publication-quality analysis suitable for peer-reviewed journals`;
      default:
        return `- Solid theoretical foundation with clear conceptual framework
- Comprehensive literature review with critical analysis of 10-15 sources
- Clear methodology with appropriate research design and data collection methods
- Evidence-based analysis with proper statistical techniques where applicable
- Academic sources required (minimum 8-12 peer-reviewed sources)
- Basic statistical analysis with descriptive statistics, correlation analysis, and significance testing
- Critical evaluation of existing research and findings
- Clear identification of research gaps and practical implications
- Professional academic writing with appropriate vocabulary and sentence structure
- Logical argumentation with supporting evidence and citations
- Discussion of limitations and recommendations for future research
- Undergraduate-level rigor suitable for university submission`;
    }
  }

  private getFormattingGuidelines(request: AssignmentRequest): string {
    return `- Font: ${request.fontFamily || 'Times New Roman'}
- Size: ${request.fontSize || 12}pt
- Line spacing: ${request.lineSpacing || 1.5}
- Margins: ${request.marginSize || 1} inch
- Page size: ${request.pageSize || 'A4'}
- Page numbers: ${request.includePageNumbers ? 'Included' : 'Not included'}
- Headers/Footers: ${request.includeHeaders ? 'Included' : 'Not included'}
- Cover page: ${request.includeCoverPage ? 'Required' : 'Not required'}
- Table of contents: ${request.includeTableOfContents ? 'Required' : 'Not required'}`;
  }

  private getDataRequirements(request: AssignmentRequest): string {
    let requirements = '';
    
    if (request.includeTables) {
      requirements += `- Include 3-5 detailed tables with comprehensive data
- Tables must be professionally formatted with clear headers, proper alignment, and captions
- Include source citations for all data with proper academic references
- Tables should support the analysis and provide evidence for conclusions
- Use appropriate table formatting with borders, shading, and professional presentation
- Include descriptive statistics, frequency distributions, and comparative data where applicable
- Ensure all tables are publication-ready with proper academic formatting\n`;
    }
    
    if (request.includeCharts) {
      requirements += `- Include 3-5 professional charts/graphs with publication-quality formatting
- Charts must be properly labeled with clear titles, axis labels, and legends
- Include comprehensive data visualization that supports the analysis and conclusions
- Use appropriate chart types (bar charts, line graphs, pie charts, scatter plots) based on data type
- Ensure charts are publication-ready with professional color schemes and formatting
- Include trend analysis, comparative visualizations, and statistical representations
- Provide clear interpretation of chart findings in the accompanying text\n`;
    }
    
    if (request.includeStatisticalAnalysis) {
      requirements += `- Include comprehensive statistical analysis with proper academic rigor
- Provide detailed p-values, confidence intervals, effect sizes, and significance levels
- Include proper statistical notation and formulas with clear explanations
- Discuss both statistical significance and practical significance of findings
- Use appropriate statistical tests (t-tests, ANOVA, regression, correlation) based on research design
- Include descriptive statistics, inferential statistics, and effect size calculations
- Provide clear interpretation of statistical results with academic precision
- Address assumptions of statistical tests and discuss limitations of analysis\n`;
    }
    
        if (!request.includeTables && !request.includeCharts && !request.includeStatisticalAnalysis) {
      requirements += `- Focus on comprehensive textual analysis and argumentation
- Provide detailed qualitative analysis with supporting evidence
- Include thorough literature review and critical discussion
- Ensure all claims are supported by academic sources and logical reasoning\n`;
    }
    
    return requirements || '- No specific data requirements';
  }

  private parseAssignmentContent(content: string, request: AssignmentRequest): {
    content: string;
    tables: TableData[];
    charts: ChartData[];
    references: Reference[];
  } {
    const tables: TableData[] = [];
    const charts: ChartData[] = [];
    const references: Reference[] = [];
    
    // Extract tables from content
    const tableMatches = content.match(/TABLE:\s*([\s\S]*?)(?=TABLE:|$)/g);
    if (tableMatches) {
      tableMatches.forEach((match, index) => {
        const tableData = this.parseTableData(match, index);
        if (tableData) tables.push(tableData);
      });
    }
    
    // Extract charts from content
    const chartMatches = content.match(/CHART:\s*([\s\S]*?)(?=CHART:|$)/g);
    if (chartMatches) {
      chartMatches.forEach((match, index) => {
        const chartData = this.parseChartData(match, index);
        if (chartData) charts.push(chartData);
      });
    }
    
    // Extract references from content
    const referenceMatches = content.match(/REFERENCE:\s*([\s\S]*?)(?=REFERENCE:|$)/g);
    if (referenceMatches) {
      referenceMatches.forEach((match, index) => {
        const referenceData = this.parseReferenceData(match, index);
        if (referenceData) references.push(referenceData);
      });
    }
    
    // Clean content by removing table/chart/reference markers
    const cleanContent = content
      .replace(/TABLE:\s*[\s\S]*?(?=TABLE:|$)/g, '')
      .replace(/CHART:\s*[\s\S]*?(?=CHART:|$)/g, '')
      .replace(/REFERENCE:\s*[\s\S]*?(?=REFERENCE:|$)/g, '')
      .trim();
    
    return {
      content: cleanContent,
      tables,
      charts,
      references
    };
  }

  private parseTableData(tableText: string, index: number): TableData | null {
    try {
      const lines = tableText.split('\n').filter(line => line.trim());
      if (lines.length < 2) return null;
      
      const titleMatch = tableText.match(/TITLE:\s*(.+)/);
      const captionMatch = tableText.match(/CAPTION:\s*(.+)/);
      const sourceMatch = tableText.match(/SOURCE:\s*(.+)/);
      
      // Extract headers and rows from the table data
      const dataLines = lines.filter(line => !line.includes('TITLE:') && !line.includes('CAPTION:') && !line.includes('SOURCE:'));
      
      if (dataLines.length < 2) return null;
      
      const headers = dataLines[0].split('|').map(h => h.trim()).filter(h => h);
      const rows = dataLines.slice(1).map(line => 
        line.split('|').map(cell => cell.trim()).filter(cell => cell)
      );
      
      return {
        id: `table-${index}`,
        title: titleMatch?.[1] || `Table ${index + 1}`,
        headers,
        rows,
        caption: captionMatch?.[1],
        source: sourceMatch?.[1]
      };
    } catch (error) {
      console.error('Error parsing table data:', error);
      return null;
    }
  }

  private parseChartData(chartText: string, index: number): ChartData | null {
    try {
      const titleMatch = chartText.match(/TITLE:\s*(.+)/);
      const typeMatch = chartText.match(/TYPE:\s*(.+)/);
      const captionMatch = chartText.match(/CAPTION:\s*(.+)/);
      const sourceMatch = chartText.match(/SOURCE:\s*(.+)/);
      
      // Generate sample chart data based on the type
      const chartType = typeMatch?.[1]?.toLowerCase() || 'bar';
      const data = this.generateChartData(chartType);
      
      return {
        id: `chart-${index}`,
        title: titleMatch?.[1] || `Chart ${index + 1}`,
        type: chartType as any,
        data,
        options: this.getChartOptions(chartType),
        caption: captionMatch?.[1],
        source: sourceMatch?.[1]
      };
    } catch (error) {
      console.error('Error parsing chart data:', error);
      return null;
    }
  }

  private parseReferenceData(referenceText: string, index: number): Reference | null {
    try {
      const citationMatch = referenceText.match(/CITATION:\s*(.+)/);
      const fullRefMatch = referenceText.match(/FULL_REFERENCE:\s*(.+)/);
      const urlMatch = referenceText.match(/URL:\s*(.+)/);
      const doiMatch = referenceText.match(/DOI:\s*(.+)/);
      
      return {
        id: `ref-${index}`,
        citation: citationMatch?.[1] || '',
        fullReference: fullRefMatch?.[1] || '',
        url: urlMatch?.[1],
        doi: doiMatch?.[1]
      };
    } catch (error) {
      console.error('Error parsing reference data:', error);
      return null;
    }
  }

  private generateChartData(type: string): any {
    switch (type) {
      case 'bar':
        return {
          labels: ['Category A', 'Category B', 'Category C', 'Category D'],
          datasets: [{
            label: 'Values',
            data: [65, 59, 80, 81],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        };
      case 'line':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Trend',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#36A2EB',
            fill: false
          }]
        };
      case 'pie':
        return {
          labels: ['Red', 'Blue', 'Yellow', 'Green'],
          datasets: [{
            data: [300, 50, 100, 40],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        };
      default:
        return {
          labels: ['Category A', 'Category B', 'Category C'],
          datasets: [{
            label: 'Values',
            data: [65, 59, 80],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        };
    }
  }

  private getChartOptions(type: string): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Chart Title'
        }
      }
    };
  }

  private async callTogetherAI(prompt: string, maxTokens: number): Promise<{ content: string; usage: any }> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-Vision-Free',
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].text,
      usage: data.usage
    };
  }
}

export const aiService = AIService.getInstance(); 