"use client";

import { useMemo, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { ACCENT_PALETTE, ACCENT_PALETTE_NAMES, Habit } from "@/lib/types";

export default function AddHabit({ habits, onAdd }: { habits: Habit[]; onAdd: (name: string, color: string) => void }) {
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [colorOverride, setColorOverride] = useState<string | null>(null);

  // Suggests the first palette color no existing habit is already using, so
  // new habits default to standing out from the ones already in the list.
  const suggestedColor = useMemo(() => {
    const used = new Set(habits.map((h) => h.color));
    return ACCENT_PALETTE.find((c) => !used.has(c)) ?? ACCENT_PALETTE[habits.length % ACCENT_PALETTE.length];
  }, [habits]);
  const color = colorOverride ?? suggestedColor;

  function submit() {
    if (!name.trim()) return;
    onAdd(name, color);
    setName("");
    setColorOverride(null);
  }

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2 shadow-sm transition-all animate-slide-up dark:border-line dark:bg-surface ${
        isFocused ? "border-ink/30 shadow-md dark:border-ink/30 dark:shadow-md" : ""
      }`}
    >
      <Dropdown
        value={color}
        onChange={setColorOverride}
        ariaLabel="Habit color"
        className="shrink-0"
        sections={[
          {
            options: ACCENT_PALETTE.map((c) => ({ value: c, label: ACCENT_PALETTE_NAMES[c], color: c })),
          },
        ]}
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add a habit and press Enter"
        className="min-w-0 flex-1 bg-transparent px-2 py-2 font-body text-base text-ink placeholder:text-muted focus:outline-none dark:text-ink dark:placeholder:text-muted"
      />
      <button
        onClick={submit}
        className="shrink-0 rounded-lg bg-ink px-4 py-2 font-body text-sm font-medium text-paper transition-all active:scale-95 active:brightness-110 hover:shadow-sm dark:bg-ink dark:text-paper"
      >
        Add
      </button>
    </div>
  );
}
