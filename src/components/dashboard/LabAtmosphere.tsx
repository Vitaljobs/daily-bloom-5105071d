import { motion } from "framer-motion";
import { Coffee, Leaf, Volume2, VolumeX, Flame, BookOpen, Sun } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useMemo, useState, useEffect } from "react";

// Lab-specific configurations
const LAB_CONFIG = {
  roastery: {
    accent: "from-amber-600 to-orange-700",
    bgAccent: "bg-amber-900/20",
    borderAccent: "border-amber-700/30",
    icon: Flame,
    dailySpecial: [
      "☕ Vandaag: Ethiopian Yirgacheffe",
      "☕ Barista tip: Probeer de Cold Brew!",
      "☕ Special: Oat Milk Latte -20%",
      "☕ Fresh roast: Colombian Supremo",
    ],
    vibe: "Industrieel & Warm",
  },
  library: {
    accent: "from-slate-600 to-slate-800",
    bgAccent: "bg-slate-800/20",
    borderAccent: "border-slate-600/30",
    icon: BookOpen,
    dailySpecial: null,
    vibe: "Stil & Gefocust",
  },
  espresso: {
    accent: "from-amber-500 to-yellow-600",
    bgAccent: "bg-amber-800/20",
    borderAccent: "border-amber-600/30",
    icon: Coffee,
    dailySpecial: [
      "☕ Express lunch menu beschikbaar!",
      "☕ Speed networking om 15:00",
      "☕ Double shot = dubbel enthousiasme",
    ],
    vibe: "Snel & Sociaal",
  },
  rooftop: {
    accent: "from-orange-500 to-pink-600",
    bgAccent: "bg-orange-900/20",
    borderAccent: "border-orange-600/30",
    icon: Sun,
    dailySpecial: [
      "🌅 Sunset drinks vanaf 17:00",
      "🌅 Panoramisch uitzicht vandaag: helder!",
      "🌅 Live acoustic session om 18:00",
    ],
    vibe: "Inspirerend & Open",
  },
  greenhouse: {
    accent: "from-emerald-500 to-green-600",
    bgAccent: "bg-emerald-900/20",
    borderAccent: "border-emerald-600/30",
    icon: Leaf,
    dailySpecial: null,
    vibe: "Fris & Groen",
  },
};

export const LabAtmosphere = () => {
  const { currentLab, openUsers } = useCommonGround();
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0);
  
  const labId = currentLab?.id || "roastery";
  const config = LAB_CONFIG[labId as keyof typeof LAB_CONFIG] || LAB_CONFIG.roastery;
  const Icon = config.icon;

  // Rotate daily specials
  useEffect(() => {
    if (!config.dailySpecial) return;
    
    const interval = setInterval(() => {
      setCurrentSpecialIndex((prev) => 
        (prev + 1) % (config.dailySpecial?.length || 1)
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [config.dailySpecial]);

  // Calculate "rust score" for Greenhouse
  const restScore = useMemo(() => {
    if (labId !== "greenhouse") return null;
    
    // Lower score = more quiet (fewer people = more rest)
    const peopleCount = openUsers.length;
    const maxCapacity = 15;
    const score = Math.max(0, Math.min(100, 100 - (peopleCount / maxCapacity) * 100));
    return Math.round(score);
  }, [labId, openUsers.length]);

  // Sound level indicator for Library
  const soundLevel = useMemo(() => {
    if (labId !== "library") return null;
    // Library is always quiet
    return "Stilte zone";
  }, [labId]);

  return (
    <motion.div
      key={labId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`wood-card p-4 h-full relative overflow-hidden ${config.borderAccent}`}
    >
      {/* Atmospheric gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.accent} opacity-10 pointer-events-none`} />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: labId === "greenhouse" ? [0, 5, -5, 0] : 0,
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`w-7 h-7 rounded-lg ${config.bgAccent} flex items-center justify-center`}
        >
          <Icon className={`w-3.5 h-3.5 bg-gradient-to-r ${config.accent} bg-clip-text`} style={{ color: labId === "greenhouse" ? "#10b981" : labId === "roastery" ? "#f59e0b" : "#d97706" }} />
        </motion.div>
        <div>
          <h3 className="text-sm font-serif text-foreground">{currentLab?.name}</h3>
          <p className="text-[10px] text-muted-foreground">{config.vibe}</p>
        </div>
      </div>

      {/* Content based on lab type */}
      <div className="space-y-2 relative z-10">
        {/* Daily Special for Roastery/Espresso/Rooftop */}
        {config.dailySpecial && (
          <motion.div
            key={currentSpecialIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-inner p-3 rounded-lg"
          >
            <p className="text-xs text-foreground">
              {config.dailySpecial[currentSpecialIndex]}
            </p>
          </motion.div>
        )}

        {/* Rest Score for Greenhouse */}
        {restScore !== null && (
          <div className="glass-inner p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Rust-score</span>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-sm font-semibold text-accent"
              >
                {restScore}%
              </motion.span>
            </div>
            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${restScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {restScore > 70 ? "🌿 Zeer rustig" : restScore > 40 ? "🌱 Rustig" : "🍃 Gemiddeld druk"}
            </p>
          </div>
        )}

        {/* Sound Level for Library */}
        {soundLevel && (
          <div className="glass-inner p-3 rounded-lg flex items-center gap-3">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            </motion.div>
            <div>
              <p className="text-xs text-foreground">{soundLevel}</p>
              <p className="text-[10px] text-muted-foreground">Fluisteren alstublieft</p>
            </div>
          </div>
        )}
      </div>

      {/* Atmospheric particles for Greenhouse */}
      {labId === "greenhouse" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100],
                x: [0, Math.random() * 20 - 10],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + Math.random() * 2,
                delay: i * 0.8,
              }}
              className="absolute bottom-0 w-2 h-2 rounded-full bg-accent/30"
              style={{ left: `${20 + i * 15}%` }}
            />
          ))}
        </div>
      )}

      {/* Flame particles for Roastery */}
      {labId === "roastery" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -50],
                opacity: [0, 0.4, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 2 + Math.random(),
                delay: i * 0.5,
              }}
              className="absolute bottom-0 w-3 h-3 rounded-full bg-primary/20"
              style={{ left: `${30 + i * 20}%` }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
