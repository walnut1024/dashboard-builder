---
name: dashboard-builder
description: Build, design, implement, and verify visual data dashboards and large-screen data displays. Use this skill whenever the user asks for a dashboard, data cockpit, operations screen, command center, BI display, monitoring screen, 数据大屏, 可视化大屏, 监控大屏, 指挥中心, 驾驶舱, or any screen that turns metrics, API data, or mock data into a visual dashboard. Use it for prototype single-file HTML dashboards, hybrid mock-backed production-shaped dashboards, and production dashboards connected to backend APIs.
---

# Dashboard Builder

## Purpose

Guide a dashboard from rough intent to a verified runnable artifact. Follow the real design and development sequence, write a layout-first `DASHBOARD.md`, get user confirmation, then implement and verify.

## Core Rules

- Do not implement immediately. Confirm the dashboard decisions first.
- After requirements are confirmed, write `DASHBOARD.md` before coding and wait for user confirmation.
- `DASHBOARD.md` frontmatter must contain only `name`, `resolution`, and `description`.
- `DASHBOARD.md` body must read like a dashboard design document, not a workflow transcript.
- The `Layout` section in `DASHBOARD.md` must include an ASCII structure diagram.
- Do not use a visual companion. Use text proposals, simple layout descriptions, code, screenshots, and automated inspection.
- Default delivery mode is `prototype`.
- Default prototype stack is a single HTML file using Tailwind CDN and ECharts CDN.
- Default hybrid and production stack is React + TypeScript + ECharts, unless the existing project already has a suitable stack.
- Prefer existing project conventions over the defaults when working in a real app.
- Keep dashboards operational: dense, legible, aligned, and stable at the target resolution.
- After generating a runnable dashboard, verify with `scripts/inspect-dashboard.mjs` when the environment can run a browser.

## Workflow

Start with `references/workflow.md`. It is the controlling process.

Confirm these steps in order before coding:

1. Usage scenario and delivery mode.
2. Information architecture.
3. Layout plan.
4. Visual theme.
5. Interaction requirements.
6. Technical and environment constraints.
7. Acceptance criteria.

After these are confirmed, write `DASHBOARD.md` using `references/dashboard-spec.md`. Do not implement until the user confirms or edits it.

For each step, use this format:

```text
Confirmed:
Assumptions:
Proposal:
Question:
```

If the user's prompt is sparse, propose sensible defaults for all seven steps and ask the user to confirm or adjust them. If the user asks to move quickly, compress the seven steps into one concise confirmation summary, but still cover every step before implementing.

## Reference Routing

- Read `references/workflow.md` first for the step sequence and confirmation format.
- Read `references/dashboard-spec.md` before writing `DASHBOARD.md`.
- Read `references/scenario.md` while confirming audience, viewing context, resolution, and delivery mode.
- Read `references/information-architecture.md` when deciding metrics, entities, charts, data source, and refresh behavior.
- Read `references/layouts.md` when selecting or describing the screen layout.
- Read `references/themes.md` when selecting visual style, colors, typography, chart palette, and panel treatment.
- Read `references/components.md` when composing reusable dashboard panels and visual patterns.
- Read `references/interactions.md` when the dashboard needs hover, filtering, drilldown, linking, effects, refresh, or full-screen behavior.
- Read `references/implementation.md` before coding, especially when choosing between single HTML, hybrid adapter, and production API integration.
- Read `references/verification.md` before claiming the dashboard is ready.

## Assets And Scripts

- Use `assets/template.html` as the default starting point for prototype dashboards in empty workspaces or standalone demos.
- Treat `assets/template.html` as a copy-and-modify template, not a mandatory framework.
- Use `scripts/inspect-dashboard.mjs` to inspect generated dashboards for rendering, overlap, overflow, alignment, chart presence, and screenshot evidence.

## Deliverables

End with:

- The delivery mode and target resolution.
- The `DASHBOARD.md` path used for implementation.
- The generated files or modified project paths.
- The data source: mock data, mock adapter contract, or backend API.
- Verification commands run, including `inspect-dashboard.mjs` when applicable.
- Known gaps, especially missing API details, CDN/offline constraints, or unverified browser checks.
