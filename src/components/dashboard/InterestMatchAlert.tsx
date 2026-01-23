import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Coffee, Zap } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useState, useEffect, useMemo } from "react";
import { UserProfile } from "@/types/common-ground";

// Skills that represent "I'm looking for" vs "I offer"
const SEEKING_KEYWORDS = ["consultant", "strategist", "lead", "manager"];
const OFFERING_KEYWORDS = ["developer", "designer", "engineer", "creator"];

interface MatchAlert {
  seeker: UserProfile;
  offerer: UserProfile;
  matchedSkill: string;
}

export const InterestMatchAlert = () => {
  const { openUsers, currentLab, setSelectedUser, triggerMatchReveal } = useCommonGround();
  const [currentAlert, setCurrentAlert] = useState<MatchAlert | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  // Find potential matches between users
  const potentialMatches = useMemo(() => {
    const matches: MatchAlert[] = [];
    
    openUsers.forEach((seeker) => {
      const isSeeking = SEEKING_KEYWORDS.some(kw => 
        seeker.role.toLowerCase().includes(kw)
      );
      
      if (isSeeking) {
        openUsers.forEach((offerer) => {
          if (seeker.id === offerer.id) return;
          
          const isOffering = OFFERING_KEYWORDS.some(kw =>
            offerer.role.toLowerCase().includes(kw)
          );
          
          if (isOffering) {
            // Find matching skill
            const matchedSkill = seeker.skills.find(skill =>
              offerer.skills.includes(skill)
            );
            
            if (matchedSkill) {
              const matchId = `${seeker.id}-${offerer.id}`;
              if (!dismissedAlerts.has(matchId)) {
                matches.push({ seeker, offerer, matchedSkill });
              }
            }
          }
        });
      }
    });
    
    return matches;
  }, [openUsers, dismissedAlerts]);

  // Show alerts periodically
  useEffect(() => {
    if (potentialMatches.length === 0) {
      setIsVisible(false);
      return;
    }

    // Show first match after 3 seconds
    const showTimer = setTimeout(() => {
      const randomMatch = potentialMatches[Math.floor(Math.random() * potentialMatches.length)];
      setCurrentAlert(randomMatch);
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [potentialMatches]);

  // Auto-hide after 8 seconds
  useEffect(() => {
    if (!isVisible) return;
    
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  const handleDismiss = () => {
    if (currentAlert) {
      setDismissedAlerts(prev => new Set([...prev, `${currentAlert.seeker.id}-${currentAlert.offerer.id}`]));
    }
    setIsVisible(false);
  };

  const handleConnect = () => {
    if (currentAlert) {
      setSelectedUser(currentAlert.offerer);
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && currentAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="wood-card p-4 border-primary/50 shadow-[0_0_30px_hsl(35_85%_58%/0.3)]">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/30 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Header with sparkles */}
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center"
              >
                <Zap className="w-4 h-4 text-primary-foreground" />
              </motion.div>
              <div>
                <h4 className="text-sm font-serif text-primary">Match Gevonden!</h4>
                <p className="text-[10px] text-muted-foreground">In {currentLab?.name}</p>
              </div>
            </div>

            {/* Match content */}
            <div className="glass-inner p-3 rounded-lg mb-3">
              <div className="flex items-center gap-3">
                {/* Offerer avatar */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 10px hsl(35 85% 58% / 0.3)",
                      "0 0 20px hsl(35 85% 58% / 0.5)",
                      "0 0 10px hsl(35 85% 58% / 0.3)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-xs font-medium text-primary-foreground"
                >
                  {currentAlert.offerer.avatar}
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{currentAlert.offerer.name}</p>
                  <p className="text-xs text-muted-foreground">{currentAlert.offerer.role}</p>
                </div>
              </div>
              <p className="text-xs text-primary mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Match op: <span className="font-medium">{currentAlert.matchedSkill}</span>
              </p>
            </div>

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              className="w-full py-2 rounded-lg btn-gold text-xs font-medium flex items-center justify-center gap-2"
            >
              <Coffee className="w-3.5 h-3.5" />
              Bekijk & Uitnodigen
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
