"use client";

import { motion } from "framer-motion";

const universities = [
  { name: "Harvard University", logo: "Harvard" },
  { name: "Stanford University", logo: "Stanford" },
  { name: "MIT", logo: "MIT" },
  { name: "Oxford University", logo: "Oxford" },
  { name: "Cambridge University", logo: "Cambridge" },
  { name: "Yale University", logo: "Yale" },
  { name: "Princeton University", logo: "Princeton" },
  { name: "Columbia University", logo: "Columbia" }
];

const UniversityLogos = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Trusted by students from top universities worldwide
          </h3>
          <p className="text-sm text-muted-foreground">
            Join thousands of students from prestigious institutions
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {universities.map((university, index) => (
            <motion.div
              key={university.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-colors">
                    <span className="text-lg font-bold text-primary">
                      {university.logo.charAt(0)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {university.logo}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    University
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Universities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">150+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">1M+</div>
              <div className="text-sm text-muted-foreground">Assignments Created</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityLogos; 