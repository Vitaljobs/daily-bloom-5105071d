import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const ProfileCompleteness = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDismissed, setIsDismissed] = useState(false);

    interface ProfileData {
        avatar_url: string | null;
        name: string | null;
        headline: string | null;
        bio: string | null;
        location: string | null;
        shared_skills: string[] | null;
        linkedin_url: string | null;
    }

    const { data: profile } = useQuery({
        queryKey: ["profile-completeness", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (error) throw error;
            return data as unknown as ProfileData;
        },
        enabled: !!user?.id,
    });

    if (!profile || isDismissed) return null;

    // Calculate completeness
    const checks = [
        { label: "Profile Photo", key: "avatar_url", done: !!profile.avatar_url },
        { label: "Full Name", key: "name", done: !!profile.name && profile.name !== "Anonymous" },
        { label: "Headline", key: "headline", done: !!profile.headline },
        { label: "Bio", key: "bio", done: !!profile.bio },
        { label: "Location", key: "location", done: !!profile.location },
        { label: "Skills", key: "skills", done: Array.isArray(profile.shared_skills) && profile.shared_skills.length > 0 },
        { label: "LinkedIn", key: "linkedin", done: !!profile.linkedin_url },
    ];

    const completedCount = checks.filter((c) => c.done).length;
    const totalCount = checks.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    if (percentage === 100) return null; // Hide if complete

    const nextTask = checks.find((c) => !c.done);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full"
            >
                <Card className="bg-gradient-to-br from-card to-muted border-primary/20 shadow-lg overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-serif">Setup Your Profile</CardTitle>
                            <span className="text-sm font-bold text-primary">{percentage}%</span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Progress value={percentage} className="h-2 bg-muted/50" />

                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                <p>Complete your profile to unlock more matches.</p>
                                {nextTask && (
                                    <p className="text-foreground font-medium mt-1 flex items-center gap-2">
                                        <Circle className="w-3 h-3 fill-primary text-primary animate-pulse" />
                                        Next: Add your {nextTask.label}
                                    </p>
                                )}
                            </div>
                            <Button size="sm" onClick={() => navigate("/profile")} className="shadow-md">
                                Complete Now <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};
