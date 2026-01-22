import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const AdminLink = () => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={() => navigate("/admin")}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shadow-lg"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-card border-border">
          <p>Admin Control Center</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
