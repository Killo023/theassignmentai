"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
          duration: "14 days",
    description: "Perfect for trying out our AI assistant",
    features: [
      "Full access to all features",
      "3 assignments per day",
      "Basic support",
      "Standard export formats",
      "Community forum access"
    ],
    cta: "Start Free Trial",
    popular: false,
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Premium",
    price: "$29.99",
    duration: "per month",
    description: "Unlimited access for serious students",
    features: [
      "Unlimited assignments",
      "Priority AI processing",
      "Advanced export formats (PDF, DOCX, Excel)",
      "Priority support",
      "Version history",
      "Collaboration tools",
      "Custom templates",
      "Advanced analytics"
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "from-primary to-purple-600"
  }
];

const PricingCards = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 left-20 opacity-10"
      >
        <Sparkles className="w-10 h-10 text-primary" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 right-20 opacity-10"
      >
        <Sparkles className="w-12 h-12 text-purple-500" />
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
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
              style={{ perspective: "1000px" }}
            >
              {plan.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              <motion.div 
                className={`bg-background rounded-2xl p-8 border-2 relative overflow-hidden ${
                  plan.popular 
                    ? 'border-primary shadow-xl' 
                    : 'border-border shadow-lg'
                }`}
                whileHover={{ 
                  rotateY: plan.popular ? 8 : 5,
                  rotateX: 2,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                style={{ 
                  transformStyle: "preserve-3d",
                  transform: plan.popular ? "scale(1.05)" : "scale(1)"
                }}
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
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Floating accent for popular plan */}
                {plan.popular && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-purple-600 rounded-full"
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
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-8 relative z-10">
                  <motion.h3 
                    className="text-2xl font-bold text-foreground mb-2"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {plan.name}
                  </motion.h3>
                  <motion.div 
                    className="mb-4"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.duration}</span>
                  </motion.div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 relative z-10">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.1 }}
                      whileHover={{ 
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.div 
                        className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 360,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Check className="w-3 h-3 text-green-600" />
                      </motion.div>
                      <span className="text-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="text-center relative z-10">
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Button 
                      asChild 
                      size="lg" 
                      className={`w-full h-12 text-lg font-semibold shadow-lg ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90' 
                          : ''
                      }`}
                    >
                      <Link href="/auth/signup" className="flex items-center justify-center gap-2">
                        {plan.cta}
                        {plan.popular && <Zap className="w-5 h-5" />}
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Risk Reversal */}
                {plan.popular && (
                  <motion.div 
                    className="mt-6 text-center relative z-10"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-sm text-muted-foreground">
                      🔒 30-day money-back guarantee
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.div 
            className="bg-muted/50 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur-sm"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <h4 className="font-semibold text-foreground mb-2">All plans include:</h4>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {[
                "No setup fees",
                "Cancel anytime", 
                "Secure & private",
                "Regular updates"
              ].map((item, index) => (
                <motion.span 
                  key={item}
                  className="flex items-center gap-2"
                  whileHover={{ 
                    scale: 1.1,
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
                    <Check className="w-4 h-4 text-green-500" />
                  </motion.div>
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground">
            Questions? Check out our{" "}
            <Link href="#faq" className="text-primary hover:underline">
              FAQ section
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact support
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingCards; 