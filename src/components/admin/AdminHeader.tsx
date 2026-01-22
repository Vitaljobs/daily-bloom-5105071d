import { motion } from "framer-motion";
import { Settings, ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-admin-border bg-admin-elevated/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground hover:bg-admin-border"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30"
              >
                <Settings className="w-6 h-6 text-neon-cyan" />
              </motion.div>
              
              <div>
                <h1 className="text-xl font-sans font-semibold text-foreground tracking-tight">
                  Admin Control Center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Common Ground Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-medium text-neon-green">System Online</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-admin-border">
              <Shield className="w-4 h-4 text-neon-cyan" />
              <span className="text-xs font-medium text-foreground">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
