import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Camera, MapPin, Briefcase, Link as LinkIcon, Edit2, Check, X, LogOut } from "lucide-react";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { Button } from "@/components/ui/button";
import { useUserProfile, UserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Profile() {
    const navigate = useNavigate();
    const { profile, isLoading, refetch } = useUserProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState<Partial<UserProfile>>({});

    const handleEditClick = () => {
        if (profile) {
            setEditedValues({
                name: profile.name,
                headline: profile.headline,
                bio: profile.bio,
                role: profile.role,
                location: profile.location,
                linkedin_url: profile.linkedin_url,
            });
            setIsEditing(true);
        }
    };

    const handleEditChange = (field: keyof UserProfile, value: string) => {
        setEditedValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedValues({});
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            const { error } = await supabase
                .from("profiles")
                .update(editedValues as any)
                .eq("id", profile.id);

            if (error) throw error;

            toast.success("Profile updated!");
            setIsEditing(false);
            refetch();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleAddSkill = async (skill: string) => {
        if (!profile) return;

        const updatedSkills = [...(profile.skills || []), skill];

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ skills: updatedSkills })
                .eq("id", profile.id);

            if (error) throw error;

            toast.success("Skill added!");
            refetch();
        } catch (error) {
            console.error("Error adding skill:", error);
            toast.error("Failed to add skill");
        }
    };

    const handleRemoveSkill = async (skill: string) => {
        if (!profile) return;

        const updatedSkills = (profile.skills || []).filter((s) => s !== skill);

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ skills: updatedSkills })
                .eq("id", profile.id);

            if (error) throw error;

            toast.success("Skill removed!");
            refetch();
        } catch (error) {
            console.error("Error removing skill:", error);
            toast.error("Failed to remove skill");
        }
    };

    const handleAvatarUpload = async (file: File) => {
        if (!profile) return;

        try {
            console.log("Starting avatar upload...");
            console.log("File:", file.name, file.type, file.size);
            console.log("Profile user_id:", profile.user_id);

            const fileExt = file.name.split(".").pop();
            const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            console.log("Upload path:", filePath);
            console.log("Bucket: avatars");

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            console.log("Upload response:", { uploadError, uploadData });

            if (uploadError) {
                console.error("Upload error details:", uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            console.log("Public URL:", data.publicUrl);

            const { error: updateError } = await supabase
                .from("profiles")
                .update({ avatar_url: data.publicUrl })
                .eq("id", profile.id);

            if (updateError) throw updateError;

            toast.success("Avatar updated!");
            refetch();
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("Failed to upload avatar");
        }
    };

    const handleCoverUpload = async (file: File) => {
        if (!profile) return;

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${profile.user_id}-cover-${Date.now()}.${fileExt}`;
            const filePath = `covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from("profiles")
                .update({ cover_image_url: data.publicUrl } as any)
                .eq("id", profile.id);

            if (updateError) throw updateError;

            toast.success("Cover image updated!");
            refetch();
        } catch (error) {
            console.error("Error uploading cover:", error);
            toast.error("Failed to upload cover image");
        }
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Close Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={() => navigate("/dashboard")}
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Header */}
                <ProfileHeader
                    profile={profile}
                    isOwnProfile={true}
                    isEditing={isEditing}
                    editedValues={editedValues}
                    onEditChange={handleEditChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onEditClick={handleEditClick}
                    onAvatarUpload={handleAvatarUpload}
                    onCoverUpload={handleCoverUpload}
                />

                {/* Skills Section */}
                <SkillsSection
                    skills={profile.skills || []}
                    isEditable={true}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                />
            </div>
        </div>
    );
}
