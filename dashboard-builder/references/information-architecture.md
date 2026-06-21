# Information Architecture

Use this file during Phase 2: Information Model.

## Build The Content Model

Define:

- Dashboard title and one-sentence narrative.
- Reading path: first scan, second scan, and on-demand detail.
- KPI band: 3-6 values that summarize the state.
- Main visual: the most important spatial, operational, or comparative view.
- Trend panels: time-series changes and thresholds.
- Distribution panels: composition, status, or category mix.
- Rankings: top regions, devices, departments, projects, risks, or events.
- Alert/event list: severity, time, source, summary, and handling state.
- Detail table: exact values for lookup or audit.
- Story scenes or immersive layers when the dashboard type is `editorial`, `presentation`, or `immersive`.

## Select The Metric Model

Classify what the dashboard measures, then choose only the metric families that matter for the audience and decision. Do not force every family into every dashboard.

Use these families as prompts:

- Outcome: primary status, value, savings, conversion, reliability, completion, or other headline result.
- Volume: events, requests, orders, cases, devices, users, throughput, or workload.
- Quality: success, failure, latency, accuracy, SLA, satisfaction, safety, or support burden.
- Movement: trend, growth, seasonality, pre/post change, target progress, forecast, or anomaly.
- Mix: segment, region, channel, product line, source system, service line, type, cohort, or status distribution.
- Depth: repeat usage, intensity, workflow completion, maturity, or lifecycle stage.
- Risk: alerts, capacity limits, source freshness, compliance, operational constraints, or known blind spots.

Map selected metrics into dashboard roles:

- Hero metrics for first-glance status.
- Driver metrics that explain movement or variance.
- Guardrail metrics that prevent misleading interpretation.
- Breakdown metrics for comparison and diagnosis.
- Detail metrics for lookup, audit, or operational follow-up.

Keep definitions consistent across panels. Reuse the same date windows, filters, dimensions, units, and denominator rules so KPI cards, charts, and tables reconcile.

## Match Data To Form

- Capture chart intent for major visuals; write the final chart map in `DASHBOARD.md`. Use `references/chart-contract.md`.
- Use line charts for trends with enough time points.
- Use bars, ranked bars, or leaderboards for ranking and comparison.
- Use stacked bars, stacked area, or rings only for bounded composition with explicit denominator.
- Use histograms, box plots, or heatmaps when distribution or matrix shape matters.
- Use scatter only when there are enough same-grain observations and two compatible numeric measures.
- Use matrix/grid for status across many entities.
- Use tables for exact lookup, audit, or operational follow-up.
- Use center situation view for operational overview when no real map/topology is available.
- Use map/topology only when geography, location, or network relationship matters.
- Do not default to pie, bubble, waterfall, or funnel charts unless the analytical question requires that form.

## Data Source By Delivery Mode

Prototype:

- Create deterministic mock data in the HTML or a small local data module.
- Include realistic names, timestamps, statuses, units, edge values, and missing values.

Hybrid:

- Shape mock data like the future API response.
- Keep a narrow adapter that maps raw data to view models.
- Capture the implied endpoints and schemas in `DASHBOARD_API.yaml`.

Production:

- Confirm endpoint paths, methods, auth, request parameters, response schema, units, timestamps, status enums, and nullability in `DASHBOARD_API.yaml`.
- Keep API calls outside presentational chart components.
- Normalize API responses before rendering.

Do not treat sample, fallback, scratch, or mock data as production data. If the source path or API contract needed for a production dashboard is unavailable, stop and ask for the required source, access, or confirmed OAS fallback.

## Refresh Behavior

Choose one:

- Static snapshot.
- Manual refresh.
- Polling interval.
- Server-sent events or websocket.
- Batch import.

Production screens need visible last-updated and stale-data indicators.

## Runtime State Model

For remote, live, or production dashboards, define only the states that matter:

- Loading.
- Empty.
- Error.
- Live.
- Delayed.
- Stale.
- Partial.
- Offline.
- Reconnecting.
- Last-known-good.

Keep last-known-good evidence visible during reconnect, offline, or partial failure unless that would mislead the viewer.
