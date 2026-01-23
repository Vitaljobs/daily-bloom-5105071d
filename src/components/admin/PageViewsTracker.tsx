import { motion, AnimatePresence } from "framer-motion";
import { Eye, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { usePageViewStats } from "@/hooks/useAdminData";

export const PageViewsTracker = () => {
  const { data: pageStats, isLoading, error } = usePageViewStats();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 text-center text-muted-foreground h-full flex items-center justify-center">
        <span className="text-sm">Geen page view data beschikbaar</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden h-full">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
            <Eye className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-foreground">Page Views</h2>
            <p className="text-sm text-muted-foreground">Bezoekersstatistieken</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Total Views - Hero stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-5 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/5 border border-neon-cyan/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-neon-cyan/10 blur-2xl" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-neon-cyan" />
              <span className="text-sm text-muted-foreground">Totaal Views</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={pageStats?.total}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-3xl font-bold text-neon-cyan"
              >
                {pageStats?.total?.toLocaleString() || 0}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Time-based stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-admin-elevated border border-admin-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-neon-green" />
              <span className="text-xs text-muted-foreground">Vandaag</span>
            </div>
            <span className="text-2xl font-bold text-neon-green">
              {pageStats?.today || 0}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-xl bg-admin-elevated border border-admin-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-neon-purple" />
              <span className="text-xs text-muted-foreground">Deze Week</span>
            </div>
            <span className="text-2xl font-bold text-neon-purple">
              {pageStats?.thisWeek || 0}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
