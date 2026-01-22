import { motion } from "framer-motion";
import { MapPin, Coffee, Clock } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  senderName?: string;
}

export const ChatBubble = ({ message, isOwn, senderName }: ChatBubbleProps) => {
  const getMessageIcon = () => {
    switch (message.type) {
      case "location":
        return <MapPin className="w-4 h-4" />;
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      case "timing":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMessageContent = () => {
    switch (message.type) {
      case "location":
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Ik ben in {message.metadata?.labName}</span>
          </div>
        );
      case "coffee":
        return (
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Coffee className="w-4 h-4 text-primary" />
            </motion.div>
            <span>
              {message.metadata?.coffeeOffer
                ? "Ik haal koffie, wil je ook iets? ☕"
                : "Ik haal koffie!"}
            </span>
          </div>
        );
      case "timing":
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Ben er over {message.metadata?.minutes || 5} minuten!</span>
          </div>
        );
      case "system":
        return (
          <div className="text-center text-xs text-muted-foreground italic">
            {message.content}
          </div>
        );
      default:
        return <span>{message.content}</span>;
    }
  };

  if (message.type === "system") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center my-2"
      >
        <div className="px-3 py-1.5 rounded-full bg-muted/30 text-xs text-muted-foreground">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[80%] ${
          isOwn
            ? "bg-gradient-to-br from-primary/90 to-gold-dark/90 text-primary-foreground"
            : "bg-card/80 backdrop-blur-sm border border-border/50 text-foreground"
        } rounded-2xl px-4 py-3 ${
          isOwn ? "rounded-br-md" : "rounded-bl-md"
        }`}
      >
        {!isOwn && senderName && (
          <p className="text-xs text-primary mb-1 font-medium">{senderName}</p>
        )}
        <div className="text-sm">{getMessageContent()}</div>
        <p
          className={`text-[10px] mt-1 ${
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {format(message.timestamp, "HH:mm", { locale: nl })}
        </p>
      </div>
    </motion.div>
  );
};
