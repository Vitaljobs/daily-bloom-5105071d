import { motion, AnimatePresence } from "framer-motion";
import { Lock, Crown, X, Sparkles } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const PaywallPopup = () => {
  const { showPaywall, paywallFeature, closePaywall, openPremiumOverlay } = usePremium();
  const { t, language } = useLanguage();

  const featureDescriptions: Record<string, { title: string; description: string; icon: string }> = {
    "ai-icebreaker": {
      title: t.paywall.aiIcebreaker.title,
      description: t.paywall.aiIcebreaker.description,
      icon: "💡",
    },
    "contact-share": {
      title: t.paywall.contactShare.title,
      description: t.paywall.contactShare.description,
      icon: "📇",
    },
    "smart-topics": {
      title: t.paywall.smartTopics.title,
      description: t.paywall.smartTopics.description,
      icon: "✨",
    },
    "unlimited-invites": {
      title: language === "nl" ? "Onbeperkte Uitnodigingen" : "Unlimited Invites",
      description: language === "nl" 
        ? "Stuur zoveel koffie-uitnodigingen als je wilt zonder limiet."
        : "Send as many coffee invitations as you want without limits.",
      icon: "☕",
    },
    "chatTranslation": {
      title: t.paywall.chatTranslation.title,
      description: t.paywall.chatTranslation.description,
      icon: "🌐",
    },
    "smart-filter": {
      title: language === "nl" ? "Smart Industry Filter" : "Smart Industry Filter",
      description: language === "nl"
        ? "Filter de Social Radar op specifieke industrieën om de perfecte connectie te vinden."
        : "Filter the Social Radar by specific industries to find your perfect connection.",
      icon: "🎯",
    },
  };

  const feature = paywallFeature ? featureDescriptions[paywallFeature] : null;

  const handleUpgrade = () => {
    closePaywall();
    openPremiumOverlay();
  };

  return (
    <AnimatePresence>
      {showPaywall && feature && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closePaywall}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="wood-card w-full max-w-sm p-6 text-center"
          >
            {/* Close button */}
            <button
              onClick={closePaywall}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Lock icon with glow */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px hsl(35 85% 58% / 0.3)",
                  "0 0 40px hsl(35 85% 58% / 0.5)",
                  "0 0 20px hsl(35 85% 58% / 0.3)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-gold-dark/20 border-2 border-primary/50 flex items-center justify-center"
            >
              <Lock className="w-7 h-7 text-primary" />
            </motion.div>

            {/* Feature icon */}
            <div className="text-4xl mb-3">{feature.icon}</div>

            <h3 className="font-serif text-xl text-foreground mb-2">
              {feature.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {feature.description}
            </p>

            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.paywall.premiumFeature}</span>
            </div>

            {/* Upgrade button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpgrade}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-medium flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t.paywall.unlock}
            </motion.button>

            <button
              onClick={closePaywall}
              className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.paywall.maybeLater}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
