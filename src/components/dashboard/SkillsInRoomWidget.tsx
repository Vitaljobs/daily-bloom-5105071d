import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Palette, Code, TrendingUp, MoreHorizontal } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useMemo } from "react";

// Role category mapping
const ROLE_CATEGORIES = {
  "Developer": { icon: Code, color: "text-blue-400" },
  "Designer": { icon: Palette, color: "text-pink-400" },
  "Marketeer": { icon: TrendingUp, color: "text-green-400" },
  "Finance": { icon: Briefcase, color: "text-amber-400" },
  "Other": { icon: MoreHorizontal, color: "text-muted-foreground" },
};

const categorizeRole = (role: string): keyof typeof ROLE_CATEGORIES => {
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("developer") || lowerRole.includes("engineer") || lowerRole.includes("programmer")) {
    return "Developer";
  }
  if (lowerRole.includes("designer") || lowerRole.includes("ux") || lowerRole.includes("ui") || lowerRole.includes("creative")) {
    return "Designer";
  }
  if (lowerRole.includes("market") || lowerRole.includes("content") || lowerRole.includes("brand") || lowerRole.includes("strateg")) {
    return "Marketeer";
  }
  if (lowerRole.includes("financ") || lowerRole.includes("invest") || lowerRole.includes("analyst") || lowerRole.includes("consult")) {
    return "Finance";
  }
  return "Other";
};

export const SkillsInRoomWidget = () => {
  const { openUsers, currentLab } = useCommonGround();

  // Aggregate roles by category
  const roleCategories = useMemo(() => {
    const categories: Record<string, number> = {};
    
    openUsers.forEach((user) => {
      const category = categorizeRole(user.role);
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [openUsers]);

  const totalProfessionals = openUsers.length;

  return (
    <div className="wood-card p-4 h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 8px hsl(35 85% 58% / 0.2)",
              "0 0 16px hsl(35 85% 58% / 0.4)",
              "0 0 8px hsl(35 85% 58% / 0.2)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <Users className="w-3.5 h-3.5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-sm font-serif text-foreground">Nu Aanwezig</h3>
          <p className="text-[10px] text-muted-foreground">In {currentLab?.name || "dit Lab"}</p>
        </div>
      </div>

      {/* Role categories */}
      <div className="space-y-2 relative z-10">
        <AnimatePresence mode="popLayout">
          {roleCategories.map(([category, count], index) => {
            const categoryInfo = ROLE_CATEGORIES[category as keyof typeof ROLE_CATEGORIES];
            const Icon = categoryInfo.icon;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 glass-inner px-3 py-2 rounded-lg"
              >
                <Icon className={`w-4 h-4 ${categoryInfo.color}`} />
                <span className="text-xs text-foreground flex-1">{count}x {category}</span>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Total count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between text-xs relative z-10"
      >
        <span className="text-muted-foreground">Totaal open voor koffie</span>
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-primary font-semibold"
        >
          {totalProfessionals}
        </motion.span>
      </motion.div>
    </div>
  );
};
