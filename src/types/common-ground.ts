export type UserStatus = "focus" | "open" | "invisible";

export type Industry = "tech" | "finance" | "creative" | "consulting" | "healthcare" | "education" | "other";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  status: UserStatus;
  checkedInAt: string;
  labId?: string;
  industry?: Industry;
  labVisits?: number; // For Local Guide badge
  preferredLanguage?: "nl" | "en";
}

export interface AggregatedSkill {
  name: string;
  count: number;
  users: UserProfile[];
}

export const industryLabels: Record<Industry, { nl: string; en: string }> = {
  tech: { nl: "Technologie", en: "Technology" },
  finance: { nl: "Financiën", en: "Finance" },
  creative: { nl: "Creatief", en: "Creative" },
  consulting: { nl: "Consultancy", en: "Consulting" },
  healthcare: { nl: "Gezondheidszorg", en: "Healthcare" },
  education: { nl: "Onderwijs", en: "Education" },
  other: { nl: "Overig", en: "Other" },
};
