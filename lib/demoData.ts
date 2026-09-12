import { Group, Habit, Task } from "./types";
import { dayKey, daysAgo } from "./date";

export const DEMO_GROUPS: Group[] = [
  { id: "demo-work", name: "Work", color: "#3E5C8A", soft: "#DCE4F0" },
  { id: "demo-life", name: "Life", color: "#6B7F4F", soft: "#E4EADB" },
  { id: "demo-side", name: "Side Project", color: "#8A5FA6", soft: "#8A5FA622" },
];

const WORK = "demo-work";
const LIFE = "demo-life";
const SIDE = "demo-side";

// completedDaysAgo: null for a still-open task. createdAt trails completion
// by a day so timestamps stay plausible without needing to be exact.
const DEMO_TASK_SEED: { title: string; groupId: string; completedDaysAgo: number | null }[] = [
  { title: "Review Q3 roadmap feedback", groupId: WORK, completedDaysAgo: 0 },
  { title: "Water the plants", groupId: LIFE, completedDaysAgo: 0 },
  { title: "Sync with design on onboarding flow", groupId: WORK, completedDaysAgo: 1 },
  { title: "Fix mobile nav overflow bug", groupId: SIDE, completedDaysAgo: 1 },
  { title: "Call mom", groupId: LIFE, completedDaysAgo: 2 },
  { title: "Prep slides for Monday standup", groupId: WORK, completedDaysAgo: 3 },
  { title: "Grocery run", groupId: LIFE, completedDaysAgo: 3 },
  { title: "Write project README", groupId: SIDE, completedDaysAgo: 4 },
  { title: "Reply to client email thread", groupId: WORK, completedDaysAgo: 5 },
  { title: "Plan weekend hike", groupId: LIFE, completedDaysAgo: 6 },
  { title: "Set up CI pipeline", groupId: SIDE, completedDaysAgo: 9 },
  { title: "Draft Q3 roadmap doc", groupId: WORK, completedDaysAgo: 12 },
  { title: "Book dentist appointment", groupId: LIFE, completedDaysAgo: 15 },
  { title: "Sketch landing page wireframe", groupId: SIDE, completedDaysAgo: 20 },
  { title: "Review PR feedback", groupId: WORK, completedDaysAgo: null },
  { title: "Draft investor update", groupId: WORK, completedDaysAgo: null },
  { title: "Plan Sunday dinner", groupId: LIFE, completedDaysAgo: null },
  { title: "Renew car registration", groupId: LIFE, completedDaysAgo: null },
  { title: "Add dark mode toggle", groupId: SIDE, completedDaysAgo: null },
];

// Fresh Task objects each call, timestamps relative to now, so the demo
// heatmap/streak/recap always look current instead of frozen to build time.
export function buildDemoTasks(): Task[] {
  return DEMO_TASK_SEED.map((seed, i) => ({
    id: `demo-task-${i}`,
    title: seed.title,
    groupId: seed.groupId,
    createdAt: daysAgo((seed.completedDaysAgo ?? 0) + 1).toISOString(),
    completedAt: seed.completedDaysAgo === null ? null : daysAgo(seed.completedDaysAgo).toISOString(),
    order: i,
  }));
}

const DEMO_HABIT_SEED: { name: string; color: string; completedDaysAgo: number[] }[] = [
  { name: "Morning run", color: "#A6613C", completedDaysAgo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 16, 18, 21, 24, 27] },
  { name: "Read 20 minutes", color: "#4B7B8C", completedDaysAgo: [0, 1, 2, 3, 5, 6, 9, 10, 11, 15, 19, 23, 28] },
  { name: "Stretch before bed", color: "#4F7F6F", completedDaysAgo: [1, 2, 4, 5, 6, 9, 12, 13, 14, 20, 25] },
];

export function buildDemoHabits(): Habit[] {
  return DEMO_HABIT_SEED.map((seed, i) => ({
    id: `demo-habit-${i}`,
    name: seed.name,
    color: seed.color,
    createdAt: daysAgo(30).toISOString(),
    completions: seed.completedDaysAgo.map((n) => dayKey(daysAgo(n))),
  }));
}
