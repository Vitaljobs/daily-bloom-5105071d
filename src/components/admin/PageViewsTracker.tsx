import { motion, AnimatePresence } from "framer-motion";
import { Eye, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { usePageViewStats } from "@/hooks/useAdminData";
import { useAdminCharts } from "@/hooks/useAdminCharts";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const PageViewsTracker = () => {
  const { data: pageStats, isLoading: statsLoading } = usePageViewStats();
  const { data: chartData, isLoading: chartLoading } = useAdminCharts();

  const isLoading = statsLoading || chartLoading;

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 flex items-center justify-center h-full min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
            <Eye className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-foreground">Page Views</h2>
            <p className="text-sm text-muted-foreground">Bezoekersstatistieken (30 dagen)</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        {/* Total Views - Hero stat */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-2 relative p-5 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/5 border border-neon-cyan/20 overflow-hidden"
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

          <div className="p-3 rounded-xl bg-admin-elevated border border-admin-border flex flex-col justify-center">
            <span className="text-xs text-muted-foreground mb-1">Vandaag</span>
            <span className="text-xl font-bold text-neon-green">{pageStats?.today || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-admin-elevated border border-admin-border flex flex-col justify-center">
            <span className="text-xs text-muted-foreground mb-1">Deze Week</span>
            <span className="text-xl font-bold text-neon-purple">{pageStats?.thisWeek || 0}</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="date"
                stroke="#ffffff50"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '8px' }}
                itemStyle={{ color: '#06b6d4' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
