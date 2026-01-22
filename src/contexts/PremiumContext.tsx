import React, { createContext, useContext, useState, ReactNode } from "react";

interface PremiumContextType {
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
  showPaywall: boolean;
  paywallFeature: string | null;
  triggerPaywall: (feature: string) => void;
  closePaywall: () => void;
  showPremiumOverlay: boolean;
  openPremiumOverlay: () => void;
  closePremiumOverlay: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string | null>(null);
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);

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
        setIsPremium,
        showPaywall,
        paywallFeature,
        triggerPaywall,
        closePaywall,
        showPremiumOverlay,
        openPremiumOverlay,
        closePremiumOverlay,
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
