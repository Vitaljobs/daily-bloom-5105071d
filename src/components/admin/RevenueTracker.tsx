import { motion } from "framer-motion";
import { TrendingUp, Crown, CreditCard, ArrowUpRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock revenue data
const revenueData = [
  { month: "Jan", premium: 12, dayPass: 45 },
  { month: "Feb", premium: 18, dayPass: 52 },
  { month: "Mar", premium: 25, dayPass: 61 },
  { month: "Apr", premium: 32, dayPass: 58 },
  { month: "May", premium: 41, dayPass: 72 },
  { month: "Jun", premium: 48, dayPass: 85 },
  { month: "Jul", premium: 56, dayPass: 91 },
];

export const RevenueTracker = () => {
  const totalPremium = revenueData[revenueData.length - 1].premium;
  const totalDayPass = revenueData[revenueData.length - 1].dayPass;
  const growthRate = Math.round(
    ((totalPremium - revenueData[0].premium) / revenueData[0].premium) * 100
  );

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden h-full">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <TrendingUp className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-foreground">Revenue Tracker</h2>
              <p className="text-sm text-muted-foreground">Premium & Day Pass growth</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30">
            <ArrowUpRight className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-bold text-neon-green">+{growthRate}%</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-admin-elevated border border-admin-border">
            <Crown className="w-5 h-5 text-neon-cyan" />
            <div>
              <p className="text-xs text-muted-foreground">Premium Members</p>
              <p className="text-2xl font-bold text-neon-cyan">{totalPremium}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-admin-elevated border border-admin-border">
            <CreditCard className="w-5 h-5 text-neon-purple" />
            <div>
              <p className="text-xs text-muted-foreground">Day Passes Sold</p>
              <p className="text-2xl font-bold text-neon-purple">{totalDayPass}</p>
            </div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(185 100% 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(185 100% 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dayPassGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(270 100% 65%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(270 100% 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 12% 18%)" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(210 10% 55%)" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(210 10% 55%)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 15% 11%)",
                  border: "1px solid hsl(220 12% 18%)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(210 20% 92%)" }}
              />
              <Area
                type="monotone"
                dataKey="premium"
                stroke="hsl(185 100% 50%)"
                strokeWidth={2}
                fill="url(#premiumGradient)"
                name="Premium"
              />
              <Area
                type="monotone"
                dataKey="dayPass"
                stroke="hsl(270 100% 65%)"
                strokeWidth={2}
                fill="url(#dayPassGradient)"
                name="Day Pass"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-cyan" />
            <span className="text-xs text-muted-foreground">Premium Members</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-purple" />
            <span className="text-xs text-muted-foreground">Day Passes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
