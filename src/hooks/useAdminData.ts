import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { labs as localLabs } from "@/data/labs";

export interface ProfileWithStats {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  industry: string | null;
  skills: string[] | null;
  status: string | null;
  premium_tier: string | null;
  lab_visits: number | null;
  current_lab_id: string | null;
  checked_in_at: string | null;
  last_seen: string | null;
  created_at: string;
}

export interface LabWithStats {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  atmosphere: string | null;
  checked_in_count: number;
  top_skill: string | null;
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProfileWithStats[];
    },
  });
};

export const useLabStats = () => {
  return useQuery({
    queryKey: ["admin-lab-stats"],
    queryFn: async () => {
      // Get all checked-in profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("current_lab_id, skills, status")
        .not("current_lab_id", "is", null)
        .neq("status", "invisible");

      if (profilesError) throw profilesError;

      // Use local labs data and calculate stats per lab
      const labStats: LabWithStats[] = localLabs.map((lab) => {
        const usersInLab = profiles?.filter((p) => p.current_lab_id === lab.id) || [];
        
        // Calculate top skill in this lab
        const skillCounts: Record<string, number> = {};
        usersInLab.forEach((user) => {
          (user.skills || []).forEach((skill: string) => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
          });
        });

        const topSkillEntry = Object.entries(skillCounts)
          .sort((a, b) => b[1] - a[1])[0];

        return {
          id: lab.id,
          name: lab.name,
          tagline: lab.tagline,
          description: lab.description,
          icon: lab.icon,
          atmosphere: lab.atmosphere,
          checked_in_count: usersInLab.length,
          top_skill: topSkillEntry ? topSkillEntry[0] : null,
        };
      });

      return labStats;
    },
  });
};

export const usePremiumStats = () => {
  return useQuery({
    queryKey: ["admin-premium-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("premium_tier");

      if (error) throw error;

      const premiumCount = data.filter((p) => p.premium_tier === "premium").length;
      const vipCount = data.filter((p) => p.premium_tier === "vip").length;
      const freeCount = data.filter((p) => p.premium_tier === "free" || !p.premium_tier).length;

      return {
        premium: premiumCount,
        vip: vipCount,
        free: freeCount,
        total: data.length,
        paidTotal: premiumCount + vipCount,
      };
    },
  });
};

export const useTopSkills = () => {
  return useQuery({
    queryKey: ["admin-top-skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("skills");

      if (error) throw error;

      const skillCounts: Record<string, number> = {};
      data.forEach((profile) => {
        (profile.skills || []).forEach((skill: string) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      });

      const sortedSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      return sortedSkills;
    },
  });
};

export const useEngagementStats = () => {
  return useQuery({
    queryKey: ["admin-engagement-stats"],
    queryFn: async () => {
      // Get profiles checked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: checkedInToday, error } = await supabase
        .from("profiles")
        .select("id, checked_in_at")
        .not("current_lab_id", "is", null)
        .gte("checked_in_at", today.toISOString());

      if (error) throw error;

      return {
        activeToday: checkedInToday?.length || 0,
      };
    },
  });
};

// New hooks for extended admin functionality

export const usePageViewStats = () => {
  return useQuery({
    queryKey: ["admin-page-views"],
    queryFn: async () => {
      // Get total page views
      const { count: totalViews, error: countError } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      if (countError) throw countError;

      // Get today's views
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: todayViews, error: todayError } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      if (todayError) throw todayError;

      // Get views this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: weekViews, error: weekError } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString());

      if (weekError) throw weekError;

      return {
        total: totalViews || 0,
        today: todayViews || 0,
        thisWeek: weekViews || 0,
      };
    },
  });
};

export const useOnlineUsers = () => {
  return useQuery({
    queryKey: ["admin-online-users"],
    queryFn: async () => {
      // Get users who were active in the last 15 minutes OR are checked into a lab
      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, current_lab_id, last_seen, status, industry")
        .or(`last_seen.gte.${fifteenMinutesAgo.toISOString()},current_lab_id.not.is.null`)
        .neq("status", "invisible")
        .order("last_seen", { ascending: false });

      if (error) throw error;

      return data as Array<{
        id: string;
        name: string;
        avatar_url: string | null;
        current_lab_id: string | null;
        last_seen: string | null;
        status: string | null;
        industry: string | null;
      }>;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useLabAnalytics = () => {
  return useQuery({
    queryKey: ["admin-lab-analytics"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("current_lab_id, status, premium_tier")
        .not("current_lab_id", "is", null)
        .neq("status", "invisible");

      if (error) throw error;

      // Calculate stats per lab
      const labAnalytics = localLabs.map((lab) => {
        const usersInLab = profiles?.filter((p) => p.current_lab_id === lab.id) || [];
        const premiumUsers = usersInLab.filter((p) => p.premium_tier === "premium" || p.premium_tier === "vip");
        
        return {
          id: lab.id,
          name: lab.name,
          icon: lab.icon,
          activeUsers: usersInLab.length,
          premiumUsers: premiumUsers.length,
          occupancyPercent: Math.min(100, Math.round((usersInLab.length / 20) * 100)), // Assume max 20 users per lab
        };
      });

      // Sort by active users descending
      return labAnalytics.sort((a, b) => b.activeUsers - a.activeUsers);
    },
    refetchInterval: 30000,
  });
};
