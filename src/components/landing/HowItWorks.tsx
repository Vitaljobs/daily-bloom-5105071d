import { motion } from "framer-motion";
import { QrCode, Radar, Coffee } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    step: "Step 1",
    title: "Scan & Enter",
    description: "Scan de QR op je tafel om een 'Digital Lab' binnen te stappen.",
  },
  {
    icon: Radar,
    step: "Step 2", 
    title: "Pulse Check",
    description: "Zie anoniem welke skills (Design, Tech, Business) nu in de ruimte aanwezig zijn.",
  },
  {
    icon: Coffee,
    step: "Step 3",
    title: "Connect",
    description: "Stuur een 'Coffee Invite' en maak van een vreemde een waardevolle connectie.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs sm:text-sm text-primary font-medium">Hoe het werkt</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
            In 3 stappen{" "}
            <span className="text-gradient-gold">connected</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Van QR-scan tot waardevolle connectie in minder dan een minuut
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connection line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
              )}
              
              <div className="wood-card p-6 sm:p-8 text-center h-full">
                {/* Step Number */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 mb-5 sm:mb-6 relative"
                >
                  <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  
                  {/* Step badge */}
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {index + 1}
                  </span>
                </motion.div>

                {/* Content */}
                <span className="text-xs text-primary/70 font-medium uppercase tracking-wider mb-2 block">
                  {step.step}
                </span>
                <h3 className="text-lg sm:text-xl font-serif text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
