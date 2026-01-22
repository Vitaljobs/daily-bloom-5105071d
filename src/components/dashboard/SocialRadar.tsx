import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const skills = [
  { name: "UX Design", count: 4, size: "lg" },
  { name: "React", count: 6, size: "xl" },
  { name: "Marketing", count: 3, size: "md" },
  { name: "Python", count: 2, size: "sm" },
  { name: "Copywriting", count: 5, size: "lg" },
  { name: "Figma", count: 4, size: "md" },
  { name: "Node.js", count: 3, size: "md" },
  { name: "Branding", count: 2, size: "sm" },
  { name: "AI/ML", count: 1, size: "sm" },
];

const sizeClasses = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
  xl: "text-lg px-6 py-3",
};

export const SocialRadar = () => {
  return (
    <div className="bento-card col-span-2 row-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-serif text-foreground">Skill Pulse</h3>
          <p className="text-sm text-muted-foreground">Expertise in this space right now</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center items-center min-h-[200px]">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ scale: 1.1 }}
            className={`
              ${sizeClasses[skill.size as keyof typeof sizeClasses]}
              rounded-full glass-panel cursor-pointer
              hover:border-primary/50 hover:shadow-[0_0_20px_hsl(35_80%_55%/0.2)]
              transition-all duration-300
            `}
          >
            <span className="text-cream">{skill.name}</span>
            <span className="ml-2 text-primary font-medium">{skill.count}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">23 professionals</span> checked in nearby
        </p>
      </div>
    </div>
  );
};
