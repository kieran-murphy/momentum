import { Habit } from "./types";
import { dayKey, daysAgo } from "./date";

export function isDoneOn(habit: Habit, key: string): boolean {
  return habit.completions.includes(key);
}

export function habitStreak(habit: Habit): number {
  const done = new Set(habit.completions);
  let streak = 0;
  const cursor = new Date();
  // allow today to be empty (day in progress) without breaking the streak
  if (!done.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (done.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function habitBestStreak(habit: Habit): number {
  const days = [...habit.completions].sort();
  let best = 0;
  let running = 0;
  let prev: Date | null = null;
  for (const key of days) {
    const d = new Date(key);
    if (prev) {
      const gapDays = Math.round((d.getTime() - prev.getTime()) / 86400000);
      running = gapDays === 1 ? running + 1 : 1;
    } else {
      running = 1;
    }
    best = Math.max(best, running);
    prev = d;
  }
  return best;
}

export type HabitDay = { date: Date; key: string; done: boolean };

export function recentHistory(habit: Habit, days = 30): HabitDay[] {
  const done = new Set(habit.completions);
  const out: HabitDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgo(i);
    const key = dayKey(date);
    out.push({ date, key, done: done.has(key) });
  }
  return out;
}
