# Verification

Use this file before claiming the dashboard is ready.

## Quality Precedence

Automated checks protect dashboard quality; they do not define the product. A passing inspection is not acceptable if it was achieved by lowering a confirmed requirement.

- Do not replace a confirmed real map, topology, advanced scene, image substrate, or domain-specific visual with a lower-fidelity placeholder just to pass `inspect-dashboard.mjs`.
- When `inspect-dashboard.mjs` reports blank or broken chart/scene output, first diagnose asset loading, data registration, container size, timing, projection, renderer, CORS, and console errors.
- For real maps, prefer local confirmed GeoJSON or another confirmed local map asset over runtime CDN/network fetches when reproducibility matters.
- Keep fallbacks secondary and conditional. A fallback may support offline, reduced-motion, loading, error, or unsupported-renderer states, but it must not replace the primary implementation unless the user explicitly accepts the downgrade.
- If the root cause cannot be fixed, report the blocker, failed check, screenshot/report path, and next required asset or environment change.

## Browser Checks

At minimum check:

- Target resolution, default `1920x1080`.
- No unintended page scroll.
- No horizontal overflow.
- No obvious element overlap.
- Panels align to a shared grid.
- Chart containers have non-zero size.
- ECharts canvases or SVGs render nonblank content.
- Text is readable and not clipped.
- KPI values are visible.
- Production loading, empty, error, stale, partial, reconnect, offline, and refresh states are visible when they can be simulated in the runnable environment.
- Advanced scenes, canvases, WebGL, 3D, or particles render nonblank content and have a visible fallback when required.

## Design Document Checks

Before implementation, verify `DASHBOARD.md`:

- Exists at the agreed path.
- Has YAML frontmatter with only `name`, `resolution`, and `description`.
- Uses a dashboard design structure, not the workflow phases as headings.
- States dashboard type separately from delivery mode.
- Includes a reading path or storyboard.
- Has a `Layout` section with an ASCII structure diagram.
- Describes each major screen region by purpose, content, visualization/component, visual treatment, data behavior, and interaction.
- Includes a `Chart Map` for major visuals when chart choice or data sufficiency matters.
- Includes `Advanced Visual Contract` when WebGL, 3D, particles, scrollytelling, stepper scenes, generated/raster substrates, or advanced motion are used.
- Has acceptance criteria that can be checked after implementation.

For `hybrid` and `production`, also verify:

- `DASHBOARD_API.yaml` exists or the user explicitly provided an OAS-compliant equivalent.
- `DASHBOARD.md` references `DASHBOARD_API.yaml` instead of duplicating full schemas.
- Every API-backed panel maps to at least one endpoint or schema.
- Field units, timestamp formats, refresh behavior, and empty/error/stale states are documented.
- `scripts/validate-dashboard-api.mjs` passes, or any remaining warnings are explicitly accepted.

## Scripted Inspection

Use the bundled script from the installed `dashboard-builder` skill folder. If needed, resolve the skill path first or copy the script into the target project.

Example when running from the skill folder:

```bash
node scripts/inspect-dashboard.mjs --file path/to/dashboard.html --viewport 1920x1080 --out report.json --screenshot screenshot.png
```

or:

```bash
node scripts/inspect-dashboard.mjs --url http://localhost:5173 --viewport 1920x1080 --out report.json --screenshot screenshot.png
```

The script needs Playwright available in the project or current runtime.

For `hybrid` or `production`, also run the lightweight API contract check from the skill folder or by absolute path:

```bash
node scripts/validate-dashboard-api.mjs path/to/DASHBOARD_API.yaml
```

## Automated Browser Gates

Treat these as hard failures:

- Page cannot load.
- Main content is blank.
- Severe console errors.
- Horizontal overflow at target viewport.
- Large panel overlap.
- Chart containers are zero-size.
- Advanced scene container is blank or fallback remains incorrectly layered over the primary scene.

Treat these as warnings:

- Minor alignment variance.
- Small text count above threshold.
- Many one-off colors.
- Noncritical console warnings.
- Missing screenshot due to environment constraints.

## Design And Analytical Gates

Treat these as hard failures:

- Default view does not answer the primary audience question.
- Reading path is unclear or does not match the selected dashboard type.
- Major chart uses a form that does not match its analytical question.
- Trend, scatter, or distribution chart is too sparse to support the claim and has no fallback.
- Advanced visual effect has no stated data, state, orientation, or narrative meaning.
- WebGL, 3D, particles, scrollytelling, or autoplay lacks static or reduced-motion fallback.

Treat these as warnings:

- KPI cards lack visible unit, time window, denominator, or freshness context.
- Related KPI, chart, and table values do not reconcile and the difference is not labeled.
- Chart labels, ticks, legends, annotations, or direct values collide or clip in the final dashboard container.
- Chart color encodes meaning without a non-color backup such as ordering, labels, line style, or shape.
- Legends, filters, scene controls, or source caveats are too far from the evidence they explain.

## Layered QA

Use the smallest useful mix:

- Data correctness: check metric definitions, units, time windows, denominators, sorting, aggregation, and KPI/chart/table reconciliation.
- API contract: run `validate-dashboard-api.mjs` for `hybrid` and `production`.
- Visual stability: run `inspect-dashboard.mjs` for target resolution, overlap, overflow, text clipping, and chart nonblank rendering.
- Interaction: verify filters, reset, drilldown, linked charts, full-screen, autoplay, scene stepper, URL/share state, and refresh behavior when present.
- Runtime states: verify loading, empty, error, live, delayed, stale, partial, offline, reconnecting, and last-known-good states that the design claims.
- Accessibility and export: check non-color encoding, reduced motion, static screenshots, source/caveat visibility, and export state when required.

## Production Data Gates

Treat these as hard failures for `production`:

- Production dashboard uses mock, sample, scratch, or fallback data as if it were real data.
- Required `DASHBOARD_API.yaml` is missing or unconfirmed.
- API-backed panels cannot be traced to a confirmed endpoint or schema.
- Loading, empty, error, stale, refresh, delayed, offline, reconnecting, last-known-good, and partial-failure states are missing from production implementation or acceptance criteria when relevant.

## Advanced Visual Gates

Treat these as hard failures when advanced visuals are used:

- `DASHBOARD.md` lacks an `Advanced Visual Contract`.
- The effect is only decorative and does not carry data, state, orientation, or narrative meaning.
- Static screenshot or reduced-motion state does not preserve the claim.
- Scene labels, legends, overlays, or hit targets detach from the evidence.
- Performance risk or degradation path is not stated.

## Dashboard Quality Bar

Before handoff, check that the dashboard is useful as a measurement surface:

- The default view answers the main monitoring or decision question before interaction.
- Hero KPIs have clear metric names, units, time windows, and denominator or eligibility rules when relevant.
- Charts answer specific questions and avoid combining unrelated metrics in one visual.
- Major charts have a compact `Chart Map` entry covering question, takeaway, chart variant, fields, units, data sufficiency, fallback, and final-context QA.
- Filters are few, meaningful, and affect the panels they claim to control.
- Tables support lookup, comparison, audit, or operational follow-up rather than duplicating charts.
- Source freshness, stale-data status, access limits, and caveats are visible where they affect interpretation.
- The metric set covers the relevant outcome, driver, guardrail, breakdown, and detail roles without flattening the screen into a chart pile.
- Presentation, editorial, and immersive dashboards preserve evidence while increasing visual impact; they do not trade truth for atmosphere.
