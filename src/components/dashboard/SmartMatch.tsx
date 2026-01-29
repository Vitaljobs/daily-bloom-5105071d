import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Coffee, Check, MessageCircle } from "lucide-react";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { useToast } from "@/hooks/use-toast";

export const SmartMatch = () => {
  const {
    openUsers,
    selectedUser,
    setSelectedUser,
    sendInvite,
    lastInvitedUser,
    triggerMatchReveal,
    hasActiveChat,
    chatPartner,
    openChat,
  } = useCommonGround();
  const { toast } = useToast();

  // Use selected user from Social Radar, or default to first open user
  const match = selectedUser || openUsers[0];

  const handleInvite = () => {
    if (!match) return;

    sendInvite(match);
    toast({
      title: "☕ Koffie-uitnodiging verzonden!",
      description: `Je uitnodiging is verzonden naar ${match.name}`,
    });

    // Trigger the match reveal animation after a short delay (simulating acceptance)
    setTimeout(() => {
      triggerMatchReveal(match);
    }, 1500);
  };

  const handleOpenChat = () => {
    if (chatPartner) {
      openChat(chatPartner);
    }
  };

  const isInvited = lastInvitedUser?.id === match?.id;

  // Show active chat status
  if (hasActiveChat && chatPartner) {
    return (
      <div className="wood-card p-5 h-full relative">
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 text-primary" />
          </motion.div>
          <div>
            <h3 className="text-base font-serif text-foreground">Actieve Chat</h3>
            <p className="text-xs text-muted-foreground">Gesprek bezig</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-inner p-4 relative z-10 border border-primary/40 shadow-[0_0_20px_hsl(35_85%_58%/0.2)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px hsl(35 85% 58% / 0.3)",
                  "0 0 25px hsl(35 85% 58% / 0.5)",
                  "0 0 10px hsl(35 85% 58% / 0.3)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-sm font-medium text-primary-foreground"
            >
              {chatPartner.avatar}
            </motion.div>
            <div>
              <p className="font-medium text-foreground">{chatPartner.name}</p>
              <p className="text-xs text-primary flex items-center gap-1">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                Verbonden
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenChat}
            className="w-full py-2.5 rounded-lg btn-gold text-xs font-medium flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Open Chat
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!match) return null;

  return (
    <div className="wood-card p-5 h-full relative">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <motion.div
          animate={selectedUser ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: selectedUser ? Infinity : 0, duration: 1.5 }}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-base font-serif text-foreground">Smart Match</h3>
          <p className="text-xs text-muted-foreground">
            {selectedUser ? "Geselecteerd profiel" : "Aanbevolen connectie"}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={match.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`glass-inner p-4 relative z-10 transition-all duration-300 ${selectedUser ? "border border-primary/40 shadow-[0_0_20px_hsl(35_85%_58%/0.2)]" : ""
            }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => window.location.href = `/profile/${match.id}`}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-sm font-medium text-primary-foreground hover:ring-2 hover:ring-primary transition-all cursor-pointer"
            >
              {match.avatar}
            </button>
            <div className="flex-1">
              <button
                onClick={() => window.location.href = `/profile/${match.id}`}
                className="font-medium text-foreground hover:text-primary transition-colors text-left"
              >
                {match.name}
              </button>
              <p className="text-xs text-muted-foreground">{match.role}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {match.skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary"
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {/* Status indicator */}
          {match.status === "open" && (
            <div className="flex items-center gap-2 mb-3 text-xs text-primary">
              <Coffee className="w-3 h-3" />
              <span>Open voor koffie</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInvite}
              disabled={isInvited}
              className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${isInvited
                  ? "bg-primary/30 text-primary cursor-default"
                  : "btn-gold"
                }`}
            >
              {isInvited ? (
                <>
                  <Check className="w-4 h-4" />
                  Uitnodiging verzonden
                </>
              ) : (
                <>
                  <Coffee className="w-3 h-3" />
                  Uitnodigen
                </>
              )}
            </motion.button>
            <button
              onClick={() => setSelectedUser(null)}
              className="p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
