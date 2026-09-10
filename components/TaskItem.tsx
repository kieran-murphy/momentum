"use client";

import { useState, type LiHTMLAttributes } from "react";
import { Group, Task } from "@/lib/types";
import Burst from "./Burst";

export default function TaskItem({
  task,
  group,
  onToggle,
  onDelete,
  dragProps,
  isDragging,
  isDragOver,
}: {
  task: Task;
  group: Group | undefined;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  dragProps?: LiHTMLAttributes<HTMLLIElement>;
  isDragging?: boolean;
  isDragOver?: boolean;
}) {
  const [showBurst, setShowBurst] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const color = group?.color ?? "#6B6A5E";
  const isDone = Boolean(task.completedAt);

  const handleDelete = (id: string) => {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    setIsExiting(true);
    setTimeout(() => onDelete(id), 250);
  };

  return (
    <li
      {...dragProps}
      className={`group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-all hover:border-ink/20 dark:border-line dark:bg-surface dark:hover:border-ink/20 ${
        isExiting ? "animate-fade-out" : "animate-slide-up"
      } ${isDragging ? "opacity-40" : ""} ${isDragOver ? "ring-2 ring-ink/20 dark:ring-ink/20" : ""}`}
    >
      <span
        aria-hidden="true"
        className="shrink-0 cursor-grab text-line transition-colors hover:text-muted active:cursor-grabbing dark:text-line dark:hover:text-muted"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
          <circle cx="5" cy="4" r="1.3" />
          <circle cx="5" cy="8" r="1.3" />
          <circle cx="5" cy="12" r="1.3" />
          <circle cx="11" cy="4" r="1.3" />
          <circle cx="11" cy="8" r="1.3" />
          <circle cx="11" cy="12" r="1.3" />
        </svg>
      </span>

      <button
        onClick={() => {
          if (!isDone) setShowBurst(true);
          onToggle(task.id);
        }}
        aria-pressed={isDone}
        aria-label={isDone ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all"
        style={{
          borderColor: color,
          backgroundColor: isDone ? color : "transparent",
        }}
      >
        {isDone && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-surface" fill="none">
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {showBurst && <Burst color={color} onDone={() => setShowBurst(false)} />}
      </button>

      <span
        className={`flex-1 font-body text-[15px] ${
          isDone ? "text-muted line-through decoration-2 dark:text-muted" : "text-ink dark:text-ink"
        }`}
      >
        {task.title}
      </span>

      <span
        className="hidden rounded-full px-2 py-0.5 font-body text-xs sm:inline-block"
        style={{ backgroundColor: group?.soft ?? "#EEE", color }}
      >
        {group?.name ?? "—"}
      </span>

      <button
        onClick={() => handleDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
        className="ml-1 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100 text-muted"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
