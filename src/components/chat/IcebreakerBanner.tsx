import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Coffee } from "lucide-react";
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
  if (!isVisible) return null;

  // Generate dynamic passion text
  const sharedSkillsText = matchAnalysis.sharedSkills.length > 0
    ? matchAnalysis.sharedSkills.length === 1
      ? matchAnalysis.sharedSkills[0]
      : `${matchAnalysis.sharedSkills.slice(0, -1).join(", ")} en ${matchAnalysis.sharedSkills[matchAnalysis.sharedSkills.length - 1]}`
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0, y: -30 }}
        animate={{ 
          height: "auto", 
          opacity: 1, 
          y: 0,
          transition: {
            height: { duration: 0.3 },
            opacity: { duration: 0.3 },
            y: { type: "spring", stiffness: 400, damping: 15, delay: 0.1 }
          }
        }}
        exit={{ height: 0, opacity: 0, y: -20 }}
        className="overflow-hidden"
      >
        {/* Golden border glow */}
        <div className="relative mx-4 mt-3">
          {/* Animated border */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px hsl(35 85% 58% / 0.3), inset 0 0 10px hsl(35 85% 58% / 0.1)",
                "0 0 20px hsl(35 85% 58% / 0.5), inset 0 0 15px hsl(35 85% 58% / 0.2)",
                "0 0 10px hsl(35 85% 58% / 0.3), inset 0 0 10px hsl(35 85% 58% / 0.1)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-xl border-2 border-primary/50"
          />
          
          <div className="relative p-4 rounded-xl bg-gradient-to-r from-primary/15 via-gold-dark/20 to-primary/15 backdrop-blur-sm">
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
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 rounded-xl"
            />
            
            <div className="relative flex items-start gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg"
              >
                <Coffee className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                {/* Match Found Header */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1.5 mb-1"
                >
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    ✨ Match gevonden
                  </span>
                </motion.div>
                
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {sharedSkillsText ? (
                    <>
                      Jullie hebben allebei ervaring met{" "}
                      <span className="text-primary font-semibold">{sharedSkillsText}</span>.
                      {" "}Start hier het gesprek!
                    </>
                  ) : (
                    matchAnalysis.icebreaker || `Start een gesprek met ${partnerName}!`
                  )}
                </p>
                
                {matchAnalysis.sharedSkills.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-1.5 mt-2"
                  >
                    {matchAnalysis.sharedSkills.slice(0, 4).map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/25 text-primary border border-primary/40 shadow-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>

              <button
                onClick={onDismiss}
                className="flex-shrink-0 w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
