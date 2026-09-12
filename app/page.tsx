"use client";

import TaskList from "@/components/TaskList";
import { useTaskStore } from "@/lib/useTaskStore";

export default function Home() {
  const { tasks, groups, hydrated, addTask, updateTaskTitle, toggleComplete, deleteTask, reorderTasks } =
    useTaskStore();

  if (!hydrated) {
    return <div className="font-body text-sm text-muted">Loading…</div>;
  }

  return (
    <TaskList
      tasks={tasks}
      groups={groups}
      addTask={addTask}
      updateTaskTitle={updateTaskTitle}
      toggleComplete={toggleComplete}
      deleteTask={deleteTask}
      reorderTasks={reorderTasks}
    />
  );
}
