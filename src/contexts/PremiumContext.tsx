import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface PremiumContextType {
  isPremium: boolean;
  premiumTier: "free" | "premium" | "vip";
  showPaywall: boolean;
  paywallFeature: string | null;
  triggerPaywall: (feature: string) => void;
  closePaywall: () => void;
  showPremiumOverlay: boolean;
  openPremiumOverlay: () => void;
  closePremiumOverlay: () => void;
  isLoading: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const { profile, isLoading } = useUserProfile();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string | null>(null);
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);

  // Derive premium status from database
  const premiumTier = profile?.premium_tier || "free";
  const isPremium = premiumTier === "premium" || premiumTier === "vip";

  const triggerPaywall = (feature: string) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };

  const closePaywall = () => {
    setShowPaywall(false);
    setPaywallFeature(null);
  };

  const openPremiumOverlay = () => {
    setShowPremiumOverlay(true);
  };

  const closePremiumOverlay = () => {
    setShowPremiumOverlay(false);
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        premiumTier,
        showPaywall,
        paywallFeature,
        triggerPaywall,
        closePaywall,
        showPremiumOverlay,
        openPremiumOverlay,
        closePremiumOverlay,
        isLoading,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
