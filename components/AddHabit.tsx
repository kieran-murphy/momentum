"use client";

import { useMemo, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { ACCENT_PALETTE, ACCENT_PALETTE_NAMES, Habit } from "@/lib/types";

export default function AddHabit({ habits, onAdd }: { habits: Habit[]; onAdd: (name: string, color: string) => void }) {
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [colorOverride, setColorOverride] = useState<string | null>(null);

  // A color already worn by an existing habit is off the table until that
  // habit is deleted and frees it back up — unless every color is taken, in
  // which case the picker falls back to the full palette rather than being empty.
  const availableColors = useMemo(() => {
    const used = new Set(habits.map((h) => h.color));
    const unused = ACCENT_PALETTE.filter((c) => !used.has(c));
    return unused.length > 0 ? unused : ACCENT_PALETTE;
  }, [habits]);
  const suggestedColor = availableColors[0];
  const color = colorOverride && availableColors.includes(colorOverride) ? colorOverride : suggestedColor;

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
            options: availableColors.map((c) => ({ value: c, label: ACCENT_PALETTE_NAMES[c], color: c, hideLabel: true })),
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
