import { motion } from "framer-motion";
import { TrendingUp, Crown, Users, ArrowUpRight, Loader2, Zap } from "lucide-react";
import { usePremiumStats, useTopSkills } from "@/hooks/useAdminData";

export const RevenueTracker = () => {
  const { data: premiumStats, isLoading: premiumLoading } = usePremiumStats();
  const { data: topSkills, isLoading: skillsLoading } = useTopSkills();

  const isLoading = premiumLoading || skillsLoading;

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-12 flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  const topSkill = topSkills?.[0];

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden h-full">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <TrendingUp className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-foreground">Stats Overview</h2>
              <p className="text-sm text-muted-foreground">Premium leden & populaire skills</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Premium Members */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-cyan/5 border border-neon-cyan/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-neon-cyan" />
              <span className="text-sm text-muted-foreground">Premium Leden</span>
            </div>
            <p className="text-4xl font-bold text-neon-cyan">{premiumStats?.paidTotal || 0}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{premiumStats?.premium || 0} Premium</span>
              <span>•</span>
              <span>{premiumStats?.vip || 0} VIP</span>
            </div>
          </motion.div>

          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-gradient-to-br from-neon-purple/10 to-neon-purple/5 border border-neon-purple/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-neon-purple" />
              <span className="text-sm text-muted-foreground">Totaal Gebruikers</span>
            </div>
            <p className="text-4xl font-bold text-neon-purple">{premiumStats?.total || 0}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{premiumStats?.free || 0} gratis</span>
            </div>
          </motion.div>
        </div>

        {/* Top Skills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-admin-elevated border border-admin-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-neon-green" />
            <span className="font-medium text-foreground">Populairste Skills</span>
          </div>
          
          {topSkill ? (
            <div className="space-y-3">
              {/* #1 Skill - Featured */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-neon-green/10 border border-neon-green/20">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-neon-green">#1</span>
                  <span className="font-medium text-foreground">{topSkill.skill}</span>
                </div>
                <span className="text-sm text-neon-green font-bold">{topSkill.count} experts</span>
              </div>

              {/* Other top skills */}
              <div className="grid grid-cols-2 gap-2">
                {topSkills?.slice(1, 5).map((skill, index) => (
                  <div 
                    key={skill.skill}
                    className="flex items-center justify-between p-2 rounded-lg bg-admin-elevated border border-admin-border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{index + 2}</span>
                      <span className="text-sm text-foreground truncate">{skill.skill}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{skill.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nog geen skills geregistreerd</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
