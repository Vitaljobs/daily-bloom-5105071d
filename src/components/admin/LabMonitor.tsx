import { motion } from "framer-motion";
import { Building2, Users, Zap, Loader2 } from "lucide-react";
import { useLabStats } from "@/hooks/useAdminData";

export const LabMonitor = () => {
  const { data: labStats, isLoading, error } = useLabStats();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 text-center text-destructive">
        Fout bij laden van lab data
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
            <Building2 className="w-5 h-5 text-neon-purple" />
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-foreground">Lab Monitor</h2>
            <p className="text-sm text-muted-foreground">Real-time occupancy per location</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {labStats?.map((lab, index) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative p-5 rounded-xl bg-admin-elevated border border-admin-border hover:border-neon-cyan/30 transition-all duration-300"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-sans font-medium text-foreground text-sm leading-tight">
                    {lab.name}
                  </h3>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20">
                    <Users className="w-3 h-3 text-neon-cyan" />
                    <span className="text-xs font-bold text-neon-cyan">{lab.checked_in_count}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {lab.description}
                </p>

                <div className="pt-3 border-t border-admin-border">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-neon-green" />
                    <span className="text-xs text-muted-foreground">Top skill:</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-neon-green truncate">
                      {lab.top_skill || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
