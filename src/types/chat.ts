import { UserProfile } from "@/types/common-ground";

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "location" | "coffee" | "timing" | "system";
  metadata?: {
    labName?: string;
    coffeeOffer?: boolean;
    minutes?: number;
  };
}

export interface ChatSession {
  id: string;
  participants: [string, string]; // User IDs
  messages: ChatMessage[];
  isActive: boolean;
  startedAt: Date;
  isTyping: Record<string, boolean>;
}

export type QuickReplyType = "location" | "coffee" | "timing" | "custom";

export interface QuickReply {
  id: string;
  type: QuickReplyType;
  label: string;
  icon: string;
  message?: string;
}

export const defaultQuickReplies: QuickReply[] = [
  {
    id: "location",
    type: "location",
    label: "Waar zit je?",
    icon: "📍",
  },
  {
    id: "coffee",
    type: "coffee",
    label: "Ik haal koffie!",
    icon: "☕",
  },
  {
    id: "timing-5",
    type: "timing",
    label: "5 min",
    icon: "⏱️",
    message: "Ben er over 5 minuten!",
  },
  {
    id: "timing-10",
    type: "timing",
    label: "10 min",
    icon: "⏱️",
    message: "Ben er over 10 minuten!",
  },
];
