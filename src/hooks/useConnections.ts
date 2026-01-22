import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConnectionProfile {
  name: string;
  avatar_url: string | null;
  role: string | null;
  skills: string[];
  industry: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
}

export interface ConnectionLab {
  name: string;
  icon: string | null;
}

export interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  connected_at: string;
  lab_id: string | null;
  shared_skills: string[];
  private_note: string | null;
  linkedin_shared: boolean;
  email_shared: boolean;
  created_at: string;
  updated_at: string;
  connected_profile?: ConnectionProfile;
  lab?: ConnectionLab;
}

interface RawConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  connected_at: string;
  lab_id: string | null;
  shared_skills: string[];
  private_note: string | null;
  linkedin_shared: boolean;
  email_shared: boolean;
  created_at: string;
  updated_at: string;
}

interface RawProfile {
  user_id: string;
  name: string;
  avatar_url: string | null;
  role: string | null;
  skills: string[] | null;
  industry: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
}

interface RawLab {
  id: string;
  name: string;
  icon: string | null;
}

export const useConnections = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: connections, isLoading, error, refetch } = useQuery({
    queryKey: ["user-connections", user?.id],
    queryFn: async (): Promise<Connection[]> => {
      if (!user?.id) return [];

      // First get connections - use raw SQL-like query to bypass type issues
      const { data: connectionsData, error: connectionsError } = await supabase
        .from("connections" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("connected_at", { ascending: false });

      if (connectionsError) {
        console.error("Error fetching connections:", connectionsError);
        throw connectionsError;
      }

      const rawConnections = (connectionsData as unknown) as RawConnection[] | null;

      if (!rawConnections || rawConnections.length === 0) {
        return [];
      }

      // Get connected user profiles
      const connectedUserIds = rawConnections.map((c) => c.connected_user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, name, avatar_url, role, skills, industry")
        .in("user_id", connectedUserIds);

      if (profilesError) {
        console.error("Error fetching connected profiles:", profilesError);
      }

      // Cast to our expected shape (linkedin_url/portfolio_url may not exist in types yet)
      const rawProfiles = (profilesData as unknown) as RawProfile[] | null;

      // Get lab names
      const labIds = rawConnections.filter((c) => c.lab_id).map((c) => c.lab_id) as string[];
      let labsMap: Record<string, ConnectionLab> = {};
      
      if (labIds.length > 0) {
        const { data: labsData } = await supabase
          .from("labs")
          .select("id, name, icon")
          .in("id", labIds);
        
        const rawLabs = labsData as RawLab[] | null;
        
        if (rawLabs) {
          labsMap = rawLabs.reduce((acc, lab) => {
            acc[lab.id] = { name: lab.name, icon: lab.icon };
            return acc;
          }, {} as Record<string, ConnectionLab>);
        }
      }

      // Map profiles to connections
      const profilesMap = (rawProfiles || []).reduce((acc, profile) => {
        acc[profile.user_id] = {
          name: profile.name,
          avatar_url: profile.avatar_url,
          role: profile.role,
          skills: profile.skills || [],
          industry: profile.industry,
          linkedin_url: profile.linkedin_url || null,
          portfolio_url: profile.portfolio_url || null,
        };
        return acc;
      }, {} as Record<string, ConnectionProfile>);

      return rawConnections.map((conn): Connection => ({
        ...conn,
        connected_profile: profilesMap[conn.connected_user_id] || undefined,
        lab: conn.lab_id ? labsMap[conn.lab_id] : undefined,
      }));
    },
    enabled: !!user?.id,
  });

  const addConnectionMutation = useMutation({
    mutationFn: async ({
      connectedUserId,
      labId,
      sharedSkills,
    }: {
      connectedUserId: string;
      labId?: string;
      sharedSkills?: string[];
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("connections" as any)
        .insert({
          user_id: user.id,
          connected_user_id: connectedUserId,
          lab_id: labId || null,
          shared_skills: sharedSkills || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-connections", user?.id] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ connectionId, note }: { connectionId: string; note: string }) => {
      const { error } = await supabase
        .from("connections" as any)
        .update({ private_note: note })
        .eq("id", connectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-connections", user?.id] });
    },
  });

  const markLinkedInSharedMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from("connections" as any)
        .update({ linkedin_shared: true })
        .eq("id", connectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-connections", user?.id] });
    },
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from("connections" as any)
        .delete()
        .eq("id", connectionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-connections", user?.id] });
    },
  });

  return {
    connections: connections || [],
    isLoading,
    error,
    refetch,
    addConnection: addConnectionMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    markLinkedInShared: markLinkedInSharedMutation.mutateAsync,
    deleteConnection: deleteConnectionMutation.mutateAsync,
    isAddingConnection: addConnectionMutation.isPending,
  };
};

// Export helper function
export const exportConnectionsToCSV = (connections: Connection[]): string => {
  const headers = ["Naam", "Rol", "Industrie", "Skills", "LinkedIn", "Datum", "Locatie", "Notitie"];
  const rows = connections.map((conn) => [
    conn.connected_profile?.name || "Onbekend",
    conn.connected_profile?.role || "",
    conn.connected_profile?.industry || "",
    (conn.connected_profile?.skills || []).join("; "),
    conn.connected_profile?.linkedin_url || "",
    new Date(conn.connected_at).toLocaleDateString("nl-NL"),
    conn.lab?.name || "",
    conn.private_note || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return csvContent;
};

export const exportConnectionsToVCF = (connections: Connection[]): string => {
  return connections
    .map((conn) => {
      const profile = conn.connected_profile;
      if (!profile) return "";

      const nameParts = profile.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${profile.name}
TITLE:${profile.role || ""}
NOTE:${conn.private_note || ""} | Skills: ${(profile.skills || []).join(", ")} | Ontmoet op: ${new Date(conn.connected_at).toLocaleDateString("nl-NL")} in ${conn.lab?.name || "Common Ground"}
URL:${profile.linkedin_url || ""}
END:VCARD`;
    })
    .filter(Boolean)
    .join("\n\n");
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
