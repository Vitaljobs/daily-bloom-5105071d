import { motion } from "framer-motion";
import { ArrowRight, Coffee, Users, Zap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import cafeBg from "@/assets/cafe-bg.jpg";
import { LiveOccupancyBadge } from "./LiveOccupancyBadge";
import { getLabById } from "@/data/labs";

export const Hero = () => {
  const [searchParams] = useSearchParams();
  const labParam = searchParams.get("lab");
  const preselectedLab = labParam ? getLabById(labParam) : null;

  // Build the dashboard link with optional lab parameter
  const dashboardLink = labParam ? `/dashboard?lab=${labParam}` : "/dashboard";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Live Occupancy Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-4"
          >
            <LiveOccupancyBadge />
          </motion.div>

          {/* Preselected Lab Banner (from QR scan) */}
          {preselectedLab && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-4"
            >
              <span className="text-lg">{preselectedLab.icon}</span>
              <span className="text-sm text-gold font-medium">
                Check in bij {preselectedLab.name}
              </span>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6 md:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs md:text-sm text-cream-muted">Real-time professional networking</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-serif mb-4 md:mb-6 leading-tight">
            Find Your{" "}
            <span className="text-gradient-gold">Common Ground</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 px-4">
            Connect with professionals in your space. Real conversations, real connections, 
            brewed in the places where creativity flows.
          </p>

          {/* CTA Buttons - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4"
          >
            <Link 
              to={dashboardLink}
              className="btn-gold w-full sm:w-auto px-8 py-4 rounded-xl text-base md:text-lg font-medium flex items-center justify-center gap-2 group min-h-[56px]"
            >
              {preselectedLab ? `Check In @ ${preselectedLab.name}` : "Check In Now"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-base md:text-lg font-medium border border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2 min-h-[56px]">
              <Coffee className="w-5 h-5" />
              Explore Spaces
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-20 max-w-2xl mx-auto px-4"
          >
            {[
              { icon: Users, value: "2,400+", label: "Active Professionals" },
              { icon: Coffee, value: "180+", label: "Connected Spaces" },
              { icon: Zap, value: "5,000+", label: "Connections Made" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
                <p className="text-xl md:text-2xl lg:text-3xl font-serif text-foreground">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
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
