import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { QuickActionCard } from "@/components/QuickActionCard";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { Wind, Moon, Sparkles, Brain, Heart, Waves } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const exercises = [
  {
    icon: Brain,
    title: "Diepte Meditatie",
    subtitle: "Guided Audio",
    duration: "20 min",
  },
  {
    icon: Sparkles,
    title: "Stress Relief Flow",
    subtitle: "Interactive Exercise",
    duration: "10 min",
  },
  {
    icon: Wind,
    title: "Ademhaling",
    subtitle: "4-7-8 Techniek",
    duration: "5 min",
  },
  {
    icon: Heart,
    title: "Hartcoherentie",
    subtitle: "Voice Guide",
    duration: "8 min",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-0 md:ml-64 relative z-10">
        <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-8">
          {/* Welcome Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-16 md:pt-8"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-2">
              Welkom bij <span className="text-gradient-gold">MindGarden</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Neem een moment voor jezelf en vind je innerlijke rust
            </p>
          </motion.header>

          {/* Daily Check-in */}
          <section>
            <MoodCheckIn />
          </section>

          {/* Featured Exercises */}
          <section className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <h2 className="text-2xl font-serif text-foreground">
                Aanbevolen Oefeningen
              </h2>
              <button className="text-primary text-sm hover:underline underline-offset-4 transition-all">
                Bekijk alles
              </button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.title}
                  icon={exercise.icon}
                  title={exercise.title}
                  subtitle={exercise.subtitle}
                  duration={exercise.duration}
                  delay={0.5 + index * 0.1}
                  variant={index === 0 ? "featured" : "default"}
                />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <QuickActionCard
                title="Sleep Stories"
                variant="secondary"
                delay={0.8}
              />
            </div>
            <div className="space-y-3">
              <QuickActionCard
                title="Daily Check-in"
                variant="primary"
                delay={0.9}
              />
            </div>
          </section>

          {/* Evening Wind Down */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="card-glass rounded-2xl p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Moon className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-serif text-foreground mb-2">
                  Avond Wind Down
                </h3>
                <p className="text-muted-foreground mb-4">
                  Een 15-minuten sessie om je dag rustig af te sluiten met ademhalingsoefeningen en zachte meditatie.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold px-6 py-2 rounded-xl text-sm font-medium"
                >
                  Start Sessie
                </motion.button>
              </div>
            </div>
          </motion.section>

          {/* Stats Bar */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="grid grid-cols-3 gap-4 py-6"
          >
            {[
              { label: "Dagen streak", value: "7" },
              { label: "Minuten deze week", value: "45" },
              { label: "Voltooide oefeningen", value: "12" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                  className="text-3xl font-serif text-primary mb-1"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.section>
        </div>
      </main>

      {/* Mobile Navigation Overlay */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-sidebar/95 backdrop-blur-lg border-t border-sidebar-border p-4 z-50">
        <div className="flex justify-around">
          {[
            { icon: <Waves className="w-6 h-6" />, label: "Home", active: true },
            { icon: <Wind className="w-6 h-6" />, label: "Explore" },
            { icon: <Heart className="w-6 h-6" />, label: "Saved" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
