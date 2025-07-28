"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Calendar,
  Tag,
  Heart,
  Filter,
  Grid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface FavoriteAssignment {
  id: string;
  title: string;
  subject: string;
  type: string;
  status: "draft" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  favoritedAt: Date;
  description?: string;
}

const mockFavorites: FavoriteAssignment[] = [
  {
    id: "1",
    title: "Research Paper on AI Ethics",
    subject: "Computer Science",
    type: "Research Paper",
    status: "completed",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    wordCount: 2500,
    favoritedAt: new Date("2024-01-18"),
    description: "Comprehensive analysis of ethical considerations in artificial intelligence development and deployment."
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
    favoritedAt: new Date("2024-01-22"),
    description: "Critical examination of contemporary poetic movements and their cultural significance."
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
    favoritedAt: new Date("2024-01-16"),
    description: "Detailed statistical analysis with comprehensive data visualization and interpretation."
  },
  {
    id: "6",
    title: "Marketing Strategy Analysis",
    subject: "Business Administration",
    type: "Case Study",
    status: "in-progress",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
    wordCount: 2100,
    favoritedAt: new Date("2024-01-20"),
    description: "Strategic marketing analysis with competitive landscape evaluation and recommendations."
  },
  {
    id: "7",
    title: "Environmental Science Research",
    subject: "Environmental Science",
    type: "Research Paper",
    status: "completed",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-14"),
    wordCount: 2800,
    favoritedAt: new Date("2024-01-15"),
    description: "Comprehensive study on climate change impacts and mitigation strategies."
  }
];

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<FavoriteAssignment[]>(mockFavorites);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("favoritedAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredFavorites = favorites.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.description && assignment.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter;
    const matchesSubject = subjectFilter === "all" || assignment.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case "favoritedAt":
        return b.favoritedAt.getTime() - a.favoritedAt.getTime();
      case "updatedAt":
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "wordCount":
        return b.wordCount - a.wordCount;
      default:
        return 0;
    }
  });

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(assignment => assignment.id !== id));
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Favorites</h1>
          <p className="text-muted-foreground mt-1">
            Your saved and favorite assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Favorites</p>
              <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card border rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {favorites.filter(f => f.status === "completed").length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card border rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">
                {favorites.filter(f => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return f.favoritedAt >= weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-card border rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subjects</p>
              <p className="text-2xl font-bold text-foreground">
                {new Set(favorites.map(f => f.subject)).size}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search favorites..."
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
            <option value="English Literature">English Literature</option>
            <option value="Statistics">Statistics</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Environmental Science">Environmental Science</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="favoritedAt">Recently Favorited</option>
            <option value="updatedAt">Recently Updated</option>
            <option value="title">Title A-Z</option>
            <option value="wordCount">Word Count</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedFavorites.length} favorite{sortedFavorites.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Favorites List */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {sortedFavorites.map((assignment, index) => (
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
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)} {assignment.status}
                    </span>
                  </div>
                  
                  {assignment.description && (
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {assignment.description}
                    </p>
                  )}
                  
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
                      Favorited {formatTimeAgo(assignment.favoritedAt)}
                    </span>
                    <span>{assignment.wordCount} words</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFavorite(assignment.id)}
                    className="text-red-600 hover:text-red-700"
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
          {sortedFavorites.map((assignment, index) => (
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
                <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
              </div>
              
              {assignment.description && (
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {assignment.description}
                </p>
              )}
              
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
                  Favorited {formatTimeAgo(assignment.favoritedAt)}
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
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFavorite(assignment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedFavorites.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" || subjectFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Start creating assignments and add them to your favorites"
            }
          </p>
          <Button asChild>
            <Link href="/dashboard/new">
              <FileText className="w-4 h-4 mr-2" />
              Create Assignment
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage; 