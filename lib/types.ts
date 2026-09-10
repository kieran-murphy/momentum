export type Group = {
  id: string;
  name: string;
  color: string; // hex
  soft: string; // hex, light background variant
};

export type Task = {
  id: string;
  title: string;
  groupId: string;
  createdAt: string; // ISO
  completedAt: string | null; // ISO or null
  order: number; // manual sort position within its group; lower shows first
};

export type Habit = {
  id: string;
  name: string;
  color: string; // hex
  createdAt: string; // ISO
  completions: string[]; // day keys ("YYYY-MM-DD") marked done
};

export const DEFAULT_GROUPS: Group[] = [
  { id: "work", name: "Work", color: "#3E5C8A", soft: "#DCE4F0" },
  { id: "life", name: "Life", color: "#6B7F4F", soft: "#E4EADB" },
];

export const ACCENT_PALETTE = ["#A6613C", "#4B7B8C", "#8A5FA6", "#B0793F", "#4F7F6F"];
