import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, Activity, Loader2 } from "lucide-react";
import { useEngagementStats, usePremiumStats } from "@/hooks/useAdminData";

export const EngagementPulse = () => {
  const { data: engagementStats, isLoading: engagementLoading } = useEngagementStats();
  const { data: premiumStats, isLoading: premiumLoading } = usePremiumStats();

  const isLoading = engagementLoading || premiumLoading;

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-12 flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden h-full">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-pink/10 border border-neon-pink/30">
            <Zap className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-foreground">Engagement Pulse</h2>
            <p className="text-sm text-muted-foreground">Vandaag</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Active Users Today */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-5 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-cyan/5 border border-neon-cyan/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-neon-cyan/10 blur-2xl" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-neon-cyan" />
              <span className="text-sm text-muted-foreground">Actief Vandaag</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={engagementStats?.activeToday}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-3xl font-bold text-neon-cyan"
              >
                {engagementStats?.activeToday || 0}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 p-4 rounded-xl bg-admin-elevated border border-admin-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-neon-purple" />
              <span className="text-xs text-muted-foreground">Gratis</span>
            </div>
            <span className="text-2xl font-bold text-neon-purple">{premiumStats?.free || 0}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 p-4 rounded-xl bg-admin-elevated border border-admin-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-neon-green" />
              <span className="text-xs text-muted-foreground">Premium</span>
            </div>
            <span className="text-2xl font-bold text-neon-green">{premiumStats?.paidTotal || 0}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
