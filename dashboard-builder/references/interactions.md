# Interactions

Use this file during Phase 4: Screen Design.

## Common Interactions

- Hover tooltip: default for charts.
- Filter: time range, region, status, category, owner, or source.
- Linked highlight: selecting one chart filters or highlights another.
- Drilldown: click an item to reveal detail.
- Alert expansion: open event details without losing context.
- Auto-rotation: cycle regions or panels for unattended displays.
- Manual refresh: trigger API reload.
- Full-screen mode: useful for wall displays.
- Stepper or scene transition: useful for editorial, presentation, or immersive dashboards.
- Autoplay with pause: useful for exhibition screens when operators are not present.
- URL/share state: useful when filters, selected entities, scenes, or time ranges need to be restored.

## Effects

Use effects to guide attention, not to decorate every panel.

Acceptable effects:

- Numeric count-up.
- Subtle node pulse.
- Slow flow line.
- Alert highlight.
- Soft scan or grid background.
- Scene transition, particle flow, 3D camera move, or map flight only when it carries narrative, state, orientation, or data meaning.

Avoid effects that reduce readability, cause layout shift, make screenshots noisy, or imply data movement without an explicit meaning.

## State And Persistence

Use URL or share state for committed analytical or presentation state when needed:

- Time range.
- Filters.
- Selected entity or region.
- Active scene or step.
- Drilldown path.
- Map bounds, zoom, or camera target when it changes interpretation.

Keep transient hover, pointer position, drag-in-progress, and animation frame out of URL state.

## Runtime States

For remote or live data, define:

- Live.
- Delayed.
- Stale.
- Partial.
- Offline.
- Reconnecting.
- Last-known-good.
- Empty and error.

Prefer stale-but-visible views over blank reconnect screens.

## Advanced Interaction

For `editorial` and `immersive` dashboards:

- Define default, playing, paused, selected, expanded, fallback, loading, and error states as relevant.
- Provide static and reduced-motion behavior for autoplay, scrollytelling, particles, 3D camera movement, and scene transitions.
- Keep source, caveat, and active scene visible in paused screenshots.
- Do not rely on hover-only discovery for essential values.

## Interaction By Delivery Mode

Prototype:

- Implement interactions only if they help validate the concept.
- Prefer simple hover, filter, or simulated refresh.

Hybrid:

- Keep interaction state close to the adapter/view model boundary.
- Make future API parameters obvious.

Production:

- Handle loading, failure, partial failure, stale data, delayed/offline/reconnect behavior, and retry.
- Preserve the user's filter context across refresh when appropriate.
