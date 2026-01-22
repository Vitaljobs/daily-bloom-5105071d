import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X, Coffee } from "lucide-react";
import { UserProfile } from "@/types/common-ground";

interface MeetingCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddConnection: () => void;
  onSkip: () => void;
  partner: UserProfile | null;
}

export const MeetingCompleteModal = ({
  isOpen,
  onClose,
  onAddConnection,
  onSkip,
  partner,
}: MeetingCompleteModalProps) => {
  if (!partner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            className="wood-card w-full max-w-sm p-6 text-center overflow-hidden"
          >
            {/* Cheers Animation */}
            <div className="relative h-32 mb-4">
              {/* Left Coffee Cup */}
              <motion.div
                initial={{ x: -60, rotate: -20 }}
                animate={{ 
                  x: -20, 
                  rotate: 15,
                  transition: { delay: 0.2, type: "spring", stiffness: 200 }
                }}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 text-6xl"
              >
                ☕
              </motion.div>
              
              {/* Right Coffee Cup */}
              <motion.div
                initial={{ x: 60, rotate: 20 }}
                animate={{ 
                  x: 20, 
                  rotate: -15,
                  transition: { delay: 0.2, type: "spring", stiffness: 200 }
                }}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 text-6xl"
              >
                ☕
              </motion.div>

              {/* Sparkles on collision */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0],
                  transition: { delay: 0.5, duration: 0.8 }
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <span className="text-4xl">✨</span>
              </motion.div>

              {/* Hearts floating up */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    y: -60,
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    transition: { delay: 0.6 + i * 0.15, duration: 1 }
                  }}
                  className="absolute left-1/2 top-1/2"
                  style={{ marginLeft: `${(i - 1) * 30}px` }}
                >
                  <span className="text-xl text-primary">💛</span>
                </motion.div>
              ))}
            </div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-serif text-xl text-foreground mb-2">
                Proost! 🎉
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Hopelijk was het een inspirerend gesprek met{" "}
                <span className="text-primary font-medium">{partner.name}</span>!
              </p>
            </motion.div>

            {/* Connection Question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-xl bg-muted/30 border border-primary/20 mb-4"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-sm">
                  {partner.avatar}
                </div>
                <span className="text-sm font-medium text-foreground">{partner.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Wil je {partner.name} toevoegen aan je Eerdere Connecties?
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAddConnection}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-medium flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Toevoegen aan Connecties
              </motion.button>
              
              <button
                onClick={onSkip}
                className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Misschien later
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
