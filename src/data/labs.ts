import labRoastery from "@/assets/lab-roastery.jpg";
import labLibrary from "@/assets/lab-library.jpg";
import labEspresso from "@/assets/lab-espresso.jpg";
import labRooftop from "@/assets/lab-rooftop.jpg";
import labGreenhouse from "@/assets/lab-greenhouse.jpg";

export interface Lab {
  id: string;
  name: string;
  tagline: string;
  description: string;
  background: string;
  icon: string;
  atmosphere: "industrial" | "quiet" | "social" | "inspiring" | "fresh";
}

export const labs: Lab[] = [
  {
    id: "roastery",
    name: "The Roastery",
    tagline: "Industrieel & Ruig",
    description: "Een ruige, industriële sfeer met koperen branders en de geur van vers gebrande bonen.",
    background: labRoastery,
    icon: "🔥",
    atmosphere: "industrial",
  },
  {
    id: "library",
    name: "The Library Vault",
    tagline: "Stil & Focus",
    description: "Diepe concentratie in een klassieke bibliotheeksfeer met leren fauteuils.",
    background: labLibrary,
    icon: "📚",
    atmosphere: "quiet",
  },
  {
    id: "espresso",
    name: "The Espresso Bar",
    tagline: "Snel & Sociaal",
    description: "Bruisende energie en snelle connecties aan de bar.",
    background: labEspresso,
    icon: "☕",
    atmosphere: "social",
  },
  {
    id: "rooftop",
    name: "The Rooftop Terrace",
    tagline: "Inspirerend & Open",
    description: "Panoramisch uitzicht bij zonsondergang voor creatieve inspiratie.",
    background: labRooftop,
    icon: "🌅",
    atmosphere: "inspiring",
  },
  {
    id: "greenhouse",
    name: "The Greenhouse",
    tagline: "Fris & Groen",
    description: "Omringd door planten in een lichte, botanische oase.",
    background: labGreenhouse,
    icon: "🌿",
    atmosphere: "fresh",
  },
];

export const getLabById = (id: string): Lab | undefined => {
  return labs.find((lab) => lab.id === id);
};
