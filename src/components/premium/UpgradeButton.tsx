import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

export const UpgradeButton = () => {
  const { isPremium, openPremiumOverlay } = usePremium();

  if (isPremium) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={openPremiumOverlay}
      className="fixed bottom-6 right-6 z-30 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-medium shadow-lg flex items-center gap-2"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Crown className="w-5 h-5" />
      </motion.div>
      <span>Upgrade naar Premium</span>
      
      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/50 to-gold-dark/50 blur-lg -z-10"
      />
    </motion.button>
  );
};
