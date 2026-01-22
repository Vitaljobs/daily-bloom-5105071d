import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  skills: string[];
  industry: string | null;
  status: "open" | "focused" | "invisible" | null;
  premium_tier: "free" | "premium" | "vip" | null;
  lab_visits: number | null;
  current_lab_id: string | null;
  checked_in_at: string | null;
  preferred_language: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }

      return data as UserProfile;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Subscribe to realtime updates for the user's profile
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Profile updated:", payload);
          queryClient.invalidateQueries({ queryKey: ["user-profile", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const isPremium = profile?.premium_tier === "premium" || profile?.premium_tier === "vip";
  const isLocalGuide = (profile?.lab_visits || 0) >= 30;

  return {
    profile,
    isLoading,
    error,
    refetch,
    isPremium,
    isLocalGuide,
    preferredLanguage: profile?.preferred_language || "nl",
    skills: profile?.skills || [],
    currentLabId: profile?.current_lab_id,
  };
};
