# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 14, React 18, TypeScript, Tailwind CSS. Local storage only (browser-based, no server).

## Users

Primary: someone managing work and personal tasks across multiple life domains, looking to see progress over time rather than just what's left.

## Product Purpose

Momentum makes task completion visible. Most todo apps make you feel behind by emphasizing what remains; Momentum balances forward focus with retrospective proof of what you actually got done. Success means people use it sustainably and feel good about their productivity.

## Positioning

The unique mechanism: **Recap turns completions into meaningful data.** While other todo apps track debt, Momentum makes you see streaks, weekly patterns, group breakdowns, and a 12-week heatmap of your effort. Looking back on progress is as natural as planning ahead.

## Operating Context

Single-user, browser-based tool. Tasks live in groups (Work and Life ship by default; users can add more). Workflows:
- **Capture:** quick task entry per group, hit Enter
- **Complete:** check task off → satisfying particle burst in group color
- **Reflect:** visit Recap to see stats, streaks, heatmap, and breakdown by group

No account or device sync. Data is permanent within a device/browser.

## Capabilities and Constraints

**Confirmed capabilities:**
- Fast task capture and completion
- Group-based organization (create, use, visualize per group)
- Recap view: today/week/all-time stats, 12-week heatmap (color-split by groups), per-group breakdown bar
- Satisfying completion feedback (particle burst)
- Responsive design for mobile and desktop

**Confirmed constraints:**
- Local storage only (no cloud sync, no accounts, no cross-device data)
- Browser-based (no native apps)
- Single user per browser
- Data persists under `localStorage` keys `todo.tasks.v1` and `todo.groups.v1`

## Brand Commitments

**Name & Voice:** Momentum — shorthand for progress and forward motion. Friendly, direct, visual. Tagline: "Tasks, sorted by Work and Life — and a recap of what you actually got done."

**Fonts:** Fraunces (display, serif), Inter (body, sans), IBM Plex Mono (monospace)

**Color system:**
- Paper (#F2F1EA), Surface (#FBFAF6): warm, calm backgrounds
- Ink (#20241C), Muted (#6B6A5E): text hierarchy
- Line (#E1DFD3): gentle borders
- Work (#3E5C8A, soft #DCE4F0): blue group
- Life (#6B7F4F, soft #E4EADB): green group
- Gold (#E8B23D): accent

**Motion:** Pop-in (0.25s), Strike-fade (0.6s) for task completion feedback.

## Evidence on Hand

- Working web app in Next.js with TaskList, TaskItem, AddTask, GroupTabs, Heatmap, StatCards, Burst components
- Responsive design intent stated; refinement may be needed for small screens
- Local storage integration proven

## Product Principles

1. **Celebrate completions.** Make finishing visible and satisfying. Most apps make work feel endless; we show progress.
2. **Keep it personal and local.** No accounts, no sync friction, no data leaving the browser. Simplicity is the feature.
3. **Respect both work and life.** Tasks matter across domains. Visualize effort in all of them.
4. **Look back to move forward.** Recap is not an afterthought; it's how you understand your pace and rhythm.

## Accessibility & Inclusion

Responsive design for mobile (stated requirement). No other product-specific accessibility requirements documented; standard WCAG 2.1 AA as baseline for all new work.
