import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { labs } from "@/data/labs";
import { Flame, BookOpen, Coffee, Sun, Leaf } from "lucide-react";

const labIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  roastery: Flame,
  library: BookOpen,
  espresso: Coffee,
  rooftop: Sun,
  greenhouse: Leaf,
};

const labGradients: Record<string, string> = {
  roastery: "from-amber-900/80 to-amber-950/90",
  library: "from-blue-900/80 to-slate-950/90",
  espresso: "from-orange-900/80 to-amber-950/90",
  rooftop: "from-orange-800/70 to-purple-900/80",
  greenhouse: "from-emerald-900/80 to-teal-950/90",
};

export const LabPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);

  return (
    <section ref={containerRef} className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 container mx-auto px-4 sm:px-6"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-xs sm:text-sm text-accent font-medium">5 Unieke Sferen</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
            Ontdek de{" "}
            <span className="text-gradient-gold">Digital Labs</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Elk Lab heeft zijn eigen sfeer, energie en type professional
          </p>
        </motion.div>

        {/* Labs Carousel */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 sm:overflow-visible">
          {labs.map((lab, index) => {
            const IconComponent = labIcons[lab.id] || Coffee;
            const gradient = labGradients[lab.id] || "from-gray-900/80 to-gray-950/90";
            
            return (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="flex-shrink-0 w-[260px] sm:w-auto snap-center group cursor-pointer"
              >
                <div className="relative h-64 sm:h-72 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${lab.background})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
                    {/* Icon */}
                    <motion.div 
                      className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20"
                      whileHover={{ rotate: 15 }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </motion.div>
                    
                    {/* Lab icon emoji */}
                    <span className="text-2xl mb-2">{lab.icon}</span>
                    
                    {/* Name */}
                    <h3 className="text-base sm:text-lg font-serif text-white mb-1">
                      {lab.name}
                    </h3>
                    
                    {/* Tagline */}
                    <p className="text-xs sm:text-sm text-white/70">
                      {lab.tagline}
                    </p>
                    
                    {/* Hover reveal description */}
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      whileHover={{ opacity: 1, height: "auto" }}
                      className="text-xs text-white/60 mt-2 line-clamp-2 hidden sm:block"
                    >
                      {lab.description}
                    </motion.p>
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
