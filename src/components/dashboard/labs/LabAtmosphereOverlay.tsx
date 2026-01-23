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
        // Warm copper/orange industrial overlay with smoky depth
        return {
          background: `
            linear-gradient(135deg, hsla(20, 30%, 5%, 0.92) 0%, hsla(25, 35%, 8%, 0.88) 50%, hsla(15, 25%, 4%, 0.94) 100%),
            radial-gradient(ellipse at bottom center, hsla(28, 75%, 35%, 0.35) 0%, transparent 55%),
            radial-gradient(ellipse at top left, hsla(35, 60%, 20%, 0.25) 0%, transparent 45%)
          `,
        };
      case "library":
        // Deep midnight blue with paper/parchment warmth
        return {
          background: `
            linear-gradient(180deg, hsla(220, 35%, 8%, 0.94) 0%, hsla(215, 30%, 12%, 0.9) 50%, hsla(225, 40%, 6%, 0.95) 100%),
            radial-gradient(ellipse at top center, hsla(210, 50%, 25%, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, hsla(40, 30%, 20%, 0.15) 0%, transparent 40%)
          `,
        };
      case "espresso":
        // Neon-lit dark with cyan/magenta energy accents
        return {
          background: `
            linear-gradient(135deg, hsla(220, 30%, 6%, 0.88) 0%, hsla(260, 25%, 10%, 0.85) 40%, hsla(200, 30%, 8%, 0.88) 100%),
            radial-gradient(circle at 20% 80%, hsla(190, 100%, 50%, 0.15) 0%, transparent 35%),
            radial-gradient(circle at 80% 20%, hsla(320, 100%, 50%, 0.12) 0%, transparent 30%),
            radial-gradient(circle at 50% 50%, hsla(270, 80%, 40%, 0.08) 0%, transparent 50%)
          `,
        };
      case "rooftop":
        // Golden hour with purple/orange sunset gradient - lighter, more open
        return {
          background: `
            linear-gradient(180deg, hsla(270, 40%, 25%, 0.6) 0%, hsla(30, 80%, 50%, 0.35) 40%, hsla(35, 70%, 40%, 0.5) 100%),
            radial-gradient(ellipse at top center, hsla(40, 100%, 60%, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, hsla(280, 50%, 30%, 0.2) 0%, transparent 60%)
          `,
        };
      case "greenhouse":
        // Fresh botanical green with light, airy feel
        return {
          background: `
            linear-gradient(160deg, hsla(140, 30%, 10%, 0.85) 0%, hsla(130, 25%, 15%, 0.8) 50%, hsla(150, 35%, 8%, 0.88) 100%),
            radial-gradient(ellipse at bottom left, hsla(120, 50%, 35%, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at top right, hsla(90, 40%, 40%, 0.15) 0%, transparent 45%)
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
