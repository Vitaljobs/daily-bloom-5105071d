import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Coffee, User } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";

export const SocialRadar = () => {
  const { aggregatedSkills, selectedSkill, setSelectedSkill, filteredUsers, openUsers } = useCommonGround();

  // Calculate size based on count - more count = bigger
  const getSize = (count: number) => {
    const maxCount = Math.max(...aggregatedSkills.map((s) => s.count));
    const ratio = count / maxCount;
    
    if (ratio >= 0.8) return "xl";
    if (ratio >= 0.6) return "lg";
    if (ratio >= 0.4) return "md";
    return "sm";
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5 font-medium",
    xl: "text-lg px-6 py-3 font-semibold",
  };

  const glowClasses = {
    sm: "",
    md: "shadow-[0_0_15px_hsl(35_80%_55%/0.15)]",
    lg: "shadow-[0_0_25px_hsl(35_80%_55%/0.25)]",
    xl: "shadow-[0_0_35px_hsl(35_80%_55%/0.35)] border-primary/40",
  };

  return (
    <div className="bento-card h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="text-lg font-serif text-foreground">Skill Pulse</h3>
            <p className="text-sm text-muted-foreground">Expertise in this space right now</p>
          </div>
        </div>

        {selectedSkill && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setSelectedSkill(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm"
          >
            {selectedSkill}
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Skill Cloud */}
      <div className="flex flex-wrap gap-3 justify-center items-center min-h-[180px] relative">
        {/* Breathing background pulse */}
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 rounded-3xl bg-primary/10 blur-xl"
        />

        {aggregatedSkills.map((skill, index) => {
          const size = getSize(skill.count);
          const isSelected = selectedSkill === skill.name;
          const openCount = skill.users.filter((u) => u.status === "open").length;

          return (
            <motion.button
              key={skill.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: isSelected ? 1.1 : 1,
                y: [0, -2, 0],
              }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                y: {
                  repeat: Infinity,
                  duration: 3 + index * 0.2,
                  ease: "easeInOut",
                },
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSkill(isSelected ? null : skill.name)}
              className={`
                ${sizeClasses[size]}
                ${glowClasses[size]}
                ${isSelected ? "ring-2 ring-primary bg-primary/20" : "glass-panel"}
                relative rounded-full cursor-pointer
                hover:border-primary/50 
                transition-all duration-300 z-10
              `}
            >
              <span className={size === "xl" ? "text-primary" : "text-cream"}>
                {skill.name}
              </span>
              <span className="ml-2 text-primary font-medium">{skill.count}</span>
              
              {/* Open indicator */}
              {openCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {openCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Filtered Users Panel */}
      <AnimatePresence>
        {selectedSkill && filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="p-4 rounded-xl glass-panel border border-primary/20">
              <p className="text-sm text-primary mb-3 flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                {filteredUsers.length} {selectedSkill} expert{filteredUsers.length > 1 ? "s" : ""} open for coffee
              </p>
              
              <div className="space-y-2">
                {filteredUsers.slice(0, 3).map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-xs font-medium text-primary-foreground">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                      Invite
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="mt-6 text-center">
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm text-muted-foreground"
        >
          <span className="text-primary font-medium">{openUsers.length} professionals</span> open for coffee
        </motion.p>
      </div>
    </div>
  );
};
