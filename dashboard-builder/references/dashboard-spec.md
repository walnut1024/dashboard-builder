# DASHBOARD.md Specification

Use this file after workflow confirmation and before implementation.

`DASHBOARD.md` is the design source of truth for the dashboard. It should let a reader understand the intended screen shape, major regions, charts, data behavior, and visual treatment before seeing the code.

## Frontmatter

Use only these three fields:

```md
---
name: "Hospital Oversight Dashboard"
resolution: "1920x1080"
description: "A prototype command-center dashboard for hospital imaging oversight, showing operating status, risk alerts, service trends, and regional workload."
---
```

Do not add delivery mode, theme, stack, API fields, or nested YAML. Put those in the body.

## Body Structure

Use this structure:

````md
# [Dashboard Name]

## Overview

Describe the audience, viewing context, delivery mode, and overall purpose in 1-3 short paragraphs.

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
````

Explain why the layout fits the scenario and what tradeoffs it accepts.

## Sections

### [Region Or Panel Name]

- Purpose:
- Content:
- Visualization or component:
- Visual treatment:
- Data behavior:
- Interaction:

Repeat for each major region and nested panel.

## Visual System

- Theme direction:
- Background:
- Panel style:
- Typography:
- Chart palette:
- Status colors:
- Motion:

## Data Model

- Delivery mode:
- Data source:
- Mock data or API contract:
- Refresh behavior:
- Empty/error/stale behavior:

## Interactions

List hover, filters, drilldown, linked charts, refresh, full-screen behavior, and effects.

## Acceptance Criteria

List concrete checks for rendering, layout, data, production states, inspection, and deliverables.
```

## Writing Rules

- Make `Layout` visual first. The ASCII diagram should appear before detailed panel prose.
- Describe sections by screen region, not by workflow step.
- Make each section specific enough to implement without re-asking basic layout questions.
- For prototype dashboards, keep data model concise but realistic.
- For hybrid dashboards, document the adapter boundary and future API shape.
- For production dashboards, document real endpoints, runtime states, and refresh behavior.
