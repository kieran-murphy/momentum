"use client";

import { useState } from "react";
import AddHabit from "@/components/AddHabit";
import HabitItem from "@/components/HabitItem";
import { useHabitStore } from "@/lib/useHabitStore";
import { dayKey, daysAgo } from "@/lib/date";

type DayChoice = "today" | "yesterday";

export default function HabitsPage() {
  const { habits, hydrated, addHabit, updateHabitName, deleteHabit, toggleCompletion } = useHabitStore();
  const [day, setDay] = useState<DayChoice>("today");
  const selectedKey = day === "today" ? dayKey(new Date()) : dayKey(daysAgo(1));

  if (!hydrated) {
    return <div className="font-body text-sm text-muted">Loading…</div>;
  }

  function handleDelete(id: string) {
    const habit = habits.find((h) => h.id === id);
    const hasHistory = (habit?.completions.length ?? 0) > 0;
    const message = hasHistory
      ? `Delete "${habit?.name}"? Its whole streak and history will be lost. This can't be undone.`
      : `Delete "${habit?.name}"? This can't be undone.`;
    if (!window.confirm(message)) return;
    deleteHabit(id);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3 animate-slide-up">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink dark:text-ink">Habits</h1>
          <p className="mt-1 font-body text-sm text-muted dark:text-muted">Small things, done daily.</p>
        </div>
        <div className="relative shrink-0">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value as DayChoice)}
            aria-label="Day to log habits for"
            className="appearance-none rounded-lg border border-line bg-paper py-1.5 pl-3 pr-8 font-body text-base text-ink focus:outline-none dark:border-line dark:bg-paper dark:text-ink"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted dark:text-muted"
          >
            <path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <AddHabit onAdd={addHabit} />

      {habits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center font-body text-sm text-muted animate-slide-up dark:border-line dark:text-muted">
          No habits yet. Add one above to start building a streak.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {habits.map((h) => (
            <HabitItem
              key={h.id}
              habit={h}
              dayKey={selectedKey}
              dayLabel={day}
              onToggleDay={toggleCompletion}
              onUpdateName={updateHabitName}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
