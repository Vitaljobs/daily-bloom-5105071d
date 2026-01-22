import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Sparkles, Coffee, Star } from "lucide-react";

interface QRWelcomeAnimationProps {
  isVisible: boolean;
  labName: string;
  onComplete: () => void;
}

// Confetti particle component
const ConfettiParticle = ({ delay, index }: { delay: number; index: number }) => {
  const colors = ["#d4a44c", "#f5deb3", "#8B4513", "#c9a55c", "#ffd700"];
  const color = colors[index % colors.length];
  const startX = Math.random() * 100;
  const endX = startX + (Math.random() - 0.5) * 50;
  
  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        y: -20, 
        x: `${startX}vw`,
        rotate: 0,
        scale: 1
      }}
      animate={{ 
        opacity: 0, 
        y: "100vh", 
        x: `${endX}vw`,
        rotate: Math.random() * 720 - 360,
        scale: 0.5
      }}
      transition={{ 
        duration: 2.5 + Math.random(), 
        delay: delay,
        ease: "easeOut"
      }}
      className="fixed z-[60] pointer-events-none"
      style={{
        width: 8 + Math.random() * 8,
        height: 8 + Math.random() * 8,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      }}
    />
  );
};

export const QRWelcomeAnimation = ({ isVisible, labName, onComplete }: QRWelcomeAnimationProps) => {
  const [confettiParticles, setConfettiParticles] = useState<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      setConfettiParticles(Array.from({ length: 50 }, (_, i) => i));
      
      // Auto-close after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Confetti */}
          {confettiParticles.map((index) => (
            <ConfettiParticle key={index} delay={index * 0.02} index={index} />
          ))}

          {/* Badge Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md"
            onClick={onComplete}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-gold/30 blur-3xl"
                style={{ width: 300, height: 300, marginLeft: -75, marginTop: -75 }}
              />

              {/* Badge */}
              <div className="relative bg-gradient-to-br from-gold via-cream to-gold p-1 rounded-3xl shadow-2xl">
                <div className="bg-background rounded-3xl p-8 text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-4"
                  >
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark">
                      <Award className="w-10 h-10 text-background" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                      >
                        <Sparkles className="absolute top-0 right-0 w-5 h-5 text-gold" />
                        <Star className="absolute bottom-0 left-0 w-4 h-4 text-cream" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className="text-2xl font-serif text-gradient-gold mb-2">
                      Welkom!
                    </h2>
                    <p className="text-muted-foreground mb-1">
                      Je bent ingecheckt bij
                    </p>
                    <p className="text-xl font-serif text-foreground flex items-center justify-center gap-2">
                      <Coffee className="w-5 h-5 text-primary" />
                      {labName}
                    </p>
                  </motion.div>

                  {/* First time badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-sm text-gold font-medium">Eerste QR Check-in!</span>
                  </motion.div>

                  {/* Tap to dismiss */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-6 text-xs text-muted-foreground"
                  >
                    Tik om te sluiten
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
