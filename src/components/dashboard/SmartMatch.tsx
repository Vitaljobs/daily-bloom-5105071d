import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";

export const SmartMatch = () => {
  const { openUsers } = useCommonGround();
  const match = openUsers[0];

  if (!match) return null;

  return (
    <div className="wood-card p-5 h-full relative">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-serif text-foreground">Smart Match</h3>
          <p className="text-xs text-muted-foreground">Aanbevolen connectie</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-inner p-4 relative z-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-sm font-medium text-primary-foreground avatar-ring">
            {match.avatar}
          </div>
          <div>
            <p className="font-medium text-foreground">{match.name}</p>
            <p className="text-xs text-muted-foreground">{match.role}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {match.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 btn-gold py-2 rounded-lg text-xs font-medium">
            Uitnodigen
          </button>
          <button className="p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
