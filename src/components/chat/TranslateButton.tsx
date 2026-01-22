import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, Loader2 } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranslateButtonProps {
  text: string;
  onTranslate: (translatedText: string) => void;
  fromLanguage?: "nl" | "en";
}

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
      // Determine target language (opposite of source)
      const toLanguage = fromLanguage === "nl" ? "en" : "nl";
      
      const { data, error } = await supabase.functions.invoke("translate-message", {
        body: { text, fromLanguage, toLanguage },
      });

      if (error) {
        console.error("Translation error:", error);
        if (error.message?.includes("429")) {
          toast.error(language === "nl" ? "Te veel verzoeken. Probeer later opnieuw." : "Too many requests. Please try again later.");
        } else if (error.message?.includes("402")) {
          toast.error(language === "nl" ? "AI-credits op. Voeg credits toe." : "AI credits depleted. Please add credits.");
        } else {
          toast.error(language === "nl" ? "Vertaling mislukt" : "Translation failed");
        }
        return;
      }

      if (data?.translatedText) {
        onTranslate(data.translatedText);
        setIsTranslated(true);
      }
    } catch (error) {
      console.error("Translation failed:", error);
      toast.error(language === "nl" ? "Vertaling mislukt" : "Translation failed");
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
