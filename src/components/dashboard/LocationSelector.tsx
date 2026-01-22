import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { labs, Lab } from "@/data/labs";

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (locationId: string) => void;
  usersPerLab: Record<string, number>;
}

export const LocationSelector = ({
  currentLocation,
  onLocationChange,
  usersPerLab,
}: LocationSelectorProps) => {
  const selectedLab = labs.find((l) => l.id === currentLocation) || labs[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-center gap-3">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 10px hsl(35 85% 58% / 0.2)",
              "0 0 20px hsl(35 85% 58% / 0.4)",
              "0 0 10px hsl(35 85% 58% / 0.2)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <MapPin className="w-4 h-4 text-primary" />
        </motion.div>
        
        <span className="text-sm text-muted-foreground font-medium">Huidige Locatie:</span>
        
        <Select value={currentLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="w-auto min-w-[280px] bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
            <SelectValue>
              <div className="flex items-center gap-3">
                <span className="text-lg">{selectedLab.icon}</span>
                <div className="text-left">
                  <span className="font-serif text-foreground">{selectedLab.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({usersPerLab[currentLocation] || 0} aanwezig)
                  </span>
                </div>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-md border-border/50">
            {labs.map((lab) => (
              <SelectItem
                key={lab.id}
                value={lab.id}
                className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lab.icon}</span>
                  <div className="flex-1">
                    <p className="font-serif text-foreground">{lab.name}</p>
                    <p className="text-xs text-muted-foreground">{lab.tagline}</p>
                  </div>
                  <span className="text-xs text-primary ml-4">
                    {usersPerLab[lab.id] || 0} 👥
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Lab description */}
      <motion.p
        key={selectedLab.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xs text-muted-foreground mt-2"
      >
        {selectedLab.description}
      </motion.p>
    </motion.div>
  );
};

export { labs };
export type { Lab };
