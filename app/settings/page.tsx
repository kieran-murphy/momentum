"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/useTaskStore";

export default function SettingsPage() {
  const { tasks, groups, hydrated, addGroup, renameGroup, deleteGroup } = useTaskStore();
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  if (!hydrated) {
    return <div className="font-body text-sm text-muted">Loading…</div>;
  }

  function submit() {
    if (!name.trim()) return;
    addGroup(name);
    setName("");
  }

  function startEditing(id: string, currentName: string) {
    setDraft(currentName);
    setEditingId(id);
  }

  function commitEdit(id: string, originalName: string) {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== originalName) renameGroup(id, trimmed);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    const group = groups.find((g) => g.id === id);
    const count = tasks.filter((t) => t.groupId === id).length;
    const fallback = groups.find((g) => g.id !== id);
    const groupName = group?.name ?? "this group";
    const message =
      count > 0 && fallback
        ? `Delete "${groupName}"? ${count} task${count === 1 ? "" : "s"} will move to "${fallback.name}". This can't be undone.`
        : `Delete "${groupName}"? This can't be undone.`;
    if (!window.confirm(message)) return;
    deleteGroup(id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-slide-up">
        <h1 className="font-display text-xl font-semibold text-ink dark:text-ink">Settings</h1>
        <p className="mt-1 font-body text-sm text-muted dark:text-muted">Add and remove your groups.</p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 animate-card-entrance dark:border-line dark:bg-surface">
        <h2 className="font-body text-sm font-medium text-ink dark:text-ink">Groups</h2>
        <ul className="flex flex-col gap-2">
          {groups.map((g) => {
            const count = tasks.filter((t) => t.groupId === g.id).length;
            return (
              <li
                key={g.id}
                className="group flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 dark:border-line"
              >
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: g.color }} />
                {editingId === g.id ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={() => commitEdit(g.id, g.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit(g.id, g.name);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    aria-label={`Edit "${g.name}" group name`}
                    className="min-w-0 flex-1 rounded-md border border-ink/20 bg-transparent px-1.5 py-0.5 font-body text-base text-ink focus:outline-none dark:border-ink/20 dark:text-ink"
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEditing(g.id, g.name)}
                    className="flex-1 truncate font-body text-[15px] text-ink dark:text-ink"
                  >
                    {g.name}
                  </span>
                )}
                <span className="shrink-0 font-mono text-xs text-muted dark:text-muted">
                  {count} task{count === 1 ? "" : "s"}
                </span>
                {editingId !== g.id && (
                  <button
                    onClick={() => startEditing(g.id, g.name)}
                    aria-label={`Rename "${g.name}" group`}
                    className="ml-1 shrink-0 rounded-full p-1 text-muted opacity-0 transition-all hover:scale-110 hover:bg-black/10 hover:text-ink focus-visible:opacity-100 active:scale-95 group-hover:opacity-100 dark:text-muted dark:hover:text-ink"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                      <path
                        d="M11.3 2.7l2 2L5.3 12.7l-2.7.7.7-2.7 8-8z"
                        stroke="currentColor"
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                {groups.length > 1 && editingId !== g.id && (
                  <button
                    onClick={() => handleDelete(g.id)}
                    aria-label={`Delete "${g.name}" group`}
                    className="shrink-0 rounded-full p-1 text-muted opacity-0 transition-all hover:scale-110 hover:bg-black/10 hover:text-ink focus-visible:opacity-100 active:scale-95 group-hover:opacity-100 dark:text-muted dark:hover:text-ink"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

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
          placeholder="New group name"
          className="min-w-0 flex-1 bg-transparent px-2 py-2 font-body text-base text-ink placeholder:text-muted focus:outline-none dark:text-ink dark:placeholder:text-muted"
        />
        <button
          onClick={submit}
          className="shrink-0 rounded-lg bg-ink px-4 py-2 font-body text-sm font-medium text-paper transition-all active:scale-95 active:brightness-110 hover:shadow-sm dark:bg-ink dark:text-paper"
        >
          Add group
        </button>
      </div>
    </div>
  );
}
