import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format, parseISO, eachDayOfInterval } from "date-fns";
import { nl } from "date-fns/locale";

export const useAdminCharts = () => {
    return useQuery({
        queryKey: ["admin-charts-data"],
        queryFn: async () => {
            const today = new Date();
            const thirtyDaysAgo = subDays(today, 30);

            // 1. Fetch Page Views (Last 30 days)
            const { data: pageViews } = await supabase
                .from("page_views")
                .select("created_at")
                .gte("created_at", thirtyDaysAgo.toISOString())
                .order("created_at", { ascending: true });

            // 2. Fetch User Growth (Last 30 days)
            const { data: newUsers } = await supabase
                .from("profiles")
                .select("created_at")
                .gte("created_at", thirtyDaysAgo.toISOString())
                .order("created_at", { ascending: true });

            // 3. Fetch Sessions (Last 30 days)
            // @ts-ignore - Table exists but types are not yet regenerated
            const { data: sessions } = await supabase
                .from("user_sessions")
                .select("started_at")
                .gte("started_at", thirtyDaysAgo.toISOString())
                .order("started_at", { ascending: true });

            // Helper to group by date
            const generateDateMap = () => {
                const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
                return days.reduce((acc, day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    acc[dateKey] = {
                        date: format(day, "d MMM", { locale: nl }),
                        fullDate: dateKey,
                        views: 0,
                        users: 0,
                        sessions: 0,
                    };
                    return acc;
                }, {} as Record<string, any>);
            };

            const chartDataMap = generateDateMap();

            // Aggregate Views
            pageViews?.forEach((pv) => {
                const dateKey = format(parseISO(pv.created_at), "yyyy-MM-dd");
                if (chartDataMap[dateKey]) {
                    chartDataMap[dateKey].views += 1;
                }
            });

            // Aggregate Users
            newUsers?.forEach((u) => {
                const dateKey = format(parseISO(u.created_at), "yyyy-MM-dd");
                if (chartDataMap[dateKey]) {
                    chartDataMap[dateKey].users += 1;
                }
            });

            // Aggregate Sessions
            sessions?.forEach((s) => {
                const dateKey = format(parseISO(s.started_at), "yyyy-MM-dd");
                if (chartDataMap[dateKey]) {
                    chartDataMap[dateKey].sessions += 1;
                }
            });

            return Object.values(chartDataMap);
        },
    });
};
