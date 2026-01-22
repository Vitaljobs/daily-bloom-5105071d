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
