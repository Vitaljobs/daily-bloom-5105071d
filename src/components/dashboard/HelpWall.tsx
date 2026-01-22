import { motion } from "framer-motion";
import { HelpCircle, Clock, MessageCircle, Plus } from "lucide-react";

const skillTaps = [
  {
    id: 1,
    user: "Marc B.",
    avatar: "MB",
    question: "Quick CSS grid question — anyone free for 5 min?",
    skill: "CSS",
    time: "2m ago",
    responses: 2,
  },
  {
    id: 2,
    user: "Sarah K.",
    avatar: "SK",
    question: "Need help with Figma auto-layout, stuck on a component",
    skill: "Figma",
    time: "8m ago",
    responses: 0,
  },
  {
    id: 3,
    user: "Tom H.",
    avatar: "TH",
    question: "Anyone know about Stripe webhooks?",
    skill: "Payments",
    time: "15m ago",
    responses: 3,
  },
];

export const HelpWall = () => {
  return (
    <div className="bento-card col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-foreground">Help Wall</h3>
            <p className="text-sm text-muted-foreground">Quick 5-min skill taps</p>
          </div>
        </div>
        <button className="btn-gold px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Post Question
        </button>
      </div>

      <div className="space-y-3">
        {skillTaps.map((tap, index) => (
          <motion.div
            key={tap.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground flex-shrink-0">
                {tap.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground text-sm">{tap.user}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {tap.skill}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{tap.question}</p>
              </div>

              {/* Meta */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tap.time}
                </span>
                {tap.responses > 0 && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {tap.responses}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
