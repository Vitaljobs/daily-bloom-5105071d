import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";

export const SkillsWidget = () => {
  const { aggregatedSkills } = useCommonGround();
  const topSkills = aggregatedSkills.slice(0, 5);
  const maxCount = topSkills[0]?.count || 1;

  return (
    <div className="wood-card p-5 h-full relative">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-serif text-foreground">Skills</h3>
          <p className="text-xs text-muted-foreground">Aanwezige expertise</p>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        {topSkills.map((skill, index) => {
          const isTop = index === 0;
          const widthPercent = (skill.count / maxCount) * 100;

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
              className="flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <motion.span 
                    animate={isTop ? { 
                      textShadow: ["0 0 8px hsl(35 85% 58% / 0)", "0 0 8px hsl(35 85% 58% / 0.5)", "0 0 8px hsl(35 85% 58% / 0)"]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`text-sm ${isTop ? "text-primary font-semibold" : "text-foreground"}`}
                  >
                    {skill.name}
                    {isTop && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary"
                      >
                        TOP
                      </motion.span>
                    )}
                  </motion.span>
                  <span className="text-xs text-muted-foreground">{skill.count}</span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${isTop ? "bg-gradient-to-r from-primary to-gold-light" : "bg-muted-foreground/50"}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 flex items-center gap-2 text-xs text-muted-foreground relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
        <span>Live updates</span>
      </motion.div>
    </div>
  );
};
