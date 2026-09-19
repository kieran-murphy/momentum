"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ACCENT_PALETTE, Habit } from "./types";
import { readLocal, writeLocal } from "./storage";
import { useDataSource } from "./dataSource";
import { buildDemoHabits } from "./demoData";

const HABITS_KEY = "todo.habits.v1";

export function useHabitStore() {
  const [dataSource, setDataSource] = useDataSource();
  // Includes soft-deleted habits so their completions keep counting in Recap.
  const [allHabits, setHabits] = useState<Habit[]>([]);
  const habits = useMemo(() => allHabits.filter((h) => !h.deletedAt), [allHabits]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHabits(dataSource === "demo" ? buildDemoHabits() : readLocal<Habit[]>(HABITS_KEY, []));
    setHydrated(true);
  }, [dataSource]);

  useEffect(() => {
    if (hydrated && dataSource === "local") writeLocal(HABITS_KEY, allHabits);
  }, [allHabits, hydrated, dataSource]);

  const addHabit = useCallback((name: string, color?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => {
      const usedColors = new Set(prev.map((h) => h.color));
      const resolvedColor =
        color ?? ACCENT_PALETTE.find((c) => !usedColors.has(c)) ?? ACCENT_PALETTE[prev.length % ACCENT_PALETTE.length];
      const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
      return [...prev, { id, name: trimmed, color: resolvedColor, createdAt: new Date().toISOString(), completions: [] }];
    });
  }, []);

  const updateHabitName = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name: trimmed } : h)));
  }, []);

  // A habit with completions is kept as a hidden record so Recap history is
  // permanent; one that was never completed has nothing to preserve.
  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.flatMap((h) => {
        if (h.id !== id) return [h];
        if (h.completions.length === 0) return [];
        return [{ ...h, deletedAt: new Date().toISOString() }];
      })
    );
  }, []);

  const toggleCompletion = useCallback((id: string, key: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completions.includes(key);
        return {
          ...h,
          completions: done ? h.completions.filter((d) => d !== key) : [...h.completions, key],
        };
      })
    );
  }, []);

  return { habits, allHabits, hydrated, dataSource, setDataSource, addHabit, updateHabitName, deleteHabit, toggleCompletion };
}
