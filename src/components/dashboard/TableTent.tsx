import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Focus, User, BellOff, Sparkles, Lightbulb } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { smartSuggestions } from "@/data/mock-users";

export const TableTent = () => {
  const { currentUserStatus, setCurrentUserStatus, aggregatedSkills, openUsers } = useCommonGround();

  // Get a smart suggestion based on available skills
  const dailySuggestion = useMemo(() => {
    // Find a skill that has open users
    const availableSkills = aggregatedSkills.filter((skill) =>
      skill.users.some((user) => user.status === "open")
    );

    if (availableSkills.length === 0) return null;

    // Find matching suggestion
    const matchingSuggestion = smartSuggestions.find((s) =>
      availableSkills.some((skill) => skill.name === s.skill)
    );

    return matchingSuggestion || {
      skill: availableSkills[0].name,
      message: `Er zijn ${availableSkills[0].users.filter((u) => u.status === "open").length} ${availableSkills[0].name} experts beschikbaar!`,
    };
  }, [aggregatedSkills]);

  return (
    <motion.div
      layout
      className={`
        bento-card transition-all duration-500 overflow-hidden
        ${currentUserStatus === "open" 
          ? "shadow-[0_0_50px_hsl(35_80%_55%/0.25)] border-primary/40" 
          : "bg-[hsl(20_25%_8%)] border-border/50"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={currentUserStatus === "open" ? { 
            boxShadow: ["0 0 20px hsl(35 80% 55% / 0.3)", "0 0 35px hsl(35 80% 55% / 0.5)", "0 0 20px hsl(35 80% 55% / 0.3)"]
          } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            currentUserStatus === "open" 
              ? "bg-primary/30 border border-primary/50" 
              : "bg-muted/50 border border-border"
          }`}
        >
          {currentUserStatus === "open" ? (
            <Coffee className="w-5 h-5 text-primary" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.div>
        <div>
          <h3 className="text-lg font-serif text-foreground">Your Status</h3>
          <p className="text-sm text-muted-foreground">Digital Table Tent</p>
        </div>
      </div>

      {/* Status Toggle */}
      <div className="flex gap-2 mb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentUserStatus("focus")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentUserStatus === "focus"
              ? "bg-muted text-foreground border border-border"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Focus className="w-4 h-4 inline mr-2" />
          Focus Mode
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentUserStatus("open")}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentUserStatus === "open"
              ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_hsl(35_80%_55%/0.2)]"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Coffee className="w-4 h-4 inline mr-2" />
          Open for Coffee
        </motion.button>
      </div>

      {/* Current Status Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentUserStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center py-4"
        >
          {currentUserStatus === "open" ? (
            <>
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 30px hsl(35 80% 55% / 0.3)",
                    "0 0 50px hsl(35 80% 55% / 0.5)",
                    "0 0 30px hsl(35 80% 55% / 0.3)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary mx-auto mb-4 flex items-center justify-center"
              >
                <User className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-foreground font-medium">You're visible!</p>
              <p className="text-sm text-muted-foreground mb-4">
                {openUsers.length} others also open for coffee
              </p>

              {/* Smart Suggestion */}
              {dailySuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-xs font-medium text-primary mb-1">Daily Tip</p>
                      <p className="text-xs text-muted-foreground">{dailySuggestion.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-muted/50 border border-border mx-auto mb-4 flex items-center justify-center relative">
                <Focus className="w-8 h-8 text-muted-foreground" />
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
                  <BellOff className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <p className="text-foreground font-medium">Deep work mode</p>
              <p className="text-sm text-muted-foreground">You're invisible to others</p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 rounded-xl bg-muted/30 border border-border"
              >
                <p className="text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {openUsers.length} professionals are open for coffee right now
                </p>
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
