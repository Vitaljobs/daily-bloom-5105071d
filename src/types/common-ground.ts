export type UserStatus = "focus" | "open";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  status: UserStatus;
  checkedInAt: string;
}

export interface AggregatedSkill {
  name: string;
  count: number;
  users: UserProfile[];
}
