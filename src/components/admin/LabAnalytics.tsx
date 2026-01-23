import { motion } from "framer-motion";
import { BarChart3, Users, Crown, Loader2, TrendingUp } from "lucide-react";
import { useLabAnalytics } from "@/hooks/useAdminData";

export const LabAnalytics = () => {
  const { data: labAnalytics, isLoading, error } = useLabAnalytics();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 text-center text-muted-foreground">
        <span className="text-sm">Kon lab analytics niet laden</span>
      </div>
    );
  }

  const totalActive = labAnalytics?.reduce((sum, lab) => sum + lab.activeUsers, 0) || 0;
  const busiestLab = labAnalytics?.[0];

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
              <BarChart3 className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-foreground">Lab Analytics</h2>
              <p className="text-sm text-muted-foreground">Bezetting per locatie</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/30">
            <Users className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-bold text-neon-purple">{totalActive} totaal</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Busiest Lab Highlight */}
        {busiestLab && busiestLab.activeUsers > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 border border-neon-cyan/30"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4 text-neon-cyan" />
              <span>Drukste Locatie</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{busiestLab.icon}</span>
                <span className="font-semibold text-foreground">{busiestLab.name}</span>
              </div>
              <span className="text-2xl font-bold text-neon-cyan">{busiestLab.activeUsers}</span>
            </div>
          </motion.div>
        )}

        {/* Lab bars */}
        <div className="space-y-4">
          {labAnalytics?.map((lab, index) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lab.icon}</span>
                  <span className="text-sm font-medium text-foreground">{lab.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {lab.premiumUsers > 0 && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Crown className="w-3 h-3" />
                      <span>{lab.premiumUsers}</span>
                    </div>
                  )}
                  <span className="text-sm font-bold text-foreground">{lab.activeUsers}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-2 bg-admin-elevated rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lab.occupancyPercent}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    lab.occupancyPercent >= 80 
                      ? "bg-gradient-to-r from-neon-pink to-neon-purple" 
                      : lab.occupancyPercent >= 50 
                      ? "bg-gradient-to-r from-neon-cyan to-neon-green" 
                      : "bg-gradient-to-r from-neon-cyan/70 to-neon-cyan"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {(!labAnalytics || labAnalytics.every(l => l.activeUsers === 0)) && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Geen actieve gebruikers in labs</p>
          </div>
        )}
      </div>
    </div>
  );
};
