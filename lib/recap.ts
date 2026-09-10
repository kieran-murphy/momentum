import { Group, Task } from "./types";
import { dayKey, daysAgo, startOfWeek } from "./date";

export type DayCell = {
  date: Date;
  key: string;
  countsByGroup: Record<string, number>;
  total: number;
};

export function buildHeatmap(tasks: Task[], groups: Group[], weeks = 12): DayCell[] {
  const days: DayCell[] = [];
  const totalDays = weeks * 7;

  const byDay = new Map<string, Record<string, number>>();
  for (const t of tasks) {
    if (!t.completedAt) continue;
    const k = dayKey(new Date(t.completedAt));
    const entry = byDay.get(k) ?? {};
    entry[t.groupId] = (entry[t.groupId] ?? 0) + 1;
    byDay.set(k, entry);
  }

  const start = daysAgo(totalDays - 1);
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const k = dayKey(d);
    const countsByGroup = byDay.get(k) ?? {};
    const total = Object.values(countsByGroup).reduce((a, b) => a + b, 0);
    days.push({ date: d, key: k, countsByGroup, total });
  }
  return days;
}

export function cellGradient(cell: DayCell, groups: Group[]): string {
  if (cell.total === 0) return "#E1DFD3";
  const parts: string[] = [];
  let acc = 0;
  for (const g of groups) {
    const count = cell.countsByGroup[g.id] ?? 0;
    if (count === 0) continue;
    const slice = (count / cell.total) * 360;
    parts.push(`${g.color} ${acc}deg ${acc + slice}deg`);
    acc += slice;
  }
  if (parts.length === 0) return "#E1DFD3";
  if (parts.length === 1) return parts[0].split(" ")[0];
  return `conic-gradient(${parts.join(", ")})`;
}

export function currentStreak(tasks: Task[]): number {
  const completedDays = new Set(
    tasks.filter((t) => t.completedAt).map((t) => dayKey(new Date(t.completedAt as string)))
  );
  let streak = 0;
  let cursor = new Date();
  // allow today to be empty (day in progress) without breaking the streak
  if (!completedDays.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (completedDays.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function recapStats(tasks: Task[]) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const completed = tasks.filter((t) => t.completedAt);

  const today = completed.filter((t) => dayKey(new Date(t.completedAt as string)) === dayKey(now)).length;
  const thisWeek = completed.filter((t) => new Date(t.completedAt as string) >= weekStart).length;
  const allTime = completed.length;
  const streak = currentStreak(tasks);

  return { today, thisWeek, allTime, streak };
}

export function groupBreakdown(tasks: Task[], groups: Group[]) {
  const completed = tasks.filter((t) => t.completedAt);
  return groups.map((g) => ({
    group: g,
    count: completed.filter((t) => t.groupId === g.id).length,
  }));
}
