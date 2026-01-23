import { Hero } from "@/components/landing/Hero";
import { motion } from "framer-motion";
import { Coffee, ArrowRight, Users, Zap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "Skill Pulse Radar",
    description: "See who's working nearby and what expertise is in the room — in real-time.",
  },
  {
    icon: Coffee,
    title: "Digital Table Tent",
    description: "Toggle between Focus Mode and Open for Coffee — let others know your availability.",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description: "AI-powered suggestions for complementary connections based on your skills.",
  },
  {
    icon: MapPin,
    title: "Help Wall",
    description: "Post quick questions and get 5-minute help from professionals around you.",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Hero />

      {/* Features Section */}
      <section className="relative py-12 sm:py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-3 sm:mb-4 px-2">
              Networking, <span className="text-gradient-gold">Reimagined</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Built for the way modern professionals actually work — in coffee shops, 
              co-working spaces, and creative hubs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bento-card text-center p-4 sm:p-6"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-serif text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-serif text-foreground mb-3 sm:mb-4 px-2">
              Ready to find your <span className="text-gradient-gold">Common Ground</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto px-2">
              Join thousands of professionals already making meaningful connections 
              in their favorite spaces.
            </p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-gold px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 rounded-xl text-base font-medium inline-flex items-center gap-2 sm:gap-3 min-h-[52px] sm:min-h-[56px]"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-foreground">Common Ground</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © 2025 Common Ground. Built for modern professionals.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
