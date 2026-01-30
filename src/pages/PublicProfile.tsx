import { useParams, useNavigate } from "react-router-dom";
import { Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/useUserProfile";

export default function PublicProfile() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { profile: currentUserProfile } = useUserProfile();

    // Fetch the target user's profile
    const { data: targetProfile, isLoading } = useQuery({
        queryKey: ["public-profile", userId],
        queryFn: async (): Promise<UserProfile | null> => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", userId)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                throw error;
            }

            return data as unknown as UserProfile;
        },
        enabled: !!userId,
    });

    const handleMessageClick = () => {
        if (userId) {
            navigate(`/messages?userId=${userId}`);
        }
    };

    // Calculate shared skills
    const sharedSkills =
        currentUserProfile && targetProfile
            ? (currentUserProfile.skills || []).filter((skill) =>
                (targetProfile.skills || []).includes(skill)
            )
            : [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!targetProfile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Profile not found</p>
                <Button onClick={() => navigate("/dashboard")} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back Button */}
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    className="gap-2 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                {/* Header */}
                <ProfileHeader
                    profile={targetProfile}
                    isOwnProfile={false}
                    onMessageClick={handleMessageClick}
                />

                {/* Match Score (if shared skills) */}
                {sharedSkills.length > 0 && (
                    <div className="bento-card bg-primary/10 border-primary/30">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-lg font-serif text-primary">
                                    {Math.round((sharedSkills.length / (targetProfile.skills?.length || 1)) * 100)}%
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-foreground">
                                    {sharedSkills.length} shared skill{sharedSkills.length !== 1 ? "s" : ""}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    You have {sharedSkills.length} skill{sharedSkills.length !== 1 ? "s" : ""} in common
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                <SkillsSection
                    skills={targetProfile.skills || []}
                    isEditable={false}
                    highlightedSkills={sharedSkills}
                />

                {/* Bio Section */}
                {targetProfile.bio && (
                    <div className="bento-card">
                        <h2 className="font-serif text-xl text-foreground mb-4">About</h2>
                        <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                            {targetProfile.bio}
                        </p>
                    </div>
                )}

                {/* Social Links */}
                {(targetProfile.linkedin_url || targetProfile.portfolio_url) && (
                    <div className="bento-card">
                        <h2 className="font-serif text-xl text-foreground mb-4">Links</h2>
                        <div className="flex flex-wrap gap-3">
                            {targetProfile.linkedin_url && (
                                <a
                                    href={targetProfile.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-inner px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    LinkedIn
                                </a>
                            )}
                            {targetProfile.portfolio_url && (
                                <a
                                    href={targetProfile.portfolio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-inner px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    Portfolio
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Floating Message Button */}
                <div className="fixed bottom-8 right-8">
                    <Button
                        onClick={handleMessageClick}
                        className="btn-gold gap-2 shadow-lg"
                        size="lg"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Send Message
                    </Button>
                </div>
            </div>
        </div>
    );
}
