import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { UserProfile } from "@/types/common-ground";

interface ContactShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
}

export const ContactShareModal = ({ isOpen, onClose, partnerName }: ContactShareModalProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  // Mock current user contact info
  const myContact = {
    linkedin: "linkedin.com/in/mijn-profiel",
    email: "mijn.email@example.com",
  };

  const handleCopy = (type: "linkedin" | "email") => {
    navigator.clipboard.writeText(myContact[type]);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => {
      onClose();
      setShared(false);
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
              <h3 className="font-serif text-lg text-foreground">Contact Delen</h3>
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
                  Deel je contactgegevens met {partnerName} zodat jullie verbonden blijven na de koffie.
                </p>

                {/* Contact Options */}
                <div className="space-y-3">
                  {/* LinkedIn */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                    <div className="w-10 h-10 rounded-full bg-[#0A66C2]/20 flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">LinkedIn</p>
                      <p className="text-xs text-muted-foreground truncate">{myContact.linkedin}</p>
                    </div>
                    <button
                      onClick={() => handleCopy("linkedin")}
                      className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      {copied === "linkedin" ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">E-mail</p>
                      <p className="text-xs text-muted-foreground truncate">{myContact.email}</p>
                    </div>
                    <button
                      onClick={() => handleCopy("email")}
                      className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      {copied === "email" ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Verstuur naar {partnerName}
                </motion.button>
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
                <p className="text-foreground font-medium">Contact gedeeld!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {partnerName} heeft je gegevens ontvangen
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
