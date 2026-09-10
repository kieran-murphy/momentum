"use client";

import { useState } from "react";
import { Habit } from "@/lib/types";
import { habitBestStreak, habitStreak, isDoneToday, recentHistory } from "@/lib/habits";
import { formatDayLabel } from "@/lib/date";
import Burst from "./Burst";

export default function HabitItem({
  habit,
  onToggleToday,
  onDelete,
}: {
  habit: Habit;
  onToggleToday: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showBurst, setShowBurst] = useState(false);
  const doneToday = isDoneToday(habit);
  const streak = habitStreak(habit);
  const best = habitBestStreak(habit);
  const history = recentHistory(habit, 14);

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-ink/20 animate-slide-up dark:border-line dark:bg-surface dark:hover:border-ink/20">
      <button
        onClick={() => {
          if (!doneToday) setShowBurst(true);
          onToggleToday(habit.id);
        }}
        aria-pressed={doneToday}
        aria-label={doneToday ? `Mark "${habit.name}" as not done today` : `Mark "${habit.name}" as done today`}
        className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all"
        style={{
          borderColor: habit.color,
          backgroundColor: doneToday ? habit.color : "transparent",
        }}
      >
        {doneToday && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-surface" fill="none">
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {showBurst && <Burst color={habit.color} onDone={() => setShowBurst(false)} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-body text-[15px] text-ink dark:text-ink">{habit.name}</span>
          {streak > 0 && (
            <span
              className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[11px]"
              style={{ backgroundColor: habit.color + "22", color: habit.color }}
            >
              {streak}d streak
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-[3px]">
          {history.map((d) => (
            <span
              key={d.key}
              title={`${formatDayLabel(d.date)}${d.done ? " — done" : ""}`}
              className="h-2.5 w-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: d.done ? habit.color : "var(--color-line)" }}
            />
          ))}
        </div>
      </div>

      {best > 0 && (
        <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline-block dark:text-muted">
          best {best}d
        </span>
      )}

      <button
        onClick={() => onDelete(habit.id)}
        aria-label={`Delete "${habit.name}"`}
        className="ml-1 shrink-0 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100 text-muted"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
