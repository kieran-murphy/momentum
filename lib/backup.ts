import { readLocal, writeLocal } from "./storage";
import { DEFAULT_GROUPS, Group, Habit, Task } from "./types";

const TASKS_KEY = "todo.tasks.v1";
const GROUPS_KEY = "todo.groups.v1";
const HABITS_KEY = "todo.habits.v1";

export type Backup = {
  version: 1;
  exportedAt: string;
  tasks: Task[];
  groups: Group[];
  habits: Habit[];
};

export class BackupImportError extends Error {}

function isTask(x: unknown): x is Task {
  const t = x as Task;
  return !!t && typeof t.id === "string" && typeof t.title === "string" && typeof t.groupId === "string";
}

function isGroup(x: unknown): x is Group {
  const g = x as Group;
  return !!g && typeof g.id === "string" && typeof g.name === "string" && typeof g.color === "string";
}

function isHabit(x: unknown): x is Habit {
  const h = x as Habit;
  return !!h && typeof h.id === "string" && typeof h.name === "string" && Array.isArray(h.completions);
}

// Reads straight from localStorage (not from React state) so exporting works
// regardless of which stores happen to be mounted, and always reflects
// exactly what's persisted on this device.
export function buildBackup(): Backup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: readLocal<Task[]>(TASKS_KEY, []),
    groups: readLocal<Group[]>(GROUPS_KEY, DEFAULT_GROUPS),
    habits: readLocal<Habit[]>(HABITS_KEY, []),
  };
}

export function downloadBackup() {
  const backup = buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `momentum-backup-${backup.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Accepts anything roughly backup-shaped rather than requiring an exact
// version match, so a file exported by an older build still imports.
export function parseBackup(raw: string): Backup {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new BackupImportError("That file isn't valid JSON.");
  }
  if (!data || typeof data !== "object") throw new BackupImportError("This doesn't look like a Momentum backup file.");
  const record = data as Record<string, unknown>;
  const hasAnyField = Array.isArray(record.tasks) || Array.isArray(record.groups) || Array.isArray(record.habits);
  if (!hasAnyField) throw new BackupImportError("This doesn't look like a Momentum backup file.");

  const tasks = Array.isArray(record.tasks) ? record.tasks.filter(isTask) : [];
  const groups =
    Array.isArray(record.groups) && record.groups.length > 0 && record.groups.every(isGroup)
      ? (record.groups as Group[])
      : DEFAULT_GROUPS;
  const habits = Array.isArray(record.habits) ? record.habits.filter(isHabit) : [];

  return {
    version: 1,
    exportedAt: typeof record.exportedAt === "string" ? record.exportedAt : new Date().toISOString(),
    tasks,
    groups,
    habits,
  };
}

// Overwrites local storage directly; callers are expected to reload the app
// afterward so every store hook re-hydrates from the new data.
export function applyBackup(backup: Backup) {
  writeLocal(TASKS_KEY, backup.tasks);
  writeLocal(GROUPS_KEY, backup.groups);
  writeLocal(HABITS_KEY, backup.habits);
}
