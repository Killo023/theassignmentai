"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Plus, 
  History, 
  Star, 
  Settings,
  ChevronDown,
  Bot,
  MessageSquare,
  Download,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "New Assignment", href: "/dashboard/new", icon: Plus },
  { name: "My Assignments", href: "/dashboard/assignments", icon: FileText },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Favorites", href: "/dashboard/favorites", icon: Star },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const recentAssignments = [
  { id: 1, title: "Research Paper on AI Ethics", status: "completed", date: "2 days ago" },
  { id: 2, title: "Business Case Study", status: "draft", date: "1 week ago" },
  { id: 3, title: "Literature Review", status: "in-progress", date: "3 days ago" },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(true);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Recent Assignments */}
        {!isCollapsed && (
          <div className="border-t p-4">
            <motion.button
              onClick={() => setIsRecentOpen(!isRecentOpen)}
              className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ x: 2 }}
            >
              <span>Recent Assignments</span>
              <motion.div
                animate={{ rotate: isRecentOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            {isRecentOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {recentAssignments.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">{assignment.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          assignment.status === "completed"
                            ? "bg-green-500"
                            : assignment.status === "draft"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="border-t p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Chat
                </Button>
              </motion.div>
              <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <div className="border-t p-4">
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isCollapsed ? "rotate-90" : "-rotate-90"
              }`}
            />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar; 