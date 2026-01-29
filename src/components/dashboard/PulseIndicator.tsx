import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { pulseApi, PulseStats } from '@/lib/pulse';

export const PulseIndicator = () => {
    const [stats, setStats] = useState<PulseStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await pulseApi.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch pulse stats", error);
            }
        };

        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!stats) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-sm mb-4"
        >
            <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <Activity className="w-3.5 h-3.5" />
                <span>{stats.active_now} Active</span>
                <span className="text-white/40">|</span>
                <span>{stats.page_views_24h.toLocaleString()} Views</span>
            </div>
        </motion.div>
    );
};
