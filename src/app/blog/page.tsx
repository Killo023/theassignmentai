"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "AssignmentGPT AI vs ChatGPT: Which is Better for Academic Writing?",
    excerpt: "Discover the key differences between AssignmentGPT AI and ChatGPT for academic writing tasks. Learn which AI tool provides better results for essays, research papers, and assignments.",
    author: "AssignmentGPT Team",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "AI Comparison"
  },
  {
    id: 2,
    title: "Complete Guide to Writing an A+ Essay with AI Assistance",
    excerpt: "Master the art of essay writing with our comprehensive guide. Learn how to use AI tools effectively while maintaining academic integrity and producing high-quality work.",
    author: "Academic Writing Expert",
    date: "2024-01-12",
    readTime: "8 min read",
    category: "Writing Guide"
  },
  {
    id: 3,
    title: "Top 10 AI Tools for Students in 2024",
    excerpt: "Explore the best AI tools that can help students improve their academic performance. From writing assistants to study aids, find the perfect tools for your needs.",
    author: "Tech Education Team",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "AI Tools"
  },
  {
    id: 4,
    title: "How to Avoid Plagiarism When Using AI Writing Tools",
    excerpt: "Learn essential strategies to ensure your AI-assisted writing is original and plagiarism-free. Follow these best practices for academic integrity.",
    author: "Academic Integrity Expert",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Academic Integrity"
  },
  {
    id: 5,
    title: "The Future of AI in Education: What Students Need to Know",
    excerpt: "Explore how artificial intelligence is transforming education and what it means for students. Understand the opportunities and challenges ahead.",
    author: "Education Technology Expert",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Education Technology"
  },
  {
    id: 6,
    title: "13 Free AI Text Generators for Students on a Budget",
    excerpt: "Discover free AI text generation tools that can help students with their assignments without breaking the bank. Quality options for every budget.",
    author: "Budget-Friendly Tech",
    date: "2024-01-03",
    readTime: "4 min read",
    category: "Free Tools"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              AssignmentGPT AI Blog
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Expert insights, tips, and guides to help you excel in your academic journey with AI assistance.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {post.readTime}
                    </span>
                    
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          
          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Load More Articles
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 