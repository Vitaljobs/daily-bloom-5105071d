import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Lock, Check, X } from "lucide-react";
import { Industry, industryLabels } from "@/types/common-ground";
import { usePremium } from "@/contexts/PremiumContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface IndustryFilterProps {
  selectedIndustry: Industry | null;
  onSelectIndustry: (industry: Industry | null) => void;
}

const industries: Industry[] = ["tech", "finance", "creative", "consulting", "healthcare", "education", "other"];

export const IndustryFilter = ({ selectedIndustry, onSelectIndustry }: IndustryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium, triggerPaywall } = usePremium();
  const { language } = useLanguage();

  const handleFilterClick = () => {
    if (isPremium) {
      setIsOpen(!isOpen);
    } else {
      triggerPaywall("smart-filter");
    }
  };

  const handleSelectIndustry = (industry: Industry | null) => {
    onSelectIndustry(industry);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFilterClick}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          selectedIndustry
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50 text-muted-foreground hover:bg-muted"
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>
          {selectedIndustry 
            ? industryLabels[selectedIndustry][language]
            : language === "nl" ? "Industrie" : "Industry"
          }
        </span>
        {!isPremium && (
          <Lock className="w-3 h-3 ml-1 text-muted-foreground" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-50 w-48 p-2 rounded-xl bg-card/95 backdrop-blur-md border border-border/50 shadow-xl"
          >
            {/* Clear filter option */}
            <button
              onClick={() => handleSelectIndustry(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedIndustry
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <X className="w-4 h-4" />
              <span>{language === "nl" ? "Alle industrieën" : "All industries"}</span>
            </button>

            <div className="h-px bg-border/50 my-1" />

            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => handleSelectIndustry(industry)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedIndustry === industry
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                <span>{industryLabels[industry][language]}</span>
                {selectedIndustry === industry && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
