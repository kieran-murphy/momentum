"use client";

import { useEffect, useRef, useState } from "react";
import { Group } from "@/lib/types";

export default function GroupSelect({
  groups,
  value,
  onChange,
  onFocus,
  onBlur,
}: {
  groups: Group[];
  value: string;
  onChange: (id: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = groups.find((g) => g.id === value) ?? groups[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          onFocus?.();
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-w-[6.5rem] items-center gap-2 rounded-lg border border-line bg-paper py-2.5 pl-3 pr-2.5 font-body text-[15px] text-ink transition-all hover:border-ink/30 dark:border-line dark:bg-paper dark:text-ink dark:hover:border-ink/30"
      >
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: selected?.color ?? "var(--color-muted)" }}
        />
        <span className="flex-1 truncate text-left">{selected?.name}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Group"
          className="absolute left-0 top-[calc(100%+6px)] z-20 min-w-full overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-lg animate-slide-down dark:border-line dark:bg-surface"
        >
          {groups.map((g) => {
            const isSelected = g.id === selected?.id;
            return (
              <li key={g.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(g.id);
                    setOpen(false);
                    onBlur?.();
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left font-body text-[15px] transition-colors ${
                    isSelected ? "bg-paper text-ink dark:bg-paper dark:text-ink" : "text-ink hover:bg-paper dark:text-ink dark:hover:bg-paper"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="flex-1 truncate">{g.name}</span>
                  {isSelected && (
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-ink">
                      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
