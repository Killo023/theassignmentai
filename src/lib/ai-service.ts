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
      
      // Provide more specific error messages
      let errorMessage = 'Error generating assignment. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('repetitive content')) {
          errorMessage = 'The AI generated repetitive content. Please try again with different parameters or requirements.';
        } else if (error.message.includes('All AI models failed')) {
          errorMessage = 'All AI models are currently unavailable. Please try again in a few minutes.';
        } else if (error.message.includes('API key not configured')) {
          errorMessage = 'AI service is not properly configured. Please contact support.';
        } else if (error.message.includes('API request failed')) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later.';
        }
      }
      
      return {
        content: errorMessage,
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

    return `You are an expert academic writer. Generate a comprehensive ${assignmentType} for the following requirements.

CRITICAL INSTRUCTIONS:
- Write the complete assignment content directly
- Do NOT include any confirmation messages or repetitive text
- Do NOT ask for confirmation or additional information
- Generate the full assignment as requested
- Focus on the specific topic and requirements provided
- Use professional academic language throughout

ASSIGNMENT SPECIFICATIONS:
Title: "${request.title}"
Subject: ${request.subject}
Type: ${request.type}
Academic Level: ${academicLevel}
Quality Level: ${qualityLevel}
Word Count: ${request.wordCount} words
Citation Style: ${request.citationStyle || 'APA'}

ACADEMIC STANDARDS (${academicLevel.toUpperCase()} LEVEL):
${academicStandards}

FORMATTING REQUIREMENTS:
${formattingGuidelines}

DATA AND ANALYSIS REQUIREMENTS:
${dataRequirements}

SPECIFIC REQUIREMENTS:
${request.requirements || 'Focus on producing a high-quality, university-standard assignment that demonstrates deep understanding of the subject matter and critical thinking skills.'}

${request.citations ? `CITATION REQUIREMENTS: Include proper ${request.citationStyle || 'APA'} in-text citations and a comprehensive reference list with at least 10-15 academic sources.` : ''}

STRUCTURE REQUIREMENTS:

1. ${request.includeCoverPage ? 'TITLE PAGE: Professional title formatting with student information, course details, and submission date.' : ''}

2. ${request.includeExecutiveSummary ? 'EXECUTIVE SUMMARY: Concise overview of key findings, main conclusions, and recommendations.' : ''}

3. ${request.includeTableOfContents ? 'TABLE OF CONTENTS: Complete section listing with page numbers and professional formatting.' : ''}

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

${request.includeTables ? `TABLE FORMATTING REQUIREMENTS:
- Include realistic, context-appropriate data tables
- Use the following format for each table:
  TABLE:
  TITLE: [Descriptive table title]
  CAPTION: [Table caption explaining the data]
  SOURCE: [Data source or reference]
  [Header1]|[Header2]|[Header3]|[Header4]
  [Data1]|[Data2]|[Data3]|[Data4]
  [Data5]|[Data6]|[Data7]|[Data8]
  [Continue with more rows as needed]
- Ensure all data is realistic and relevant to the topic
- Include proper column headers and row labels
- Use appropriate data types (numbers, percentages, text)
- Include source citations for all data` : ''}

${request.includeCharts ? `CHART FORMATTING REQUIREMENTS:
- Include realistic, context-appropriate charts and graphs
- Use the following format for each chart:
  CHART:
  TITLE: [Descriptive chart title]
  TYPE: [bar|line|pie|scatter]
  CAPTION: [Chart caption explaining the visualization]
  SOURCE: [Data source or reference]
  DATA: [JSON format chart data with labels and datasets]
- Generate realistic data that matches the topic and context
- Use appropriate chart types for the data being presented
- Include proper labels, legends, and color schemes
- Ensure data is consistent with the analysis and conclusions
- Use professional color schemes and formatting` : ''}

IMPORTANT: Generate the complete assignment content now. Do not ask for confirmation or provide repetitive text. Write the full assignment as specified above. Include realistic tables and charts with proper formatting as requested.`;
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
      const dataLines = lines.filter(line => 
        !line.includes('TITLE:') && 
        !line.includes('CAPTION:') && 
        !line.includes('SOURCE:') &&
        line.trim() !== ''
      );
      
      if (dataLines.length < 2) return null;
      
      // Parse headers (first line)
      const headerLine = dataLines[0];
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
      
      if (headers.length === 0) return null;
      
      // Parse data rows (remaining lines)
      const rows = dataLines.slice(1).map(line => {
        const cells = line.split('|').map(cell => cell.trim());
        // Ensure all rows have the same number of columns as headers
        while (cells.length < headers.length) {
          cells.push('');
        }
        return cells.slice(0, headers.length);
      }).filter(row => row.some(cell => cell !== '')); // Remove empty rows
      
      if (rows.length === 0) return null;
      
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
      const dataMatch = chartText.match(/DATA:\s*(\{[\s\S]*?\})/);
      
      // Parse chart type
      const chartType = typeMatch?.[1]?.toLowerCase() || 'bar';
      
      // Try to parse actual chart data from the AI response
      let chartData;
      if (dataMatch && dataMatch[1]) {
        try {
          chartData = JSON.parse(dataMatch[1]);
        } catch (parseError) {
          console.warn('Failed to parse chart data JSON, using fallback:', parseError);
          chartData = this.generateChartData(chartType);
        }
      } else {
        // Generate context-appropriate chart data based on the title and type
        chartData = this.generateContextualChartData(chartType, titleMatch?.[1] || '');
      }
      
      return {
        id: `chart-${index}`,
        title: titleMatch?.[1] || `Chart ${index + 1}`,
        type: chartType as any,
        data: chartData,
        options: this.getChartOptions(chartType, titleMatch?.[1]),
        caption: captionMatch?.[1],
        source: sourceMatch?.[1]
      };
    } catch (error) {
      console.error('Error parsing chart data:', error);
      return null;
    }
  }

  private generateContextualChartData(type: string, title: string): any {
    // Generate more realistic data based on the chart title and type
    const lowerTitle = title.toLowerCase();
    
    // Financial/Performance data
    if (lowerTitle.includes('revenue') || lowerTitle.includes('profit') || lowerTitle.includes('financial')) {
      return this.generateFinancialChartData(type);
    }
    
    // Survey/Research data
    if (lowerTitle.includes('survey') || lowerTitle.includes('response') || lowerTitle.includes('participant')) {
      return this.generateSurveyChartData(type);
    }
    
    // Time series data
    if (lowerTitle.includes('trend') || lowerTitle.includes('growth') || lowerTitle.includes('over time')) {
      return this.generateTimeSeriesChartData(type);
    }
    
    // Demographic data
    if (lowerTitle.includes('age') || lowerTitle.includes('gender') || lowerTitle.includes('demographic')) {
      return this.generateDemographicChartData(type);
    }
    
    // Default to generic data
    return this.generateChartData(type);
  }

  private generateFinancialChartData(type: string): any {
    const years = ['2019', '2020', '2021', '2022', '2023'];
    const revenue = [85, 92, 78, 105, 120];
    const profit = [12, 15, 8, 18, 25];
    const expenses = [73, 77, 70, 87, 95];
    
    switch (type) {
      case 'line':
        return {
          labels: years,
          datasets: [
            {
              label: 'Revenue ($M)',
              data: revenue,
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              fill: true
            },
            {
              label: 'Profit ($M)',
              data: profit,
              borderColor: '#4BC0C0',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              fill: true
            }
          ]
        };
      case 'bar':
        return {
          labels: years,
          datasets: [
            {
              label: 'Revenue ($M)',
              data: revenue,
              backgroundColor: '#36A2EB'
            },
            {
              label: 'Expenses ($M)',
              data: expenses,
              backgroundColor: '#FF6384'
            }
          ]
        };
      default:
        return this.generateChartData(type);
    }
  }

  private generateSurveyChartData(type: string): any {
    const categories = ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'];
    const responses = [45, 30, 15, 8, 2];
    
    switch (type) {
      case 'pie':
        return {
          labels: categories,
          datasets: [{
            data: responses,
            backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384', '#9966FF']
          }]
        };
      case 'bar':
        return {
          labels: categories,
          datasets: [{
            label: 'Number of Responses',
            data: responses,
            backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384', '#9966FF']
          }]
        };
      default:
        return this.generateChartData(type);
    }
  }

  private generateTimeSeriesChartData(type: string): any {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = [65, 72, 68, 75, 82, 78, 85, 90, 88, 92, 95, 98];
    
    switch (type) {
      case 'line':
        return {
          labels: months,
          datasets: [{
            label: 'Growth Trend',
            data: values,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      case 'bar':
        return {
          labels: months,
          datasets: [{
            label: 'Monthly Values',
            data: values,
            backgroundColor: '#36A2EB'
          }]
        };
      default:
        return this.generateChartData(type);
    }
  }

  private generateDemographicChartData(type: string): any {
    const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55+'];
    const percentages = [25, 35, 20, 15, 5];
    
    switch (type) {
      case 'bar':
        return {
          labels: ageGroups,
          datasets: [{
            label: 'Percentage (%)',
            data: percentages,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        };
      case 'pie':
        return {
          labels: ageGroups,
          datasets: [{
            data: percentages,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        };
      default:
        return this.generateChartData(type);
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

  private getChartOptions(type: string, title?: string): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        title: {
          display: true,
          text: title || 'Chart Title',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#fff',
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: true
        }
      },
      scales: type === 'line' || type === 'bar' ? {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      } : {},
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6
        },
        line: {
          tension: 0.4
        }
      }
    };
  }

  private async callTogetherAI(prompt: string, maxTokens: number): Promise<{ content: string; usage: any }> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const models = [
      'meta-llama/Llama-2-70b-chat-hf',
      'meta-llama/Llama-2-13b-chat-hf',
      'meta-llama/Llama-Vision-Free'
    ];

    for (const model of models) {
      try {
        const response = await fetch('https://api.together.xyz/v1/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            prompt: prompt,
            max_tokens: maxTokens,
            temperature: 0.3, // Reduced temperature for more consistent outputs
            top_p: 0.9,
            frequency_penalty: 0.1, // Add frequency penalty to reduce repetition
            presence_penalty: 0.1, // Add presence penalty to encourage diverse content
            stop: ['\n\n\n', 'END_OF_ASSIGNMENT', '---'] // Add stop sequences to prevent runaway generation
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error Response for model ${model}:`, errorText);
          continue; // Try next model
        }

        const data = await response.json();
        
        // Validate the response
        if (!data.choices || !data.choices[0] || !data.choices[0].text) {
          console.error(`Invalid response format from model ${model}`);
          continue; // Try next model
        }

        const content = data.choices[0].text.trim();
        
        // Check for repetitive content
        if (this.isRepetitiveContent(content)) {
          console.error(`Model ${model} generated repetitive content`);
          continue; // Try next model
        }

        return {
          content: content,
          usage: data.usage
        };
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue; // Try next model
      }
    }

    throw new Error('All AI models failed to generate content. Please try again later.');
  }

  private isRepetitiveContent(content: string): boolean {
    // Check for repetitive patterns
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 3) return false;
    
    // Check if the same line appears multiple times
    const uniqueLines = new Set(lines);
    if (uniqueLines.size < lines.length * 0.3) { // If less than 30% unique lines
      return true;
    }
    
    // Check for repetitive phrases
    const words = content.toLowerCase().split(/\s+/);
    const wordCounts = new Map<string, number>();
    
    for (const word of words) {
      if (word.length > 3) { // Only check words longer than 3 characters
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    }
    
    // If any word appears too frequently
    for (const [word, count] of wordCounts) {
      if (count > words.length * 0.1) { // If a word appears more than 10% of the time
        return true;
      }
    }
    
    return false;
  }
}

export const aiService = AIService.getInstance(); 