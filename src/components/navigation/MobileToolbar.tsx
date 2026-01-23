import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

interface MobileToolbarProps {
  onLogout: () => void;
}

export const MobileToolbar = ({ onLogout }: MobileToolbarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-[76px] left-0 right-0 z-40 flex md:hidden justify-center"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg">
        {/* Language Toggle */}
        <LanguageToggle variant="inline" />
        
        {/* Divider */}
        <div className="w-px h-6 bg-border/50" />
        
        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Uitloggen</span>
        </Button>
      </div>
    </motion.div>
  );
};
