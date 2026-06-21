# Implementation

Use this file before coding.

## Existing Project First

Inspect the current project before choosing a stack. If the project already has a frontend framework, routing, chart library, UI library, styling system, data-fetching pattern, or test setup, use it unless the user asks otherwise.

## Prototype

Default:

- Single HTML file.
- Tailwind CDN.
- ECharts CDN.
- Mock data inline.
- Start from `assets/template.html` when useful.

If CDN or internet is not allowed, ask before switching to local assets or inline CSS/JS.

For simple prototype charts, ECharts CDN is acceptable. For very simple visuals, CSS/SVG/Canvas can be enough.

For presentation, editorial, or immersive prototypes, still prefer a single HTML file unless the requested scene requires a project stack. Use CDN libraries only when allowed.

## Lightweight Technical Design

Before coding substantial `hybrid`, `production`, `editorial`, or `immersive` dashboards, document:

- Expected chart or scene instance count.
- Target container sizes and responsive fallback.
- Data volume, mark count, scene object count, or update cadence.
- Interaction states: filters, hover/tap, selection, scene step, autoplay, zoom, drilldown, refresh.
- Renderer choice and why it fits the dashboard.
- Performance degradation plan.
- Static or reduced-motion fallback for advanced visuals.

## Fidelity And Asset Handling

- Preserve the confirmed visual requirement. Automated inspection failures are defects to diagnose, not permission to downgrade the primary dashboard design.
- If the user asks for a real geographic map, topology, floor plan, image substrate, 3D model, or other domain-specific asset, use the real asset or ask the user for it.
- When a runtime network asset is needed, prefer downloading or copying it into the project and referencing it locally when licensing and project policy allow. For ECharts maps, register the local GeoJSON with `echarts.registerMap` before rendering.
- Do not replace a confirmed real map with a DOM/SVG schematic, grid, abstract matrix, or placeholder just to pass nonblank canvas checks.
- Use lower-fidelity fallbacks only as conditional fallback states, reduced-motion/static alternatives, or explicitly user-approved temporary gaps. Label them as fallback or unresolved, not as the primary fulfilled requirement.
- If a high-fidelity visual fails inspection because of an asset, projection, container, renderer, CORS, or timing issue, fix that root cause first. If it cannot be fixed in the current environment, report the failed check and the exact blocker instead of silently lowering fidelity.

## Chart Implementation

- Implement major charts from the confirmed `Chart Map` in `DASHBOARD.md`.
- Keep ECharts options aligned with the selected chart family, fields, units, palette policy, and non-color distinction plan.
- Keep chart-ready view models separate from raw mock/API responses.
- Leave enough container space for labels, legends, tooltips, negative values, and direct value labels at the target resolution.
- If the data is too sparse for the selected chart, switch to the documented fallback rather than forcing the original chart type.

## Renderer Selection

- Use ECharts for standard dashboard charts, KPI-adjacent trends, maps when ECharts maps are sufficient, and fast prototype work.
- Use SVG or DOM for simple custom diagrams, direct labels, annotations, and crisp vector overlays.
- Use Canvas2D for dense flat marks, custom hit testing, or many repeated microcharts when SVG/DOM is too heavy.
- Use Three.js, WebGL, deck.gl, PixiJS, or similar renderers only when scale, 3D structure, particles, flow, topology, shader effects, or spatial interaction materially improve the dashboard.
- Use static HTML/CSS/SVG fallback when advanced renderers are not allowed or cannot be verified.

Advanced effects must follow the `Advanced Visual Contract` in `DASHBOARD.md`; do not add ambient effects that have no data, state, orientation, or narrative role.

## Hybrid

Default:

- React + TypeScript + ECharts for new projects.
- Confirmed `DASHBOARD_API.yaml` before coding.
- Mock data behind a data adapter shaped like the future API.
- View models separated from raw mock/API response.
- Start from `assets/react-echarts-template/` only when the target workspace has no suitable frontend stack.

Deliver:

- Components or page.
- Mock data that conforms to `DASHBOARD_API.yaml`.
- Adapter/service boundary.
- Clear note on how to replace mock data with real API.

## Production

Default:

- React + TypeScript + ECharts for new projects.
- Confirmed `DASHBOARD_API.yaml` before coding.
- Real API calls in service/adapter layer.
- Loading, empty, error, stale, refresh, and partial-failure states.
- Delayed, offline, reconnecting, and last-known-good states when remote or live data requires them.
- No mock, sample, scratch, or fallback data presented as production data.
- Start from `assets/react-echarts-template/` only when creating a new standalone React dashboard.

Confirm:

- Endpoint paths and methods.
- Auth.
- Request parameters.
- Response schema.
- Units and timestamp formats.
- Refresh behavior.
- Deployment/runtime environment.

## Styling

- Use Tailwind for new prototype HTML and new React projects.
- Preserve existing styling systems in existing projects.
- Centralize theme tokens: colors, status colors, font scale, panel style, chart palette.

## Comments

Add comments only where they explain data contracts, adapter boundaries, or non-obvious chart setup.
