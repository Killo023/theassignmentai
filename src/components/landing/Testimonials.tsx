"use client";

import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    university: "MIT",
    major: "Computer Science",
    rating: 5,
    quote: "This tool saved me 10 hours every week! The AI understands exactly what I need and generates high-quality content that actually gets me better grades.",
    avatar: "SJ",
    image: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    university: "Stanford",
    major: "Business Administration",
    rating: 5,
    quote: "As a business student, I need to write a lot of case studies and reports. This AI assistant has been a game-changer for my academic performance.",
    avatar: "MC",
    image: "/images/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    university: "Harvard",
    major: "Psychology",
    rating: 5,
    quote: "The citation feature is incredible! It automatically formats everything in APA style, which saves me so much time on research papers.",
    avatar: "ER",
    image: "/images/testimonial-3.jpg"
  },
  {
    id: 4,
    name: "David Kim",
    university: "UC Berkeley",
    major: "Engineering",
    rating: 5,
    quote: "Perfect for technical writing. The AI helps me structure complex engineering reports and ensures all technical details are accurate.",
    avatar: "DK",
    image: "/images/testimonial-4.jpg"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    university: "Yale",
    major: "English Literature",
    rating: 5,
    quote: "Even as an English major, I find this tool incredibly helpful for brainstorming and structuring my essays. It's like having a brilliant writing partner.",
    avatar: "LT",
    image: "/images/testimonial-5.jpg"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-20 opacity-10"
      >
        <Sparkles className="w-8 h-8 text-primary" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 25, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 right-20 opacity-10"
      >
        <Sparkles className="w-10 h-10 text-purple-500" />
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
            Loved by students worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who have transformed their academic experience
          </p>
        </motion.div>

        <div className="relative">
          {/* Testimonial Cards */}
          <div className="relative h-96">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  x: index === currentIndex ? 0 : 100,
                  scale: index === currentIndex ? 1 : 0.9,
                  rotateY: index === currentIndex ? 0 : 15,
                }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${
                  index === currentIndex ? 'z-10' : 'z-0'
                }`}
                style={{ perspective: "1000px" }}
              >
                <motion.div 
                  className="bg-background rounded-2xl p-8 shadow-lg border max-w-2xl mx-auto h-full relative overflow-hidden"
                  whileHover={{ 
                    rotateY: 5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Background Gradient Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"
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

                  {/* Quote Icon */}
                  <motion.div 
                    className="flex justify-center mb-6 relative z-10"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 text-primary" />
                    </div>
                  </motion.div>

                  {/* Rating */}
                  <motion.div 
                    className="flex justify-center mb-6 relative z-10"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 360,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Quote */}
                  <motion.blockquote 
                    className="text-lg text-foreground text-center mb-8 leading-relaxed relative z-10"
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    "{testimonial.quote}"
                  </motion.blockquote>

                  {/* Author with Image */}
                  <motion.div 
                    className="flex items-center justify-center gap-4 relative z-10"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.div 
                      className="relative"
                      whileHover={{ 
                        rotateY: 180,
                        scale: 1.1,
                        transition: { duration: 0.5 }
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to gradient avatar
                            e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          }}
                        />
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
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
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.major} • {testimonial.university}
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating accent */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-primary to-purple-600 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                whileHover={{ 
                  scale: 1.2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg"
            whileHover={{ 
              scale: 1.1,
              rotateY: -15,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg"
            whileHover={{ 
              scale: 1.1,
              rotateY: 15,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* University Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">
              Trusted by students from top universities
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              { name: "MIT", logo: "/images/mit-logo.png" },
              { name: "Stanford", logo: "/images/stanford-logo.png" },
              { name: "Harvard", logo: "/images/harvard-logo.png" },
              { name: "Yale", logo: "/images/yale-logo.png" },
              { name: "UC Berkeley", logo: "/images/berkeley-logo.png" }
            ].map((university, index) => (
              <motion.div
                key={university.name}
                className="flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1,
                  opacity: 1,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">{university.name.split(' ')[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {[
            { number: "50,000+", label: "Active Students" },
            { number: "95%", label: "Satisfaction Rate" },
            { number: "10hrs", label: "Time Saved Weekly" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              style={{ perspective: "1000px" }}
            >
              <motion.div 
                className="text-3xl font-bold text-primary mb-2"
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 