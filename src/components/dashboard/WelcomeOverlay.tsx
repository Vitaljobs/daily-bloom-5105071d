import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X, Users, Sparkles } from "lucide-react";
import { Lab } from "@/data/labs";
import { useLanguage } from "@/contexts/LanguageContext";

interface WelcomeOverlayProps {
  isVisible: boolean;
  lab: Lab | null;
  openUsersCount: number;
  onClose: () => void;
}

export const WelcomeOverlay = ({
  isVisible,
  lab,
  openUsersCount,
  onClose,
}: WelcomeOverlayProps) => {
  const { t } = useLanguage();
  
  if (!lab) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-background/70"
          />

          {/* Welcome Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              type: "spring" as const,
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 wood-card p-6 sm:p-8 max-w-md w-full text-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Lab Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" as const }}
              className="mx-auto mb-4 sm:mb-6"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 30px hsl(35 85% 58% / 0.3)",
                    "0 0 60px hsl(35 85% 58% / 0.5)",
                    "0 0 30px hsl(35 85% 58% / 0.3)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-3xl sm:text-4xl"
              >
                {lab.icon}
              </motion.div>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                {t.welcome.welcomeTo}
              </h2>
              <motion.h1
                animate={{
                  textShadow: [
                    "0 0 10px hsl(35 85% 58% / 0)",
                    "0 0 20px hsl(35 85% 58% / 0.5)",
                    "0 0 10px hsl(35 85% 58% / 0)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="font-serif text-2xl sm:text-3xl text-primary mb-2"
              >
                {lab.name}
              </motion.h1>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{lab.tagline}</p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-inner p-3 sm:p-4 mb-4 sm:mb-6"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-serif text-lg sm:text-xl">{openUsersCount}</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {t.welcome.professionalsOpen}
                </span>
              </div>
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6"
            >
              {t.welcome.enjoyMessage}
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="btn-gold w-full py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Coffee className="w-4 h-4" />
              <span>{t.welcome.startNetworking}</span>
              <Sparkles className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Decorative sparkles - reduced radius for mobile */}
          <div className="hidden sm:block">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  x: Math.cos((i * 45 * Math.PI) / 180) * 150,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 150,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  delay: i * 0.2,
                }}
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary/60"
                style={{ marginLeft: -6, marginTop: -6 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
