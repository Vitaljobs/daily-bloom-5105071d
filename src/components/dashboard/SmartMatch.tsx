import { motion } from "framer-motion";
import { Sparkles, MessageCircle, X } from "lucide-react";

const suggestedMatch = {
  name: "Emma van Dijk",
  role: "Full-Stack Developer",
  skills: ["React", "Node.js", "TypeScript"],
  complementary: "You're a Designer — she can build your ideas",
  avatar: "ED",
  status: "open",
};

export const SmartMatch = () => {
  return (
    <div className="bento-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-serif text-foreground">Smart Match</h3>
          <p className="text-sm text-muted-foreground">Perfect coffee partner</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-4"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-lg font-medium text-primary-foreground">
              {suggestedMatch.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-card" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{suggestedMatch.name}</h4>
            <p className="text-sm text-muted-foreground">{suggestedMatch.role}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {suggestedMatch.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Complementary reason */}
        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-primary">
            <Sparkles className="w-4 h-4 inline mr-1" />
            {suggestedMatch.complementary}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 btn-gold py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Invite for Coffee
          </button>
          <button className="p-2 rounded-lg border border-border hover:border-muted-foreground transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
