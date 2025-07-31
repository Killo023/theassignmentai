"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  Copy, 
  Eye,
  EyeOff,
  Settings,
  Save,
  ArrowLeft,
  Plus,
  Crown,
  Lock,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  BookOpen,
  CheckSquare,
  Type,
  Ruler,
  Palette,
  Award,
  Shield,
  BarChart3,
  PieChart,
  TrendingUp,
  Table,
  Bookmark,
  ExternalLink,
  FileSpreadsheet,
  FileImage,
  FileCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TableData, 
  ChartData, 
  Reference 
} from "@/lib/ai-service";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

interface ProfessionalAssignmentDisplayProps {
  assignment: {
    title: string;
    subject: string;
    type: string;
    wordCount: number;
    content: string;
    status: "draft" | "in-progress" | "completed";
    requirements?: string;
    assignmentType?: string;
    academicLevel?: string;
    qualityLevel?: string;
    citations?: boolean;
    citationStyle?: string;
    includeCoverPage?: boolean;
    includeTableOfContents?: boolean;
    includeExecutiveSummary?: boolean;
    includeAppendices?: boolean;
    fontFamily?: string;
    fontSize?: number;
    lineSpacing?: number;
    marginSize?: number;
    pageSize?: string;
    includePageNumbers?: boolean;
    includeHeaders?: boolean;
    includeFooters?: boolean;
    includeMCQ?: boolean;
    mcqCount?: number;
    mcqDifficulty?: string;
    includeAnswerKey?: boolean;
    includeRubric?: boolean;
    includePlagiarismCheck?: boolean;
    includeQualityIndicators?: boolean;
    includeEducationalDisclaimer?: boolean;
    exportFormats?: string[];
  };
  tables: TableData[];
  charts: ChartData[];
  references: Reference[];
  onExport?: (format: string) => void;
  onCopy?: () => void;
  onSave?: () => void;
}

export default function ProfessionalAssignmentDisplay({
  assignment,
  tables,
  charts,
  references,
  onExport,
  onCopy,
  onSave
}: ProfessionalAssignmentDisplayProps) {
  const [showReferences, setShowReferences] = useState(true);
  const [showTables, setShowTables] = useState(true);
  const [showCharts, setShowCharts] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'tables' | 'charts' | 'references'>('content');

  const renderChart = (chart: ChartData) => {
    const chartProps = {
      data: chart.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: chart.title
          }
        },
        ...(chart.options || {})
      }
    };

    switch (chart.type) {
      case 'bar':
        return <Bar {...chartProps} />;
      case 'line':
        return <Line {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'scatter':
        return <Line {...chartProps} />;
      default:
        return <Bar {...chartProps} />;
    }
  };

  const renderTable = (table: TableData) => (
    <div key={table.id} className="mb-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">{table.title}</h3>
        {table.caption && (
          <p className="text-blue-100 text-sm mt-1">{table.caption}</p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {table.headers.map((header, index) => (
                <th key={index} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150`}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200">
                    <div className="flex items-center">
                      {/* Check if cell contains numeric data for better formatting */}
                      {!isNaN(Number(cell)) && cell !== '' ? (
                        <span className="font-mono text-gray-800">
                          {Number(cell).toLocaleString()}
                        </span>
                      ) : cell.includes('%') ? (
                        <span className="font-semibold text-green-600">
                          {cell}
                        </span>
                      ) : cell.includes('$') ? (
                        <span className="font-semibold text-blue-600">
                          {cell}
                        </span>
                      ) : (
                        <span className="text-gray-900">
                          {cell}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {table.source && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <BookOpen className="w-3 h-3 mr-2" />
            <span>Source: {table.source}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderReference = (reference: Reference) => (
    <div key={reference.id} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {reference.citation}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            {reference.fullReference}
          </p>
          <div className="flex items-center gap-2">
            {reference.doi && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <FileCode className="w-3 h-3 mr-1" />
                DOI: {reference.doi}
              </span>
            )}
            {reference.url && (
              <a
                href={reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{assignment.title}</h1>
                <p className="text-sm text-gray-500">{assignment.subject} • {assignment.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Select onValueChange={(value) => onExport?.(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="docx">
                    <div className="flex items-center">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      DOCX
                    </div>
                  </SelectItem>
                  <SelectItem value="xlsx">
                    <div className="flex items-center">
                      <FileImage className="w-4 h-4 mr-2" />
                      XLSX
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2 inline" />
              Content
            </button>
            {tables.length > 0 && (
              <button
                onClick={() => setActiveTab('tables')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tables'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Table className="w-4 h-4 mr-2 inline" />
                Tables ({tables.length})
              </button>
            )}
            {charts.length > 0 && (
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'charts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                Charts ({charts.length})
              </button>
            )}
            {references.length > 0 && (
              <button
                onClick={() => setActiveTab('references')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'references'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bookmark className="w-4 h-4 mr-2 inline" />
                References ({references.length})
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Assignment Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{assignment.title}</h1>
                  <p className="text-blue-100">{assignment.subject} • {assignment.type}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Award className="w-4 h-4 mr-1" />
                      {assignment.academicLevel?.charAt(0).toUpperCase() + assignment.academicLevel?.slice(1)} Level
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {assignment.qualityLevel?.charAt(0).toUpperCase() + assignment.qualityLevel?.slice(1)} Quality
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <FileText className="w-4 h-4 mr-1" />
                      {assignment.wordCount} words
                    </span>
                  </div>
                </div>
                <div className="text-right text-blue-100">
                  <p className="text-sm">Generated Assignment</p>
                  <p className="text-xs opacity-75">University Standard</p>
                </div>
              </div>
            </div>

            {/* Assignment Content */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="whitespace-pre-wrap text-gray-900 leading-relaxed"
                  style={{
                    fontFamily: assignment.fontFamily || 'Times New Roman',
                    fontSize: `${assignment.fontSize || 12}pt`,
                    lineHeight: assignment.lineSpacing || 1.5
                  }}
                >
                  {assignment.content || 'No content available. Please regenerate the assignment.'}
                </div>
                
                {/* Show warning if content seems incomplete */}
                {assignment.content && assignment.wordCount && assignment.content.length < (assignment.wordCount * 0.3) && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Content May Be Incomplete</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          The generated content appears to be shorter than expected. Consider regenerating the assignment with more specific requirements.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tables' && (
          <div className="space-y-6">
            {tables.map(renderTable)}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map((chart) => (
              <div key={chart.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">{chart.title}</h3>
                  {chart.caption && (
                    <p className="text-green-100 text-sm mt-1">{chart.caption}</p>
                  )}
                </div>
                <div className="p-6">
                  <div className="h-80 w-full">
                    <div className="relative w-full h-full">
                      {renderChart(chart)}
                    </div>
                  </div>
                  {chart.source && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <BookOpen className="w-3 h-3 mr-2" />
                        <span>Source: {chart.source}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'references' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">References</h3>
              <p className="text-purple-100 text-sm">
                {assignment.citationStyle || 'APA'} Format • {references.length} Sources
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {references.map(renderReference)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 