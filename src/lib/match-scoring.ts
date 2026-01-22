import { UserProfile } from "@/types/common-ground";

export interface MatchAnalysis {
  score: number; // 0-100
  sharedSkills: string[];
  uniqueSkillsA: string[];
  uniqueSkillsB: string[];
  sameLocation: boolean;
  icebreaker: string;
  topics: string[];
}

// Predefined icebreakers based on skill categories
const icebreakerTemplates: Record<string, string[]> = {
  tech: [
    "Jullie zijn allebei tech-enthousiastelingen. Wat is het meest spannende project waar je momenteel aan werkt?",
    "Als developers delen jullie de passie voor code. Welke technologie wil je dit jaar nog leren?",
    "Jullie hebben beide een technische achtergrond. Hoe zie je de toekomst van AI in jullie vakgebied?",
  ],
  design: [
    "Jullie delen een oog voor design. Wat inspireert jullie creatieve proces het meest?",
    "Als designers: welk recent project of merk heeft jullie visueel echt geraakt?",
    "Jullie beiden hebben een designachtergrond. Hoe balanceren jullie esthetiek met functionaliteit?",
  ],
  business: [
    "Jullie hebben beiden een zakelijke inslag. Wat is de belangrijkste les die je recent hebt geleerd?",
    "Als professionals in business: wat is jullie grootste uitdaging momenteel?",
    "Jullie delen interesse in strategie. Welke trends volgen jullie op dit moment?",
  ],
  creative: [
    "Jullie zijn beiden creatieve geesten. Waar haal je je inspiratie vandaan?",
    "Als creatieven: welk project zou je starten als geld geen rol speelde?",
    "Jullie delen een passie voor creatie. Hoe komen jullie tot de beste ideeën?",
  ],
  ai: [
    "Jullie zijn allebei gepassioneerd door AI-innovatie. Misschien een interessant onderwerp voor bij de koffie?",
    "AI is een gemeenschappelijke interesse. Welke applicatie van AI fascineert jullie het meest?",
    "Jullie delen een interesse in kunstmatige intelligentie. Hoe zien jullie de impact op jullie werk?",
  ],
};

// Topic templates based on shared skills
const topicTemplates: Record<string, string[]> = {
  React: [
    "Welke state management oplossing prefereer je en waarom?",
    "Wat is je mening over Server Components?",
    "Hoe pak je testing aan in je React projecten?",
  ],
  "AI/ML": [
    "Welke AI-tool heeft je workflow het meest veranderd?",
    "Hoe zie je de rol van AI in [jullie vakgebied]?",
    "Welke ethische overwegingen vind je belangrijk bij AI?",
  ],
  "UX Design": [
    "Hoe valideer je design beslissingen met gebruikers?",
    "Welke design trend vind je overgewaardeerd?",
    "Hoe balanceer je gebruikerswensen met business doelen?",
  ],
  Marketing: [
    "Welk kanaal levert voor jou de beste resultaten?",
    "Hoe meet je de impact van je campagnes?",
    "Welke marketingtrend volg je met interesse?",
  ],
  Python: [
    "Welke Python libraries gebruik je het meest?",
    "Hoe organiseer je je Python projecten?",
    "Wat is je favoriete Python use case?",
  ],
  TypeScript: [
    "Hoe streng configureer je je TypeScript projecten?",
    "Welke TypeScript feature gebruik je het meest?",
    "Hoe ga je om met complexe type definities?",
  ],
  Figma: [
    "Hoe organiseer je je design systemen in Figma?",
    "Welke plugins zijn onmisbaar voor je workflow?",
    "Hoe werk je samen met developers vanuit Figma?",
  ],
  Branding: [
    "Wat maakt een merk echt memorabel voor jou?",
    "Hoe ontwikkel je een consistente merkidentiteit?",
    "Welk merk inspireert je het meest en waarom?",
  ],
  "Node.js": [
    "Welk framework prefereer je voor backend development?",
    "Hoe handel je error handling in je Node apps?",
    "Wat is je strategie voor API design?",
  ],
};

