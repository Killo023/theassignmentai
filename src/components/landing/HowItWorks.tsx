"use client";

import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Bot, 
  MessageCircle, 
  Download,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe your assignment",
    description: "Tell our AI about your assignment requirements, topic, and any specific guidelines you need to follow.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Bot,
    title: "AI generates draft",
    description: "Our advanced AI creates a well-structured draft with proper formatting, citations, and academic standards.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: MessageCircle,
    title: "Refine via chat",
    description: "Chat with the AI to make improvements, add details, or modify any section of your assignment.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Download,
    title: "Export & submit",
    description: "Download your final assignment in DOCX, PDF, or Excel format, ready for submission.",
    color: "from-orange-500 to-orange-600"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your assignments done in 4 simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary to-primary/20 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                  <div className="bg-background rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6 md:mx-0 ${
                      index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                    }`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                </div>

                {/* Arrow (mobile only) */}
                <div className="md:hidden flex justify-center">
                  <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to transform your academic workflow?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already saving time and improving their grades with AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks; 