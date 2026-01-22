import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Sparkles, MessageSquare, Share2, Zap, Check, Languages } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const PremiumOverlay = () => {
  const { showPremiumOverlay, closePremiumOverlay, setIsPremium } = usePremium();
  const { t } = useLanguage();

  const premiumFeatures = [
    {
      icon: Sparkles,
      title: t.premium.feature1Title,
      description: t.premium.feature1Desc,
    },
    {
      icon: MessageSquare,
      title: t.premium.feature2Title,
      description: t.premium.feature2Desc,
    },
    {
      icon: Share2,
      title: t.premium.feature3Title,
      description: t.premium.feature3Desc,
    },
    {
      icon: Zap,
      title: t.premium.feature4Title,
      description: t.premium.feature4Desc,
    },
    {
      icon: Languages,
      title: t.premium.feature5Title,
      description: t.premium.feature5Desc,
    },
  ];

  const handleUpgrade = () => {
    // Simulate premium upgrade
    setIsPremium(true);
    closePremiumOverlay();
  };

  return (
    <AnimatePresence>
      {showPremiumOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={closePremiumOverlay}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <div className="wood-card p-0 overflow-hidden">
              {/* Premium Header */}
              <div className="relative p-8 bg-gradient-to-br from-primary/30 via-gold-dark/20 to-primary/30">
                {/* Animated glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                />
                
                {/* Close button */}
                <button
                  onClick={closePremiumOverlay}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Crown icon */}
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg"
                >
                  <Crown className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                <h2 className="font-serif text-3xl text-center text-foreground mb-2">
                  {t.premium.title}
                </h2>
                <p className="text-center text-muted-foreground">
                  {t.premium.subtitle}
                </p>
              </div>

              {/* Features */}
              <div className="p-6 space-y-4">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-xl bg-muted/30 border border-border/30"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                  </motion.div>
                ))}
              </div>

              {/* Pricing */}
              <div className="p-6 pt-0">
                <div className="text-center mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-serif text-foreground">€9,99</span>
                    <span className="text-muted-foreground">{t.premium.perMonth}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.premium.perYear}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-medium text-lg flex items-center justify-center gap-2 shadow-lg"
                >
                  <Crown className="w-5 h-5" />
                  {t.premium.upgradeButton}
                </motion.button>

                <p className="text-center text-xs text-muted-foreground mt-3">
                  {t.premium.freeTrial}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
