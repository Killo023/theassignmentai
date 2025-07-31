"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  Star, 
  Eye,
  FileText,
  Calendar,
  Tag,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AssignmentService } from "@/lib/assignment-service";
import { EnhancedExportService } from "@/lib/enhanced-export-service";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  type: string;
  status: "draft" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  isFavorite: boolean;
  content?: string;
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Research Paper on AI Ethics",
    subject: "Computer Science",
    type: "Research Paper",
    status: "completed",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    wordCount: 2500,
    isFavorite: true
  },
  {
    id: "2",
    title: "Business Case Study Analysis",
    subject: "Business Administration",
    type: "Case Study",
    status: "in-progress",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-22"),
    wordCount: 1800,
    isFavorite: false
  },
  {
    id: "3",
    title: "Literature Review: Modern Poetry",
    subject: "English Literature",
    type: "Literature Review",
    status: "draft",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-21"),
    wordCount: 1200,
    isFavorite: true
  },
  {
    id: "4",
    title: "Statistical Analysis Report",
    subject: "Statistics",
    type: "Report",
    status: "completed",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
    wordCount: 3200,
    isFavorite: false
  },
  {
    id: "5",
    title: "Psychology Research Proposal",
    subject: "Psychology",
    type: "Proposal",
    status: "draft",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    wordCount: 800,
    isFavorite: false
  }
];

const AssignmentsPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isLoading, setIsLoading] = useState(true);

  const assignmentService = user ? new AssignmentService(user.id) : null;

  useEffect(() => {
    const loadAssignments = async () => {
      if (!assignmentService) return;
      
      try {
        setIsLoading(true);
        const data = await assignmentService.getAssignments();
        setAssignments(data.map(assignment => ({
          id: assignment.id,
          title: assignment.title,
          subject: assignment.subject,
          type: assignment.type,
          status: assignment.status,
          createdAt: new Date(assignment.created_at),
          updatedAt: new Date(assignment.updated_at),
          wordCount: assignment.word_count,
          isFavorite: assignment.is_favorite,
          content: assignment.content
        })));
      } catch (error) {
        console.error('Error loading assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignments();
  }, [assignmentService]);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    const matchesSubject = subjectFilter === "all" || assignment.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
      case "updatedAt":
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case "createdAt":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "wordCount":
        return b.wordCount - a.wordCount;
      default:
        return 0;
    }
  });

  const toggleFavorite = async (id: string) => {
    if (!assignmentService) return;
    
    try {
      const success = await assignmentService.toggleFavorite(id);
      if (success) {
        setAssignments(prev => 
          prev.map(assignment => 
            assignment.id === id 
              ? { ...assignment, isFavorite: !assignment.isFavorite }
              : assignment
          )
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteAssignment = async (id: string) => {
    if (!assignmentService) return;
    
    try {
      const success = await assignmentService.deleteAssignment(id);
      if (success) {
        setAssignments(prev => prev.filter(assignment => assignment.id !== id));
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const exportAssignment = async (assignment: Assignment, format: string) => {
    try {
      const options = {
        format: format as "txt" | "docx" | "pdf" | "xlsx",
        includeCoverPage: false,
        includeTableOfContents: false,
        includeExecutiveSummary: false,
        includeAppendices: false,
        fontFamily: "Times New Roman",
        fontSize: 12,
        lineSpacing: 1.5,
        marginSize: 1,
        pageSize: "A4",
        includePageNumbers: true,
        includeHeaders: true,
        includeFooters: true,
      };

      switch (format) {
        case "txt":
          await EnhancedExportService.exportAsTXT(assignment.content || '', options);
          break;
        case "docx":
          await EnhancedExportService.exportAsDOCX(assignment.content || '', options);
          break;
        case "pdf":
          await EnhancedExportService.exportAsPDF(assignment.content || '', options);
          break;
        case "xlsx":
          await EnhancedExportService.exportAsXLSX(assignment.content || '', options);
          break;
      }
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "🔄";
      case "draft":
        return "📝";
      default:
        return "📄";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your academic assignments
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600">
            <Link href="/dashboard/new" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Assignment
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="all">All Subjects</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business Administration">Business Administration</option>
            <option value="English Literature">English Literature</option>
            <option value="Statistics">Statistics</option>
            <option value="Psychology">Psychology</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="updatedAt">Recently Updated</option>
            <option value="createdAt">Recently Created</option>
            <option value="title">Title A-Z</option>
            <option value="wordCount">Word Count</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedAssignments.length} assignment{sortedAssignments.length !== 1 ? 's' : ''} found
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <FileText className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Assignments List */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {sortedAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {assignment.title}
                    </h3>
                    {assignment.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)} {assignment.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {assignment.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {assignment.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {assignment.updatedAt.toLocaleDateString()}
                    </span>
                    <span>{assignment.wordCount} words</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => exportAssignment(assignment, 'pdf')}
                    title="Export as PDF"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => exportAssignment(assignment, 'docx')}
                    title="Export as DOCX"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleFavorite(assignment.id)}
                    title={assignment.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${assignment.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteAssignment(assignment.id)}
                    title="Delete assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                  {assignment.title}
                </h3>
                {assignment.isFavorite && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  {assignment.subject}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  {assignment.type}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {assignment.updatedAt.toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {assignment.wordCount} words
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}>
                  {getStatusIcon(assignment.status)} {assignment.status}
                </span>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => exportAssignment(assignment, 'pdf')}
                    title="Export as PDF"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleFavorite(assignment.id)}
                    title={assignment.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${assignment.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignments...</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && sortedAssignments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No assignments found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" || subjectFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first assignment to get started"
            }
          </p>
          <Button asChild>
            <Link href="/dashboard/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AssignmentsPage; 