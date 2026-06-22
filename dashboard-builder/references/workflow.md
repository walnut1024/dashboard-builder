# Workflow

Use this sequence for every dashboard build. This is the working process, not the final design document structure.

## Interactive Intake Contract

Default to interactive QA, not one-shot specification.

- Advance one phase per assistant response.
- Ask at most three high-value questions in each response.
- Use defaults to reduce burden, but present them as recommended defaults for the current phase only.
- Stop after the current phase questions. Wait for the user to answer, confirm, or authorize defaults.
- Do not gather every phase, write `DASHBOARD.md`, or start implementation in the same response as the initial brief unless the user explicitly asks to use defaults or move fast.
- If the user says "use defaults", "fast", "快速生成", "不用问了", or equivalent, compress the remaining intake into a concise confirmation summary, then still require confirmation before writing `DASHBOARD.md`.
- Treat a plain "continue" as permission to advance to the next phase only. It does not authorize compressing remaining phases or applying defaults beyond the current transition.

Phase transition rules:

- Phase 1 can proceed to Phase 2 after audience, viewing environment, goal, dashboard type, resolution, delivery mode, and key technical constraints are confirmed or defaulted with user approval.
- Phase 2 can proceed after core narrative, reading path, metric groups, data entities, major visual intent, refresh behavior, and priority are confirmed or defaulted with user approval.
- Phase 3 is skipped for `prototype`; for `hybrid` or `production`, it must produce or adopt a first-pass `DASHBOARD_API.yaml` and get user confirmation.
- Phase 4 can proceed after layout, visual system, interaction requirements, effects, and implementation/template starting point are confirmed.
- Phase 5 writes `DASHBOARD.md` only after Phases 1-4 are complete, and required API contracts are confirmed.
- Phase 6 starts only after the user confirms `DASHBOARD.md` and any required `DASHBOARD_API.yaml`.

## Phase 1: Brief

Confirm:

- Audience: who watches or operates the dashboard.
- Viewing environment: command center, meeting room, exhibition wall, desktop browser, embedded system, kiosk, or projection.
- Goal: monitor, report, warn, dispatch, analyze, demonstrate, or sell.
- Dashboard type. Default to `operational` for monitoring and command-center requests; otherwise infer and ask for confirmation.
- Target resolution. Default to `1920x1080`.
- Display size or browser viewport, if known. If unknown, default viewport adaptation to `fit-contain-center`.
- Delivery mode. Default to `prototype`.
- Technical constraints already known: CDN/internet, existing project stack, browser target, deployment target, auth, offline requirements, full-screen, autoplay, motion, WebGL/3D, or device capability limits.

Dashboard types:

- `operational`: monitoring, command center, alerting, dispatch, incident response, live status.
- `analytical`: business overview, BI-style analysis, comparison, trend, diagnosis, driver breakdown.
- `presentation`: leadership report, exhibition wall, sales or achievement display, lower data density and stronger visual hierarchy.
- `editorial`: data story, staged explanation, annotations, stepper, scrollytelling, narrative sequence.
- `immersive`: map/3D/WebGL/particles/topology/flow scene where the visual substrate carries orientation or meaning.

Delivery modes:

- `prototype`: single HTML dashboard with mock data. Default to Tailwind CDN and ECharts CDN.
- `hybrid`: production-shaped app using mock data behind an adapter shaped like the future API.
- `production`: real backend APIs with loading, empty, error, stale, and refresh states.

Viewport adaptation modes:

- `fit-contain-center`: default when display size is unknown. Use a fixed design canvas, usually `1920x1080`, then proportionally scale and center it so the full dashboard is visible on 1440x900, 1920x1080, 2560x1440, and 3840x2160.
- `fluid-responsive`: use CSS grid/flex to reflow panels for ordinary web dashboards where the browser viewport varies and pixel-perfect large-screen composition is less important.
- `fit-cover-crop`: use only for exhibition backgrounds or immersive scenes where edge cropping is accepted. Keep KPIs, labels, controls, and primary evidence inside a safe area.

## Phase 2: Information Model

Confirm what the screen must communicate:

- Core narrative: the one-sentence purpose of the screen.
- Reading path: what a viewer should understand first, second, and on demand before any interaction.
- Metric groups: overview KPIs, trends, distribution, rankings, alerts, detail tables.
- Metric roles: hero outcome, drivers, guardrails, breakdowns, and detail metrics.
- Data entities: regions, devices, patients, orders, assets, events, projects, or other domain objects.
- Major visual intent: map, topology, process, trend, ranking, distribution, matrix, table, timeline, ticker, or center situation view.
- Major chart intent for the later `Chart Map`: analytical question, intended takeaway, fields, units, and data sufficiency risk.
- Refresh behavior: static, manual, polling, stream, or real time.
- Runtime state model for remote or live data: live, delayed, stale, partial, offline, reconnecting, empty, and error when relevant.
- Priority: main visual, secondary panels, and supporting details.

Use `references/chart-contract.md` when selecting chart types or when a panel's data shape could make the obvious chart misleading.

Use `assets/templates/dashboard-reading-path.md` or `dashboard-chart-map.md` when the prompt is broad or chart-heavy.

## Phase 3: Data Contract

Skip this phase for `prototype`.

For `hybrid` and `production`, create or adopt a first-pass API contract before screen design hardens:

