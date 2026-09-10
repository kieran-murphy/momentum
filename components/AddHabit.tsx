"use client";

import { useState } from "react";

export default function AddHabit({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function submit() {
    if (!name.trim()) return;
    onAdd(name);
    setName("");
  }

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2 shadow-sm transition-all animate-slide-up dark:border-line dark:bg-surface ${
        isFocused ? "border-ink/30 shadow-md dark:border-ink/30 dark:shadow-md" : ""
      }`}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add a habit and press Enter"
        className="min-w-0 flex-1 bg-transparent px-2 py-2 font-body text-[15px] text-ink placeholder:text-muted focus:outline-none dark:text-ink dark:placeholder:text-muted"
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
