export interface GuestbookMessage {
  id: string;
  name: string;
  relation: string;
  message: string;
  likes: number;
  createdAt: string;
  avatarColor: string;
}

export interface RsvpData {
  id?: string;
  fullName: string;
  phone?: string;
  email?: string;
  attending: 'yes' | 'no';
  additionalGuestsCount: number; // Number of extra companions
  totalAttendeesCount: number;  // 1 (self) + additionalGuestsCount if attending === 'yes', else 0
  companionNames: string[];     // Array of individual companion names
  dietaryRestrictions: string[];
  dietaryOther?: string;
  songRequest?: string;
  loveMessage?: string;         // Optional dedication to Luz & Julio
  passcodeUsed?: string;
  confirmedAt: string;
}

export interface AccessPasscode {
  id: string;
  code: string;
  guestName: string;
  maxCompanions: number;
  notes?: string;
  usedCount: number;
  createdAt: string;
}

export interface BibleVerse {
  id: string;
  text: string;
  reference: string;
  theme: string;
}
