import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { MatchAnalysis } from "@/lib/match-scoring";

interface SmartTopicsProps {
  matchAnalysis: MatchAnalysis;
  onSelectTopic: (topic: string) => void;
}

export const SmartTopics = ({ matchAnalysis, onSelectTopic }: SmartTopicsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectTopic = (topic: string, index: number) => {
    setSelectedIndex(index);
    onSelectTopic(topic);
    
    // Reset selection after animation
    setTimeout(() => {
      setSelectedIndex(null);
      setIsExpanded(false);
    }, 300);
  };

  return (
    <div className="px-4 py-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-muted/30 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={isExpanded ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Lightbulb className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-xs font-medium text-foreground">
            Topic suggesties
          </span>
          <motion.span
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary"
          >
            AI
          </motion.span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {matchAnalysis.topics.map((topic, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: selectedIndex === index ? 0.95 : 1,
                    backgroundColor: selectedIndex === index ? "hsl(35 85% 58% / 0.3)" : "transparent",
                  }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectTopic(topic, index)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-card/50 hover:bg-primary/10 border border-border/30 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="mt-0.5"
                    >
                      <Sparkles className="w-3 h-3 text-primary/60 group-hover:text-primary" />
                    </motion.div>
                    <span className="text-xs text-foreground/80 group-hover:text-foreground leading-relaxed">
                      {topic}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
