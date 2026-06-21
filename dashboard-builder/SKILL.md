---
name: dashboard-builder
description: Build, design, implement, and verify visual data dashboards and large-screen data displays. Use this skill whenever the user asks for a data cockpit, operations screen, command center, monitoring screen, exhibition or presentation data screen, 数据大屏, 可视化大屏, 监控大屏, 指挥中心, 驾驶舱, or a frontend dashboard that turns metrics, API data, or mock data into a visual screen. Use it for prototype single-file HTML dashboards, hybrid mock-backed production-shaped dashboards, production dashboards connected to backend APIs, and advanced visual dashboards with maps, scenes, WebGL, 3D, particles, or scrollytelling when those effects carry meaning; do not use it for editing BI-platform dashboards directly.
metadata:
  version: "0.0.3"
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
- Confirm the dashboard type separately from delivery mode. Dashboard type describes the experience; delivery mode describes implementation and data readiness.
- Write `DASHBOARD.md` and `DASHBOARD_API.yaml` in the current project root by default, unless the project already has a clear docs/specs convention. Ask before overwriting existing files.
- For `hybrid` and `production`, confirm an OpenAPI Specification contract in `DASHBOARD_API.yaml` before implementation.
- If the user provides OAS-compliant API docs, use them as `DASHBOARD_API.yaml`; otherwise collect API details and draft `DASHBOARD_API.yaml` for confirmation.
- Do not use a visual companion. Use text proposals, simple layout descriptions, code, screenshots, and automated inspection.
- Do not assume or require any specific AI service, runtime, or agent host. Keep instructions portable across agents that can read this skill.
- Default delivery mode is `prototype`.
- Default dashboard type is `operational` when the request is monitoring or command-center oriented; otherwise infer from the scenario and ask for confirmation.
- Default prototype stack is a single HTML file using Tailwind CDN and ECharts CDN.
- Default hybrid and production stack is React + TypeScript + ECharts, unless the existing project already has a suitable stack.
- Prefer existing project conventions over the defaults when working in a real app.
- Do not present mock, sample, scratch, or fallback data as production data.
- Keep dashboards legible, aligned, and stable at the target resolution. Operational dashboards should be dense and scan-first; presentation, editorial, and immersive dashboards may be more visual but must still preserve the evidence.
- Quality and confirmed requirements outrank automated inspection. Do not replace a confirmed high-fidelity map, scene, chart, or data substrate with a lower-fidelity placeholder just to pass `inspect-dashboard.mjs`; fix the asset, renderer, container, data, or environment issue, or report the failing check as a blocker.
- Allow WebGL, 3D, particles, scrollytelling, and advanced motion only when they carry data, state, orientation, or narrative meaning and have static or reduced-motion fallback.
- After generating a runnable dashboard, verify with `scripts/inspect-dashboard.mjs` when the environment can run a browser.

## Workflow

Start with `references/workflow.md`. It is the controlling process.

Confirm these phases in order before coding:

1. Brief: usage scenario, audience, goal, dashboard type, resolution, and delivery mode.
2. Information model: metrics, entities, refresh behavior, and major visual intent.
3. Data contract: only for `hybrid` or `production`; create or adopt `DASHBOARD_API.yaml` draft.
4. Screen design: layout, reading path, sections, visual system, interactions, advanced visuals, and chart map.
5. Design freeze: write `DASHBOARD.md`, reconcile `DASHBOARD_API.yaml` against sections, and get confirmation.
6. Implementation and QA.

After the first four phases are confirmed, write `DASHBOARD.md` using `references/dashboard-spec.md`. For `hybrid` and `production`, finalize `DASHBOARD_API.yaml` against the confirmed sections. Do not implement until the user confirms or edits the design document and API contract.

For each phase, use this format:

```text
Confirmed:
Assumptions:
Proposal:
Question:
```

If the user's prompt is sparse, propose sensible defaults for all workflow phases and ask the user to confirm or adjust them. If the user asks to move quickly, compress the workflow into one concise confirmation summary, but still cover every required phase before implementing.

## Reference Routing

- Read `references/workflow.md` first for the phase sequence and confirmation format.
- Read `references/dashboard-spec.md` before writing `DASHBOARD.md`.
- Read `references/api-contract.md` when delivery mode is `hybrid` or `production`, or when the user provides API details or OAS documentation.
- Read `references/scenario.md` while confirming audience, viewing context, resolution, and delivery mode.
- Read `references/information-architecture.md` when deciding metrics, entities, charts, data source, and refresh behavior.
- Read `references/chart-contract.md` when selecting chart types, writing chart-heavy `DASHBOARD.md` sections, or reviewing chart readability.
- Read `references/layouts.md` when selecting or describing the screen layout.
- Read `references/themes.md` when selecting visual style, colors, typography, chart palette, and panel treatment.
- Read `references/components.md` when composing reusable dashboard panels and visual patterns.
- Read `references/interactions.md` when the dashboard needs hover, filtering, drilldown, linking, effects, refresh, or full-screen behavior.
- Read `references/implementation.md` before coding, especially when choosing between single HTML, hybrid adapter, and production API integration.
- Read `references/verification.md` before claiming the dashboard is ready.
- Use `assets/templates/` selectively when a reusable brief, design contract, storyboard, advanced visual contract, API checklist, QA plan, accessibility review, or export checklist would make the dashboard spec more controlled.

## Assets And Scripts

- Use `assets/template.html` as the default starting point for prototype dashboards in empty workspaces or standalone demos.
- Treat `assets/template.html` as a copy-and-modify template, not a mandatory framework.
- Use `assets/react-echarts-template/` as the optional starting point for new hybrid or production React + TypeScript + ECharts dashboards when no project stack exists.
- Use `assets/templates/dashboard-brief.md`, `dashboard-design-contract.md`, `dashboard-reading-path.md`, and `dashboard-chart-map.md` when clarifying or drafting the design.
- Use `assets/templates/dashboard-api-contract-checklist.md` for `hybrid` or `production`.
- Use `assets/templates/presentation-dashboard-brief.md`, `editorial-dashboard-storyboard.md`, `immersive-dashboard-contract.md`, and `advanced-visual-effects-contract.md` when the dashboard type or effects require them.
- Use `assets/templates/dashboard-qa-plan.md`, `live-dashboard-review-checklist.md`, `accessibility-review-checklist.md`, and `export-checklist.md` before handoff when relevant.
- Use the bundled `scripts/inspect-dashboard.mjs` to inspect generated dashboards for rendering, overlap, overflow, alignment, chart presence, and screenshot evidence.
- Use the bundled `scripts/validate-dashboard-api.mjs` for a lightweight `DASHBOARD_API.yaml` structure check before implementing `hybrid` or `production`.

## Deliverables

End with:

- The delivery mode and target resolution.
- The `DASHBOARD.md` path used for implementation.
- The `DASHBOARD_API.yaml` path for `hybrid` or `production`, or state that it was not needed for `prototype`.
- The generated files or modified project paths.
- The data source: mock data, mock adapter contract, or backend API.
- Verification commands run, including `inspect-dashboard.mjs` when applicable.
- Known gaps, especially missing API details, CDN/offline constraints, or unverified browser checks.
