import { motion } from "framer-motion";
import { Camera, MapPin, Briefcase, Edit2, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/hooks/useUserProfile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileHeaderProps {
    profile: UserProfile;
    isOwnProfile: boolean;
    isEditing?: boolean;
    editedValues?: Partial<UserProfile>;
    onEditChange?: (field: keyof UserProfile, value: string) => void;
    onSave?: () => void;
    onCancel?: () => void;
    onEditClick?: () => void;
    onMessageClick?: () => void;
    onAvatarUpload?: (file: File) => void;
    onCoverUpload?: (file: File) => void;
}

export const ProfileHeader = ({
    profile,
    isOwnProfile,
    isEditing,
    editedValues,
    onEditChange,
    onSave,
    onCancel,
    onEditClick,
    onMessageClick,
    onAvatarUpload,
    onCoverUpload,
}: ProfileHeaderProps) => {
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onAvatarUpload) {
            onAvatarUpload(file);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onCoverUpload) {
            onCoverUpload(file);
        }
    };

    return (
        <div className="bento-card overflow-hidden p-0">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/10 to-background overflow-hidden">
                {profile.cover_image_url ? (
                    <img
                        src={profile.cover_image_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-coffee/30 to-wood-dark" />
                )}

                {isOwnProfile && (
                    <label className="absolute bottom-4 right-4 cursor-pointer group">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                        />
                        <div className="glass-panel px-4 py-2 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 text-white/90 group-hover:text-white shadow-lg backdrop-blur-md border border-white/10">
                            <Camera className="w-5 h-5" />
                            <span className="font-medium text-sm">Edit Cover Photo</span>
                        </div>
                    </label>
                )}
            </div>

            {/* Profile Info */}
            <div className="p-6 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-4xl font-medium text-primary-foreground avatar-ring-active overflow-hidden">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                profile.name.substring(0, 2).toUpperCase()
                            )}
                        </div>

                        {isOwnProfile && (
                            <label className="absolute bottom-0 right-0 cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                <div className="glass-panel p-2 rounded-full hover:bg-muted/50 transition-colors">
                                    <Camera className="w-4 h-4 text-foreground" />
                                </div>
                            </label>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mb-4">
                    {isOwnProfile ? (
                        isEditing ? (
                            <>
                                <Button onClick={onCancel} variant="ghost">
                                    Cancel
                                </Button>
                                <Button onClick={onSave} className="btn-gold">
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={onEditClick} variant="outline" className="gap-2">
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        )
                    ) : (
                        <Button onClick={onMessageClick} className="btn-gold gap-2">
                            Send Message
                        </Button>
                    )}
                </div>

                {/* Name & Headline */}
                <div className="mt-12 space-y-4">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    value={editedValues?.name || ""}
                                    onChange={(e) => onEditChange?.("name", e.target.value)}
                                    className="font-serif text-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Headline</label>
                                <Input
                                    value={editedValues?.headline || ""}
                                    onChange={(e) => onEditChange?.("headline", e.target.value)}
                                    placeholder="Add a headline..."
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="font-serif text-3xl text-foreground mb-2">
                                {profile.name}
                            </h1>
                            {profile.headline && (
                                <p className="text-lg text-muted-foreground mb-3">
                                    {profile.headline}
                                </p>
                            )}
                        </>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {isEditing ? (
                            <div className="flex gap-4 w-full">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <Input
                                        value={editedValues?.role || ""}
                                        onChange={(e) => onEditChange?.("role", e.target.value)}
                                        placeholder="e.g. Software Engineer"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <Input
                                        value={editedValues?.location || ""}
                                        onChange={(e) => onEditChange?.("location", e.target.value)}
                                        placeholder="e.g. Amsterdam"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                {profile.role && (
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        {profile.role}
                                    </div>
                                )}
                                {profile.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {profile.location}
                                    </div>
                                )}
                                {profile.linkedin_url && (
                                    <a
                                        href={profile.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn Profile
                                    </a>
                                )}
                            </>
                        )}
                    </div>

                    {/* Social Links Edit */}
                    {isEditing && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">LinkedIn URL</label>
                            <Input
                                value={editedValues?.linkedin_url || ""}
                                onChange={(e) => onEditChange?.("linkedin_url", e.target.value)}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    )}

                    {/* Bio */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <Textarea
                                value={editedValues?.bio || ""}
                                onChange={(e) => onEditChange?.("bio", e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="min-h-[100px]"
                            />
                        </div>
                    ) : (
                        profile.bio && (
                            <p className="mt-4 text-foreground/80 leading-relaxed">
                                {profile.bio}
                            </p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
