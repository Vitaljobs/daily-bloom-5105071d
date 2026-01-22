import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { UserProfile } from "@/types/common-ground";
import { ChatMessage, QuickReply } from "@/types/chat";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { QuickRepliesBar } from "./QuickRepliesBar";
import { IcebreakerBanner } from "./IcebreakerBanner";
import { SmartTopics } from "./SmartTopics";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { calculateMatchScore } from "@/lib/match-scoring";

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  chatPartner: UserProfile | null;
  currentLabName?: string;
}

// Mock current user for demo
const currentUserProfile = {
  id: "current-user",
  skills: ["React", "TypeScript", "AI/ML", "Node.js"],
  labId: "roastery",
};

export const ChatOverlay = ({
  isOpen,
  onClose,
  chatPartner,
  currentLabName,
}: ChatOverlayProps) => {
  const { endChatSession, currentLocation } = useCommonGround();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate match analysis
  const matchAnalysis = useMemo(() => {
    if (!chatPartner) return null;
    return calculateMatchScore(
      { ...currentUserProfile, labId: currentLocation },
      { skills: chatPartner.skills, labId: chatPartner.labId }
    );
  }, [chatPartner, currentLocation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened and reset state
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setShowIcebreaker(true);
      
      // Add initial system message
      if (messages.length === 0 && chatPartner) {
        setMessages([
          {
            id: "system-1",
            senderId: "system",
            content: `Je bent nu verbonden met ${chatPartner.name}. Spreek af voor een koffie! ☕`,
            timestamp: new Date(),
            type: "system",
          },
        ]);
      }
    }
  }, [isOpen, chatPartner]);

  // Simulate partner typing
  const simulatePartnerResponse = () => {
    setIsPartnerTyping(true);
    setTimeout(() => {
      setIsPartnerTyping(false);
      const responses = [
        "Klinkt goed! Tot zo!",
        "Perfect, ik zie je daar!",
        "Super! Ik neem een cappuccino 😊",
        "Top! Ik kom eraan!",
        "Interessant! Daar wil ik meer over horen.",
        "Goed idee, laten we dat bespreken!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          senderId: chatPartner?.id || "partner",
          content: randomResponse,
          timestamp: new Date(),
          type: "text",
        },
      ]);
    }, 2000 + Math.random() * 1500);
  };

  const sendMessage = (content: string, type: ChatMessage["type"] = "text", metadata?: ChatMessage["metadata"]) => {
    if (!content.trim() && type === "text") return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserProfile.id,
      content: content.trim(),
      timestamp: new Date(),
      type,
      metadata,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setShowIcebreaker(false); // Hide icebreaker after first message
    
    // Simulate partner response for demo
    if (Math.random() > 0.3) {
      simulatePartnerResponse();
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    switch (reply.type) {
      case "location":
        sendMessage(`Ik ben in ${currentLabName || "het café"}`, "location", {
          labName: currentLabName,
        });
        break;
      case "coffee":
        sendMessage("Ik haal koffie!", "coffee", { coffeeOffer: true });
        break;
      case "timing":
        const minutes = reply.id.includes("10") ? 10 : 5;
        sendMessage(`Ben er over ${minutes} minuten!`, "timing", { minutes });
        break;
      default:
        if (reply.message) {
          sendMessage(reply.message);
        }
    }
  };

  const handleTopicSelect = (topic: string) => {
    sendMessage(topic);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleEndMeeting = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `system-end-${Date.now()}`,
        senderId: "system",
        content: "Ontmoeting afgerond. Hopelijk was het een goede connectie! 🌟",
        timestamp: new Date(),
        type: "system",
      },
    ]);
    
    setTimeout(() => {
      endChatSession();
      onClose();
    }, 1500);
  };

  if (!chatPartner || !matchAnalysis) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-end justify-end p-4 md:p-6 pointer-events-none"
        >
          {/* Chat Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md h-[700px] max-h-[85vh] wood-card flex flex-col pointer-events-auto overflow-hidden"
          >
            {/* Header with Match Score */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 10px hsl(35 85% 58% / 0.3)",
                      "0 0 20px hsl(35 85% 58% / 0.5)",
                      "0 0 10px hsl(35 85% 58% / 0.3)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-sm font-medium text-primary-foreground"
                >
                  {chatPartner.avatar}
                </motion.div>
                <div>
                  <h3 className="font-serif text-foreground">{chatPartner.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              
              {/* Match Score Badge */}
              <div className="flex items-center gap-3">
                <MatchScoreBadge
                  score={matchAnalysis.score}
                  sharedSkillsCount={matchAnalysis.sharedSkills.length}
                  sameLocation={matchAnalysis.sameLocation}
                />
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Icebreaker Banner */}
            <IcebreakerBanner
              matchAnalysis={matchAnalysis}
              partnerName={chatPartner.name}
              onDismiss={() => setShowIcebreaker(false)}
              isVisible={showIcebreaker && messages.length <= 1}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUserProfile.id}
                  senderName={
                    message.senderId !== currentUserProfile.id && message.senderId !== "system"
                      ? chatPartner.name
                      : undefined
                  }
                />
              ))}
              
              <AnimatePresence>
                {isPartnerTyping && (
                  <TypingIndicator userName={chatPartner.name} />
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Topics */}
            {messages.length <= 2 && (
              <SmartTopics
                matchAnalysis={matchAnalysis}
                onSelectTopic={handleTopicSelect}
              />
            )}

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-border/30">
              <QuickRepliesBar
                onQuickReply={handleQuickReply}
                currentLabName={currentLabName}
              />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Typ een bericht..."
                  className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* End Meeting Button */}
            <div className="p-4 pt-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEndMeeting}
                className="w-full py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Ontmoeting afgerond
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
