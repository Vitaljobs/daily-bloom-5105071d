import { motion } from "framer-motion";
import { useState, ReactNode } from "react";
import { RotateCcw } from "lucide-react";

interface FlippableCardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  className?: string;
}

export const FlippableCard = ({
  frontContent,
  backContent,
  className = "",
}: FlippableCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="wood-card h-full relative">
            {frontContent}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-2 right-2 text-xs text-muted-foreground/50 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Klik voor details</span>
            </motion.div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="wood-card h-full bg-gradient-to-br from-card to-wood-darker relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  hsl(var(--primary)) 10px,
                  hsl(var(--primary)) 11px
                )`,
              }} />
            </div>
            
            <div className="relative z-10">
              {backContent}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-2 right-2 text-xs text-muted-foreground/50 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Terug</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
