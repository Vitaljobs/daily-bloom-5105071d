import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, 
  Check, 
  CreditCard, 
  Shield, 
  Zap, 
  Users, 
  MessageSquare,
  Filter,
  FileText,
  ArrowLeft,
  Lock,
  Sparkles,
  Languages
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { labs, getLabById, Lab } from "@/data/labs";

const premiumFeatures = [
  {
    icon: Users,
    title: "Onbeperkt LinkedIn Delen",
    description: "Deel je professionele profiel met iedereen in je netwerk",
  },
  {
    icon: FileText,
    title: "Privé Notities",
    description: "Bewaar persoonlijke notities bij elke connectie",
  },
  {
    icon: Filter,
    title: "Smart Industrie Filters",
    description: "Filter professionals op branche en expertise",
  },
  {
    icon: MessageSquare,
    title: "AI Icebreakers",
    description: "Slimme gespreksopeners gebaseerd op gedeelde interesses",
  },
  {
    icon: Languages,
    title: "Realtime Vertalingen",
    description: "Automatische chatvertalingen in 50+ talen",
  },
  {
    icon: Shield,
    title: "Ghost Mode",
    description: "Bekijk profielen zonder gezien te worden",
  },
];

// Contextual headlines per lab
const labHeadlines: Record<string, { headline: string; subtext: string }> = {
  roastery: {
    headline: "Versterk je netwerk met Premium",
    subtext: "Smeed sterke connecties in de hitte van The Roastery",
  },
  library: {
    headline: "Focus op kwaliteit met Premium",
    subtext: "Maak diepe, betekenisvolle connecties in stilte",
  },
  espresso: {
    headline: "Versnel je groei met Premium",
    subtext: "Meer connecties, sneller resultaat aan de bar",
  },
  rooftop: {
    headline: "Bereik een hoger niveau met Premium",
    subtext: "Verhef je netwerk naar nieuwe hoogten op het terras",
  },
  greenhouse: {
    headline: "Upgrade voor een frisse start",
    subtext: "Laat je professionele netwerk groeien en bloeien",
  },
};

