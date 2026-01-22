import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, Loader2 } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface TranslateButtonProps {
  text: string;
  onTranslate: (translatedText: string) => void;
  fromLanguage?: "nl" | "en";
}

// Mock translation function (in real app, would call AI API)
const mockTranslate = async (text: string, from: "nl" | "en"): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple mock translations for demo
  const translations: Record<string, Record<string, string>> = {
    nl: {
      "Klinkt goed! Tot zo!": "Sounds good! See you soon!",
      "Perfect, ik zie je daar!": "Perfect, I'll see you there!",
      "Super! Ik neem een cappuccino 😊": "Great! I'll have a cappuccino 😊",
      "Top! Ik kom eraan!": "Great! I'm on my way!",
      "Interessant! Daar wil ik meer over horen.": "Interesting! I'd like to hear more about that.",
      "Goed idee, laten we dat bespreken!": "Good idea, let's discuss that!",
    },
    en: {
      "Sounds good! See you soon!": "Klinkt goed! Tot zo!",
      "Perfect, I'll see you there!": "Perfect, ik zie je daar!",
      "Great! I'll have a cappuccino 😊": "Super! Ik neem een cappuccino 😊",
      "Great! I'm on my way!": "Top! Ik kom eraan!",
      "Interesting! I'd like to hear more about that.": "Interessant! Daar wil ik meer over horen.",
      "Good idea, let's discuss that!": "Goed idee, laten we dat bespreken!",
    },
  };

  // Return mock translation or original with language indicator
  return translations[from]?.[text] || `[${from === "nl" ? "EN" : "NL"}] ${text}`;
};

export const TranslateButton = ({ text, onTranslate, fromLanguage = "nl" }: TranslateButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const { isPremium, triggerPaywall } = usePremium();
  const { language } = useLanguage();

  const handleTranslate = async () => {
    if (!isPremium) {
      triggerPaywall("chatTranslation");
      return;
    }

    if (isTranslated) return;

    setIsTranslating(true);
    try {
      const translated = await mockTranslate(text, fromLanguage);
      onTranslate(translated);
      setIsTranslated(true);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const label = language === "nl" ? "Vertaal" : "Translate";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleTranslate}
      disabled={isTranslating || isTranslated}
      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] transition-colors ${
        isTranslated
          ? "bg-primary/20 text-primary"
          : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
      }`}
    >
      {isTranslating ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Languages className="w-3 h-3" />
      )}
      <span>{isTranslated ? (language === "nl" ? "Vertaald" : "Translated") : label}</span>
    </motion.button>
  );
};
