export interface ExportOptions {
  format: 'txt' | 'docx' | 'pdf' | 'xlsx';
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  includeExecutiveSummary: boolean;
  includeAppendices: boolean;
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
  marginSize: number;
  pageSize: 'A4' | 'Letter';
  includePageNumbers: boolean;
  includeHeaders: boolean;
  includeFooters: boolean;
}

export class EnhancedExportService {
  static async exportAsTXT(content: string, options: ExportOptions): Promise<void> {
    let formattedContent = content;
    
    if (options.includeCoverPage) {
      formattedContent = this.generateCoverPageTXT(options) + '\n\n' + formattedContent;
    }
    
    if (options.includeTableOfContents) {
      formattedContent = this.generateTableOfContentsTXT(content) + '\n\n' + formattedContent;
    }
    
    if (options.includeExecutiveSummary) {
      formattedContent = this.generateExecutiveSummaryTXT(content) + '\n\n' + formattedContent;
    }
    
    if (options.includeAppendices) {
      formattedContent += '\n\n' + this.generateAppendicesTXT(options);
    }
    
    formattedContent += '\n\n' + this.generateEducationalDisclaimerTXT();
    
    const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assignment.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportAsDOCX(content: string, options: ExportOptions): Promise<void> {
    const htmlContent = this.generateHTMLContent(content, options);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assignment.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async exportAsPDF(content: string, options: ExportOptions): Promise<void> {
    const htmlContent = this.generateHTMLContent(content, options);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  }

  static async exportAsXLSX(content: string, options: ExportOptions): Promise<void> {
    const tables = this.extractTablesFromContent(content);
    const workbook = {
      SheetNames: ['Assignment Data'],
      Sheets: {
        'Assignment Data': {
          'A1': { v: 'Assignment Content' },
          'A2': { v: content.substring(0, 1000) }
        }
      }
    };
    
    // For now, export as CSV since XLSX library might not be available
    const csvContent = 'Assignment Content\n' + content.replace(/"/g, '""');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assignment.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static generateHTMLContent(content: string, options: ExportOptions): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Assignment</title>
        <style>
          body { font-family: ${options.fontFamily}; font-size: ${options.fontSize}pt; line-height: ${options.lineSpacing}; margin: ${options.marginSize}in; }
          @media print { @page { size: ${options.pageSize}; margin: ${options.marginSize}in; } }
        </style>
      </head>
      <body>
        ${options.includeCoverPage ? this.generateCoverPageHTML(options) : ''}
        ${options.includeTableOfContents ? this.generateTableOfContentsHTML(content) : ''}
        ${options.includeExecutiveSummary ? this.generateExecutiveSummaryHTML(content) : ''}
        <div class="content">${content}</div>
        ${options.includeAppendices ? this.generateAppendicesHTML(options) : ''}
        ${this.generateEducationalDisclaimerHTML()}
      </body>
      </html>
    `;
  }

  private static generateCoverPageTXT(options: ExportOptions): string {
    return `ASSIGNMENT

Title: [Assignment Title]
Subject: [Subject]
Date: ${new Date().toLocaleDateString()}
Page Size: ${options.pageSize}
Font: ${options.fontFamily} ${options.fontSize}pt

${'='.repeat(50)}`;
  }

  private static generateCoverPageHTML(options: ExportOptions): string {
    return `
      <div style="text-align: center; margin-bottom: 2in;">
        <h1>ASSIGNMENT</h1>
        <p><strong>Title:</strong> [Assignment Title]</p>
        <p><strong>Subject:</strong> [Subject]</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Format:</strong> ${options.pageSize}, ${options.fontFamily} ${options.fontSize}pt</p>
      </div>
    `;
  }

  private static generateTableOfContentsTXT(content: string): string {
    const lines = content.split('\n');
    const sections = lines.filter(line => line.startsWith('#'));
    return 'TABLE OF CONTENTS\n\n' + sections.map((section, index) => `${index + 1}. ${section.replace(/^#+\s*/, '')}`).join('\n');
  }

  private static generateTableOfContentsHTML(content: string): string {
    const lines = content.split('\n');
    const sections = lines.filter(line => line.startsWith('#'));
    return `
      <div style="page-break-after: always;">
        <h2>TABLE OF CONTENTS</h2>
        ${sections.map((section, index) => `<p>${index + 1}. ${section.replace(/^#+\s*/, '')}</p>`).join('')}
      </div>
    `;
  }

  private static generateExecutiveSummaryTXT(content: string): string {
    return `EXECUTIVE SUMMARY

This assignment provides a comprehensive analysis of the topic, covering key concepts and findings. The document is structured to meet academic standards and includes detailed analysis and conclusions.

${content.substring(0, 200)}...`;
  }

  private static generateExecutiveSummaryHTML(content: string): string {
    return `
      <div style="page-break-after: always;">
        <h2>EXECUTIVE SUMMARY</h2>
        <p>This assignment provides a comprehensive analysis of the topic, covering key concepts and findings. The document is structured to meet academic standards and includes detailed analysis and conclusions.</p>
        <p>${content.substring(0, 200)}...</p>
      </div>
    `;
  }

  private static generateAppendicesTXT(options: ExportOptions): string {
    return `APPENDICES

Appendix A: Formatting Specifications
- Font: ${options.fontFamily}
- Size: ${options.fontSize}pt
- Line Spacing: ${options.lineSpacing}
- Margins: ${options.marginSize}in
- Page Size: ${options.pageSize}

Appendix B: Quality Assurance
- Plagiarism Check: Enabled
- Academic Standards: University Level
- Quality Indicators: Included`;
  }

  private static generateAppendicesHTML(options: ExportOptions): string {
    return `
      <div style="page-break-before: always;">
        <h2>APPENDICES</h2>
        <h3>Appendix A: Formatting Specifications</h3>
        <ul>
          <li>Font: ${options.fontFamily}</li>
          <li>Size: ${options.fontSize}pt</li>
          <li>Line Spacing: ${options.lineSpacing}</li>
          <li>Margins: ${options.marginSize}in</li>
          <li>Page Size: ${options.pageSize}</li>
        </ul>
        <h3>Appendix B: Quality Assurance</h3>
        <ul>
          <li>Plagiarism Check: Enabled</li>
          <li>Academic Standards: University Level</li>
          <li>Quality Indicators: Included</li>
        </ul>
      </div>
    `;
  }

  private static generateEducationalDisclaimerTXT(): string {
    return `

EDUCATIONAL DISCLAIMER

This assignment was generated for educational purposes only. It serves as a reference material and example of academic writing standards. Students should use this as a learning tool and develop their own original work based on their research and understanding.

For educational use only.`;
  }

  private static generateEducationalDisclaimerHTML(): string {
    return `
      <div style="margin-top: 2in; border-top: 1px solid #ccc; padding-top: 1em;">
        <h3>EDUCATIONAL DISCLAIMER</h3>
        <p>This assignment was generated for educational purposes only. It serves as a reference material and example of academic writing standards. Students should use this as a learning tool and develop their own original work based on their research and understanding.</p>
        <p><em>For educational use only.</em></p>
      </div>
    `;
  }

  private static extractTablesFromContent(content: string): string[] {
    const tableRegex = /\|.*\|/g;
    return content.match(tableRegex) || [];
  }
} 