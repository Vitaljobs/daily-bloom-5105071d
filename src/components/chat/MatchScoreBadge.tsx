import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import { getMatchScoreLabel } from "@/lib/match-scoring";

interface MatchScoreBadgeProps {
  score: number;
  sharedSkillsCount: number;
  sameLocation: boolean;
}

export const MatchScoreBadge = ({
  score,
  sharedSkillsCount,
  sameLocation,
}: MatchScoreBadgeProps) => {
  const { label, color } = getMatchScoreLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      {/* Score circle */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 10px hsl(35 85% 58% / 0.2)",
            "0 0 20px hsl(35 85% 58% / 0.4)",
            "0 0 10px hsl(35 85% 58% / 0.2)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-gold-dark/20 border border-primary/30 flex items-center justify-center"
      >
        <span className={`text-sm font-bold ${color}`}>{score}%</span>
        
        {/* Animated ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 40 40"
        >
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="hsl(35 85% 58% / 0.3)"
            strokeWidth="2"
            strokeDasharray={`${(score / 100) * 113} 113`}
            initial={{ strokeDasharray: "0 113" }}
            animate={{ strokeDasharray: `${(score / 100) * 113} 113` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Label and details */}
      <div className="flex flex-col">
        <span className={`text-xs font-medium ${color}`}>{label}</span>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" />
            {sharedSkillsCount} gedeeld
          </span>
          {sameLocation && (
            <span className="flex items-center gap-0.5 text-primary">
              <TrendingUp className="w-3 h-3" />
              Zelfde locatie
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
