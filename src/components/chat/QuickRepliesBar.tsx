import { motion } from "framer-motion";
import { MapPin, Coffee, Clock, MessageCircle } from "lucide-react";
import { QuickReply, defaultQuickReplies } from "@/types/chat";

interface QuickRepliesBarProps {
  onQuickReply: (reply: QuickReply) => void;
  currentLabName?: string;
}

export const QuickRepliesBar = ({
  onQuickReply,
  currentLabName,
}: QuickRepliesBarProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "location":
        return <MapPin className="w-3.5 h-3.5" />;
      case "coffee":
        return <Coffee className="w-3.5 h-3.5" />;
      case "timing":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <MessageCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
      {defaultQuickReplies.map((reply, index) => (
        <motion.button
          key={reply.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onQuickReply(reply)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/50 hover:bg-primary/20 border border-border/50 hover:border-primary/40 text-xs font-medium text-foreground whitespace-nowrap transition-all"
        >
          {getIcon(reply.type)}
          <span>{reply.label}</span>
        </motion.button>
      ))}
      
      {/* Location-specific quick reply */}
      {currentLabName && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            onQuickReply({
              id: "current-location",
              type: "location",
              label: currentLabName,
              icon: "📍",
            })
          }
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/20 border border-primary/40 text-xs font-medium text-primary whitespace-nowrap"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Ik zit in {currentLabName}</span>
        </motion.button>
      )}
    </div>
  );
};
