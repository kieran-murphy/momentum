"use client";

import { useMemo, useState } from "react";
import { Group } from "@/lib/types";
import { DayCell, cellGradient } from "@/lib/recap";
import { formatDayLabel } from "@/lib/date";

export default function Heatmap({ days, groups }: { days: DayCell[]; groups: Group[] }) {
  const [hovered, setHovered] = useState<DayCell | null>(null);

  const weeks = useMemo(() => {
    const out: DayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7));
    return out;
  }, [days]);

  const maxTotal = Math.max(1, ...days.map((d) => d.total));

  return (
    <div className="rounded-xl border border-line bg-surface p-4 animate-grid-fade dark:border-line dark:bg-surface">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell) => {
                const scale = 0.55 + 0.45 * (cell.total / maxTotal);
                return (
                  <button
                    key={cell.key}
                    onMouseEnter={() => setHovered(cell)}
                    onFocus={() => setHovered(cell)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={`${formatDayLabel(cell.date)}: ${cell.total} completed`}
                    className="h-3.5 w-3.5 rounded-[3px] transition-all duration-200 hover:scale-150"
                    style={{
                      background: cellGradient(cell, groups),
                      opacity: cell.total === 0 ? 1 : scale,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="w-40 shrink-0 font-body text-xs text-muted transition-all duration-200 dark:text-muted">
          {hovered ? (
            <div className="animate-slide-up">
              <div className="font-medium text-ink dark:text-ink">{formatDayLabel(hovered.date)}</div>
              <div className="mt-1 font-mono">{hovered.total} done</div>
            </div>
          ) : (
            <div>Hover a square to see that day's breakdown.</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-3 dark:border-line">
        {groups.map((g) => (
          <div key={g.id} className="flex items-center gap-1.5 font-body text-xs text-muted dark:text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
}
