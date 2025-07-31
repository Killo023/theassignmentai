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
  Trash2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "New Assignment", href: "/dashboard/new", icon: Plus },
  { name: "My Assignments", href: "/dashboard/assignments", icon: FileText },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
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
      className="h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block hidden"
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
                    whileHover={{ x: 3, transition: { duration: 0.2 } }}
                    className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{assignment.date}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : assignment.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {assignment.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar; 