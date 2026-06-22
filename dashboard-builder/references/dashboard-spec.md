# DASHBOARD.md Specification

Use this file after workflow confirmation and before implementation.

`DASHBOARD.md` is the design source of truth for the dashboard. It should let a reader understand the intended screen shape, major regions, charts, data behavior, and visual treatment before seeing the code.

## Frontmatter

Use only these three fields:

````md
---
name: "Hospital Oversight Dashboard"
resolution: "1920x1080"
description: "A prototype command-center dashboard for hospital imaging oversight, showing operating status, risk alerts, service trends, and regional workload."
---
````

Do not add delivery mode, theme, stack, API fields, or nested YAML. Put those in the body.

## Body Structure

Use this structure:

````md
# [Dashboard Name]

## Overview

Describe the audience, viewing context, dashboard type, delivery mode, and overall purpose in 1-3 short paragraphs.

## Dashboard Type

- Type: `operational`, `analytical`, `presentation`, `editorial`, or `immersive`.
- Why this type fits:
- What this type changes about density, hierarchy, motion, interaction, and visual ambition:

## Reading Path

- First scan:
- Second scan:
- On-demand detail:
- What must remain visible without hover:

## Layout

State the selected layout type and include an ASCII structure diagram.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header: Title / Time / Refresh / Global Status               │
├───────────────┬──────────────────────────────┬───────────────┤
│ Left Column   │ Center Stage                 │ Right Column  │
│ - Trend       │ - Main Situation View        │ - Alerts      │
│ - Ranking     │ - Core Flow / Map / Topology │ - Details     │
├───────────────┴──────────────────────────────┴───────────────┤
│ Bottom: Timeline / Detail Table / Supplement Trend            │
└──────────────────────────────────────────────────────────────┘
```

Explain why the layout fits the scenario and what tradeoffs it accepts.

## Viewport Adaptation

- Design canvas: default `1920x1080`.
- Display or browser viewport: known value, unknown, or expected range.
- Adaptation mode: `fit-contain-center`, `fluid-responsive`, or `fit-cover-crop`.
- Scale behavior: how the dashboard behaves below, at, and above the design canvas.
- Safe area: where critical KPIs, controls, labels, legends, and core evidence must remain visible.
- Required test viewports: include at least `1440x900`, `1920x1080`, `2560x1440`, and `3840x2160` unless the user provides a narrower target set.

## Sections

### [Region Or Panel Name]

- Purpose:
- Content:
- Visualization or component:
- Visual treatment:
- Data behavior:
- Interaction:

Repeat for each major region and nested panel.

## Chart Map

For major charts only:

- Panel or region:
- Analytical question:
- Takeaway:
- Chart variant:
- Fields and units:
- Data sufficiency and fallback:
- Final-context QA:

## Visual System

- Theme direction:
- Background:
- Panel style:
- Typography:
- Chart palette:
- Chart encoding rules:
- Status colors:
- Motion:

## Optional: Advanced Visual Contract

Include this section only when advanced visual techniques are part of the design.

- Technique: WebGL, 3D, particles, map scene, scrollytelling, stepper, generated/raster substrate, or advanced motion.
- Meaning: what data, state, orientation, or narrative role it carries.
- Non-goals: what it must not imply.
- Static or reduced-motion fallback:
- Render/performance risk:
- QA evidence:

## Data Model

- Delivery mode:
- Data source:
- Source-of-truth status:
- Mock data or API contract:
- API contract file: `DASHBOARD_API.yaml` for `hybrid` or `production`; not required for `prototype`.
- OpenAPI status: not required, first-pass draft, user-provided, generated from user input, or final confirmed.
- Metric roles: hero outcome, drivers, guardrails, breakdowns, and detail metrics.
- Metric definition rules: units, time windows, denominator or eligibility rules, filters, and freshness.
- Refresh behavior:
- Runtime states: loading, empty, error, live, delayed, stale, partial, offline, reconnecting, refresh, and last-known-good behavior as relevant.

## Interactions

List hover, filters, drilldown, linked charts, refresh, full-screen behavior, URL/share state when needed, autoplay, stepper/scrollytelling scenes, and effects.

## Acceptance Criteria

List concrete checks for rendering, layout, data, production states, inspection, and deliverables.
````

## Writing Rules

- Make `Layout` visual first. The ASCII diagram should appear before detailed panel prose.
- Separate dashboard type from delivery mode. Do not use `prototype`, `hybrid`, or `production` as a visual style.
- Include a reading path so the default screen has a clear first scan before interaction.
- Include viewport adaptation so unknown screen sizes do not produce cropped small screens or tiny upper-left dashboards on 2K/4K displays.
- Describe sections by screen region, not by workflow step.
- Make each section specific enough to implement without re-asking basic layout questions.
- Use `Chart Map` for major charts only. Do not force chart contracts onto headers, KPI cards, alert lists, filters, tables, or purely structural sections.
- For prototype dashboards, keep data model concise but realistic.
- For hybrid dashboards, reference `DASHBOARD_API.yaml`, then document the adapter boundary and future API shape.
- For production dashboards, reference `DASHBOARD_API.yaml`, then document real endpoints, runtime states, and refresh behavior.
- Use `Optional: Advanced Visual Contract` for advanced effects only. Do not force it onto standard charts or simple panels.
- For WebGL, 3D, particles, scrollytelling, or advanced motion, state the effect meaning and fallback before implementation.
- Do not describe mock, sample, scratch, or fallback data as production data.
