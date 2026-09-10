"use client";

import StatCards from "@/components/StatCards";
import Heatmap from "@/components/Heatmap";
import { useTaskStore } from "@/lib/useTaskStore";
import { buildHeatmap, groupBreakdown, recapStats } from "@/lib/recap";

export default function RecapPage() {
  const { tasks, groups, hydrated } = useTaskStore();

  if (!hydrated) {
    return <div className="font-body text-sm text-muted">Loading…</div>;
  }

  const stats = recapStats(tasks);
  const days = buildHeatmap(tasks, groups, 12);
  const breakdown = groupBreakdown(tasks, groups);
  const hasAny = tasks.some((t) => t.completedAt);

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-slide-up">
        <h1 className="font-display text-xl font-semibold text-ink dark:text-ink">Recap</h1>
        <p className="mt-1 font-body text-sm text-muted dark:text-muted">What you've actually gotten done.</p>
      </div>

      <StatCards today={stats.today} thisWeek={stats.thisWeek} streak={stats.streak} allTime={stats.allTime} />

      {hasAny ? (
        <>
          <Heatmap days={days} groups={groups} />

          <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 animate-card-entrance dark:border-line dark:bg-surface">
            <h2 className="font-body text-sm font-medium text-ink dark:text-ink">By group</h2>
            {breakdown.map(({ group, count }) => {
              const max = Math.max(1, ...breakdown.map((b) => b.count));
              return (
                <div 
                  key={group.id} 
                  className="flex items-center gap-3 animate-slide-up"
                >
                  <span className="w-16 shrink-0 font-body text-xs text-muted dark:text-muted">{group.name}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line dark:bg-line">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(count / max) * 100}%`, backgroundColor: group.color }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right font-mono text-xs text-ink dark:text-ink">{count}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center font-body text-sm text-muted animate-slide-up dark:border-line dark:text-muted">
          Complete a task to start seeing your recap here.
        </div>
      )}
    </div>
  );
}
