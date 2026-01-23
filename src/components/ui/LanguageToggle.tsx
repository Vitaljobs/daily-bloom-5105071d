import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  variant?: "default" | "inline";
}

export const LanguageToggle = ({ variant = "default" }: LanguageToggleProps) => {
  const { language, toggleLanguage } = useLanguage();

  // Inline variant for use inside other components (no fixed positioning)
  if (variant === "inline") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLanguage}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg"
      >
        <span
          className={`text-sm font-medium transition-colors ${
            language === "nl" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          NL
        </span>
        <span className="text-muted-foreground/50">|</span>
        <span
          className={`text-sm font-medium transition-colors ${
            language === "en" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          EN
        </span>
      </motion.button>
    );
  }

  // Default fixed positioning - hidden on mobile (shown in mobile toolbar instead)
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="hidden md:flex fixed top-4 right-4 z-40 items-center gap-1 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg"
    >
      <span
        className={`text-sm font-medium transition-colors ${
          language === "nl" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        NL
      </span>
      <span className="text-muted-foreground/50">|</span>
      <span
        className={`text-sm font-medium transition-colors ${
          language === "en" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        EN
      </span>
      
      {/* Active indicator */}
      <motion.div
        layoutId="language-indicator"
        className="absolute top-0 bottom-0 w-1/2 rounded-full bg-primary/10 -z-10"
        animate={{
          left: language === "nl" ? "0%" : "50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.button>
  );
};
