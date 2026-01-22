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
    <main className="min-h-screen bg-background">
      <Hero />

      {/* Features Section */}
      <section className="relative py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              Networking, <span className="text-gradient-gold">Reimagined</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for the way modern professionals actually work — in coffee shops, 
              co-working spaces, and creative hubs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bento-card text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
              Ready to find your <span className="text-gradient-gold">Common Ground</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of professionals already making meaningful connections 
              in their favorite spaces.
            </p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-gold px-10 py-4 rounded-xl text-lg font-medium inline-flex items-center gap-3"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-foreground">Common Ground</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Common Ground. Built for modern professionals.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
