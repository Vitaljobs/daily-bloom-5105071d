import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Crown, MapPin, Search, Loader2 } from "lucide-react";
import { useProfiles, ProfileWithStats } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const UserManagement = () => {
  const { data: profiles, isLoading, error } = useProfiles();
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const filteredProfiles = profiles?.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePremiumToggle = async (profile: ProfileWithStats) => {
    setUpdatingUser(profile.id);
    
    const newTier = profile.premium_tier === "premium" || profile.premium_tier === "vip" 
      ? "free" 
      : "premium";

    const { error } = await supabase
      .from("profiles")
      .update({ premium_tier: newTier })
      .eq("id", profile.id);

    if (error) {
      toast.error("Kon premium status niet updaten");
      console.error(error);
    } else {
      toast.success(`${profile.name} is nu ${newTier === "premium" ? "Premium" : "Free"}`);
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-premium-stats"] });
    }

    setUpdatingUser(null);
  };

  const handleLocalGuideToggle = async (profile: ProfileWithStats) => {
    setUpdatingUser(profile.id);
    
    // Local Guide is indicated by 30+ lab visits
    const newVisits = (profile.lab_visits || 0) >= 30 ? 0 : 30;

    const { error } = await supabase
      .from("profiles")
      .update({ lab_visits: newVisits })
      .eq("id", profile.id);

    if (error) {
      toast.error("Kon Local Guide status niet updaten");
      console.error(error);
    } else {
      toast.success(`${profile.name} is nu ${newVisits >= 30 ? "Local Guide" : "geen Local Guide meer"}`);
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    }

    setUpdatingUser(null);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card border border-admin-border p-8 text-center text-destructive">
        Fout bij laden van gebruikers
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
              <Users className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-foreground">User Management</h2>
              <p className="text-sm text-muted-foreground">
                {profiles?.length || 0} geregistreerde gebruikers
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zoek gebruiker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-admin-elevated border-admin-border"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border bg-admin-elevated/50">
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Gebruiker
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Industrie
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Locatie
              </th>
              <th className="text-center p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Premium
              </th>
              <th className="text-center p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Local Guide
              </th>
              <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles?.map((profile, index) => (
              <motion.tr
                key={profile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-admin-border hover:bg-admin-elevated/30 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-admin-border">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-admin-elevated text-foreground">
                        {profile.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString("nl-NL")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="border-admin-border text-muted-foreground">
                    {profile.industry || "Onbekend"}
                  </Badge>
                </td>
                <td className="p-4">
                  {profile.current_lab_id ? (
                    <div className="flex items-center gap-2 text-neon-green">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.current_lab_id}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Niet ingecheckt</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {updatingUser === profile.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                    ) : (
                      <>
                        <Switch
                          checked={profile.premium_tier === "premium" || profile.premium_tier === "vip"}
                          onCheckedChange={() => handlePremiumToggle(profile)}
                          className="data-[state=unchecked]:bg-muted-foreground/30 data-[state=unchecked]:border-muted-foreground/50 data-[state=checked]:bg-amber-500 border-2"
                        />
                        {(profile.premium_tier === "premium" || profile.premium_tier === "vip") && (
                          <Crown className="w-4 h-4 text-amber-400" />
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {updatingUser === profile.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                    ) : (
                      <>
                        <Switch
                          checked={(profile.lab_visits || 0) >= 30}
                          onCheckedChange={() => handleLocalGuideToggle(profile)}
                          className="data-[state=unchecked]:bg-muted-foreground/30 data-[state=unchecked]:border-muted-foreground/50 data-[state=checked]:bg-neon-green border-2"
                        />
                        {(profile.lab_visits || 0) >= 30 && (
                          <MapPin className="w-4 h-4 text-neon-green" />
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge
                    className={
                      profile.status === "open"
                        ? "bg-neon-green/20 text-neon-green border-neon-green/30"
                        : profile.status === "focused"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {profile.status || "invisible"}
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredProfiles?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Geen gebruikers gevonden
          </div>
        )}
      </div>
    </div>
  );
};
