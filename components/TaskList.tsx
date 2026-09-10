"use client";

import { useMemo, useState, type DragEvent } from "react";
import { Group, Task } from "@/lib/types";
import AddTask from "./AddTask";
import GroupTabs from "./GroupTabs";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  groups,
  addTask,
  toggleComplete,
  deleteTask,
  reorderTasks,
}: {
  tasks: Task[];
  groups: Group[];
  addTask: (title: string, groupId: string) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (orderedIds: string[]) => void;
}) {
  const [filter, setFilter] = useState<string>(() => groups[0]?.id ?? "");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const groupById = useMemo(() => new Map(groups.map((g) => [g.id, g])), [groups]);

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => t.groupId === filter);
    return [...filtered].sort((a, b) => a.order - b.order);
  }, [tasks, filter]);

  function pushDoneToBottom() {
    const notDone = visible.filter((t) => !t.completedAt).map((t) => t.id);
    const done = visible.filter((t) => t.completedAt).map((t) => t.id);
    reorderTasks([...notDone, ...done]);
  }

  function handleDragStart(id: string) {
    return (e: DragEvent<HTMLLIElement>) => {
      setDraggingId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    };
  }

  function handleDragOver(id: string) {
    return (e: DragEvent<HTMLLIElement>) => {
      e.preventDefault();
      if (draggingId && id !== draggingId && id !== dragOverId) setDragOverId(id);
    };
  }

  function handleDrop(id: string) {
    return (e: DragEvent<HTMLLIElement>) => {
      e.preventDefault();
      if (!draggingId || draggingId === id) {
        setDraggingId(null);
        setDragOverId(null);
        return;
      }
      const ids = visible.map((t) => t.id);
      const from = ids.indexOf(draggingId);
      const to = ids.indexOf(id);
      if (from !== -1 && to !== -1) {
        ids.splice(from, 1);
        ids.splice(to, 0, draggingId);
        reorderTasks(ids);
      }
      setDraggingId(null);
      setDragOverId(null);
    };
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
  }

  const activeCount = visible.filter((t) => !t.completedAt).length;

  return (
    <div className="flex flex-col gap-5">
      <GroupTabs groups={groups} activeId={filter} onSelect={setFilter} />

      <AddTask groups={groups} activeGroupId={filter} onAdd={addTask} />

      {visible.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={pushDoneToBottom}
            title="Push done tasks to the bottom"
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 font-body text-xs text-muted transition-all hover:border-ink/30 hover:text-ink dark:border-line dark:bg-surface dark:text-muted dark:hover:border-ink/30 dark:hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h5M4 8h8M4 12h3" />
            </svg>
            Sort done
          </button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center font-body text-sm text-muted animate-slide-up dark:border-line dark:text-muted">
          Nothing here yet. Add a task above to get started.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((t) => (
            <div key={t.id} className="animate-slide-up">
              <TaskItem
                task={t}
                group={groupById.get(t.groupId)}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                isDragging={draggingId === t.id}
                isDragOver={dragOverId === t.id}
                dragProps={{
                  draggable: true,
                  onDragStart: handleDragStart(t.id),
                  onDragOver: handleDragOver(t.id),
                  onDrop: handleDrop(t.id),
                  onDragEnd: handleDragEnd,
                }}
              />
            </div>
          ))}
        </ul>
      )}

      <p className="font-mono text-xs text-muted dark:text-muted">
        {activeCount} open · {visible.length - activeCount} done
      </p>
    </div>
  );
}
