import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Generate or retrieve session ID for anonymous tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("pulse_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("pulse_session_id", sessionId);
  }
  return sessionId;
};

export const usePageTracking = () => {
  const location = useLocation();
  const { user } = useAuth();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if the path has changed
    if (lastTrackedPath.current === location.pathname) {
      return;
    }

    lastTrackedPath.current = location.pathname;

    const trackPageView = async () => {
      try {
        await supabase.from("page_views").insert({
          page_path: location.pathname,
          user_id: user?.id || null,
          session_id: getSessionId(),
        });
      } catch (error) {
        // Silently fail - page tracking shouldn't break the app
        console.debug("Page tracking failed:", error);
      }
    };

    trackPageView();
  }, [location.pathname, user?.id]);
};

// Hook to update last_seen timestamp for logged-in users
export const usePresenceTracking = () => {
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.id) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const updatePresence = async () => {
      try {
        await supabase
          .from("profiles")
          .update({ last_seen: new Date().toISOString() })
          .eq("user_id", user.id);
      } catch (error) {
        console.debug("Presence update failed:", error);
      }
    };

    // Update immediately
    updatePresence();

    // Update every 5 minutes
    intervalRef.current = setInterval(updatePresence, 5 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.id]);
};
