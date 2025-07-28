"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  FileText, 
  Download, 
  Edit, 
  Plus, 
  Star, 
  Trash2, 
  Eye,
  Calendar,
  Filter,
  Search,
  Activity,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HistoryItem {
  id: string;
  type: "created" | "edited" | "downloaded" | "favorited" | "deleted" | "viewed";
  title: string;
  description: string;
  timestamp: Date;
  assignmentId?: string;
  metadata?: {
    wordCount?: number;
    format?: string;
    subject?: string;
  };
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    type: "created",
    title: "Research Paper on AI Ethics",
    description: "Created new assignment",
    timestamp: new Date("2024-01-25T10:30:00"),
    assignmentId: "1",
    metadata: {
      wordCount: 2500,
      subject: "Computer Science"
    }
  },
  {
    id: "2",
    type: "edited",
    title: "Business Case Study Analysis",
    description: "Updated assignment content",
    timestamp: new Date("2024-01-25T09:15:00"),
    assignmentId: "2",
    metadata: {
      wordCount: 1800,
      subject: "Business Administration"
    }
  },
  {
    id: "3",
    type: "downloaded",
    title: "Literature Review: Modern Poetry",
    description: "Exported as PDF",
    timestamp: new Date("2024-01-24T16:45:00"),
    assignmentId: "3",
    metadata: {
      format: "PDF",
      subject: "English Literature"
    }
  },
  {
    id: "4",
    type: "favorited",
    title: "Statistical Analysis Report",
    description: "Added to favorites",
    timestamp: new Date("2024-01-24T14:20:00"),
    assignmentId: "4",
    metadata: {
      wordCount: 3200,
      subject: "Statistics"
    }
  },
  {
    id: "5",
    type: "viewed",
    title: "Psychology Research Proposal",
    description: "Viewed assignment details",
    timestamp: new Date("2024-01-24T11:30:00"),
    assignmentId: "5",
    metadata: {
      wordCount: 800,
      subject: "Psychology"
    }
  },
  {
    id: "6",
    type: "downloaded",
    title: "Research Paper on AI Ethics",
    description: "Exported as DOCX",
    timestamp: new Date("2024-01-23T15:10:00"),
    assignmentId: "1",
    metadata: {
      format: "DOCX",
      subject: "Computer Science"
    }
  },
  {
    id: "7",
    type: "edited",
    title: "Business Case Study Analysis",
    description: "Added new sections",
    timestamp: new Date("2024-01-23T13:45:00"),
    assignmentId: "2",
    metadata: {
      wordCount: 1800,
      subject: "Business Administration"
    }
  },
  {
    id: "8",
    type: "created",
    title: "Literature Review: Modern Poetry",
    description: "Created new assignment",
    timestamp: new Date("2024-01-22T10:20:00"),
    assignmentId: "3",
    metadata: {
      wordCount: 1200,
      subject: "English Literature"
    }
  }
];

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const itemDate = item.timestamp;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      switch (dateFilter) {
        case "today":
          matchesDate = itemDate >= today;
          break;
        case "yesterday":
          matchesDate = itemDate >= yesterday && itemDate < today;
          break;
        case "lastWeek":
          matchesDate = itemDate >= lastWeek;
          break;
        case "lastMonth":
          matchesDate = itemDate >= lastMonth;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "created":
        return <Plus className="w-4 h-4" />;
      case "edited":
        return <Edit className="w-4 h-4" />;
      case "downloaded":
        return <Download className="w-4 h-4" />;
      case "favorited":
        return <Star className="w-4 h-4" />;
      case "deleted":
        return <Trash2 className="w-4 h-4" />;
      case "viewed":
        return <Eye className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "created":
        return "bg-green-100 text-green-800 border-green-200";
      case "edited":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "downloaded":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "favorited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "deleted":
        return "bg-red-100 text-red-800 border-red-200";
      case "viewed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getActivityStats = () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayCount = history.filter(item => item.timestamp >= today).length;
    const yesterdayCount = history.filter(item => 
      item.timestamp >= yesterday && item.timestamp < today
    ).length;
    const lastWeekCount = history.filter(item => item.timestamp >= lastWeek).length;
    
    return { todayCount, yesterdayCount, lastWeekCount };
  };

  const stats = getActivityStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity History</h1>
          <p className="text-muted-foreground mt-1">
            Track your assignment activities and progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("timeline")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <FileText className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">{stats.todayCount}</p>
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Yesterday</p>
              <p className="text-2xl font-bold text-foreground">{stats.yesterdayCount}</p>
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
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Week</p>
              <p className="text-2xl font-bold text-foreground">{stats.lastWeekCount}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="all">All Activities</option>
            <option value="created">Created</option>
            <option value="edited">Edited</option>
            <option value="downloaded">Downloaded</option>
            <option value="favorited">Favorited</option>
            <option value="viewed">Viewed</option>
            <option value="deleted">Deleted</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedHistory.length} activity{sortedHistory.length !== 1 ? 'ies' : 'y'} found
        </p>
      </div>

      {/* Timeline View */}
      {viewMode === "timeline" ? (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {sortedHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 w-12 h-12 bg-background border-2 border-primary rounded-full flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                  
                  {item.metadata && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {item.metadata.wordCount && (
                        <span>{item.metadata.wordCount} words</span>
                      )}
                      {item.metadata.format && (
                        <span>Format: {item.metadata.format}</span>
                      )}
                      {item.metadata.subject && (
                        <span>Subject: {item.metadata.subject}</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {sortedHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No activities found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== "all" || dateFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Your activity history will appear here as you use the platform"
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default HistoryPage; 