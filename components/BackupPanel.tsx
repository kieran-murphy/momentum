"use client";

import { useRef, useState } from "react";
import { applyBackup, BackupImportError, downloadBackup, parseBackup } from "@/lib/backup";

export function BackupPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleImportClick() {
    setError(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so choosing the same file again still fires onChange
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = parseBackup(String(reader.result));
        const summary = `${backup.tasks.length} task${backup.tasks.length === 1 ? "" : "s"} and ${backup.habits.length} habit${backup.habits.length === 1 ? "" : "s"}`;
        if (!window.confirm(`Import ${summary}? This replaces everything currently stored on this device.`)) return;
        applyBackup(backup);
        window.location.reload();
      } catch (err) {
        setError(err instanceof BackupImportError ? err.message : "Couldn't read that file.");
      }
    };
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 animate-card-entrance dark:border-line dark:bg-surface">
      <div>
        <h2 className="font-body text-sm font-medium text-ink dark:text-ink">Backup</h2>
        <p className="mt-0.5 font-body text-xs text-muted dark:text-muted">
          Save your tasks, habits, and groups to a file, and restore them if this device's storage ever gets reset —
          which can happen when the app updates as an installed PWA.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={downloadBackup}
          className="rounded-lg border border-line px-3 py-1.5 font-body text-sm text-ink transition-colors hover:border-ink/30 dark:border-line dark:text-ink dark:hover:border-ink/30"
        >
          Export data
        </button>
        <button
          onClick={handleImportClick}
          className="rounded-lg border border-line px-3 py-1.5 font-body text-sm text-ink transition-colors hover:border-ink/30 dark:border-line dark:text-ink dark:hover:border-ink/30"
        >
          Import data
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="font-body text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
