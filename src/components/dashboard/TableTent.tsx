import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Focus, BellOff, Lightbulb, User } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";

export const TableTent = () => {
  const { currentUserStatus, setCurrentUserStatus, openUsers } = useCommonGround();
  const isOpen = currentUserStatus === "open";

  return (
    <motion.div
      layout
      className={`wood-card p-5 h-full relative transition-all duration-500 ${
        isOpen ? "wood-card-glow animate-pulse-glow" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <motion.div
          animate={isOpen ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isOpen ? "bg-primary/30" : "bg-muted/50"
          }`}
        >
          {isOpen ? (
            <Coffee className="w-4 h-4 text-primary" />
          ) : (
            <BellOff className="w-4 h-4 text-muted-foreground" />
          )}
        </motion.div>
        <div>
          <h3 className="text-base font-serif text-foreground">Digital Table Tent</h3>
          <p className="text-xs text-muted-foreground">Jouw status</p>
        </div>
      </div>

      {/* Status Indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentUserStatus}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="glass-inner p-4 mb-4 relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isOpen 
                ? "bg-gradient-to-br from-primary to-gold-dark" 
                : "bg-muted"
            }`}>
              {isOpen ? (
                <User className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Focus className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className={`font-medium ${isOpen ? "text-primary" : "text-foreground"}`}>
                {isOpen ? "Open voor koffie" : "Focus Mode"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isOpen ? `${openUsers.length} anderen ook beschikbaar` : "Je bent onzichtbaar"}
              </p>
            </div>
          </div>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pt-3 border-t border-border/30"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Er is een AI-expert aanwezig die open staat voor een gesprek.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Toggle Buttons */}
      <div className="flex gap-2 relative z-10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentUserStatus("focus")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
            !isOpen
              ? "bg-muted text-foreground"
              : "bg-transparent text-muted-foreground hover:bg-muted/30"
          }`}
        >
          <Focus className="w-3 h-3 inline mr-1.5" />
          Focus
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentUserStatus("open")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
            isOpen
              ? "bg-primary/20 text-primary border border-primary/40"
              : "bg-transparent text-muted-foreground hover:bg-muted/30"
          }`}
        >
          <Coffee className="w-3 h-3 inline mr-1.5" />
          Open
        </motion.button>
      </div>
    </motion.div>
  );
};
