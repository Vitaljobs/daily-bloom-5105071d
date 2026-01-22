import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Wifi } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const LiveOccupancyBadge = () => {
  const [totalCheckedIn, setTotalCheckedIn] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    fetchOccupancy();

    // Set up realtime subscription for profile changes
    const channel = supabase
      .channel('occupancy-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          // Trigger pulse animation and refetch
          setShowPulse(true);
          fetchOccupancy();
          setTimeout(() => setShowPulse(false), 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOccupancy = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('current_lab_id', 'is', null);

      if (error) throw error;
      setTotalCheckedIn(count || 0);
    } catch (error) {
      console.error('Error fetching occupancy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel"
    >
      {/* Live indicator */}
      <div className="relative flex items-center gap-1.5">
        <motion.div
          animate={{ scale: showPulse ? [1, 1.5, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 block" />
          <span className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
        </motion.div>
        <Wifi className="w-3 h-3 text-green-500" />
      </div>

      {/* Count */}
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4 text-primary" />
        <AnimatePresence mode="wait">
          <motion.span
            key={totalCheckedIn}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-medium text-foreground"
          >
            {isLoading ? "..." : totalCheckedIn}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-muted-foreground">
          {totalCheckedIn === 1 ? "professional" : "professionals"} online
        </span>
      </div>
    </motion.div>
  );
};
