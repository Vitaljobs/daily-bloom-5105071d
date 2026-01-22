import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Zap, Users, MessageCircle } from "lucide-react";

export const EngagementPulse = () => {
  // Mock real-time counter
  const [invitesToday, setInvitesToday] = useState(47);
  const [activeChats, setActiveChats] = useState(12);
  const [newConnections, setNewConnections] = useState(23);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setInvitesToday((prev) => prev + 1);
      }
      if (Math.random() > 0.8) {
        setActiveChats((prev) => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden h-full">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-pink/10 border border-neon-pink/30">
            <Zap className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-foreground">Engagement Pulse</h2>
            <p className="text-sm text-muted-foreground">Today's activity</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Coffee Invites Counter */}
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-cyan/5 border border-neon-cyan/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-neon-cyan/10 blur-2xl" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-6 h-6 text-neon-cyan" />
              <span className="text-sm text-muted-foreground">Coffee Invites Sent</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={invitesToday}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-3xl font-bold text-neon-cyan"
              >
                {invitesToday}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Active Chats */}
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-xl bg-admin-elevated border border-admin-border">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-neon-green" />
              <span className="text-xs text-muted-foreground">Active Chats</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeChats}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-neon-green"
              >
                {activeChats}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex-1 p-4 rounded-xl bg-admin-elevated border border-admin-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-neon-purple" />
              <span className="text-xs text-muted-foreground">New Connections</span>
            </div>
            <span className="text-2xl font-bold text-neon-purple">{newConnections}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
