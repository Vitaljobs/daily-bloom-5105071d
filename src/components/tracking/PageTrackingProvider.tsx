import { ReactNode } from "react";
import { usePageTracking, usePresenceTracking } from "@/hooks/usePageTracking";

interface PageTrackingProviderProps {
  children: ReactNode;
}

const TrackingInitializer = ({ children }: PageTrackingProviderProps) => {
  usePageTracking();
  usePresenceTracking();
  return <>{children}</>;
};

export const PageTrackingProvider = ({ children }: PageTrackingProviderProps) => {
  return <TrackingInitializer>{children}</TrackingInitializer>;
};
