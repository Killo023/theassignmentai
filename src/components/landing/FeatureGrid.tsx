"use client";

import { motion } from "framer-motion";
import { 
  Bot, 
  MessageSquare, 
  FileText, 
  Zap, 
  Users, 
  Shield,
  Clock,
  CheckCircle,
  Sparkles
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Bot,
    title: "AI Document Generation",
    description: "Describe your assignment requirements and get instant, well-structured drafts with proper formatting and citations.",
    benefits: ["Instant draft generation", "Proper academic formatting", "Automatic citations"],
    color: "from-blue-500 to-blue-600",
    image: "/images/ai-generation.jpg"
  },
  {
    icon: MessageSquare,
    title: "Real-time Refinement",
    description: "Chat with AI to iterate, improve, and perfect your content with intelligent suggestions and feedback.",
    benefits: ["Interactive chat interface", "Smart suggestions", "Version history"],
    color: "from-purple-500 to-purple-600",
    image: "/images/chat-refinement.jpg"
  },
  {
    icon: FileText,
    title: "Multi-format Export",
    description: "Export your assignments in multiple formats including DOCX, PDF, and Excel with one-click convenience.",
    benefits: ["Multiple formats", "One-click export", "Professional formatting"],
    color: "from-green-500 to-green-600",
    image: "/images/export-formats.jpg"
  }
];

const FeatureGrid = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-10 opacity-10"
      >
        <Sparkles className="w-12 h-12 text-primary" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 right-10 opacity-10"
      >
        <Sparkles className="w-16 h-16 text-purple-500" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need for academic success
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed specifically for university students and researchers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
              style={{ perspective: "1000px" }}
            >
              <motion.div 
                className="bg-background rounded-xl shadow-sm border hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                whileHover={{ 
                  rotateY: 5,
                  rotateX: 2,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Feature Image */}
                <motion.div
                  className="relative h-48 overflow-hidden rounded-t-xl"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback gradient if image fails to load
                      e.currentTarget.style.background = `linear-gradient(135deg, ${feature.color})`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Floating Icon Overlay */}
                  <motion.div
                    className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg"
                    whileHover={{ 
                      rotateY: 15,
                      scale: 1.1,
                      transition: { duration: 0.3 }
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="p-6">
                  {/* Background Gradient Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      background: [
                        "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.05), transparent)",
                        "linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.05), transparent)",
                        "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.05), transparent)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Title */}
                  <motion.h3 
                    className="text-xl font-semibold text-foreground mb-4 relative z-10"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {feature.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2 relative z-10">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <motion.li 
                        key={benefitIndex} 
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: benefitIndex * 0.1 }}
                        whileHover={{ 
                          x: 5,
                          color: "hsl(var(--primary))",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 360,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        </motion.div>
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Floating accent */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Student Success Stories with Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              See how students are succeeding
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from students who transformed their academic performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                university: "MIT",
                image: "/images/student-1.jpg",
                quote: "Saved 10 hours every week on assignments"
              },
              {
                name: "Michael Chen",
                university: "Stanford",
                image: "/images/student-2.jpg",
                quote: "Improved my grades from B to A+"
              },
              {
                name: "Emily Rodriguez",
                university: "Harvard",
                image: "/images/student-3.jpg",
                quote: "Perfect citations every time"
              }
            ].map((student, index) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  className="relative mb-4"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden shadow-lg">
                    <Image
                      src={student.image}
                      alt={student.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to gradient avatar
                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      }}
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
                <h4 className="font-semibold text-foreground mb-1">{student.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{student.university}</p>
                <p className="text-sm text-primary font-medium">"{student.quote}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Benefits with 3D effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Generate content in seconds", color: "blue" },
            { icon: Shield, title: "Plagiarism Free", desc: "Original content every time", color: "green" },
            { icon: Users, title: "Collaborative", desc: "Work with your team", color: "purple" },
            { icon: Clock, title: "24/7 Available", desc: "Always ready to help", color: "orange" }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="text-center group"
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              style={{ perspective: "1000px" }}
            >
              <motion.div 
                className={`w-12 h-12 bg-${item.color}-100 dark:bg-${item.color}-900/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-${item.color}-200 dark:group-hover:bg-${item.color}-900/30 transition-colors`}
                whileHover={{ 
                  rotateY: 15,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </motion.div>
              </motion.div>
              <motion.h4 
                className="font-semibold text-foreground mb-2"
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              >
                {item.title}
              </motion.h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid; 