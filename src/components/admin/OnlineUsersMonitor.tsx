import { motion, AnimatePresence } from "framer-motion";
import { Users, Wifi, MapPin, Loader2, Clock } from "lucide-react";
import { useOnlineUsers } from "@/hooks/useAdminData";
import { labs } from "@/data/labs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";

export const OnlineUsersMonitor = () => {
  const { data: onlineUsers, isLoading, error } = useOnlineUsers();

  const getLabName = (labId: string | null) => {
    if (!labId) return null;
    const lab = labs.find((l) => l.id === labId);
    return lab ? lab.name : labId;
  };

  const getLabIcon = (labId: string | null) => {
    if (!labId) return null;
    const lab = labs.find((l) => l.id === labId);
    return lab?.icon;
  };

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
        <span className="text-sm">Kon online gebruikers niet laden</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <Wifi className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-foreground">Nu Online</h2>
              <p className="text-sm text-muted-foreground">Actieve gebruikers (laatste 15 min)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
            </span>
            <span className="text-sm font-bold text-neon-green">{onlineUsers?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {onlineUsers && onlineUsers.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence>
              {onlineUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-admin-elevated border border-admin-border hover:border-neon-cyan/30 transition-colors"
                >
                  {/* Avatar with online indicator */}
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-neon-green/30">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                      <AvatarFallback className="bg-admin-elevated text-foreground text-sm">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-neon-green ring-2 ring-card" />
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">{user.name}</span>
                      {user.industry && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20 truncate">
                          {user.industry}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1">
                      {/* Location */}
                      {user.current_lab_id && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{getLabIcon(user.current_lab_id)}</span>
                          <span className="truncate">{getLabName(user.current_lab_id)}</span>
                        </div>
                      )}
                      
                      {/* Last seen */}
                      {user.last_seen && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(user.last_seen), { 
                              addSuffix: true,
                              locale: nl 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="flex-shrink-0">
                    {user.current_lab_id ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20">
                        <MapPin className="w-3 h-3 text-neon-cyan" />
                        <span className="text-xs font-medium text-neon-cyan">Ingecheckt</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/20">
                        <Wifi className="w-3 h-3 text-neon-green" />
                        <span className="text-xs font-medium text-neon-green">Online</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Geen actieve gebruikers op dit moment</p>
          </div>
        )}
      </div>
    </div>
  );
};
