import { motion } from "framer-motion";
import { MapPin, Users, Wifi, Coffee } from "lucide-react";

export const LocationCard = () => {
  return (
    <div className="bento-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-serif text-foreground">Current Space</h3>
          <p className="text-sm text-muted-foreground">You're checked in</p>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <h4 className="font-serif text-lg text-foreground mb-1">The Coffee Lab</h4>
        <p className="text-sm text-muted-foreground mb-4">Amsterdam Centrum</p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-primary">
            <Users className="w-4 h-4" />
            <span>23</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wifi className="w-4 h-4" />
            <span>Fast</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Coffee className="w-4 h-4" />
            <span>Great</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
      >
        Change Location
      </motion.button>
    </div>
  );
};
