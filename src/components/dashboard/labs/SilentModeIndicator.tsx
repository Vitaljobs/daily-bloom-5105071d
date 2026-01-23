import { motion } from "framer-motion";
import { VolumeX, Volume1, AlertCircle } from "lucide-react";
import { useState } from "react";

export const SilentModeIndicator = () => {
  const [isSilentMode, setIsSilentMode] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wood-card p-4 h-full relative overflow-hidden"
    >
      {/* Quiet atmosphere overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{ 
            scale: isSilentMode ? [1, 0.95, 1] : 1,
            opacity: isSilentMode ? [0.8, 1, 0.8] : 1,
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          {isSilentMode ? (
            <VolumeX className="w-4 h-4 text-primary" />
          ) : (
            <Volume1 className="w-4 h-4 text-primary" />
          )}
        </motion.div>
        <div>
          <h3 className="text-sm font-serif text-foreground">Stilte Zone</h3>
          <p className="text-[10px] text-muted-foreground">Library Vault Protocol</p>
        </div>
      </div>

      {/* Status indicator */}
      <div className="glass-inner p-3 rounded-lg mb-3 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Geluidsniveau</span>
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xs font-medium text-primary"
          >
            {isSilentMode ? "Zeer stil" : "Gemiddeld"}
          </motion.span>
        </div>
        
        {/* Sound level bars */}
        <div className="flex gap-1 h-6 items-end">
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.div
              key={level}
              animate={{ 
                height: isSilentMode 
                  ? `${Math.max(15, 30 - level * 5)}%` 
                  : `${20 + Math.random() * 40}%`,
                opacity: isSilentMode ? 0.4 : 0.8,
              }}
              transition={{ 
                repeat: isSilentMode ? 0 : Infinity, 
                duration: 0.5 + Math.random() * 0.5,
                repeatType: "reverse" 
              }}
              className="flex-1 bg-primary/40 rounded-t"
            />
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span>Fluisteren alstublieft</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span>Telefoon op stil</span>
        </div>
      </div>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsSilentMode(!isSilentMode)}
        className="w-full mt-3 py-2 rounded-lg glass-inner text-xs font-medium text-foreground hover:bg-muted/30 transition-colors relative z-10"
      >
        {isSilentMode ? "Focus Mode Actief" : "Schakel Focus Mode In"}
      </motion.button>
    </motion.div>
  );
};
