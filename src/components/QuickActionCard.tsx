import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  variant?: "primary" | "secondary";
  delay?: number;
  onClick?: () => void;
}

export const QuickActionCard = ({
  title,
  variant = "primary",
  delay = 0,
  onClick,
}: QuickActionCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "w-full py-4 px-6 rounded-xl font-medium transition-all duration-300",
        variant === "primary"
          ? "btn-gold"
          : "bg-secondary border border-border text-foreground hover:bg-secondary/80 hover:border-primary/30"
      )}
    >
      {title}
    </motion.button>
  );
};
