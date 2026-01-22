import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Coffee } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { UserProfile } from "@/types/common-ground";

export const SocialRadar = () => {
  const { checkedInUsers, openUsers, setSelectedUser, selectedUser } = useCommonGround();
  const [hoveredUser, setHoveredUser] = useState<UserProfile | null>(null);

  const handleUserClick = (user: UserProfile) => {
    // Set selected user for Smart Match widget
    setSelectedUser(selectedUser?.id === user.id ? null : user);
  };

  return (
    <div className="wood-card p-5 h-full relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-base font-serif text-foreground">Social Radar</h3>
          <p className="text-xs text-muted-foreground">{openUsers.length} beschikbaar voor koffie</p>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-4 gap-3 relative z-10">
        {checkedInUsers.slice(0, 8).map((user, index) => (
          <motion.button
            key={user.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredUser(user)}
            onMouseLeave={() => setHoveredUser(null)}
            onClick={() => handleUserClick(user)}
            className={`
              relative w-12 h-12 rounded-full flex items-center justify-center
              text-sm font-medium transition-all duration-300
              ${user.status === "open" 
                ? "bg-gradient-to-br from-primary to-gold-dark text-primary-foreground" 
                : "bg-muted text-muted-foreground"
              }
              ${selectedUser?.id === user.id 
                ? "ring-2 ring-primary ring-offset-2 ring-offset-[#1a1310] shadow-[0_0_20px_hsl(35_85%_58%/0.4)]" 
                : ""
              }
            `}
          >
            {user.avatar}
            {user.status === "open" && (
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-[#1a1310]" 
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredUser && !selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-4 right-4 bottom-4 glass-inner p-3 z-20"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                ${hoveredUser.status === "open" 
                  ? "bg-gradient-to-br from-primary to-gold-dark text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
                }`}
              >
                {hoveredUser.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{hoveredUser.name}</p>
                <p className="text-xs text-muted-foreground">{hoveredUser.role}</p>
              </div>
              {hoveredUser.status === "open" && (
                <Coffee className="w-4 h-4 text-primary ml-auto" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected User Card */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-4 right-4 bottom-4 glass-inner p-4 z-20 border border-primary/30"
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${selectedUser.status === "open" 
                  ? "bg-gradient-to-br from-primary to-gold-dark text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
                }`}
              >
                {selectedUser.avatar}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedUser.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Klik op <span className="text-primary">Smart Match</span> om uit te nodigen
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
