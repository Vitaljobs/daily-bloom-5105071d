import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Heart, X } from "lucide-react";
import { UserProfile } from "@/types/common-ground";

interface MatchRevealOverlayProps {
  isVisible: boolean;
  currentUser: { name: string; avatar: string; role: string };
  matchedUser: UserProfile | null;
  onClose: () => void;
}

export const MatchRevealOverlay = ({
  isVisible,
  currentUser,
  matchedUser,
  onClose,
}: MatchRevealOverlayProps) => {
  if (!matchedUser) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4"
          onClick={onClose}
        >
          {/* Extra blurred background */}
          <motion.div
            initial={{ backdropFilter: "blur(8px)" }}
            animate={{ backdropFilter: "blur(24px)" }}
            exit={{ backdropFilter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-background/80"
          />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.8 }}
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* Match reveal content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-8" onClick={(e) => e.stopPropagation()}>
            {/* Your card */}
            <motion.div
              initial={{ x: "-50%", opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: "-50%", opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2,
              }}
              className="wood-card p-4 sm:p-6 w-48 sm:w-64"
              style={{ perspective: "1000px" }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(35 85% 58% / 0.3)",
                      "0 0 40px hsl(35 85% 58% / 0.5)",
                      "0 0 20px hsl(35 85% 58% / 0.3)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-xl sm:text-2xl font-serif text-primary-foreground mb-3 sm:mb-4"
                >
                  {currentUser.avatar}
                </motion.div>
                <h3 className="font-serif text-base sm:text-lg text-foreground">{currentUser.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{currentUser.role}</p>
              </div>
            </motion.div>

            {/* Center coffee icon - clickable to close */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5,
              }}
              onClick={onClose}
              className="relative order-first sm:order-none cursor-pointer"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 30px hsl(35 85% 58% / 0.4)",
                    "0 0 60px hsl(35 85% 58% / 0.7)",
                    "0 0 30px hsl(35 85% 58% / 0.4)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center"
              >
                <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
              </motion.div>
              
              {/* Sparkles around heart - hidden on small screens */}
              <div className="hidden sm:block">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                      x: Math.cos((i * 60 * Math.PI) / 180) * 40,
                      y: Math.sin((i * 60 * Math.PI) / 180) * 40,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: i * 0.2,
                    }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary"
                    style={{ marginLeft: -4, marginTop: -4 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Matched user card */}
            <motion.div
              initial={{ x: "50%", opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: "50%", opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.3,
              }}
              className="wood-card p-4 sm:p-6 w-48 sm:w-64"
              style={{ perspective: "1000px" }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(35 85% 58% / 0.3)",
                      "0 0 40px hsl(35 85% 58% / 0.5)",
                      "0 0 20px hsl(35 85% 58% / 0.3)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-xl sm:text-2xl font-serif text-primary-foreground mb-3 sm:mb-4"
                >
                  {matchedUser.avatar}
                </motion.div>
                <h3 className="font-serif text-base sm:text-lg text-foreground">{matchedUser.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{matchedUser.role}</p>
                <div className="flex flex-wrap gap-1 mt-2 sm:mt-3 justify-center">
                  {matchedUser.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-6 sm:bottom-12 text-center px-4"
          >
            <p className="text-base sm:text-lg font-serif text-foreground mb-1 sm:mb-2">Koffie-date gepland! ☕</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Jullie kunnen elkaar ontmoeten bij de balie
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
