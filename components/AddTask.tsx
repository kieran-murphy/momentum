"use client";

import { useState } from "react";
import { Group } from "@/lib/types";
import GroupSelect from "@/components/GroupSelect";

export default function AddTask({
  groups,
  activeGroupId,
  onAdd,
}: {
  groups: Group[];
  activeGroupId: string;
  onAdd: (title: string, groupId: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState(activeGroupId);
  const [isFocused, setIsFocused] = useState(false);

  const effectiveGroupId = groups.some((g) => g.id === groupId) ? groupId : activeGroupId;

  function submit() {
    if (!title.trim()) return;
    onAdd(title, effectiveGroupId);
    setTitle("");
  }

  return (
    <div className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2 shadow-sm transition-all animate-slide-up dark:border-line dark:bg-surface ${
      isFocused ? "border-ink/30 shadow-md dark:border-ink/30 dark:shadow-md" : ""
    }`}>
      <GroupSelect
        groups={groups}
        value={effectiveGroupId}
        onChange={setGroupId}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Add a task here"
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
