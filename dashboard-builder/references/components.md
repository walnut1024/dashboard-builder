# Component Patterns

Use this file while composing dashboard panels. These are patterns, not a required component library. Translate them into single HTML, React components, or existing project components as appropriate.

## KPI Stat Card

Purpose: expose one headline metric.

Include:

- Label.
- Main value.
- Unit.
- Delta or trend.
- Status color.
- Optional sparkline.

## Panel

Purpose: create consistent regions without nesting cards.

Include:

- Header.
- Optional subtitle or status badge.
- Content area with stable dimensions.
- Consistent border, background, padding, and radius.

## Section Header

Include:

- Title.
- Scope or filter context.
- Last updated or refresh state.
- Optional action icon/button.

## Alert/Event List

Include:

- Timestamp.
- Severity.
- Source.
- Summary.
- Handling state.

Use clear severity color and keep row heights stable.

## Ranking List

Include:

- Rank.
- Name.
- Value.
- Progress bar.
- Delta or status.

## Status Matrix

Use for many entities with simple status.

Include:

- Entity label.
- Status chip/cell.
- Optional group header.
- Legend.

## Center Situation View

Default main visual when no map or topology is required.

Include:

- Center index/score.
- Ring or orbit visual.
- Key nodes around the center.
- Node status.
- Connection/flow hint.
- Nearby trend or distribution chart if space allows.

## Metric Trend Panel

Use an ECharts line/area chart with:

- Time axis.
- Unit.
- Threshold line when meaningful.
- Anomaly marker when useful.

## Distribution Panel

Use ring, stacked bar, or horizontal bar. Include total and legend.

## Data Table / Ticker Row

Use for exact lookup or event feeds. Include fixed columns and avoid horizontal overflow.

## Filter Bar

Use only when interaction is required. Keep filters compact and visible.

## Refresh / Stale Indicator

Production dashboards should show:

- Last updated.
- Refreshing.
- Refresh failed.
- Data stale.
