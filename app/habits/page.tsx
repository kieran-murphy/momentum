"use client";

import { useState } from "react";
import AddHabit from "@/components/AddHabit";
import Dropdown from "@/components/Dropdown";
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
        <Dropdown
          value={day}
          onChange={(v) => setDay(v as DayChoice)}
          ariaLabel="Day to log habits for"
          className="shrink-0"
          sections={[
            {
              options: [
                { value: "today", label: "Today" },
                { value: "yesterday", label: "Yesterday" },
              ],
            },
          ]}
        />
      </div>

      <AddHabit habits={habits} onAdd={addHabit} />

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