const Upgrade = () => {
  const [searchParams] = useSearchParams();
  const labId = searchParams.get("lab") || "roastery";
  const [currentLab, setCurrentLab] = useState<Lab>(getLabById(labId) || labs[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const lab = getLabById(labId);
    if (lab) {
      setCurrentLab(lab);
      // Apply lab class to body for theming
      document.body.className = `lab-${lab.id}`;
    }
    return () => {
      document.body.className = "";
    };
  }, [labId]);

  const headlines = labHeadlines[currentLab.id] || labHeadlines.roastery;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("🎉 Welkom bij Pulse Premium! (Demo)", {
      description: "Dit is een preview - betaling wordt later geactiveerd.",
    });
    
    setIsProcessing(false);
  };

  const handlePayPal = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("🎉 PayPal (Demo)", {
      description: "PayPal-integratie wordt binnenkort geactiveerd.",
    });
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLab.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentLab.background})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">Terug</span>
            </Link>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Crown className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="font-serif text-foreground text-sm sm:text-base">Pulse Premium</span>
            </div>
          </div>
        </header>

        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
          <div className="container mx-auto px-4">
            {/* Hero with Lab Context */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-12"
            >
              {/* Lab indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 mb-6"
              >
                <span className="text-lg">{currentLab.icon}</span>
                <span className="text-sm text-muted-foreground">{currentLab.name}</span>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-accent/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_hsl(var(--primary)/0.3)]"
              >
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </motion.div>

              <motion.h1 
                key={headlines.headline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-3 sm:mb-4 px-2"
              >
                <span className="text-gradient-gold">{headlines.headline}</span>
              </motion.h1>

              <motion.p 
                key={headlines.subtext}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-4"
              >
                {headlines.subtext}
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 sm:space-y-4"
              >
                <h2 className="text-xl sm:text-2xl font-serif mb-4 sm:mb-6 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Premium Voordelen
                </h2>
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/70 transition-all duration-300"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm sm:text-base">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Payment Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="wood-card p-5 sm:p-6 md:p-8 rounded-2xl backdrop-blur-md">
                  {/* Pricing */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs sm:text-sm mb-3 sm:mb-4 border border-primary/20">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      Meest Populair
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl font-serif text-foreground">€9,99</span>
                      <span className="text-muted-foreground text-sm sm:text-base">/maand</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      Of €89,99/jaar (2 maanden gratis)
                    </p>
                  </div>

                  {/* Payment Form - Placeholder */}
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">Creditcard</span>
                      <div className="ml-auto flex gap-1.5 sm:gap-2">
                        <div className="w-7 h-4 sm:w-8 sm:h-5 rounded bg-[#1434CB] flex items-center justify-center">
                          <span className="text-white text-[7px] sm:text-[8px] font-bold">VISA</span>
                        </div>
                        <div className="w-7 h-4 sm:w-8 sm:h-5 rounded bg-[#EB001B] flex items-center justify-center">
                          <div className="flex">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#EB001B] opacity-80" />
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#F79E1B] -ml-0.5 sm:-ml-1 opacity-80" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground text-sm">Naam op kaart</Label>
                      <Input
                        id="name"
                        placeholder="J. de Vries"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-foreground text-sm">Kaartnummer</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="bg-background/50 border-border/50 pr-10 focus:border-primary/50"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-foreground text-sm">Vervaldatum</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/JJ"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          className="bg-background/50 border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="text-foreground text-sm">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                          className="bg-background/50 border-border/50 focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-5 sm:py-6 text-base sm:text-lg font-medium mt-4 sm:mt-6 bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/0.35)]"
                    >
                      {isProcessing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                      ) : (
                        <>
                          <Crown className="w-5 h-5 mr-2" />
                          Word Premium
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-5 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground">of</span>
                    </div>
                  </div>

                  {/* PayPal Placeholder */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePayPal}
                    disabled={isProcessing}
                    className="w-full py-5 sm:py-6 border-border/50 hover:border-primary/40 hover:bg-primary/5 bg-card/50"
                  >
                    <svg className="w-16 sm:w-20 h-4 sm:h-5" viewBox="0 0 101 32" fill="none">
                      <path d="M12.237 4.178h-7.49c-.512 0-.948.373-1.028.879L1.02 22.657c-.06.377.232.717.614.717h3.58c.512 0 .948-.373 1.028-.879l.727-4.61c.08-.506.516-.879 1.028-.879h2.37c4.934 0 7.78-2.387 8.524-7.12.335-2.07.014-3.699-.956-4.84-1.068-1.254-2.96-1.868-5.698-1.868zm.864 7.013c-.41 2.69-2.463 2.69-4.45 2.69h-1.13l.793-5.022c.047-.302.306-.527.612-.527h.518c1.352 0 2.63 0 3.287.77.393.46.512 1.143.37 2.089z" fill="#253B80"/>
                      <path d="M35.882 11.104h-3.594c-.306 0-.565.225-.612.527l-.158 1.003-.252-.364c-.779-1.13-2.514-1.508-4.246-1.508-3.973 0-7.367 3.01-8.029 7.232-.344 2.104.144 4.116 1.34 5.52 1.098 1.29 2.668 1.828 4.536 1.828 3.208 0 4.988-2.062 4.988-2.062l-.16 1.001c-.06.377.231.716.614.716h3.235c.512 0 .948-.372 1.028-.878l1.94-12.299c.06-.376-.232-.716-.614-.716zm-5.02 6.997c-.347 2.052-1.974 3.43-4.051 3.43-1.043 0-1.878-.335-2.415-.97-.533-.63-.733-1.527-.563-2.524.324-2.035 1.977-3.456 4.021-3.456 1.02 0 1.85.338 2.399.978.55.645.767 1.548.609 2.542z" fill="#253B80"/>
                      <path d="M55.32 11.104h-3.61c-.344 0-.667.168-.864.45l-4.987 7.344-2.114-7.06c-.131-.44-.538-.734-.998-.734h-3.546c-.427 0-.727.42-.585.82l3.985 11.693-3.748 5.29c-.292.413.01.98.505.98h3.606c.342 0 .662-.165.861-.443l12.022-17.36c.288-.41-.015-.98-.527-.98z" fill="#253B80"/>
                      <path d="M67.233 4.178h-7.49c-.512 0-.948.373-1.028.879l-2.699 17.6c-.06.377.232.717.614.717h3.83c.358 0 .664-.261.72-.614l.766-4.875c.08-.506.516-.879 1.028-.879h2.37c4.934 0 7.78-2.387 8.524-7.12.335-2.07.014-3.699-.956-4.84-1.068-1.254-2.96-1.868-5.698-1.868zm.864 7.013c-.41 2.69-2.463 2.69-4.45 2.69h-1.13l.793-5.022c.047-.302.306-.527.612-.527h.518c1.352 0 2.63 0 3.287.77.393.46.512 1.143.37 2.089z" fill="#179BD7"/>
                      <path d="M90.877 11.104h-3.594c-.306 0-.565.225-.612.527l-.158 1.003-.252-.364c-.779-1.13-2.514-1.508-4.246-1.508-3.973 0-7.367 3.01-8.029 7.232-.344 2.104.144 4.116 1.34 5.52 1.098 1.29 2.668 1.828 4.536 1.828 3.208 0 4.988-2.062 4.988-2.062l-.16 1.001c-.06.377.231.716.614.716h3.235c.512 0 .948-.372 1.028-.878l1.94-12.299c.06-.376-.232-.716-.614-.716zm-5.02 6.997c-.347 2.052-1.974 3.43-4.051 3.43-1.043 0-1.878-.335-2.415-.97-.533-.63-.733-1.527-.563-2.524.324-2.035 1.977-3.456 4.021-3.456 1.02 0 1.85.338 2.399.978.55.645.767 1.548.609 2.542z" fill="#179BD7"/>
                      <path d="M93.844 4.67l-2.74 17.432c-.06.377.232.716.614.716h3.092c.512 0 .948-.372 1.028-.878l2.702-17.6c.06-.377-.232-.716-.614-.716h-3.468c-.306 0-.566.224-.614.526v.52z" fill="#179BD7"/>
                    </svg>
                  </Button>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-[10px] sm:text-xs text-muted-foreground">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>256-bit SSL beveiliging • Placeholder UI</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upgrade;
