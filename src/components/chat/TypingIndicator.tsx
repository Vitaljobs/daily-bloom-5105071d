import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

interface TypingIndicatorProps {
  userName?: string;
}

export const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <div className="flex items-center gap-1">
        {/* Floating coffee beans */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -6, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="w-2 h-3 rounded-full bg-gradient-to-b from-primary to-gold-dark"
            style={{
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {userName ? `${userName} typt...` : "Aan het typen..."}
      </span>
    </motion.div>
  );
};
