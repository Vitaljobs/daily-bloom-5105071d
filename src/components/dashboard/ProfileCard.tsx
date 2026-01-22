import { motion } from "framer-motion";
import { Settings, Award, TrendingUp } from "lucide-react";

export const ProfileCard = () => {
  return (
    <div className="bento-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-xl font-medium text-primary-foreground">
            JD
          </div>
          <div>
            <h3 className="font-serif text-lg text-foreground">Jan de Vries</h3>
            <p className="text-sm text-muted-foreground">UX Designer</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["UX Design", "Figma", "User Research", "Prototyping"].map((skill) => (
          <span
            key={skill}
            className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-3 text-center">
          <Award className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-serif text-foreground">12</p>
          <p className="text-xs text-muted-foreground">Connections</p>
        </div>
        <div className="glass-panel rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-serif text-foreground">5</p>
          <p className="text-xs text-muted-foreground">This week</p>
        </div>
      </div>
    </div>
  );
};
