"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is AssignmentGPT AI?",
    answer: "AssignmentGPT AI is an AI-powered writing assistant designed to help students, blog writers, and teachers with their writing needs. It provides specific answers for assignments and homework, offers clear guidance, and follows academic standards closely."
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up for a free account and choose your writing goal to begin. You can start with our free trial that includes 800 words/day and access to basic tools."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, all data is encrypted and stored securely. We prioritize your privacy and follow industry-standard security practices to protect your information."
  },
  {
    question: "Can AssignmentGPT AI help with academic writing?",
    answer: "Absolutely, it can assist in generating essays, research papers, case studies, literature reviews, business reports, and even provide homework solutions with proper citations and references."
  },
  {
    question: "What about blog writing?",
    answer: "Yes, AssignmentGPT AI can generate SEO-friendly, engaging blog posts tailored to your audience with proper formatting and structure."
  },
  {
    question: "Is it useful for teachers?",
    answer: "Certainly, teachers can use it to create lesson plans, quizzes, and other educational content. It's designed to support both students and educators."
  },
  {
    question: "How does the plagiarism checker work?",
    answer: "Our advanced algorithms compare your content with millions of documents to ensure originality. We provide detailed reports on content authenticity and suggest improvements."
  },
  {
    question: "Can I use it for social media?",
    answer: "Yes, you can create compelling social media posts for platforms like Facebook, Twitter, and Instagram with our specialized content generation tools."
  },
  {
    question: "What formats can I download my content in?",
    answer: "You can download your content in PDF, Word, or Google Docs formats. We also support Excel for data analysis and charts."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a limited-time free trial for new users to explore our features. You can start with 800 words/day and basic tools to see how it works."
  },
  {
    question: "How do I upgrade my account?",
    answer: "You can upgrade your account through the \"Settings\" tab on your dashboard or by visiting our pricing page to choose the plan that best fits your needs."
  },
  {
    question: "Can I collaborate with others?",
    answer: "Yes, AssignmentGPT AI allows for real-time collaboration on documents. Premium plans include advanced collaboration features for team projects."
  },
  {
    question: "Is customer support available?",
    answer: "Our customer support team is available 24/7 to assist you with any queries. We offer email support for free users and priority support for premium subscribers."
  },
  {
    question: "How often are new features added?",
    answer: "We regularly update our platform to include new features based on user feedback. We're constantly improving our AI models and adding new tools to enhance your experience."
  },
  {
    question: "Do you offer an affiliate program?",
    answer: "Absolutely! We've introduced our affiliate program to make it easy for you to earn by promoting AssignmentGPT AI subscriptions. As an affiliate, you'll earn a 20% commission on each sale you generate with no maximum limit to your potential earnings."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Frequently Asked Questions ❔
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Everything you need to know about AssignmentGPT AI. Can't find the answer you're looking for? Please chat to our friendly team.
          </motion.p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openIndex === index ? (
                        <Minus className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500" />
                      )}
                    </motion.div>
                  </div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@assignmentgpt.ai"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Contact Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                View Documentation
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 