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
    <div className={`min-h-screen w-full relative overflow-x-hidden pb-24 md:pb-0 lab-${currentLocation}`}>
      {/* ... header ... */}

      {/* ... backgrounds ... */}

      {/* ... main ... */}

      {/* Dashboard Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground pb-24 md:pb-8 relative z-10 bg-gradient-to-t from-background to-transparent">
        <div className="flex justify-center gap-6 mb-2">
          <button onClick={() => navigate("/about")} className="hover:text-primary transition-colors font-medium">Over Ons</button>
          <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors font-medium">Contact</button>
        </div>
        <p className="text-xs opacity-50">© 2025 CommonGround</p>
      </footer>

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