// Skill categories for matching
const skillCategories: Record<string, string[]> = {
  tech: ["React", "TypeScript", "Python", "Node.js", "JavaScript", "Go", "Rust"],
  design: ["UX Design", "Figma", "Prototyping", "User Research", "UI Design"],
  business: ["Marketing", "Branding", "Copywriting", "Strategy", "Sales"],
  ai: ["AI/ML", "Machine Learning", "Data Science", "NLP", "Computer Vision"],
  creative: ["Copywriting", "Branding", "Content", "Photography", "Video"],
};

function getSkillCategory(skill: string): string {
  for (const [category, skills] of Object.entries(skillCategories)) {
    if (skills.some((s) => skill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(skill.toLowerCase()))) {
      return category;
    }
  }
  return "general";
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function calculateMatchScore(
  userA: { skills: string[]; labId?: string },
  userB: { skills: string[]; labId?: string }
): MatchAnalysis {
  const skillsA = new Set(userA.skills.map((s) => s.toLowerCase()));
  const skillsB = new Set(userB.skills.map((s) => s.toLowerCase()));

  // Find shared skills
  const sharedSkills: string[] = [];
  userA.skills.forEach((skill) => {
    if (skillsB.has(skill.toLowerCase())) {
      sharedSkills.push(skill);
    }
  });

  // Find unique skills
  const uniqueSkillsA = userA.skills.filter((s) => !skillsB.has(s.toLowerCase()));
  const uniqueSkillsB = userB.skills.filter((s) => !skillsA.has(s.toLowerCase()));

  // Check same location
  const sameLocation = Boolean(userA.labId && userB.labId && userA.labId === userB.labId);

  // Calculate base score from skill overlap
  const totalUniqueSkills = new Set([...skillsA, ...skillsB]).size;
  const overlapRatio = totalUniqueSkills > 0 ? sharedSkills.length / totalUniqueSkills : 0;
  
  // Score calculation: overlap (60%) + shared count bonus (20%) + location bonus (20%)
  let score = overlapRatio * 60;
  score += Math.min(sharedSkills.length * 5, 20); // Max 20 points for shared skills
  score += sameLocation ? 20 : 0;
  score = Math.min(Math.round(score), 100);

  // Determine primary category for icebreaker
  const categories = sharedSkills.map(getSkillCategory);
  const categoryCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  const primaryCategory = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "tech";

  // Get icebreaker
  const icebreakers = icebreakerTemplates[primaryCategory] || icebreakerTemplates.tech;
  const icebreaker = getRandomItem(icebreakers);

  // Generate topics based on shared skills
  const topics: string[] = [];
  sharedSkills.forEach((skill) => {
    const skillTopics = topicTemplates[skill];
    if (skillTopics) {
      topics.push(getRandomItem(skillTopics));
    }
  });

  // Fill with general topics if needed
  while (topics.length < 3) {
    const generalTopics = [
      "Wat is het meest interessante project waar je momenteel aan werkt?",
      "Hoe ben je in dit vakgebied terechtgekomen?",
      "Welke skill wil je dit jaar nog ontwikkelen?",
      "Wat is de beste carrière-advies die je ooit hebt gekregen?",
      "Hoe blijf je op de hoogte van ontwikkelingen in je vakgebied?",
    ];
    const topic = getRandomItem(generalTopics);
    if (!topics.includes(topic)) {
      topics.push(topic);
    }
  }

  return {
    score,
    sharedSkills,
    uniqueSkillsA,
    uniqueSkillsB,
    sameLocation,
    icebreaker,
    topics: topics.slice(0, 3),
  };
}

export function getMatchScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Perfect Match", color: "text-primary" };
  if (score >= 75) return { label: "Geweldige Match", color: "text-primary" };
  if (score >= 60) return { label: "Goede Match", color: "text-primary/80" };
  if (score >= 40) return { label: "Interessante Match", color: "text-muted-foreground" };
  return { label: "Nieuwe Connectie", color: "text-muted-foreground" };
}
