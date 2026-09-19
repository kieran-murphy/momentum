"use client";

import StatCards from "@/components/StatCards";
import Heatmap from "@/components/Heatmap";
import { useTaskStore } from "@/lib/useTaskStore";
import { useHabitStore } from "@/lib/useHabitStore";
import { recapStats } from "@/lib/recap";

export default function RecapPage() {
  const { allTasks: tasks, groups, hydrated: tasksHydrated } = useTaskStore();
  const { allHabits: habits, hydrated: habitsHydrated } = useHabitStore();

  if (!tasksHydrated || !habitsHydrated) {
    return <div className="font-body text-sm text-muted">Loading…</div>;
  }

  const stats = recapStats(tasks);
  const hasAny = tasks.some((t) => t.completedAt) || habits.some((h) => h.completions.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-slide-up">
        <h1 className="font-display text-xl font-semibold text-ink dark:text-ink">Recap</h1>
        <p className="mt-1 font-body text-sm text-muted dark:text-muted">What you've actually gotten done.</p>
      </div>

      <StatCards today={stats.today} thisWeek={stats.thisWeek} streak={stats.streak} allTime={stats.allTime} />

      {hasAny ? (
        <Heatmap tasks={tasks} groups={groups} habits={habits} />
      ) : (
        <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center font-body text-sm text-muted animate-slide-up dark:border-line dark:text-muted">
          Complete a task or habit to start seeing your recap here.
        </div>
      )}
    </div>
  );
}
