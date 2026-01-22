import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const defaultSummary = `# Common Ground - Project Status

## Huidige Build Status
✅ Premium Dark Wood UI Theme - Compleet
✅ Bento Grid Dashboard - Compleet
✅ Social Radar met skill filtering - Compleet
✅ Chat Bridge met Smart Topics - Compleet
✅ Premium Business Model & Paywall - Compleet
✅ Language Switcher (NL/EN) - Compleet
✅ Industry Filtering (Premium) - Compleet
✅ Local Guide Badges - Compleet
✅ Admin Control Center - Compleet

## Actieve Features
- 5 Labs: Roastery, Library, Espresso Bar, Rooftop, Greenhouse
- Smart Match systeem met compatibility scores
- Real-time occupancy per locatie
- Premium features: AI Icebreakers, Contact Sharing, Industry Filter

## Volgende Stappen
- [ ] Stripe integratie voor betalingen
- [ ] Lovable Cloud backend voor user auth
- [ ] Real-time AI vertalingen via API
- [ ] Push notificaties voor matches

## Technische Stack
- React + TypeScript + Vite
- Tailwind CSS + Framer Motion
- shadcn/ui component library`;

export const ProjectSummary = () => {
  const [summary, setSummary] = useState(defaultSummary);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem("admin-project-summary", summary);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-card border border-admin-border overflow-hidden">
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
              <FileText className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-sans font-semibold text-foreground">Project Summary</h2>
              <p className="text-sm text-muted-foreground">Build status & active prompts reference</p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="min-h-[400px] bg-admin-elevated border-admin-border text-foreground font-mono text-sm leading-relaxed resize-none focus:border-neon-cyan/50 focus:ring-neon-cyan/20"
          placeholder="Enter project notes, build status, and active prompts..."
        />
      </div>
    </div>
  );
};
