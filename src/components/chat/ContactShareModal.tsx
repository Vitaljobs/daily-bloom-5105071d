import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Mail, Copy, Check, Send, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ContactShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  onLinkedInShared?: (linkedinUrl: string) => void;
}

export const ContactShareModal = ({ 
  isOpen, 
  onClose, 
  partnerName,
  onLinkedInShared 
}: ContactShareModalProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [shareType, setShareType] = useState<"linkedin" | "email" | null>(null);
  const { profile } = useUserProfile();
  const { language } = useLanguage();

  // Get contact info from user profile
  const myContact = {
    linkedin: profile?.linkedin_url || "",
    email: "", // Email comes from auth, we can add it later
  };

  const hasLinkedIn = !!myContact.linkedin;

  const handleCopy = (type: "linkedin" | "email", value: string) => {
    if (!value) {
      toast.error(
        language === "nl" 
          ? "Voeg eerst je LinkedIn toe in je profiel" 
          : "Add your LinkedIn to your profile first"
      );
      return;
    }
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShareLinkedIn = () => {
    if (!myContact.linkedin) {
      toast.error(
        language === "nl" 
          ? "Voeg eerst je LinkedIn URL toe in je profiel" 
          : "Add your LinkedIn URL to your profile first"
      );
      return;
    }
    
    setShareType("linkedin");
    setShared(true);
    
    // Callback to parent to add to chat as interactive card
    if (onLinkedInShared) {
      onLinkedInShared(myContact.linkedin);
    }
    
    setTimeout(() => {
      onClose();
      setShared(false);
      setShareType(null);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="wood-card w-full max-w-sm p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-foreground">
                {language === "nl" ? "Contact Delen" : "Share Contact"}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {!shared ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {language === "nl" 
                    ? `Deel je contactgegevens met ${partnerName} zodat jullie verbonden blijven na de koffie.`
                    : `Share your contact details with ${partnerName} to stay connected after coffee.`}
                </p>

                {/* Contact Options */}
                <div className="space-y-3">
                  {/* LinkedIn */}
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                    hasLinkedIn 
                      ? "bg-muted/30 border-border/30" 
                      : "bg-muted/10 border-dashed border-border/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      hasLinkedIn ? "bg-[#0A66C2]/20" : "bg-muted/30"
                    }`}>
                      <Linkedin className={`w-5 h-5 ${hasLinkedIn ? "text-[#0A66C2]" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">LinkedIn</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {hasLinkedIn 
                          ? myContact.linkedin 
                          : (language === "nl" ? "Nog niet toegevoegd" : "Not added yet")}
                      </p>
                    </div>
                    {hasLinkedIn && (
                      <button
                        onClick={() => handleCopy("linkedin", myContact.linkedin)}
                        className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        {copied === "linkedin" ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* No LinkedIn Warning */}
                  {!hasLinkedIn && (
                    <p className="text-xs text-amber-500 flex items-center gap-1.5 px-3">
                      <ExternalLink className="w-3 h-3" />
                      {language === "nl" 
                        ? "Voeg je LinkedIn URL toe in je profielinstellingen"
                        : "Add your LinkedIn URL in profile settings"}
                    </p>
                  )}
                </div>

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: hasLinkedIn ? 1.02 : 1 }}
                  whileTap={{ scale: hasLinkedIn ? 0.98 : 1 }}
                  onClick={handleShareLinkedIn}
                  disabled={!hasLinkedIn}
                  className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    hasLinkedIn
                      ? "bg-gradient-to-r from-[#0A66C2] to-[#0077B5] text-white"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <Linkedin className="w-4 h-4" />
                  {language === "nl" 
                    ? `LinkedIn delen met ${partnerName}` 
                    : `Share LinkedIn with ${partnerName}`}
                </motion.button>

                <p className="text-center text-xs text-muted-foreground">
                  {language === "nl" 
                    ? "Je LinkedIn wordt als interactieve kaart in de chat getoond"
                    : "Your LinkedIn will be shown as an interactive card in chat"}
                </p>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-8 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: 2, duration: 0.3 }}
                  className="text-4xl mb-3"
                >
                  🤝
                </motion.div>
                <p className="text-foreground font-medium">
                  {language === "nl" ? "LinkedIn gedeeld!" : "LinkedIn shared!"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {partnerName} {language === "nl" ? "kan je nu vinden op LinkedIn" : "can now find you on LinkedIn"}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
