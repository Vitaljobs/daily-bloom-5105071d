import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, Lightbulb, Share2, Lock, Loader2 } from "lucide-react";
import { UserProfile } from "@/types/common-ground";
import { ChatMessage, QuickReply } from "@/types/chat";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { QuickRepliesBar } from "./QuickRepliesBar";
import { IcebreakerBanner } from "./IcebreakerBanner";
import { SmartTopics } from "./SmartTopics";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { ContactShareModal } from "./ContactShareModal";
import { MeetingCompleteModal } from "./MeetingCompleteModal";
import { useCommonGround } from "@/contexts/CommonGroundContext";
import { usePremium } from "@/contexts/PremiumContext";
import { calculateMatchScore, MatchAnalysis } from "@/lib/match-scoring";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAIIcebreaker } from "@/hooks/useAIIcebreaker";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  chatPartner: UserProfile | null;
  currentLabName?: string;
}

export const ChatOverlay = ({
  isOpen,
  onClose,
  chatPartner,
  currentLabName,
}: ChatOverlayProps) => {
  const { endChatSession, currentLocation } = useCommonGround();
  const { isPremium, triggerPaywall } = usePremium();
  const { toast } = useToast();
  const { profile: userProfile, skills: userSkills, currentLabId } = useUserProfile();
  const { generateIcebreaker, isLoading: isLoadingIcebreaker } = useAIIcebreaker();
  const { language } = useLanguage();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(true);
  const [showTopicsPopup, setShowTopicsPopup] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMeetingComplete, setShowMeetingComplete] = useState(false);
  const [aiMatchAnalysis, setAiMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate match analysis using real user skills from database
  const matchAnalysis = useMemo(() => {
    if (!chatPartner) return null;
    return calculateMatchScore(
      { skills: userSkills, labId: currentLabId || currentLocation },
      { skills: chatPartner.skills, labId: chatPartner.labId }
    );
  }, [chatPartner, userSkills, currentLabId, currentLocation]);

  // Fetch AI-generated icebreaker when chat opens (premium only)
  useEffect(() => {
    if (isOpen && chatPartner && isPremium && userSkills.length > 0) {
      generateIcebreaker(
        userSkills,
        chatPartner.skills,
        chatPartner.name,
        language as "nl" | "en"
      ).then((result) => {
        if (result) {
          // Merge AI results with calculated match analysis
          setAiMatchAnalysis({
            ...matchAnalysis!,
            icebreaker: result.icebreaker,
            topics: result.topics,
            sharedSkills: result.sharedSkills.length > 0 ? result.sharedSkills : matchAnalysis?.sharedSkills || [],
          });
        }
      });
    }
  }, [isOpen, chatPartner, isPremium, userSkills, language]);

  // Use AI-enhanced analysis if available, otherwise fall back to local calculation
  const effectiveMatchAnalysis = aiMatchAnalysis || matchAnalysis;

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
      senderId: userProfile?.id || "current-user",
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
    setShowMeetingComplete(true);
  };

  const handleAddConnection = () => {
    toast({
      title: "Connectie toegevoegd! 🤝",
      description: `${chatPartner?.name} is toegevoegd aan je Eerdere Connecties.`,
    });
    setShowMeetingComplete(false);
    finalizeMeeting();
  };

  const handleSkipConnection = () => {
    setShowMeetingComplete(false);
    finalizeMeeting();
  };

  const finalizeMeeting = () => {
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
    }, 1000);
  };

  if (!chatPartner || !effectiveMatchAnalysis) return null;

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
              
              {/* Match Score Badge & Contact Share */}
              <div className="flex items-center gap-2">
                <MatchScoreBadge
                  score={effectiveMatchAnalysis.score}
                  sharedSkillsCount={effectiveMatchAnalysis.sharedSkills.length}
                  sameLocation={effectiveMatchAnalysis.sameLocation}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isPremium) {
                      setShowContactModal(true);
                    } else {
                      triggerPaywall("contact-share");
                    }
                  }}
                  className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                  title="Contact delen"
                >
                  <Share2 className="w-4 h-4 text-primary" />
                  {!isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                    </div>
                  )}
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Icebreaker Banner - Premium Feature */}
            {isPremium ? (
              <IcebreakerBanner
                matchAnalysis={effectiveMatchAnalysis}
                partnerName={chatPartner.name}
                onDismiss={() => setShowIcebreaker(false)}
                isVisible={showIcebreaker && messages.length <= 1 && !isLoadingIcebreaker}
              />
            ) : (
              showIcebreaker && messages.length <= 1 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                >
                  <div 
                    className="relative mx-4 mt-3 p-4 rounded-xl bg-muted/30 border border-border/50 cursor-pointer group"
                    onClick={() => triggerPaywall("ai-icebreaker")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">AI Ijsbrekers</p>
                        <p className="text-xs text-muted-foreground">Ontgrendel slimme gespreksstarters</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">Premium</span>
                    </div>
                    {/* Blur overlay hint */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </div>
                </motion.div>
              )
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === (userProfile?.id || "current-user")}
                  senderName={
                    message.senderId !== (userProfile?.id || "current-user") && message.senderId !== "system"
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
                matchAnalysis={effectiveMatchAnalysis}
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

            {/* Input with Lightbulb */}
            <div className="p-4 border-t border-border/30">
              <div className="flex gap-2">
                {/* Smart Topics Lightbulb Button - Premium Feature */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isPremium) {
                      setShowTopicsPopup(!showTopicsPopup);
                    } else {
                      triggerPaywall("smart-topics");
                    }
                  }}
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    showTopicsPopup && isPremium
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted/50 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                  }`}
                  title="Topic suggesties"
                >
                  <Lightbulb className="w-4 h-4" />
                  {!isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                    </div>
                  )}
                </motion.button>
                
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
              
              {/* Topics Popup */}
              <AnimatePresence>
                {showTopicsPopup && effectiveMatchAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    className="mt-3 p-3 rounded-xl bg-muted/30 border border-primary/30 overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground mb-2">💡 AI IJsbrekers:</p>
                    <div className="space-y-2">
                      {effectiveMatchAnalysis.topics.map((topic, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            handleTopicSelect(topic);
                            setShowTopicsPopup(false);
                          }}
                          className="w-full text-left p-2.5 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/30 hover:border-primary/30 text-sm text-foreground transition-all"
                        >
                          {topic}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          
          {/* Contact Share Modal */}
          <ContactShareModal
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)}
            partnerName={chatPartner.name}
          />
          
          {/* Meeting Complete Modal */}
          <MeetingCompleteModal
            isOpen={showMeetingComplete}
            onClose={() => setShowMeetingComplete(false)}
            onAddConnection={handleAddConnection}
            onSkip={handleSkipConnection}
            partner={chatPartner}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
