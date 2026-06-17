# Information Architecture

Use this file during workflow step 2.

## Build The Content Model

Define:

- Dashboard title and one-sentence narrative.
- KPI band: 3-6 values that summarize the state.
- Main visual: the most important spatial, operational, or comparative view.
- Trend panels: time-series changes and thresholds.
- Distribution panels: composition, status, or category mix.
- Rankings: top regions, devices, departments, projects, risks, or events.
- Alert/event list: severity, time, source, summary, and handling state.
- Detail table: exact values for lookup or audit.

## Match Data To Form

- Use line/area charts for trends.
- Use bars for ranking and comparison.
- Use rings only for bounded composition.
- Use matrix/grid for status across many entities.
- Use tables for exact lookup.
- Use center situation view for operational overview when no real map/topology is available.
- Use map/topology only when geography, location, or network relationship matters.

## Data Source By Delivery Mode

Prototype:

- Create deterministic mock data in the HTML or a small local data module.
- Include realistic names, timestamps, statuses, units, edge values, and missing values.

Hybrid:

- Shape mock data like the future API response.
- Keep a narrow adapter that maps raw data to view models.
- Document the implied endpoint and schema in the final response.

Production:

- Confirm endpoint paths, methods, auth, request parameters, response schema, units, timestamps, status enums, and nullability.
- Keep API calls outside presentational chart components.
- Normalize API responses before rendering.

## Refresh Behavior

Choose one:

- Static snapshot.
- Manual refresh.
- Polling interval.
- Server-sent events or websocket.
- Batch import.

Production screens need visible last-updated and stale-data indicators.
