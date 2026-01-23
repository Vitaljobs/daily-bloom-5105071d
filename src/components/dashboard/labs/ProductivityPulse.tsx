import { motion } from "framer-motion";
import { Flame, Clock, Target, TrendingUp, Coffee } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useMemo, useState, useEffect } from "react";

export const ProductivityPulse = () => {
  const { openUsers } = useCommonGround();
  const [timeInLab, setTimeInLab] = useState(0);

  // Simulate time tracking
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeInLab(Math.floor((Date.now() - startTime) / 60000));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Count tech/developer roles
  const devCount = useMemo(() => {
    return openUsers.filter(u => 
      u.role.toLowerCase().includes("developer") || 
      u.role.toLowerCase().includes("engineer") ||
      u.role.toLowerCase().includes("tech")
    ).length;
  }, [openUsers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wood-card p-4 h-full relative overflow-hidden"
    >
      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 10px hsl(var(--primary) / 0.2)",
              "0 0 20px hsl(var(--primary) / 0.4)",
              "0 0 10px hsl(var(--primary) / 0.2)",
            ]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <Flame className="w-4 h-4 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-sm font-serif text-foreground">Productivity Pulse</h3>
          <p className="text-[10px] text-muted-foreground">Roastery Focus Zone</p>
        </div>
      </div>

      {/* Daily special */}
      <motion.div
        animate={{ 
          borderColor: ["hsl(var(--primary) / 0.3)", "hsl(var(--primary) / 0.5)", "hsl(var(--primary) / 0.3)"]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="glass-inner p-3 rounded-lg mb-3 border relative z-10"
      >
        <div className="flex items-center gap-2 mb-1">
          <Coffee className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">Dagspecial</span>
        </div>
        <p className="text-sm text-foreground">Ethiopian Yirgacheffe</p>
        <p className="text-[10px] text-muted-foreground">Fruitig & Bloemen - Perfect voor focus werk</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        <div className="glass-inner p-2 rounded-lg">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground">Developers</span>
          </div>
          <span className="text-lg font-bold text-foreground">{devCount}</span>
        </div>
        <div className="glass-inner p-2 rounded-lg">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground">Sessie</span>
          </div>
          <span className="text-lg font-bold text-foreground">{timeInLab}m</span>
        </div>
      </div>

      {/* Activity indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 flex items-center gap-2 text-xs relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <span className="text-muted-foreground">Hoge productiviteit</span>
        <TrendingUp className="w-3 h-3 text-primary ml-auto" />
      </motion.div>

      {/* Steam particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40],
              opacity: [0, 0.3, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random(),
              delay: i * 0.6,
            }}
            className="absolute bottom-8 w-4 h-4 rounded-full bg-primary/10"
            style={{ left: `${35 + i * 15}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
};
