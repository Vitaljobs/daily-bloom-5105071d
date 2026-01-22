import { motion } from "framer-motion";
import { Crown } from "lucide-react";

interface PremiumBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PremiumBadge = ({ size = "sm", className = "" }: PremiumBadgeProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-md ${className}`}
    >
      <Crown className={`${iconSizes[size]} text-primary-foreground`} />
    </motion.div>
  );
};
