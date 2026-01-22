import { motion } from "framer-motion";
import { Sun, Sunset, Moon, Coffee } from "lucide-react";
import { getLabById } from "@/data/labs";

interface PersonalizedGreetingProps {
  labId?: string | null;
}

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const greetings = {
  morning: {
    nl: "Goedemorgen",
    en: "Good morning",
    icon: Sun,
    color: "text-yellow-500",
  },
  afternoon: {
    nl: "Goedemiddag",
    en: "Good afternoon",
    icon: Coffee,
    color: "text-orange-500",
  },
  evening: {
    nl: "Goedenavond",
    en: "Good evening",
    icon: Sunset,
    color: "text-orange-600",
  },
  night: {
    nl: "Goedenacht",
    en: "Good night",
    icon: Moon,
    color: "text-indigo-400",
  },
};

export const PersonalizedGreeting = ({ labId }: PersonalizedGreetingProps) => {
  const timeOfDay = getTimeOfDay();
  const greeting = greetings[timeOfDay];
  const lab = labId ? getLabById(labId) : null;
  const Icon = greeting.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-4"
    >
      <motion.div
        animate={{ 
          rotate: timeOfDay === "morning" ? [0, 15, -15, 0] : 0,
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <Icon className={`w-4 h-4 ${greeting.color}`} />
      </motion.div>
      <span className="text-sm text-cream-muted">
        {greeting.nl}
        {lab && (
          <span className="text-gold">
            {" "}bij {lab.name}
          </span>
        )}
      </span>
    </motion.div>
  );
};
