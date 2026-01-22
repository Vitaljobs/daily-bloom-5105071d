import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodOption {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { icon: <Sun className="w-8 h-8" />, label: "Geweldig", value: "great", color: "text-gold" },
  { icon: <Smile className="w-8 h-8" />, label: "Goed", value: "good", color: "text-gold-light" },
  { icon: <Cloud className="w-8 h-8" />, label: "Oké", value: "okay", color: "text-cream-muted" },
  { icon: <Meh className="w-8 h-8" />, label: "Mwah", value: "meh", color: "text-muted-foreground" },
  { icon: <CloudRain className="w-8 h-8" />, label: "Moeilijk", value: "hard", color: "text-cream-muted" },
];

export const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMoodSelect = (value: string) => {
    setSelectedMood(value);
    setTimeout(() => setIsSubmitted(true), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="card-glass rounded-2xl p-6 md:p-8"
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-serif text-foreground mb-2">
                Hoe voel je je vandaag?
              </h2>
              <p className="text-muted-foreground">
                Neem een moment om in te checken met jezelf
              </p>
            </div>

            <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
              {moodOptions.map((mood, index) => (
                <motion.button
                  key={mood.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300",
                    "hover:bg-secondary/50 border border-transparent hover:border-primary/20",
                    selectedMood === mood.value && "bg-secondary border-primary/40",
                    mood.color
                  )}
                >
                  {mood.icon}
                  <span className="text-sm text-muted-foreground">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
            <h3 className="text-xl font-serif text-foreground">
              Bedankt voor je check-in!
            </h3>
            <p className="text-muted-foreground">
              Je bent al {Math.floor(Math.random() * 7) + 1} dagen op rij bezig met je mentale gezondheid
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsSubmitted(false);
                setSelectedMood(null);
              }}
              className="text-primary underline-offset-4 hover:underline text-sm"
            >
              Opnieuw check-in doen
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
