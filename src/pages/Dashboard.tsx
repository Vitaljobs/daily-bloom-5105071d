import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, MessageCircle } from "lucide-react";
import { LocationSelector } from "@/components/dashboard/LocationSelector";
import { MatchRevealOverlay } from "@/components/dashboard/MatchRevealOverlay";
import { WelcomeOverlay } from "@/components/dashboard/WelcomeOverlay";
import { ChatOverlay } from "@/components/chat/ChatOverlay";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { PremiumOverlay } from "@/components/premium/PremiumOverlay";
import { PaywallPopup } from "@/components/premium/PaywallPopup";
import { UpgradeButton } from "@/components/premium/UpgradeButton";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { AdminLink } from "@/components/admin/AdminLink";
import { BottomNav } from "@/components/navigation/BottomNav";
import { QRWelcomeAnimation } from "@/components/dashboard/QRWelcomeAnimation";
import { InterestMatchAlert } from "@/components/dashboard/InterestMatchAlert";
import { LabLayout } from "@/components/dashboard/LabLayout";
import { LabAtmosphereOverlay } from "@/components/dashboard/labs/LabAtmosphereOverlay";
import { CommonGroundProvider, useCommonGround } from "@/contexts/CommonGroundContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PulseIndicator } from "@/components/dashboard/PulseIndicator";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { useUnreadMessages } from "@/contexts/UnreadMessagesContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Settings } from "lucide-react";

// Staggered animation for grid items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const DashboardContent = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { unreadCount } = useUnreadMessages();
  const { isAdmin } = useIsAdmin();
  // const unreadCount = 1; // DEBUG: Force unread count for testing

  const {
    currentLocation,
    setCurrentLocation,
    isChangingLocation,
    showMatchReveal,
    matchedUser,
    closeMatchReveal,
    currentLab,
    usersPerLab,
    showWelcome,
    closeWelcome,
    openUsers,
    isChatOpen,
    chatPartner,
    closeChat,
    showQRWelcome,
    closeQRWelcome,
  } = useCommonGround();

  // Check if first visit for onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("cg-onboarding-complete");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Track user session
  useSessionTracking({
    pagePath: '/dashboard',
    labId: currentLab?.id,
    enabled: true
  });

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem("cg-onboarding-complete", "true");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Je bent uitgelogd");
    navigate("/auth");
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden pb-24 md:pb-0 lab-${currentLocation}`}>
      {/* Logout Button - Desktop only */}
      {/* Top Right Desktop Navigation */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle variant="inline" />
        </div>

        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-full relative shadow-md backdrop-blur-sm"
            title="Admin Dashboard"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/messages")}
          className="bg-blue-500 hover:bg-blue-600 text-white border border-blue-400/50 rounded-full relative shadow-md"
          title="Berichten"
        >
          <MessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="hidden md:flex bg-card/80 backdrop-blur-sm hover:bg-card/90 border border-border/50 rounded-full"
          title="Uitloggen"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Admin Button - Floating Top Left for visibility or Top Right grouping? 
          User asked for "button at top". Let's put it in the Top Right group for consistency. 
      */}
      {/* We need to use the hook inside the component first */}


      {/* Dynamic Lab Background with cross-fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLocation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: currentLab ? `url(${currentLab.background})` : undefined,
            filter: showMatchReveal ? "blur(24px)" : "blur(12px)",
          }}
        />
      </AnimatePresence>

      {/* Lab-specific Atmosphere Overlay with gradients & particles */}
      <AnimatePresence mode="wait">
        <LabAtmosphereOverlay labId={currentLocation} />
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Pulse Indicator */}
        <PulseIndicator />

        {/* Location Selector */}
        <LocationSelector
          currentLocation={currentLocation}
          onLocationChange={setCurrentLocation}
          usersPerLab={usersPerLab}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentLocation}
            variants={containerVariants}
            initial="hidden"
            animate={isChangingLocation ? "exit" : "visible"}
            exit="exit"
            className="w-full max-w-6xl"
          >
            {/* Dynamic Lab Layout */}
            <LabLayout labId={currentLocation} itemVariants={itemVariants} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Welcome Overlay */}
      <WelcomeOverlay
        isVisible={showWelcome}
        lab={currentLab || null}
        openUsersCount={openUsers.length}
        onClose={closeWelcome}
      />

      {/* Match Reveal Overlay */}
      <MatchRevealOverlay
        isVisible={showMatchReveal}
        currentUser={{ name: "Jij", avatar: "JIJ", role: "Developer" }}
        matchedUser={matchedUser}
        onClose={closeMatchReveal}
      />

      {/* Chat Overlay */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={closeChat}
        chatPartner={chatPartner}
        currentLabName={currentLab?.name}
      />

      {/* QR Check-in Welcome Animation */}
      <QRWelcomeAnimation
        isVisible={showQRWelcome}
        labName={currentLab?.name || ""}
        onComplete={closeQRWelcome}
      />

      {/* Interest Match Alert */}
      <InterestMatchAlert />

      {/* Onboarding Flow */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
      />

      {/* Premium Components */}
      <UpgradeButton />
      <PremiumOverlay />
      <PaywallPopup />

      {/* Language Toggle moved to top right group */}

      {/* Admin Link (for admin users) */}
      {/* Moved to Header */}

      {/* Dashboard Footer */}
      <footer className="py-8 text-center text-xs text-muted-foreground/50 pb-24 md:pb-8">
        <div className="flex justify-center gap-4 mb-2">
          <button onClick={() => navigate("/about")} className="hover:text-primary transition-colors">Over Ons</button>
          <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">Contact</button>
        </div>
        <p>© 2025 CommonGround</p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav onLogout={handleLogout} />
    </div >
  );
};

const Dashboard = () => {
  return (
    <LanguageProvider>
      <PremiumProvider>
        <CommonGroundProvider>
          <DashboardContent />
        </CommonGroundProvider>
      </PremiumProvider>
    </LanguageProvider>
  );
};

export default Dashboard;
