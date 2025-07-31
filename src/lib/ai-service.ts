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

    return `Generate a university-standard ${request.assignmentType || 'research paper'} on "${request.title}" for ${request.subject} at ${request.academicLevel || 'undergraduate'} level.

ACADEMIC REQUIREMENTS:
${academicStandards}

FORMATTING REQUIREMENTS:
${formattingGuidelines}

DATA AND ANALYSIS REQUIREMENTS:
${dataRequirements}

SPECIFIC REQUIREMENTS:
- Word count: ${request.wordCount} words
- Subject: ${request.subject}
- Type: ${request.type}
- Academic level: ${request.academicLevel || 'undergraduate'}
- Quality level: ${request.qualityLevel || 'standard'}

Additional requirements: ${request.requirements || 'None specified'}

${request.citations ? `CITATION REQUIREMENTS: Please include ${request.citationStyle || 'APA'} citations with proper in-text citations and a comprehensive reference list.` : ''}

STRUCTURE REQUIREMENTS:
1. Executive Summary (if requested)
2. Introduction with clear research objectives
3. Literature Review with critical analysis
4. Methodology section (if applicable)
5. Results and Analysis with ${request.includeTables ? 'detailed tables' : ''} ${request.includeCharts ? 'and charts' : ''}
6. Discussion with implications
7. Conclusion with recommendations
8. References in ${request.citationStyle || 'APA'} format

Please generate a comprehensive, well-structured assignment that meets university standards with proper academic rigor, critical analysis, and professional presentation.`;
  }

  private getAcademicStandards(level?: string): string {
    switch (level) {
      case 'graduate':
        return `- Advanced theoretical framework
- Comprehensive literature review with critical analysis
- Sophisticated methodology with statistical rigor
- Original research contribution
- Peer-reviewed sources only
- Advanced statistical analysis where applicable`;
      case 'postgraduate':
        return `- Doctoral-level theoretical framework
- Extensive literature review with gap analysis
- Rigorous methodology with advanced statistics
- Significant original contribution
- High-impact peer-reviewed sources
- Advanced statistical modeling and analysis`;
      default:
        return `- Solid theoretical foundation
- Comprehensive literature review
- Clear methodology
- Evidence-based analysis
- Academic sources required
- Basic statistical analysis where applicable`;
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
      requirements += `- Include 2-3 detailed tables with real data
- Tables should be properly formatted with headers and captions
- Include source citations for all data
- Tables should support the analysis and conclusions\n`;
    }
    
    if (request.includeCharts) {
      requirements += `- Include 2-3 professional charts/graphs
- Charts should be properly labeled with titles and axes
- Include data visualization that supports the analysis
- Charts should be publication-ready quality\n`;
    }
    
    if (request.includeStatisticalAnalysis) {
      requirements += `- Include statistical analysis where appropriate
- Provide p-values, confidence intervals, and effect sizes
- Include proper statistical notation
- Discuss statistical significance and practical significance\n`;
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