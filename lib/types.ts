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

// Single source of truth for accent colors (group/habit auto-assignment and
// the habit color picker) — kept muted/earthy to match the app's palette.
const ACCENT_COLORS: { hex: string; name: string }[] = [
  { hex: "#A6613C", name: "Terracotta" },
  { hex: "#B0793F", name: "Ochre" },
  { hex: "#8C9B4F", name: "Olive" },
  { hex: "#4F7F6F", name: "Pine" },
  { hex: "#4B8C82", name: "Jade" },
  { hex: "#4B7B8C", name: "Teal" },
  { hex: "#5B6FA6", name: "Slate" },
  { hex: "#8A5FA6", name: "Purple" },
  { hex: "#A65B7A", name: "Mauve" },
  { hex: "#A65B5B", name: "Wine" },
];

export const ACCENT_PALETTE = ACCENT_COLORS.map((c) => c.hex);
export const ACCENT_PALETTE_NAMES: Record<string, string> = Object.fromEntries(
  ACCENT_COLORS.map((c) => [c.hex, c.name])
);
