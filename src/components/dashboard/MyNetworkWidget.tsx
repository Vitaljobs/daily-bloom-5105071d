import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, MapPin, MessageCircle, ChevronRight, Download, FileText, StickyNote, Edit2, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useConnections, exportConnectionsToCSV, exportConnectionsToVCF, downloadFile, Connection } from "@/hooks/useConnections";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Vandaag";
  if (diffDays === 1) return "Gisteren";
  if (diffDays < 7) return `${diffDays} dagen geleden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weken geleden`;
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
};

const getAvatarEmoji = (name: string): string => {
  const emojis = ["👩‍💻", "👨‍💼", "👩‍🎨", "👨‍🔬", "👩‍💼", "👨‍🎤", "👩‍🏫", "👨‍🍳"];
  const index = name.charCodeAt(0) % emojis.length;
  return emojis[index];
};

const getLabIcon = (labName: string | undefined): string => {
  const icons: Record<string, string> = {
    "The Roastery": "🔥",
    "Library Vault": "📚",
    "Espresso Bar": "⚡",
    "Rooftop Terrace": "☀️",
    "The Greenhouse": "🌿",
  };
  return labName ? icons[labName] || "☕" : "☕";
};

export const MyNetworkWidget = () => {
  const { connections, isLoading, updateNote } = useConnections();
  const { language } = useLanguage();
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportCSV = () => {
    if (connections.length === 0) {
      toast.error(language === "nl" ? "Geen connecties om te exporteren" : "No connections to export");
      return;
    }
    const csv = exportConnectionsToCSV(connections);
    downloadFile(csv, "common-ground-netwerk.csv", "text/csv;charset=utf-8;");
    toast.success(language === "nl" ? "Netwerk geëxporteerd als CSV" : "Network exported as CSV");
    setShowExportMenu(false);
  };

  const handleExportVCF = () => {
    if (connections.length === 0) {
      toast.error(language === "nl" ? "Geen connecties om te exporteren" : "No connections to export");
      return;
    }
    const vcf = exportConnectionsToVCF(connections);
    downloadFile(vcf, "common-ground-netwerk.vcf", "text/vcard;charset=utf-8;");
    toast.success(language === "nl" ? "Netwerk geëxporteerd als VCF" : "Network exported as VCF");
    setShowExportMenu(false);
  };

  const handleSaveNote = async (connectionId: string) => {
    try {
      await updateNote({ connectionId, note: noteText });
      toast.success(language === "nl" ? "Notitie opgeslagen" : "Note saved");
      setEditingNote(null);
    } catch (error) {
      toast.error(language === "nl" ? "Kon notitie niet opslaan" : "Could not save note");
    }
  };

  const startEditNote = (connection: Connection) => {
    setEditingNote(connection.id);
    setNoteText(connection.private_note || "");
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="wood-card p-5 h-full flex items-center justify-center"
      >
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </motion.div>
    );
  }

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
          <h3 className="font-serif text-lg text-foreground">
            {language === "nl" ? "Mijn Netwerk" : "My Network"}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {connections.length} {language === "nl" ? "connecties" : "connections"}
          </span>
          
          {/* Export Button */}
          {connections.length > 0 && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                title={language === "nl" ? "Exporteren" : "Export"}
              >
                <Download className="w-4 h-4 text-primary" />
              </motion.button>
              
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 top-10 z-50 w-40 p-2 rounded-xl bg-card border border-border shadow-lg"
                  >
                    <button
                      onClick={handleExportCSV}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      CSV Export
                    </button>
                    <button
                      onClick={handleExportVCF}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      VCF (vCard)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Connections List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {connections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-4xl mb-3">🤝</div>
              <p className="text-sm text-muted-foreground">
                {language === "nl" 
                  ? "Nog geen connecties. Start een gesprek om je netwerk op te bouwen!"
                  : "No connections yet. Start a conversation to build your network!"}
              </p>
            </motion.div>
          ) : (
            connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => setSelectedConnection(
                  selectedConnection === connection.id ? null : connection.id
                )}
                className="relative p-3 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-gold-dark/20 flex items-center justify-center text-xl border-2 border-primary/30">
                    {connection.connected_profile?.avatar_url ? (
                      <img 
                        src={connection.connected_profile.avatar_url} 
                        alt="" 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      getAvatarEmoji(connection.connected_profile?.name || "U")
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {connection.connected_profile?.name || "Onbekend"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {connection.connected_profile?.role || connection.connected_profile?.industry || ""}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(connection.connected_at)}
                    </p>
                    <p className="text-xs text-primary flex items-center justify-end gap-1 mt-0.5">
                      <span>{getLabIcon(connection.lab?.name)}</span>
                      <span className="truncate max-w-[80px]">{connection.lab?.name || "Common Ground"}</span>
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {selectedConnection === connection.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="pt-3 mt-3 border-t border-border/30">
                        {/* Shared Skills */}
                        {connection.shared_skills && connection.shared_skills.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1.5">
                              {language === "nl" ? "Gedeelde skills:" : "Shared skills:"}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {connection.shared_skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Private Note */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <StickyNote className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {language === "nl" ? "Privé notitie:" : "Private note:"}
                            </p>
                          </div>
                          
                          {editingNote === connection.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder={language === "nl" ? "Bijv. Wil samenwerken aan AI project" : "E.g. Wants to collaborate on AI project"}
                                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-muted/50 border border-border focus:border-primary/50 focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveNote(connection.id)}
                                className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingNote(null)}
                                className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => startEditNote(connection)}
                              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                              <p className="flex-1 text-xs text-foreground">
                                {connection.private_note || (language === "nl" ? "Klik om notitie toe te voegen..." : "Click to add note...")}
                              </p>
                              <Edit2 className="w-3 h-3 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {language === "nl" ? "Nieuw bericht" : "New message"}
                          </motion.button>
                          
                          {connection.connected_profile?.linkedin_url && (
                            <motion.a
                              href={connection.connected_profile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-4 py-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#0A66C2]/20 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              LinkedIn
                            </motion.a>
                          )}
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
      {connections.length > 3 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full mt-4 py-2 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
        >
          {language === "nl" ? "Bekijk alle connecties" : "View all connections"}
          <ChevronRight className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  );
};
