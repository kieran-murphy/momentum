# Momentum

A todo app built around one idea: seeing what you've actually done matters as much as
tracking what's left. Tasks live in **Work** or **Life** (or any group you add), and the
**Recap** tab turns your completions into a heatmap and streak stats.

## Features

- **Fast capture** — pick a group, type, hit Enter.
- **Satisfying completion** — checking a task off fires a small particle burst in that
  task's group color.
- **Custom groups** — Work and Life ship by default; add more anytime from the "+ Group" button.
- **Recap** — today / this week / streak / all-time stats, a 12-week heatmap (each day's
  color split by which groups you completed things in), and a per-group breakdown bar.
- **Local-only storage** — everything lives in your browser's `localStorage`. No account,
  no server, no data leaving your machine.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For a production build:

```bash
npm run build
npm run start
```

## Notes

- Data is stored under the `todo.tasks.v1` and `todo.groups.v1` keys in `localStorage`,
  scoped to whichever browser/device you use — it won't sync across devices.
- Fonts (Fraunces, Inter, IBM Plex Mono) load from Google Fonts at build time, so the
  first `npm run build`/`npm run dev` needs internet access once to fetch them.
