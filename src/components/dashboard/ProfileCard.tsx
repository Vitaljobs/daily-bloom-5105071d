import { motion } from "framer-motion";
import { Settings, Award, TrendingUp, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";

export const ProfileCard = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="bento-card flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bento-card">
        <p className="text-muted-foreground text-center">No profile data</p>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-xl font-medium text-primary-foreground overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer"
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </button>
          <div>
            <h3 className="font-serif text-lg text-foreground">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">
              {profile.role || "Member"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(profile.skills || []).slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {skill}
          </span>
        ))}
        {(profile.skills || []).length === 0 && (
          <span className="text-xs text-muted-foreground italic">
            No skills added yet
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-3 text-center">
          <Award className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-serif text-foreground">
            {profile.lab_visits || 0}
          </p>
          <p className="text-xs text-muted-foreground">Lab Visits</p>
        </div>
        <div className="glass-panel rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-serif text-foreground">
            {profile.premium_tier === "premium" || profile.premium_tier === "vip"
              ? "Premium"
              : "Free"}
          </p>
          <p className="text-xs text-muted-foreground">Tier</p>
        </div>
      </div>
    </div>
  );
};
