export default function StatCards({
  today,
  thisWeek,
  streak,
  allTime,
}: {
  today: number;
  thisWeek: number;
  streak: number;
  allTime: number;
}) {
  const stats = [
    { label: "Today", value: today },
    { label: "This week", value: thisWeek },
    { label: "Day streak", value: streak },
    { label: "All time", value: allTime },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-line bg-surface px-4 py-4 animate-card-entrance dark:border-line dark:bg-surface"
        >
          <div className="font-mono text-3xl tabular-nums text-ink dark:text-ink">{s.value}</div>
          <div className="mt-1 font-body text-xs uppercase tracking-wide text-muted dark:text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
