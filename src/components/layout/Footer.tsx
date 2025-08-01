"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Heart,
  Shield,
  Award,
  Users
} from "lucide-react";
import Link from "next/link";

const footerLinks = {
  "Trending Tools": [
    "Assignment Writer",
    "Math Problem Solver", 
    "Upload Image and Get Answer",
    "AI Detector & Bypass AI Content",
    "Writing Assistant",
    "GPA Calculator",
    "AI Homework Helper",
    "Code Solver"
  ],
  "Blogs": [
    "Assignmentgpt AI vs Chatgpt...",
    "Guide to Writing Essay...",
    "Best Science calculator...",
    "13 Free AI Text Generator...",
    "Best AI Tools for Teachers..."
  ],
  "Company": [
    "Our Affiliate Program",
    "Contact Us", 
    "Earn Credits 🎁",
    "Pricing",
    "Blogs",
    "Services",
    "About Us",
    "Disclaimer",
    "Write For Us",
    "Review Us",
    "AI Agents"
  ]
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">AssignmentGPT AI</span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Less Stress, Better Grades. Stuck on homework or projects? Use our quick and easy AI tool to sail through your assignments. Get answers, make diagrams, and even code, all without breaking a sweat.
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Shield className="w-4 h-4" />
                  <span>Secure & Reliable</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>500K+ Users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Award className="w-4 h-4" />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-white">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Get the latest updates and exclusive offers</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <span>© 2025 VEDHAS AI TECHNOLOGIES PVT LTD, All rights reserved.</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-6 text-sm"
            >
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms & Conditions
              </Link>
              <div className="flex items-center gap-1 text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for students</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          🎀 Get 55% off the Lifetime plan! Use coupon code AUTOWRITE 🎀
        </div>
      </motion.div>
    </footer>
  );
} 