"use client";

import { motion } from "framer-motion";

const universities = [
  { 
    name: "Harvard University", 
    short: "Harvard",
    colors: "from-[#A51C30] to-[#8B1628]", // Official Harvard Crimson
    textColor: "text-[#A51C30]",
    accent: "bg-red-100",
    established: "1636"
  },
  { 
    name: "Stanford University", 
    short: "Stanford",
    colors: "from-[#8C1515] to-[#B83A4B]", // Official Stanford Cardinal Red
    textColor: "text-[#8C1515]",
    accent: "bg-red-50",
    established: "1885"
  },
  { 
    name: "MIT", 
    short: "MIT",
    colors: "from-[#8A8B8C] to-[#A31621]", // MIT Red and Gray
    textColor: "text-gray-800",
    accent: "bg-gray-100",
    established: "1861"
  },
  { 
    name: "Oxford University", 
    short: "Oxford",
    colors: "from-[#002147] to-[#0F4C75]", // Oxford Blue
    textColor: "text-[#002147]",
    accent: "bg-blue-100",
    established: "1096"
  },
  { 
    name: "Cambridge University", 
    short: "Cambridge",
    colors: "from-[#003B71] to-[#0066CC]", // Cambridge Blue
    textColor: "text-[#003B71]",
    accent: "bg-blue-50",
    established: "1209"
  },
  { 
    name: "Yale University", 
    short: "Yale",
    colors: "from-[#0F4D92] to-[#00356B]", // Yale Blue
    textColor: "text-[#0F4D92]",
    accent: "bg-blue-100",
    established: "1701"
  },
  { 
    name: "Princeton University", 
    short: "Princeton",
    colors: "from-[#FF8F00] to-[#E77500]", // Princeton Orange
    textColor: "text-[#FF8F00]",
    accent: "bg-orange-50",
    established: "1746"
  },
  { 
    name: "UC Berkeley", 
    short: "Berkeley",
    colors: "from-[#003262] to-[#FDB515]", // Berkeley Blue and Gold
    textColor: "text-[#003262]",
    accent: "bg-blue-50",
    established: "1868"
  }
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
            Join thousands of students from prestigious institutions spanning centuries of academic excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {universities.map((university, index) => (
            <motion.div
              key={university.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 group w-full">
                <div className="text-center">
                  {/* University Shield/Logo */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${university.colors} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-lg border-2 border-white/20`}>
                    <div className="text-white">
                      {university.short === "MIT" ? (
                        <div className="text-center">
                          <div className="text-lg font-bold tracking-wider mb-1">MIT</div>
                          <div className="text-xs opacity-90">1861</div>
                        </div>
                      ) : university.short === "Oxford" ? (
                        <div className="text-center">
                          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center mb-1">
                            <div className="text-sm font-bold">OX</div>
                          </div>
                          <div className="text-xs opacity-90">1096</div>
                        </div>
                      ) : university.short === "Cambridge" ? (
                        <div className="text-center">
                          <div className="flex flex-col items-center mb-1">
                            <div className="w-8 h-1 bg-white mb-1 rounded"></div>
                            <div className="text-sm font-bold">CAM</div>
                            <div className="w-8 h-1 bg-white mt-1 rounded"></div>
                          </div>
                          <div className="text-xs opacity-90">1209</div>
                        </div>
                      ) : university.short === "Harvard" ? (
                        <div className="text-center">
                          <div className="mb-1">
                            <div className="text-xs font-bold mb-1">VERITAS</div>
                            <div className="flex gap-1 justify-center">
                              <div className="w-2 h-4 bg-white rounded-sm"></div>
                              <div className="w-2 h-4 bg-white rounded-sm"></div>
                              <div className="w-2 h-4 bg-white rounded-sm"></div>
                            </div>
                          </div>
                          <div className="text-xs opacity-90">1636</div>
                        </div>
                      ) : university.short === "Yale" ? (
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">Y</div>
                          <div className="text-xs opacity-90">1701</div>
                        </div>
                      ) : university.short === "Stanford" ? (
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-white rounded-lg mb-1 flex items-center justify-center">
                            <div className="text-sm font-bold">S</div>
                          </div>
                          <div className="text-xs opacity-90">1885</div>
                        </div>
                      ) : university.short === "Princeton" ? (
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">P</div>
                          <div className="text-xs opacity-90">1746</div>
                        </div>
                      ) : university.short === "Berkeley" ? (
                        <div className="text-center">
                          <div className="text-sm font-bold mb-1">UC</div>
                          <div className="text-xs font-bold mb-1">BERKELEY</div>
                          <div className="text-xs opacity-90">1868</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-xl font-bold mb-1">
                            {university.short.charAt(0)}
                          </div>
                          <div className="text-xs opacity-90">{university.established}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* University Name */}
                  <h4 className={`text-sm font-semibold ${university.textColor} mb-1`}>
                    {university.short}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    University
                  </p>
                  
                  {/* Accent bar */}
                  <div className={`h-1 w-8 ${university.accent} mx-auto mt-3 rounded-full`}></div>
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