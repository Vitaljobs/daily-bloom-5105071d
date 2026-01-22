import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lightbulb, X } from "lucide-react";
import { MatchAnalysis } from "@/lib/match-scoring";

interface IcebreakerBannerProps {
  matchAnalysis: MatchAnalysis;
  partnerName: string;
  onDismiss: () => void;
  isVisible: boolean;
}

export const IcebreakerBanner = ({
  matchAnalysis,
  partnerName,
  onDismiss,
  isVisible,
}: IcebreakerBannerProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary/20 via-gold-dark/20 to-primary/20 border border-primary/30 rounded-xl p-4 mx-4 mt-2">
            {/* Shimmer effect */}
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12"
            />

            <div className="relative z-10">
              {/* Header with sparkles */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-xs font-medium text-primary">
                    AI Conversation Starter
                  </span>
                </div>
                <button
                  onClick={onDismiss}
                  className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>

              {/* Icebreaker text */}
              <p className="text-sm text-foreground leading-relaxed">
                {matchAnalysis.icebreaker}
              </p>

              {/* Shared skills pills */}
              {matchAnalysis.sharedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[10px] text-muted-foreground mr-1">
                    Gedeeld:
                  </span>
                  {matchAnalysis.sharedSkills.slice(0, 4).map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/30 text-primary"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
