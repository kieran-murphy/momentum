"use client";

import AddHabit from "@/components/AddHabit";
import HabitItem from "@/components/HabitItem";
import { useHabitStore } from "@/lib/useHabitStore";

export default function HabitsPage() {
  const { habits, hydrated, addHabit, updateHabitName, deleteHabit, toggleToday } = useHabitStore();

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
      <div className="animate-slide-up">
        <h1 className="font-display text-xl font-semibold text-ink dark:text-ink">Habits</h1>
        <p className="mt-1 font-body text-sm text-muted dark:text-muted">Small things, done daily.</p>
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
              onToggleToday={toggleToday}
              onUpdateName={updateHabitName}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
