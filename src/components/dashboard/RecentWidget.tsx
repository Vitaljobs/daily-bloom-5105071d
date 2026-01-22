import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const recentItems = [
  { id: 1, title: "Koffie met Emma", time: "14:30", type: "meeting" },
  { id: 2, title: "Design Review", time: "15:00", type: "task" },
];

export const RecentWidget = () => {
  return (
    <div className="wood-card p-5 h-full relative">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Clock className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-serif text-foreground">Recent</h3>
          <p className="text-xs text-muted-foreground">Laatste activiteit</p>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        {recentItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-inner p-3 flex items-center justify-between"
          >
            <p className="text-sm text-foreground">{item.title}</p>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
