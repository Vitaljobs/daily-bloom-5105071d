import { motion } from "framer-motion";
import { MapPin, ChevronDown, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Location {
  id: string;
  name: string;
  address: string;
  usersCount: number;
}

const locations: Location[] = [
  { id: "1", name: "The Coffee Lab", address: "Amsterdam Centrum", usersCount: 23 },
  { id: "2", name: "Espresso Bar", address: "De Pijp", usersCount: 15 },
  { id: "3", name: "Creative Hub", address: "NDSM Werf", usersCount: 31 },
  { id: "4", name: "Work Café", address: "Zuidas", usersCount: 18 },
];

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (locationId: string) => void;
}

export const LocationSelector = ({
  currentLocation,
  onLocationChange,
}: LocationSelectorProps) => {
  const selectedLocation = locations.find((l) => l.id === currentLocation) || locations[0];

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
          <SelectTrigger className="w-auto min-w-[200px] bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="font-serif text-foreground">{selectedLocation.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({selectedLocation.usersCount} aanwezig)
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-md border-border/50">
            {locations.map((location) => (
              <SelectItem
                key={location.id}
                value={location.id}
                className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
              >
                <div className="flex items-center justify-between w-full gap-4">
                  <div>
                    <p className="font-serif text-foreground">{location.name}</p>
                    <p className="text-xs text-muted-foreground">{location.address}</p>
                  </div>
                  <span className="text-xs text-primary">{location.usersCount} 👥</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export { locations };
