import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SkillsSectionProps {
    skills: string[];
    isEditable: boolean;
    onAddSkill?: (skill: string) => void;
    onRemoveSkill?: (skill: string) => void;
    highlightedSkills?: string[]; // For showing shared skills on public profiles
}

export const SkillsSection = ({
    skills,
    isEditable,
    onAddSkill,
    onRemoveSkill,
    highlightedSkills = [],
}: SkillsSectionProps) => {
    const [newSkill, setNewSkill] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleAddSkill = () => {
        if (newSkill.trim() && onAddSkill) {
            onAddSkill(newSkill.trim());
            setNewSkill("");
            setIsAdding(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddSkill();
        } else if (e.key === "Escape") {
            setIsAdding(false);
            setNewSkill("");
        }
    };

    return (
        <div className="bento-card">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl text-foreground">Skills</h2>
                {isEditable && !isAdding && (
                    <Button
                        onClick={() => setIsAdding(true)}
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Skill
                    </Button>
                )}
            </div>

            {/* Add Skill Input */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                    >
                        <div className="flex gap-2">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="e.g., React, TypeScript, Design..."
                                className="flex-1"
                                autoFocus
                            />
                            <Button onClick={handleAddSkill} size="sm" className="btn-gold">
                                Add
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewSkill("");
                                }}
                                variant="ghost"
                                size="sm"
                            >
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skills List */}
            <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {skills.map((skill) => {
                        const isHighlighted = highlightedSkills.includes(skill);

                        return (
                            <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`
                  glass-inner px-4 py-2 rounded-full flex items-center gap-2 group
                  ${isHighlighted ? "ring-2 ring-primary/50 bg-primary/10" : ""}
                `}
                            >
                                <span className="text-sm text-foreground">{skill}</span>

                                {isEditable && onRemoveSkill && (
                                    <button
                                        onClick={() => onRemoveSkill(skill)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        {isEditable
                            ? "No skills added yet. Click 'Add Skill' to get started."
                            : "No skills listed."}
                    </p>
                )}
            </div>
        </div>
    );
};
