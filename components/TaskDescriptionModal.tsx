"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE = "button, textarea";

export default function TaskDescriptionModal({
  title,
  color,
  description,
  onSave,
  onClose,
}: {
  title: string;
  color: string;
  description: string;
  onSave: (description: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(description);
  // Opens read-only when there's a description to read; a task without one
  // has nothing to view, so it goes straight to the text box.
  const [isEditing, setIsEditing] = useState(!description.trim());
  const dialogRef = useRef<HTMLDivElement>(null);
  const isDirty = isEditing && draft.trim() !== description.trim();

  // Lock page scroll while open and hand focus back to whatever opened the
  // modal (the row's icon) once it closes.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  const save = () => {
    onSave(draft);
    onClose();
  };

  const cancelEdit = () => {
    if (!description.trim()) {
      onClose();
      return;
    }
    setDraft(description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (isEditing && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      save();
    } else if (e.key === "Tab") {
      // Keep Tab cycling inside the dialog.
      const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-grid-fade"
      // Ignored while there are unsaved edits so a stray click can't lose them.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDirty) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-description-title"
        onKeyDown={handleKeyDown}
        className="flex max-h-full w-full max-w-md flex-col gap-4 rounded-xl border border-line bg-surface p-5 shadow-lg animate-pop-in dark:border-line dark:bg-surface"
      >
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <h2
            id="task-description-title"
            className="min-w-0 flex-1 break-words font-display text-lg font-semibold text-ink dark:text-ink"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-muted transition-colors hover:text-ink dark:text-muted dark:hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {isEditing ? (
          <>
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
              rows={6}
              placeholder="Add a description…"
              aria-label={`Description for "${title}"`}
              className="min-h-[8rem] w-full resize-y rounded-lg border border-line bg-transparent px-3 py-2 font-body text-base text-ink placeholder:text-muted focus:border-ink/30 focus:outline-none dark:border-line dark:text-ink dark:placeholder:text-muted dark:focus:border-ink/30"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={cancelEdit}
                className="rounded-lg border border-line px-4 py-2 font-body text-sm text-muted transition-all hover:border-ink/30 hover:text-ink dark:border-line dark:text-muted dark:hover:border-ink/30 dark:hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-lg bg-ink px-4 py-2 font-body text-sm font-medium text-paper transition-all active:scale-95 hover:shadow-sm dark:bg-ink dark:text-paper"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="min-h-0 overflow-y-auto whitespace-pre-wrap break-words font-body text-base text-ink dark:text-ink">
              {description}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-line px-4 py-2 font-body text-sm text-muted transition-all hover:border-ink/30 hover:text-ink dark:border-line dark:text-muted dark:hover:border-ink/30 dark:hover:text-ink"
              >
                Close
              </button>
              <button
                autoFocus
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-ink px-4 py-2 font-body text-sm font-medium text-paper transition-all active:scale-95 hover:shadow-sm dark:bg-ink dark:text-paper"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
