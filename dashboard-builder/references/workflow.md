# Workflow

Use this sequence for every dashboard build. This is the working process, not the final design document structure.

## Step 1: Usage Scenario And Delivery Mode

Confirm:

- Audience: who watches or operates the dashboard.
- Viewing environment: command center, meeting room, exhibition wall, desktop browser, embedded system, kiosk, or projection.
- Goal: monitor, report, warn, dispatch, analyze, demonstrate, or sell.
- Target resolution. Default to `1920x1080`.
- Delivery mode. Default to `prototype`.

Delivery modes:

- `prototype`: single HTML dashboard with mock data. Default to Tailwind CDN and ECharts CDN.
- `hybrid`: production-shaped app using mock data behind an adapter shaped like the future API.
- `production`: real backend APIs with loading, empty, error, stale, and refresh states.

## Step 2: Information Architecture

Confirm what the screen must communicate:

- Core narrative: the one-sentence purpose of the screen.
- Metric groups: overview KPIs, trends, distribution, rankings, alerts, detail tables.
- Data entities: regions, devices, patients, orders, assets, events, projects, or other domain objects.
- Chart/form choices: line, bar, ring, map, topology, matrix, table, timeline, ticker, or center situation view.
- Refresh behavior: static, manual, polling, stream, or real time.
- Priority: main visual, secondary panels, and supporting details.

## Step 3: Layout Plan

Confirm:

- Layout pattern and screen density.
- Main visual region.
- KPI placement.
- Left/right/bottom panel allocation.
- Responsive fallback, if any.
- Whether to start from `assets/template.html`.

## Step 4: Visual Theme

Confirm:

- Visual direction from `themes.md`.
- Theme colors and chart palette.
- Font style and size scale.
- Background treatment.
- Panel border, shadow, transparency, and radius.
- Motion intensity.

## Step 5: Interaction Requirements

Confirm:

- Hover tooltips.
- Filters.
- Chart linking.
- Drilldown.
- Alert expansion.
- Auto-rotation.
- Refresh controls.
- Full-screen behavior.
- Visual effects.

## Step 6: Technical And Environment Constraints

Confirm:

- Whether public internet access is allowed.
- Whether CDN is allowed.
- Whether offline delivery is required.
- Existing project stack, if any.
- API availability, auth, environment variables, proxy, and deployment target.
- Browser target.

Prototype defaults to CDN. If internet or CDN is not allowed, use local assets or inline CSS/JS and explain the tradeoff.

## Step 7: Acceptance Criteria

Confirm:

- Target resolution renders without overlap or unintended scroll.
- Key metrics are legible within five seconds.
- Charts have labels, units, and plausible data.
- Production states cover loading, empty, error, stale, and refresh.
- `scripts/inspect-dashboard.mjs` is run when a browser-capable environment is available.

## Confirmation Format

For each step, respond with:

```text
Confirmed:
Assumptions:
Proposal:
Question:
```

Do not proceed to implementation until the user confirms or corrects the proposal.

## Design Freeze

After the seven steps are confirmed, write `DASHBOARD.md` before implementation.

Rules:

- Use `references/dashboard-spec.md`.
- Do not paste the seven workflow steps as the document structure.
- Write a layout-first dashboard design document.
- Include YAML frontmatter with only `name`, `resolution`, and `description`.
- Include an ASCII structure diagram in the `Layout` section.
- Ask the user to confirm or edit `DASHBOARD.md`.
- Do not code until the user confirms the document.

If the user requests a quick version, write a concise `DASHBOARD.md` rather than skipping it.