- Ask the user for API interface information or an existing OpenAPI Specification document.
- If the user provides OAS-compliant documentation, save or adapt it as `DASHBOARD_API.yaml` at the agreed path. Default to the project root unless the project has a docs/specs convention.
- If the user provides natural language, tables, endpoint lists, curl examples, backend code, or partial docs, organize them into OpenAPI Specification format as `DASHBOARD_API.yaml`.
- Ask the user to confirm or correct the first-pass `DASHBOARD_API.yaml`.
- Run `scripts/validate-dashboard-api.mjs` when available to catch basic OAS structure issues before asking for confirmation.
- Treat this as the initial contract. Reconcile it again during Design Freeze after sections and panels are known.
- Do not implement hybrid adapters or production API calls until the final `DASHBOARD_API.yaml` is confirmed.

Use `references/api-contract.md` for the required OAS fields and confirmation checks.
Use `assets/templates/dashboard-api-contract-checklist.md` to keep API confirmation complete.

## Phase 4: Screen Design

Confirm:

- Layout pattern and screen density.
- Viewport adaptation mode and safe area.
- Dashboard-type fit: operational, analytical, presentation, editorial, or immersive rules that shape the design.
- Reading path and visible-by-default evidence.
- Main visual region.
- KPI placement.
- Left/right/bottom panel allocation.
- Responsive fallback, if any.
- Implementation/template starting point: existing project stack, `assets/template.html` for standalone prototypes, `assets/react-echarts-template/` for new React hybrid/production builds, or `assets/templates/*` for design, QA, API, and storyboard control.
- Visual direction from `themes.md`.
- Theme colors and chart palette.
- Font style and size scale.
- Background treatment.
- Panel border, shadow, transparency, and radius.
- Motion intensity.
- Hover tooltips.
- Filters.
- Chart linking.
- Drilldown.
- Alert expansion.
- Auto-rotation.
- Refresh controls.
- Full-screen behavior.
- Visual effects.

Type-specific checks:

- `operational`: stable metric positions, alert hierarchy, live/stale/offline/partial states, last-known-good evidence, reset paths.
- `analytical`: strongest comparison visible by default, filters near affected evidence, driver/breakdown/detail hierarchy.
- `presentation`: first-glance message, large hero evidence, restrained supporting detail, screenshot-ready composition.
- `editorial`: storyboard or scene sequence, claim titles, annotations, stepper/scrollytelling behavior, static frame fallback.
- `immersive`: scene/substrate meaning, map/3D/WebGL/particle contract, data-to-effect mapping, reduced-motion/static fallback.

Prototype defaults to CDN. If internet or CDN is not allowed, use local assets or inline CSS/JS and explain the tradeoff.

Use templates selectively:

- Brief or design control: `dashboard-brief.md`, `dashboard-design-contract.md`, `dashboard-reading-path.md`.
- Presentation: `presentation-dashboard-brief.md`.
- Editorial: `editorial-dashboard-storyboard.md`.
- Immersive or advanced effects: `immersive-dashboard-contract.md`, `advanced-visual-effects-contract.md`.
- QA and handoff: `dashboard-qa-plan.md`, `live-dashboard-review-checklist.md`, `accessibility-review-checklist.md`, `export-checklist.md`.

## Phase 5: Design Freeze

After the first four phases are confirmed, write `DASHBOARD.md` before implementation. Default to the project root unless the project has an existing docs/specs convention, and ask before overwriting existing files.

Rules:

- Use `references/dashboard-spec.md`.
- Do not paste workflow phases as the document structure.
- Write a layout-first dashboard design document.
- Include YAML frontmatter with only `name`, `resolution`, and `description`.
- Include an ASCII structure diagram in the `Layout` section.
- Include dashboard type and reading path in the body.
- Include viewport adaptation mode, design canvas, safe area, and required test viewports in the body.
- Include a `Chart Map` for major charts only.
- Include `Optional: Advanced Visual Contract` when using WebGL, 3D, particles, scrollytelling, stepper scenes, generated/raster substrates, or advanced motion.
- For `hybrid` and `production`, reconcile every API-backed section and panel against `DASHBOARD_API.yaml`.
- Run the lightweight API validator again after reconciliation when `DASHBOARD_API.yaml` exists.
- Ask the user to confirm or edit `DASHBOARD.md` and, when required, the final `DASHBOARD_API.yaml`.
- Do not code until the user confirms the design document and required API contract.

If the user requests a quick version, write concise documents rather than skipping the freeze.

## Phase 6: Implementation And QA

Confirm acceptance criteria before or during handoff:

- Target resolution renders without overlap or unintended scroll.
- Key metrics are legible within five seconds.
- The default view answers the primary audience question before interaction.
- The reading path and dashboard type are visible in the implemented screen.
- Charts have labels, units, and plausible data.
- Major charts have a clear analytical question, takeaway, compatible fields, and sufficient data for the selected form.
- Related KPI, chart, and table values reconcile or explain differences.
- KPI cards show metric names, units, time windows, and denominator rules when relevant.
- Production states cover loading, empty, error, stale, refresh, and relevant delayed/offline/partial/reconnect behavior.
- Production data comes from confirmed APIs, not mock or sample data.
- Advanced visual effects have stated meaning plus static or reduced-motion fallback.
- The bundled `scripts/inspect-dashboard.mjs` is run when a browser-capable environment is available.

## Confirmation Format

For each phase, respond with:

```text
Stage:
Confirmed:
Assumptions:
Missing:
Recommended Defaults:
Questions:
```

Do not proceed to the next phase until the user confirms, corrects, or explicitly authorizes defaults for the current phase. Do not proceed to implementation until the user confirms `DASHBOARD.md` and any required `DASHBOARD_API.yaml`.
