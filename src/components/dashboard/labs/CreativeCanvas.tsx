import { motion } from "framer-motion";
import { Palette, Lightbulb, Leaf, Wind, Sparkles } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useMemo, useState, useEffect } from "react";

const INSPIRATION_PROMPTS = [
  "Wat als je probleem eigenlijk de oplossing is?",
  "Combineer twee onverwachte elementen...",
  "Stel je voor dat je 10x meer budget had.",
  "Hoe zou een kind dit aanpakken?",
  "Wat zou het tegenovergestelde oplossen?",
  "Welk patroon uit de natuur past hierbij?",
];

export const CreativeCanvas = () => {
  const { openUsers } = useCommonGround();
  const [currentPrompt, setCurrentPrompt] = useState(0);

  // Rotate prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % INSPIRATION_PROMPTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Count creative roles
  const creativeCount = useMemo(() => {
    return openUsers.filter(u => 
      u.role.toLowerCase().includes("design") || 
      u.role.toLowerCase().includes("creative") ||
      u.role.toLowerCase().includes("brand")
    ).length;
  }, [openUsers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wood-card p-4 h-full relative overflow-hidden"
    >
      {/* Nature gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-8 h-8 rounded-2xl bg-primary/20 flex items-center justify-center"
        >
          <Leaf className="w-4 h-4 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-sm font-serif text-foreground">Creative Canvas</h3>
          <p className="text-[10px] text-muted-foreground">Greenhouse Inspiratie</p>
        </div>
      </div>

      {/* Inspiration prompt */}
      <motion.div 
        key={currentPrompt}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass-inner p-4 rounded-2xl mb-3 relative z-10"
      >
        <div className="flex items-start gap-2">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Creatieve Trigger</p>
            <p className="text-sm text-foreground leading-relaxed">
              {INSPIRATION_PROMPTS[currentPrompt]}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Creative atmosphere stats */}
      <div className="flex items-center justify-between glass-inner p-3 rounded-2xl relative z-10">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-xs text-foreground">{creativeCount} Creatieven</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <Wind className="w-4 h-4 text-muted-foreground" />
          </motion.div>
          <span className="text-xs text-muted-foreground">Frisse lucht</span>
        </div>
      </div>

      {/* Floating leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.sin(i) * 30, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + Math.random() * 4,
              delay: i * 1.2,
            }}
            className="absolute bottom-0"
            style={{ left: `${15 + i * 18}%` }}
          >
            <Leaf className="w-4 h-4 text-primary/30" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
