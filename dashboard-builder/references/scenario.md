# Usage Scenario

Use this file during Phase 1: Brief.

## Audience

Common audience types:

- Executives: need fast status, risk, and trend signals.
- Operators: need alerts, refresh state, and actionable details.
- Dispatchers: need incidents, locations, queues, and current workload.
- Analysts: need comparisons, filters, and detailed tables.
- Customers or visitors: need polished narrative and visual impact.

## Viewing Environment

- Wall display: prioritize large text, low glare, and glanceability.
- Meeting room: balance presentation polish with credible detail.
- Desktop browser: support interaction, filtering, and narrower widths.
- Exhibition or kiosk: emphasize visual narrative and controlled motion.
- Embedded system: preserve host app conventions and navigation constraints.

## Delivery Mode

Default to `prototype` when the user does not specify.

- Choose `prototype` for visual concepts, demos, early requirement alignment, and standalone previews.
- Choose `hybrid` when the backend is not ready but the dashboard should use production-shaped data boundaries.
- Choose `production` when endpoints, auth, or project service layers already exist or are expected in the current task.

## Dashboard Type

Confirm dashboard type separately from delivery mode:

- `operational`: monitor live status, alerts, dispatch, risk, or incidents.
- `analytical`: compare performance, diagnose drivers, or explore business metrics.
- `presentation`: explain achievements, progress, or value in a leadership, sales, launch, or exhibition setting.
- `editorial`: tell a staged data story with annotations, scenes, stepper, scroll, or autoplay.
- `immersive`: use maps, topology, 3D, WebGL, particles, or spatial scenes where the surface carries orientation or meaning.

When the user says "大屏" without more detail, infer from the usage scenario. Do not force an operational layout onto exhibition, presentation, or story screens.

## Defaults

- Resolution: `1920x1080`.
- Layout: `Command Center`.
- Theme: `Operations Dark`.
- Main visual: abstract center situation view.
- Prototype dependencies: Tailwind CDN and ECharts CDN.
