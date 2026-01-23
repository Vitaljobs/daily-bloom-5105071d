import { motion } from "framer-motion";
import { Zap, Timer, Users, ArrowRight, Coffee } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useState, useEffect } from "react";

export const SpeedNetworking = () => {
  const { openUsers, setSelectedUser } = useCommonGround();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    if (countdown === 0) {
      setIsActive(false);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const startSpeedNetworking = () => {
    setIsActive(true);
    setCountdown(300); // 5 minutes
    
    // Auto-select a random open user
    if (openUsers.length > 0) {
      const randomUser = openUsers[Math.floor(Math.random() * openUsers.length)];
      setSelectedUser(randomUser);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wood-card p-4 h-full relative overflow-hidden"
    >
      {/* Energy gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={isActive ? { 
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <Zap className="w-4 h-4 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-sm font-serif text-foreground">Speed Networking</h3>
          <p className="text-[10px] text-muted-foreground">Espresso Bar Connects</p>
        </div>
      </div>

      {/* Timer or Start button */}
      {isActive && countdown !== null ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-inner p-4 rounded-lg mb-3 text-center relative z-10"
        >
          <Timer className="w-6 h-6 text-primary mx-auto mb-2" />
          <motion.p
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-2xl font-bold text-primary font-mono"
          >
            {formatTime(countdown)}
          </motion.p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Tijd om te connecten!
          </p>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startSpeedNetworking}
          disabled={openUsers.length === 0}
          className="w-full glass-inner p-4 rounded-lg mb-3 text-center hover:bg-muted/30 transition-colors disabled:opacity-50 relative z-10"
        >
          <Coffee className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Start 5-min Session</p>
          <p className="text-[10px] text-muted-foreground">
            {openUsers.length > 0 
              ? `${openUsers.length} professionals beschikbaar` 
              : "Geen beschikbare matches"}
          </p>
        </motion.button>
      )}

      {/* Quick stats */}
      <div className="flex items-center justify-between glass-inner p-2 rounded-lg relative z-10">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-primary" />
          <span className="text-xs text-foreground">{openUsers.length}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Quick connect</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Energy pulses */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.6,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-primary/30"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
