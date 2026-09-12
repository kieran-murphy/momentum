import { Group, Task } from "./types";
import { dayKey, daysAgo, endOfWeek, startOfDay, startOfWeek } from "./date";

export type DayCell = {
  date: Date;
  key: string;
  countsByGroup: Record<string, number>;
  total: number;
  // False for padding days outside the requested range (an adjacent month's
  // days when viewing a single month, or the extra days used to complete a
  // calendar week at either end of a rolling range) — the UI renders these
  // as non-interactive filler so real weeks stay properly aligned.
  inRange: boolean;
};

function countsByDay(tasks: Task[]): Map<string, Record<string, number>> {
  const byDay = new Map<string, Record<string, number>>();
  for (const t of tasks) {
    if (!t.completedAt) continue;
    const k = dayKey(new Date(t.completedAt));
    const entry = byDay.get(k) ?? {};
    entry[t.groupId] = (entry[t.groupId] ?? 0) + 1;
    byDay.set(k, entry);
  }
  return byDay;
}

function buildDayCells(byDay: Map<string, Record<string, number>>, gridStart: Date, gridEnd: Date, isInRange: (d: Date) => boolean): DayCell[] {
  const cells: DayCell[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= gridEnd) {
    const k = dayKey(cursor);
    const countsByGroup = byDay.get(k) ?? {};
    const total = Object.values(countsByGroup).reduce((a, b) => a + b, 0);
    cells.push({
      date: new Date(cursor),
      key: k,
      countsByGroup,
      total,
      inRange: isInRange(cursor),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

// Builds a calendar-grid view of a single month: the target month's days,
// padded at both ends to complete whole weeks (Sun-Sat), so columns line up
// as real calendar weeks.
export function buildMonthHeatmap(tasks: Task[], groups: Group[], monthStart: Date): DayCell[] {
  const month = monthStart.getMonth();
  const firstOfMonth = new Date(monthStart.getFullYear(), month, 1);
  const lastOfMonth = new Date(monthStart.getFullYear(), month + 1, 0);
  return buildDayCells(countsByDay(tasks), startOfWeek(firstOfMonth), endOfWeek(lastOfMonth), (d) => d.getMonth() === month);
}

// Builds a rolling window of the last `days` days, inclusive of today.
// `days` should be a multiple of 7 — with no remainder to pad away, the
// window divides evenly into whole weeks on its own, so today always lands
// as the very last cell instead of being trailed by blank filler.
export function buildRecentHeatmap(tasks: Task[], groups: Group[], days: number): DayCell[] {
  const rangeEnd = startOfDay(new Date());
  const rangeStart = daysAgo(days - 1);
  return buildDayCells(countsByDay(tasks), rangeStart, rangeEnd, () => true);
}

export type MonthOption = { key: string; label: string; start: Date };

// Months selectable in the heatmap's month picker: the current month, plus
// every earlier month that has at least one completed task, so the list
// stays short instead of listing years of empty history.
export function listMonthOptions(tasks: Task[]): MonthOption[] {
  const now = new Date();
  const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let earliest = currentStart;
  for (const t of tasks) {
    if (!t.completedAt) continue;
    const d = new Date(t.completedAt);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    if (monthStart < earliest) earliest = monthStart;
  }

  const options: MonthOption[] = [];
  const cursor = new Date(currentStart);
  while (cursor >= earliest) {
    options.push({
      key: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
      label: cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      start: new Date(cursor),
    });
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return options;
}

// A day's cell is a flat intensity color rather than a per-group split —
// the click-to-expand breakdown is where per-group detail actually lives.
// Uses CSS custom properties (not hardcoded hex) so it adapts in dark mode.
export function cellColor(cell: DayCell): string {
  return cell.total === 0 ? "var(--color-line)" : "var(--color-gold)";
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
