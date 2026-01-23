import { motion } from "framer-motion";
import { Zap, Users, TrendingUp, Sparkles, Sun } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useMemo } from "react";

export const NetworkingHotspot = () => {
  const { openUsers } = useCommonGround();

  // Calculate networking score
  const networkingScore = useMemo(() => {
    const baseScore = Math.min(100, openUsers.length * 15);
    const timeBonus = new Date().getHours() >= 16 && new Date().getHours() <= 19 ? 20 : 0;
    return Math.min(100, baseScore + timeBonus);
  }, [openUsers.length]);

  const isGoldenHour = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 17 && hour <= 19;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wood-card p-4 h-full relative overflow-hidden"
    >
      {/* Sunset gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 10px hsl(var(--primary) / 0.3)",
              "0 0 25px hsl(var(--primary) / 0.5)",
              "0 0 10px hsl(var(--primary) / 0.3)",
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <Zap className="w-4 h-4 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-sm font-serif text-foreground">Networking Hotspot</h3>
          <p className="text-[10px] text-muted-foreground">Rooftop Connections</p>
        </div>
      </div>

      {/* Networking Score */}
      <div className="glass-inner p-3 rounded-lg mb-3 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Networking Score</span>
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-lg font-bold text-primary"
          >
            {networkingScore}%
          </motion.span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${networkingScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
        
        <p className="text-[10px] text-muted-foreground mt-1">
          {networkingScore > 70 ? "🔥 Ideaal moment!" : networkingScore > 40 ? "✨ Goede activiteit" : "🌱 Rustige start"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3 relative z-10">
        <div className="glass-inner p-2 rounded-lg text-center">
          <Users className="w-4 h-4 text-primary mx-auto mb-1" />
          <span className="text-sm font-semibold text-foreground">{openUsers.length}</span>
          <p className="text-[10px] text-muted-foreground">Open</p>
        </div>
        <div className="glass-inner p-2 rounded-lg text-center">
          <TrendingUp className="w-4 h-4 text-accent mx-auto mb-1" />
          <span className="text-sm font-semibold text-foreground">+24%</span>
          <p className="text-[10px] text-muted-foreground">vs. gisteren</p>
        </div>
      </div>

      {/* Golden Hour indicator */}
      {isGoldenHour && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-2 rounded-lg bg-primary/20 border border-primary/30 relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Sun className="w-4 h-4 text-primary" />
          </motion.div>
          <div>
            <p className="text-xs font-medium text-primary">Golden Hour!</p>
            <p className="text-[10px] text-muted-foreground">Beste tijd voor connecties</p>
          </div>
        </motion.div>
      )}

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -60],
              x: [0, Math.random() * 30 - 15],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              delay: i * 0.7,
            }}
            className="absolute bottom-4"
            style={{ left: `${20 + i * 20}%` }}
          >
            <Sparkles className="w-3 h-3 text-primary/60" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
