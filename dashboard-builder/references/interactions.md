# Interactions

Use this file during workflow step 5.

## Common Interactions

- Hover tooltip: default for charts.
- Filter: time range, region, status, category, owner, or source.
- Linked highlight: selecting one chart filters or highlights another.
- Drilldown: click an item to reveal detail.
- Alert expansion: open event details without losing context.
- Auto-rotation: cycle regions or panels for unattended displays.
- Manual refresh: trigger API reload.
- Full-screen mode: useful for wall displays.

## Effects

Use effects to guide attention, not to decorate every panel.

Acceptable effects:

- Numeric count-up.
- Subtle node pulse.
- Slow flow line.
- Alert highlight.
- Soft scan or grid background.

Avoid effects that reduce readability, cause layout shift, or make screenshots noisy.

## Interaction By Delivery Mode

Prototype:

- Implement interactions only if they help validate the concept.
- Prefer simple hover, filter, or simulated refresh.

Hybrid:

- Keep interaction state close to the adapter/view model boundary.
- Make future API parameters obvious.

Production:

- Handle loading, failure, partial failure, stale data, and retry.
- Preserve the user's filter context across refresh when appropriate.
