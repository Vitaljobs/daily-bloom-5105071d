import { motion } from "framer-motion";
import { Users, TrendingUp, Loader2 } from "lucide-react";
import { useAdminCharts } from "@/hooks/useAdminCharts";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const UserGrowthChart = () => {
    const { data: chartData, isLoading } = useAdminCharts();

    if (isLoading) {
        return (
            <div className="rounded-2xl bg-card border border-admin-border p-8 flex items-center justify-center h-full min-h-[300px]">
                <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
            </div>
        );
    }

    // Calculate total new users in period
    const totalNewUsers = chartData?.reduce((acc, day) => acc + day.users, 0) || 0;

    return (
        <div className="rounded-2xl bg-card border border-admin-border overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-admin-border">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
                        <Users className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div>
                        <h2 className="text-lg font-sans font-semibold text-foreground">Gebruikers Groei</h2>
                        <p className="text-sm text-muted-foreground">Nieuwe leden (30 dagen)</p>
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-neon-purple/5 border border-neon-purple/10">
                    <TrendingUp className="w-5 h-5 text-neon-purple" />
                    <span className="text-2xl font-bold text-foreground">+{totalNewUsers}</span>
                    <span className="text-sm text-muted-foreground">nieuwe gebruikers deze maand</span>
                </div>

                <div className="flex-1 min-h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#ffffff50"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                interval={4}
                            />
                            <Tooltip
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '8px' }}
                                itemStyle={{ color: '#a855f7' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Bar
                                dataKey="users"
                                fill="#a855f7"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
