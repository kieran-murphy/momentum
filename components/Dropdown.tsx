"use client";

import { Fragment, useEffect, useRef, useState } from "react";

export type DropdownOption = { value: string; label: string; color?: string };
export type DropdownSection = { label?: string; options: DropdownOption[] };

export default function Dropdown({
  value,
  sections,
  onChange,
  ariaLabel,
  className = "",
}: {
  value: string;
  sections: DropdownSection[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<HTMLButtonElement[]>([]);
  optionRefs.current = [];

  const current = sections.flatMap((s) => s.options).find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) optionRefs.current[0]?.focus();
  }, [open]);

  function select(v: string) {
    onChange(v);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveFocus(from: number, delta: number) {
    const count = optionRefs.current.length;
    const next = (from + delta + count) % count;
    optionRefs.current[next]?.focus();
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex items-center gap-2 rounded-lg border border-line bg-paper py-1.5 pl-3 pr-2.5 font-body text-base text-ink transition-colors hover:border-ink/20 focus:outline-none dark:border-line dark:bg-paper dark:text-ink"
      >
        {current?.color && (
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: current.color }} />
        )}
        <span className="truncate">{current?.label ?? value}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-muted transition-transform dark:text-muted ${open ? "rotate-180" : ""}`}
        >
          <path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
          className="absolute right-0 z-10 mt-1.5 min-w-full overflow-hidden whitespace-nowrap rounded-lg border border-line bg-paper py-1 shadow-md animate-slide-down dark:border-line dark:bg-paper dark:shadow-md"
        >
          {sections.map((section, si) => (
            <Fragment key={section.label ?? si}>
              {section.label && (
                <li
                  role="presentation"
                  className="px-3 pb-1 pt-2 font-body text-[11px] font-medium uppercase tracking-wide text-muted dark:text-muted"
                >
                  {section.label}
                </li>
              )}
              {section.options.map((option) => {
                const selected = option.value === value;
                return (
                  <li key={option.value} role="option" aria-selected={selected}>
                    <button
                      ref={(el) => {
                        if (el) optionRefs.current.push(el);
                      }}
                      type="button"
                      onClick={() => select(option.value)}
                      onKeyDown={(e) => {
                        const idx = optionRefs.current.indexOf(e.currentTarget);
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          moveFocus(idx, 1);
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          moveFocus(idx, -1);
                        }
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left font-body text-base transition-colors hover:bg-ink/5 focus:bg-ink/5 focus:outline-none ${
                        selected ? "font-medium text-ink" : "text-ink/80"
                      }`}
                    >
                      {option.color && (
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="truncate">{option.label}</span>
                    </button>
                  </li>
                );
              })}
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
