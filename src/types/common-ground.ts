export type UserStatus = "focus" | "open" | "invisible";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  status: UserStatus;
  checkedInAt: string;
  labId?: string;
}

export interface AggregatedSkill {
  name: string;
  count: number;
  users: UserProfile[];
}
