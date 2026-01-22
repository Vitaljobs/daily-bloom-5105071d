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
              className="flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isTop ? "text-primary font-medium" : "text-foreground"}`}>
                    {skill.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{skill.count}</span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className={`h-full rounded-full ${isTop ? "bg-primary" : "bg-muted-foreground/50"}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
