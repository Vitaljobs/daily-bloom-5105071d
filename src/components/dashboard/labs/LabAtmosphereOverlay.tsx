import { motion } from "framer-motion";

interface LabAtmosphereOverlayProps {
  labId: string;
}

// Roastery: Industrial smoke particles
const SmokeParticles = () => (
  <>
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${80 + i * 30}px`,
          height: `${120 + i * 40}px`,
          left: `${10 + i * 12}%`,
          bottom: `-${20 + i * 5}%`,
          background: "linear-gradient(to top, hsl(var(--accent) / 0.2), transparent)",
        }}
        animate={{
          y: [0, -200, -400],
          x: [0, Math.sin(i) * 30, Math.sin(i) * 60],
          opacity: [0, 0.4, 0],
          scale: [0.8, 1.2, 1.5],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          delay: i * 1.5,
          ease: "easeOut",
        }}
      />
    ))}
  </>
);

// Rooftop: Golden hour shimmer
const GoldenHourShimmer = () => (
  <>
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full"
        style={{
          left: `${5 + i * 8}%`,
          top: `${10 + (i % 4) * 15}%`,
          background: "hsl(var(--primary))",
        }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [0, 1.5, 0],
        }}
        transition={{
          duration: 3 + i * 0.2,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeInOut",
        }}
      />
    ))}
    {/* Sun rays */}
    <motion.div
      className="absolute -top-20 right-0 w-96 h-96"
      style={{
        background: "radial-gradient(circle at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </>
);

// Espresso: Neon energy pulses
const NeonPulses = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${100 + i * 50}px`,
          height: `${100 + i * 50}px`,
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          background: `radial-gradient(circle at center, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2 + i * 0.5,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeInOut",
        }}
      />
    ))}
    {/* Fast moving streaks */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={`streak-${i}`}
        className="absolute h-0.5"
        style={{
          width: `${150 + i * 50}px`,
          top: `${30 + i * 15}%`,
          left: "-200px",
          background: "linear-gradient(to right, transparent, hsl(var(--primary) / 0.4), transparent)",
        }}
        animate={{
          x: ["0vw", "120vw"],
        }}
        transition={{
          duration: 3 + i,
          repeat: Infinity,
          delay: i * 2,
          ease: "linear",
        }}
      />
    ))}
  </>
);

// Library: Floating dust motes & paper texture feel
const DustMotes = () => (
  <>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full"
        style={{
          left: `${5 + i * 4.5}%`,
          top: `${5 + (i % 5) * 18}%`,
          background: "hsl(var(--primary) / 0.3)",
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.sin(i) * 10, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6 + i * 0.4,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeInOut",
        }}
      />
    ))}
    {/* Soft vignette for focus */}
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.4) 100%)",
      }}
    />
  </>
);

// Greenhouse: Organic flow particles
const OrganicFlow = () => (
  <>
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${60 + i * 20}px`,
          height: `${60 + i * 20}px`,
          left: `${i * 10}%`,
          top: `${20 + (i % 4) * 20}%`,
          background: `radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8 + i,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeInOut",
        }}
      />
    ))}
  </>
);

export const LabAtmosphereOverlay = ({ labId }: LabAtmosphereOverlayProps) => {
  const getOverlayStyles = () => {
    switch (labId) {
      case "roastery":
        return {
          background: `
            linear-gradient(135deg, hsl(var(--background) / 0.9) 0%, hsl(var(--card) / 0.85) 50%, hsl(var(--background) / 0.9) 100%),
            radial-gradient(ellipse at bottom, hsl(var(--accent) / 0.3) 0%, transparent 60%)
          `,
        };
      case "library":
        return {
          background: `
            linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--card) / 0.9) 50%, hsl(var(--background) / 0.95) 100%),
            radial-gradient(ellipse at top, hsl(var(--primary) / 0.1) 0%, transparent 50%)
          `,
        };
      case "espresso":
        return {
          background: `
            linear-gradient(135deg, hsl(var(--background) / 0.85) 0%, hsl(var(--card) / 0.8) 30%, hsl(var(--background) / 0.85) 100%),
            radial-gradient(circle at 30% 70%, hsl(var(--primary) / 0.15) 0%, transparent 40%),
            radial-gradient(circle at 70% 30%, hsl(var(--accent) / 0.1) 0%, transparent 35%)
          `,
        };
      case "rooftop":
        return {
          background: `
            linear-gradient(180deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--accent) / 0.15) 50%, hsl(var(--background) / 0.7) 100%),
            radial-gradient(ellipse at top right, hsl(var(--primary) / 0.25) 0%, transparent 50%)
          `,
        };
      case "greenhouse":
        return {
          background: `
            linear-gradient(160deg, hsl(var(--background) / 0.85) 0%, hsl(var(--card) / 0.8) 50%, hsl(var(--background) / 0.9) 100%),
            radial-gradient(ellipse at bottom left, hsl(var(--primary) / 0.15) 0%, transparent 50%)
          `,
        };
      default:
        return { background: "transparent" };
    }
  };

  const renderParticles = () => {
    switch (labId) {
      case "roastery":
        return <SmokeParticles />;
      case "library":
        return <DustMotes />;
      case "espresso":
        return <NeonPulses />;
      case "rooftop":
        return <GoldenHourShimmer />;
      case "greenhouse":
        return <OrganicFlow />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={labId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={getOverlayStyles()}
    >
      {renderParticles()}
    </motion.div>
  );
};
