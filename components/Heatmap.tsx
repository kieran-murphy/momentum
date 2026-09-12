"use client";

import { useMemo, useState } from "react";
import { Group, Habit, Task } from "@/lib/types";
import { DayCell, cellColor, listMonthOptions, buildMonthHeatmap, buildRecentHeatmap } from "@/lib/recap";
import { dayKey, formatDayLabel, weekdayLabel } from "@/lib/date";

const RECENT_DAYS = 70;

export default function Heatmap({ tasks, groups, habits }: { tasks: Task[]; groups: Group[]; habits: Habit[] }) {
  const [hovered, setHovered] = useState<DayCell | null>(null);
  const [selected, setSelected] = useState<DayCell | null>(null);

  const monthOptions = useMemo(() => listMonthOptions(tasks), [tasks]);
  const [rangeKey, setRangeKey] = useState("recent");
  // "recent" (the default) has no matching month option, so this falls back
  // to the rolling 70-day view whenever rangeKey isn't a real month key.
  const selectedMonth = monthOptions.find((o) => o.key === rangeKey);

  const days = useMemo(
    () => (selectedMonth ? buildMonthHeatmap(tasks, groups, selectedMonth.start) : buildRecentHeatmap(tasks, groups, RECENT_DAYS)),
    [tasks, groups, selectedMonth]
  );

  const weeks = useMemo(() => {
    const out: DayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7));
    return out;
  }, [days]);

  const groupById = useMemo(() => new Map(groups.map((g) => [g.id, g])), [groups]);

  const inRangeDays = days.filter((d) => d.inRange);
  const maxTotal = Math.max(1, ...inRangeDays.map((d) => d.total));
  const rangeTotal = inRangeDays.reduce((sum, d) => sum + d.total, 0);
  const activeDays = inRangeDays.filter((d) => d.total > 0).length;

  // Every week column is a real calendar week (Sun-Sat), so row index 0-6
  // maps to the same day of week in every column — read the label for each
  // row off the first column.
  const rowLabels = weeks[0]?.map((cell) => weekdayLabel(cell.date)) ?? [];

  // Hover previews whatever's under the cursor (desktop only); a tap pins a
  // day so its breakdown stays visible once the pointer moves away — the
  // only mechanism that actually works on a touch device.
  const displayed = hovered ?? selected;
  const displayedTasks = displayed
    ? tasks.filter((t) => t.completedAt && dayKey(new Date(t.completedAt)) === displayed.key)
    : [];
  const displayedHabits = displayed ? habits.filter((h) => h.completions.includes(displayed.key)) : [];

  // 70 days is an exact 10 columns and a month is at most 6, so one cell
  // size comfortably fits a phone-width card in both modes — see the mobile
  // overflow bug fixed earlier in this project for why that math matters.
  const cellClass = "h-5 w-5 rounded-[5px]";
  const cellGapClass = "gap-1.5";
  const labelClass = "h-5 w-7 text-[10px] leading-[20px]";

  function selectRange(key: string) {
    setRangeKey(key);
    setHovered(null);
    setSelected(null);
  }

  function toggleSelected(cell: DayCell) {
    setSelected((prev) => (prev?.key === cell.key ? null : cell));
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-4 animate-grid-fade dark:border-line dark:bg-surface">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-body text-sm font-medium text-ink dark:text-ink">Activity</h2>
          <p className="mt-0.5 font-mono text-xs text-muted dark:text-muted">
            {rangeTotal} completed{rangeTotal > 0 ? ` · ${activeDays} active day${activeDays === 1 ? "" : "s"}` : ""}
          </p>
        </div>
        <div className="relative">
          <select
            value={rangeKey}
            onChange={(e) => selectRange(e.target.value)}
            aria-label="Date range"
            className="appearance-none rounded-lg border border-line bg-paper py-1.5 pl-3 pr-8 font-body text-base text-ink focus:outline-none dark:border-line dark:bg-paper dark:text-ink"
          >
            <option value="recent">Past {RECENT_DAYS} days</option>
            <optgroup label="By month">
              {monthOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </optgroup>
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

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
        <div className={`flex ${cellGapClass}`}>
          <div className={`flex flex-col ${cellGapClass}`}>
            {rowLabels.map((label, i) => (
              <span key={i} className={`block text-right font-mono text-muted dark:text-muted ${labelClass}`}>
                {label}
              </span>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className={`flex flex-col ${cellGapClass}`}>
              {week.map((cell) => {
                if (!cell.inRange) {
                  return <div key={cell.key} aria-hidden="true" className={`${cellClass} bg-transparent`} />;
                }
                const scale = 0.25 + 0.75 * (cell.total / maxTotal);
                const isSelected = selected?.key === cell.key;
                return (
                  <button
                    key={cell.key}
                    onMouseEnter={() => setHovered(cell)}
                    onFocus={() => setHovered(cell)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => toggleSelected(cell)}
                    aria-pressed={isSelected}
                    aria-label={`${formatDayLabel(cell.date)}: ${cell.total} completed`}
                    className={`${cellClass} transition-all duration-200 hover:scale-125 focus:outline-none ${
                      isSelected ? "shadow-[0_0_2px_1px_var(--color-gold),0_0_6px_2px_var(--color-gold)]" : ""
                    }`}
                    style={{
                      background: cellColor(cell),
                      opacity: cell.total === 0 ? 1 : scale,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="w-full font-body text-xs text-muted transition-all duration-200 dark:text-muted sm:w-40 sm:shrink-0">
          {displayed ? (
            <div className="animate-slide-up">
              <div className="font-medium text-ink dark:text-ink">{formatDayLabel(displayed.date)}</div>
              {displayed.total === 0 ? (
                <div className="mt-1 font-mono">Nothing completed</div>
              ) : (
                <div className="mt-2 flex flex-col gap-2.5">
                  {displayedTasks.length > 0 && (
                    <div>
                      <div className="font-body text-[11px] font-medium text-muted dark:text-muted">Tasks</div>
                      <ul className="mt-1 flex flex-col gap-1">
                        {displayedTasks.map((t) => (
                          <li key={t.id} className="flex items-start gap-1.5 text-ink dark:text-ink">
                            <span
                              aria-hidden="true"
                              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: groupById.get(t.groupId)?.color ?? "#6B6A5E" }}
                            />
                            {t.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {displayedHabits.length > 0 && (
                    <div>
                      <div className="font-body text-[11px] font-medium text-muted dark:text-muted">Habits</div>
                      <ul className="mt-1 flex flex-col gap-1">
                        {displayedHabits.map((h) => (
                          <li key={h.id} className="flex items-start gap-1.5 text-ink dark:text-ink">
                            <span
                              aria-hidden="true"
                              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: h.color }}
                            />
                            {h.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>Tap a square to see that day's breakdown.</div>
          )}
        </div>
      </div>
    </div>
  );
}
