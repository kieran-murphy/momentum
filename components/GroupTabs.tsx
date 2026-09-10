"use client";

import { Group } from "@/lib/types";

export default function GroupTabs({
  groups,
  activeId,
  onSelect,
}: {
  groups: Group[];
  activeId: string; // a group id
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {groups.map((g) => (
        <TabButton key={g.id} active={activeId === g.id} onClick={() => onSelect(g.id)} color={g.color} name={g.name} />
      ))}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  color,
  name,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  name: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-body text-sm transition-all ${active ? "animate-slide-down" : ""}`}
      style={{
        borderColor: active ? color : "var(--color-line)",
        backgroundColor: active ? color : "transparent",
        color: active ? "#FBFAF6" : "var(--color-ink)",
      }}
    >
      {name}
    </button>
  );
}
