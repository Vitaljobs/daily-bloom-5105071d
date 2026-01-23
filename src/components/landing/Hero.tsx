import { motion } from "framer-motion";
import { ArrowRight, Coffee, Users, Zap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import cafeBg from "@/assets/cafe-bg.jpg";
import { LiveOccupancyBadge } from "./LiveOccupancyBadge";
import { PersonalizedGreeting } from "./PersonalizedGreeting";
import { getLabById } from "@/data/labs";

export const Hero = () => {
  const [searchParams] = useSearchParams();
  const labParam = searchParams.get("lab");
  const preselectedLab = labParam ? getLabById(labParam) : null;

  // Build the dashboard link with optional lab parameter
  const dashboardLink = labParam ? `/dashboard?lab=${labParam}` : "/dashboard";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden overflow-x-hidden">
      {/* Background Image - optimized loading */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${cafeBg})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      <div className="absolute inset-0 bg-cafe-pattern" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Personalized Time-Based Greeting */}
          <PersonalizedGreeting labId={labParam} />

          {/* Live Occupancy Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-3 sm:mb-4"
          >
            <LiveOccupancyBadge />
          </motion.div>

          {/* Preselected Lab Banner (from QR scan) */}
          {preselectedLab && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-3 sm:mb-4"
            >
              <span className="text-base sm:text-lg">{preselectedLab.icon}</span>
              <span className="text-xs sm:text-sm text-gold font-medium">
                Check in bij {preselectedLab.name}
              </span>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-panel mb-4 sm:mb-6 md:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs text-cream-muted">Real-time professional networking</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
            <span className="text-gradient-gold">Common Ground Pulse</span>
            <br />
            <span className="text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Waar koffie en connecties samenkomen
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 px-2">
            Ontdek wie er nu naast je werkt. Netwerk live, deel expertise en groei lokaal.
          </p>

          {/* CTA Buttons - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center px-2"
          >
            <Link 
              to={dashboardLink}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-semibold flex items-center justify-center gap-3 group min-h-[60px] sm:min-h-[68px] bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground shadow-[0_8px_32px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_40px_hsl(var(--primary)/0.55)] transition-all duration-300 hover:scale-[1.02]"
            >
              {preselectedLab ? `Check In @ ${preselectedLab.name}` : "Check In Now"}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base font-medium border border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2 min-h-[52px] sm:min-h-[56px] bg-card/50 backdrop-blur-sm">
              <Coffee className="w-5 h-5" />
              Ontdek Spaces
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 mt-8 sm:mt-12 md:mt-20 max-w-2xl mx-auto px-2"
          >
            {[
              { icon: Users, value: "2,400+", label: "Active Professionals" },
              { icon: Coffee, value: "180+", label: "Connected Spaces" },
              { icon: Zap, value: "5,000+", label: "Connections Made" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary mx-auto mb-1.5 sm:mb-2" />
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-foreground">{stat.value}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-tight">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
