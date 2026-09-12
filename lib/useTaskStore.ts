"use client";

import { useCallback, useEffect, useState } from "react";
import { ACCENT_PALETTE, DEFAULT_GROUPS, Group, Task } from "./types";
import { readLocal, writeLocal } from "./storage";
import { generateId } from "./id";
import { useDataSource } from "./dataSource";
import { buildDemoTasks, DEMO_GROUPS } from "./demoData";

const TASKS_KEY = "todo.tasks.v1";
const GROUPS_KEY = "todo.groups.v1";

function normalizeTaskOrder(tasks: Task[]): Task[] {
  if (tasks.every((t) => typeof t.order === "number")) return tasks;
  // Backfill tasks saved before manual ordering existed, keeping their current
  // (newest-first) order so upgrading doesn't visibly reshuffle anything.
  const sorted = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const orderById = new Map(sorted.map((t, i) => [t.id, i]));
  return tasks.map((t) => (typeof t.order === "number" ? t : { ...t, order: orderById.get(t.id) ?? 0 }));
}

function dedupeGroupColors(groups: Group[]): Group[] {
  const used = new Set<string>();
  return groups.map((g) => {
    if (!used.has(g.color)) {
      used.add(g.color);
      return g;
    }
    const color = ACCENT_PALETTE.find((c) => !used.has(c)) ?? g.color;
    used.add(color);
    return { ...g, color, soft: color + "22" };
  });
}

export function useTaskStore() {
  const [dataSource, setDataSource] = useDataSource();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (dataSource === "demo") {
      setTasks(buildDemoTasks());
      setGroups(DEMO_GROUPS);
    } else {
      setTasks(normalizeTaskOrder(readLocal<Task[]>(TASKS_KEY, [])));
      setGroups(dedupeGroupColors(readLocal<Group[]>(GROUPS_KEY, DEFAULT_GROUPS)));
    }
    setHydrated(true);
  }, [dataSource]);

  // Demo data is a sandbox: edits only ever live in memory, so switching
  // back to "local" always restores your real data untouched.
  useEffect(() => {
    if (hydrated && dataSource === "local") writeLocal(TASKS_KEY, tasks);
  }, [tasks, hydrated, dataSource]);

  useEffect(() => {
    if (hydrated && dataSource === "local") writeLocal(GROUPS_KEY, groups);
  }, [groups, hydrated, dataSource]);

  const addTask = useCallback((title: string, groupId: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => {
      const minOrder = prev.reduce((min, t) => Math.min(min, t.order), 0);
      return [
        {
          id: generateId(),
          title: trimmed,
          groupId,
          createdAt: new Date().toISOString(),
          completedAt: null,
          order: minOrder - 1,
        },
        ...prev,
      ];
    });
  }, []);

  const updateTaskTitle = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completedAt: t.completedAt ? null : new Date().toISOString() }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Applies a new manual order to a set of tasks (e.g. after a drag-and-drop
  // reorder, or the "Sort done" action) — orderedIds gives their desired order.
  const reorderTasks = useCallback((orderedIds: string[]) => {
    setTasks((prev) => {
      const position = new Map(orderedIds.map((id, i) => [id, i]));
      return prev.map((t) => (position.has(t.id) ? { ...t, order: position.get(t.id)! } : t));
    });
  }, []);

  const addGroup = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const usedColors = new Set(groups.map((g) => g.color));
      const color = ACCENT_PALETTE.find((c) => !usedColors.has(c)) ?? ACCENT_PALETTE[groups.length % ACCENT_PALETTE.length];
      const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
      setGroups((prev) => [...prev, { id, name: trimmed, color, soft: color + "22" }]);
    },
    [groups]
  );

  const renameGroup = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name: trimmed } : g)));
  }, []);

  const moveGroup = useCallback((id: string, direction: "up" | "down") => {
    setGroups((prev) => {
      const index = prev.findIndex((g) => g.id === id);
      if (index === -1) return prev;
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const deleteGroup = useCallback((id: string) => {
    setGroups((prev) => {
      if (prev.length <= 1) return prev;
      const remaining = prev.filter((g) => g.id !== id);
      const fallbackId = remaining[0]?.id;
      if (fallbackId) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.groupId === id ? { ...t, groupId: fallbackId } : t))
        );
      }
      return remaining;
    });
  }, []);

  return {
    tasks,
    groups,
    hydrated,
    dataSource,
    setDataSource,
    addTask,
    updateTaskTitle,
    toggleComplete,
    deleteTask,
    reorderTasks,
    addGroup,
    renameGroup,
    moveGroup,
    deleteGroup,
  };
}
