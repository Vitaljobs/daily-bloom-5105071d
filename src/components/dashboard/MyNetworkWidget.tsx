import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, MapPin, MessageCircle, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Connection {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  connectedAt: Date;
  labName: string;
  labIcon: string;
}

// Mock connections data
const mockConnections: Connection[] = [
  {
    id: "1",
    name: "Emma van der Berg",
    avatar: "👩‍💻",
    role: "AI Researcher",
    skills: ["AI/ML", "Python"],
    connectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    labName: "The Roastery",
    labIcon: "🔥",
  },
  {
    id: "2",
    name: "Thomas Bakker",
    avatar: "👨‍💼",
    role: "Product Lead",
    skills: ["Strategy", "UX"],
    connectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    labName: "The Espresso Bar",
    labIcon: "⚡",
  },
  {
    id: "3",
    name: "Lisa de Jong",
    avatar: "👩‍🎨",
    role: "Design Lead",
    skills: ["UI Design", "Figma"],
    connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    labName: "The Greenhouse",
    labIcon: "🌿",
  },
];

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Vandaag";
  if (diffDays === 1) return "Gisteren";
  if (diffDays < 7) return `${diffDays} dagen geleden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`;
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
};

export const MyNetworkWidget = () => {
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wood-card p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 10px hsl(35 85% 58% / 0.2)",
                "0 0 15px hsl(35 85% 58% / 0.4)",
                "0 0 10px hsl(35 85% 58% / 0.2)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
          >
            <Users className="w-4 h-4 text-primary" />
          </motion.div>
          <h3 className="font-serif text-lg text-foreground">Mijn Netwerk</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          {mockConnections.length} connecties
        </span>
      </div>

      {/* Connections List */}
      <div className="space-y-3">
        <AnimatePresence>
          {mockConnections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-3">🤝</div>
              <p className="text-sm text-muted-foreground">
                Nog geen connecties. Start een gesprek om je netwerk op te bouwen!
              </p>
            </motion.div>
          ) : (
            mockConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => setSelectedConnection(
                  selectedConnection?.id === connection.id ? null : connection
                )}
                className="relative p-3 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-gold-dark/20 flex items-center justify-center text-xl border-2 border-primary/30">
                    {connection.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {connection.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {connection.role}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(connection.connectedAt)}
                    </p>
                    <p className="text-xs text-primary flex items-center justify-end gap-1 mt-0.5">
                      <span>{connection.labIcon}</span>
                      <span className="truncate max-w-[80px]">{connection.labName}</span>
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {selectedConnection?.id === connection.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-border/30">
                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {connection.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Nieuw bericht
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* View all link */}
      {mockConnections.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full mt-4 py-2 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          Bekijk alle connecties
          <ChevronRight className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  );
};
