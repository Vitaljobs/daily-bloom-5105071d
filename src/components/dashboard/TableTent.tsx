import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Focus, BellOff, Lightbulb, User, EyeOff } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";

// Enhanced breathing pulse animation
const breathingPulse = {
  initial: {
    boxShadow: "0 20px 60px hsl(20 40% 4% / 0.6)",
  },
  breathing: {
    boxShadow: [
      "0 20px 60px hsl(20 40% 4% / 0.6), 0 0 0px hsl(35 85% 58% / 0)",
      "0 20px 60px hsl(20 40% 4% / 0.6), 0 0 60px hsl(35 85% 58% / 0.5), 0 0 100px hsl(35 85% 58% / 0.2)",
      "0 20px 60px hsl(20 40% 4% / 0.6), 0 0 30px hsl(35 85% 58% / 0.3), 0 0 50px hsl(35 85% 58% / 0.1)",
      "0 20px 60px hsl(20 40% 4% / 0.6), 0 0 60px hsl(35 85% 58% / 0.5), 0 0 100px hsl(35 85% 58% / 0.2)",
      "0 20px 60px hsl(20 40% 4% / 0.6), 0 0 0px hsl(35 85% 58% / 0)",
    ],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut" as const,
    },
  },
};

const borderBreathing = {
  initial: { opacity: 0 },
  breathing: {
    opacity: [0.3, 0.7, 0.5, 0.7, 0.3],
    scale: [1, 1.02, 1.01, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut" as const,
    },
  },
};

export const TableTent = () => {
  const { currentUserStatus, setCurrentUserStatus, openUsers } = useCommonGround();
  const isOpen = currentUserStatus === "open";
  const isInvisible = currentUserStatus === "invisible";
  const isFocus = currentUserStatus === "focus";

  const getStatusIcon = () => {
    if (isOpen) return <Coffee className="w-4 h-4 text-primary" />;
    if (isInvisible) return <EyeOff className="w-4 h-4 text-muted-foreground" />;
    return <BellOff className="w-4 h-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (isOpen) return "Open voor koffie";
    if (isInvisible) return "Onzichtbaar";
    return "Focus Mode";
  };

  const getStatusDescription = () => {
    if (isOpen) return `${openUsers.length} anderen ook beschikbaar`;
    if (isInvisible) return "Je ziet de radar, maar bent zelf verborgen";
    return "Je bent niet beschikbaar";
  };

  return (
    <motion.div
      layout
      initial="initial"
      animate={isOpen ? "breathing" : "initial"}
      variants={breathingPulse}
      className={`wood-card p-5 h-full relative transition-all duration-500 ${
        isOpen ? "border-primary/50" : ""
      }`}
      style={isOpen ? {
        borderColor: "hsl(35 85% 58% / 0.5)",
      } : {}}
    >
      {/* Breathing border overlay for Open status */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            variants={borderBreathing}
            animate="breathing"
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 rounded-[1.5rem] pointer-events-none border-2 border-primary/50"
            style={{
              background: "linear-gradient(135deg, hsl(35 85% 58% / 0.08), transparent, hsl(35 85% 58% / 0.04))",
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <motion.div
          animate={isOpen ? { 
            scale: [1, 1.15, 1.05, 1.15, 1],
            boxShadow: [
              "0 0 10px hsl(35 85% 58% / 0.3)", 
              "0 0 30px hsl(35 85% 58% / 0.7)", 
              "0 0 20px hsl(35 85% 58% / 0.5)",
              "0 0 30px hsl(35 85% 58% / 0.7)", 
              "0 0 10px hsl(35 85% 58% / 0.3)"
            ]
          } : {}}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isOpen ? "bg-primary/30" : "bg-muted/50"
          }`}
        >
          {getStatusIcon()}
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
          className={`glass-inner p-4 mb-4 relative z-10 transition-all duration-300 ${
            isOpen ? "border border-primary/30" : ""
          } ${isInvisible ? "border border-muted/50 opacity-75" : ""}`}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              animate={isOpen ? { 
                boxShadow: [
                  "0 0 10px hsl(35 85% 58% / 0.2)", 
                  "0 0 30px hsl(35 85% 58% / 0.6)", 
                  "0 0 20px hsl(35 85% 58% / 0.4)",
                  "0 0 30px hsl(35 85% 58% / 0.6)", 
                  "0 0 10px hsl(35 85% 58% / 0.2)"
                ],
                scale: [1, 1.05, 1.02, 1.05, 1],
              } : {}}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isOpen 
                  ? "bg-gradient-to-br from-primary to-gold-dark" 
                  : isInvisible
                  ? "bg-muted/30 border border-dashed border-muted-foreground/30"
                  : "bg-muted"
              }`}
            >
              {isOpen ? (
                <User className="w-5 h-5 text-primary-foreground" />
              ) : isInvisible ? (
                <EyeOff className="w-5 h-5 text-muted-foreground/50" />
              ) : (
                <Focus className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.div>
            <div>
              <motion.p 
                animate={isOpen ? {
                  textShadow: [
                    "0 0 8px hsl(35 85% 58% / 0)",
                    "0 0 16px hsl(35 85% 58% / 0.5)",
                    "0 0 8px hsl(35 85% 58% / 0.3)",
                    "0 0 16px hsl(35 85% 58% / 0.5)",
                    "0 0 8px hsl(35 85% 58% / 0)",
                  ],
                } : {}}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className={`font-medium ${
                  isOpen ? "text-primary" : isInvisible ? "text-muted-foreground/70" : "text-foreground"
                }`}
              >
                {getStatusText()}
              </motion.p>
              <p className="text-xs text-muted-foreground">
                {getStatusDescription()}
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
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  Er is een AI-expert aanwezig die open staat voor een gesprek.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Toggle Buttons - 3 options */}
      <div className="flex gap-2 relative z-10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentUserStatus("focus")}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
            isFocus
              ? "bg-muted text-foreground"
              : "bg-transparent text-muted-foreground hover:bg-muted/30"
          }`}
        >
          <Focus className="w-3 h-3 inline mr-1" />
          Focus
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentUserStatus("open")}
          animate={isOpen ? {
            boxShadow: [
              "0 0 15px hsl(35 85% 58% / 0.3)",
              "0 0 25px hsl(35 85% 58% / 0.5)",
              "0 0 15px hsl(35 85% 58% / 0.3)",
            ],
          } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
            isOpen
              ? "bg-primary/20 text-primary border border-primary/40"
              : "bg-transparent text-muted-foreground hover:bg-muted/30"
          }`}
        >
          <Coffee className="w-3 h-3 inline mr-1" />
          Open
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentUserStatus("invisible")}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
            isInvisible
              ? "bg-muted/50 text-muted-foreground border border-dashed border-muted-foreground/30"
              : "bg-transparent text-muted-foreground/50 hover:bg-muted/30"
          }`}
        >
          <EyeOff className="w-3 h-3 inline mr-1" />
          Ghost
        </motion.button>
      </div>
    </motion.div>
  );
};
