import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
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
import { CommonGroundProvider, useCommonGround } from "@/contexts/CommonGroundContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="hidden md:flex fixed top-4 right-16 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
        title="Uitloggen"
      >
        <LogOut className="h-5 w-5" />
      </Button>
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
            filter: showMatchReveal ? "blur(24px)" : "blur(8px)",
          }}
        />
      </AnimatePresence>
      <div className="fixed inset-0 bg-background/60" />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
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
      
      {/* Language Toggle */}
      <LanguageToggle />
      
      {/* Admin Link (for admin users) */}
      <AdminLink />
      
      {/* Mobile Bottom Navigation */}
      <BottomNav onLogout={handleLogout} />
    </div>
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
