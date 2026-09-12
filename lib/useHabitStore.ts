"use client";

import { useCallback, useEffect, useState } from "react";
import { ACCENT_PALETTE, Habit } from "./types";
import { readLocal, writeLocal } from "./storage";
import { dayKey } from "./date";

const HABITS_KEY = "todo.habits.v1";

export function useHabitStore() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHabits(readLocal<Habit[]>(HABITS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeLocal(HABITS_KEY, habits);
  }, [habits, hydrated]);

  const addHabit = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => {
      const usedColors = new Set(prev.map((h) => h.color));
      const color = ACCENT_PALETTE.find((c) => !usedColors.has(c)) ?? ACCENT_PALETTE[prev.length % ACCENT_PALETTE.length];
      const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
      return [...prev, { id, name: trimmed, color, createdAt: new Date().toISOString(), completions: [] }];
    });
  }, []);

  const updateHabitName = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name: trimmed } : h)));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleToday = useCallback((id: string) => {
    const today = dayKey(new Date());
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completions.includes(today);
        return {
          ...h,
          completions: done ? h.completions.filter((d) => d !== today) : [...h.completions, today],
        };
      })
    );
  }, []);

  return { habits, hydrated, addHabit, updateHabitName, deleteHabit, toggleToday };
}
