"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does citation work?",
    answer: "Our AI automatically generates citations in APA, MLA, Chicago, and other academic formats. Simply specify your preferred citation style, and the AI will include properly formatted references and in-text citations throughout your document."
  },
  {
    question: "Can I use this for group projects?",
    answer: "Absolutely! Our platform supports collaboration features. You can invite team members, share documents, and work together in real-time. Each team member can contribute and the AI will help coordinate and integrate everyone's work seamlessly."
  },
  {
    question: "What file formats are supported?",
    answer: "We support multiple export formats including Microsoft Word (.docx), PDF, Excel (.xlsx), and plain text. All formats maintain proper formatting, citations, and academic standards. You can also import existing documents to continue working on them."
  },
  {
    question: "Is the content plagiarism-free?",
    answer: "Yes, all content generated by our AI is original and plagiarism-free. We use advanced language models that create unique content based on your requirements. Additionally, we provide plagiarism detection tools to ensure your work meets academic integrity standards."
  },
  {
    question: "How accurate is the AI-generated content?",
    answer: "Our AI is trained on vast academic databases and continuously updated with current research. It provides highly accurate, well-researched content that follows academic standards. However, we always recommend reviewing and fact-checking the content before submission."
  },
  {
    question: "Can I customize the writing style?",
    answer: "Yes, you can specify your preferred writing style, tone, and academic level. Whether you need formal academic writing, creative essays, or technical reports, our AI adapts to your requirements and maintains consistency throughout your document."
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "We offer unlimited revisions and a 30-day money-back guarantee. If you're not completely satisfied with your subscription, you can cancel anytime and receive a full refund. Our support team is also available 24/7 to help you get the best results."
  },
  {
    question: "How secure is my data?",
    answer: "We take data security seriously. All your documents and personal information are encrypted and stored securely. We never share your content with third parties, and you have full control over your data. You can delete your account and all associated data at any time."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about The Assignment AI
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-background rounded-lg border shadow-sm">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you get the most out of The Assignment AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Live Chat
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 