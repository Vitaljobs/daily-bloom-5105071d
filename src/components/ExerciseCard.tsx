import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  duration?: string;
  variant?: "default" | "featured";
  delay?: number;
  onClick?: () => void;
}

export const ExerciseCard = ({
  icon: Icon,
  title,
  subtitle,
  duration,
  variant = "default",
  delay = 0,
  onClick,
}: ExerciseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-2xl p-6 transition-all duration-300",
        "card-glass hover:border-primary/30",
        variant === "featured" && "glow-gold"
      )}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div
          whileHover={{ rotate: 5 }}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
          )}
        >
          <Icon className="w-8 h-8 text-primary" />
        </motion.div>

        <div className="space-y-1">
          <h3 className="text-lg font-serif text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          {duration && (
            <p className="text-xs text-primary font-medium">{duration}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
