# Layouts

Use this file during Phase 4: Screen Design and when writing the `DASHBOARD.md` Layout section.

Every selected layout in `DASHBOARD.md` must include an ASCII structure diagram.

## Selection Guide

- Business overview: use `Overview Sandwich` or `Three-Column`.
- Map or spatial situation: use `Center-Radiation` or `Map-Dominant`.
- Many equal metrics: use `Card Matrix`.
- Business process: use `Process Flow`.
- Real-time operations: use `Realtime Monitoring`.
- Leadership or exhibition: use `Presentation`.
- Data story: use `Editorial Story`.
- Immersive map, topology, or 3D scene: use `Immersive Stage`.
- Time-series or simple hierarchy: use `Vertical Split`.

## 1. Overview Sandwich

Most stable default layout. It gives a global summary, a dominant center, and supporting details.

Best for: business overview, executive operations, general monitoring.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header: Title / Time / Scope / Refresh                       │
├──────────────────────────────────────────────────────────────┤
│ KPI Band: KPI 1 | KPI 2 | KPI 3 | KPI 4 | KPI 5              │
├───────────────┬──────────────────────────────┬───────────────┤
│ Left Analysis │ Center Main View             │ Right Signals │
│ Trend/Rank    │ Map / Core Chart / Flow      │ Alerts/Detail │
├───────────────┴──────────────────────────────┴───────────────┤
│ Bottom: Detail Table / Timeline / Supporting Trend            │
└──────────────────────────────────────────────────────────────┘
```

Strength: balanced hierarchy and easy comprehension.
Risk: can become generic if every panel gets equal visual weight.

## 2. Center-Radiation

The center carries the most important situation; surrounding panels explain it.

Best for: command centers, city governance, logistics dispatch, equipment monitoring.

```text
┌──────────────┬──────────────────────────────┬──────────────┐
│ Region Stats │ Top Context / KPI Strip      │ Alert Stats  │
├──────────────┼──────────────────────────────┼──────────────┤
│ Trend        │                              │ Ranking      │
│              │        Center Situation      │              │
│ Distribution │      Map / Topology / Core   │ Event Feed   │
├──────────────┼──────────────────────────────┼──────────────┤
│ Detail A     │ Bottom Trend / Timeline      │ Detail B     │
└──────────────┴──────────────────────────────┴──────────────┘
```

Strength: clear visual focus.
Risk: surrounding modules can become fragmented.

## 3. Three-Column

Three vertical columns, with the center usually wider.

Best for: operations consoles, real-time business dashboards, monitoring desktops.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├───────────────┬──────────────────────────────┬───────────────┤
│ Left Overview │ Main Analysis                │ Right Activity│
│ KPIs          │ Dominant Chart / Flow        │ Alerts        │
│ Breakdown     │ Trend / Comparison           │ Events        │
│ Ranking       │ Detail Table                 │ Notes         │
└───────────────┴──────────────────────────────┴───────────────┘
```

Strength: easy to build and extend.
Risk: weak if the center does not clearly dominate.

## 4. Card Matrix

Grid of similarly sized cards.

Best for: multi-metric walls, department dashboards, BI snapshots.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header / Filter / Refresh                                    │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ Card 1       │ Card 2       │ Card 3       │ Card 4        │
├──────────────┼──────────────┼──────────────┼───────────────┤
│ Card 5       │ Card 6       │ Card 7       │ Card 8        │
├──────────────┼──────────────┼──────────────┼───────────────┤
│ Card 9       │ Card 10      │ Card 11      │ Card 12       │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

Strength: clear and modular.
Risk: lacks narrative and can become chart dumping.

## 5. Vertical Split

Top region carries the main view; bottom region provides breakdowns and details.

Best for: time-series analysis, production monitoring, transaction monitoring.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header + KPI Strip                                           │
├──────────────────────────────────────────────────────────────┤
│ Main View: Core Trend / Status / Comparison                   │
│                                                              │
├───────────────┬──────────────────────────────┬───────────────┤
│ Breakdown A   │ Breakdown B                  │ Detail Table  │
└───────────────┴──────────────────────────────┴───────────────┘
```

Strength: simple hierarchy.
Risk: bottom panels can feel secondary or cramped.

## 6. Map-Dominant

Map or spatial view owns most of the screen, with overlays around it.

Best for: logistics, stores, security, smart city, energy, traffic.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header / Global KPIs / Time                                  │
├──────────────────────────────────────────────────────────────┤
│ ┌────────────┐                                  ┌──────────┐ │
│ │ KPI Stack  │                                  │ Alerts   │ │
│ └────────────┘        Full Map / Geo View       └──────────┘ │
│ ┌────────────┐                                  ┌──────────┐ │
│ │ Filters    │                                  │ Ranking  │ │
│ └────────────┘                                  └──────────┘ │
└──────────────────────────────────────────────────────────────┘
```

Strength: high impact for location-based data.
Risk: map readability and data density are hard to balance.

## 7. Process Flow

Organize information by business chain from left to right or top to bottom.

Best for: order fulfillment, supply chain, production, funnels, risk workflows.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header + End-to-End KPIs                                     │
├───────────┬───────────┬───────────┬───────────┬────────────┤
│ Inflow    │ Convert   │ Process   │ Deliver   │ Aftercare  │
│ Metrics   │ Metrics   │ Metrics   │ Metrics   │ Metrics    │
├───────────┴───────────┴───────────┴───────────┴────────────┤
│ Bottlenecks / Exceptions / Timeline                          │
└──────────────────────────────────────────────────────────────┘
```

Strength: strong narrative.
Risk: weak for unrelated metrics.

## 8. Realtime Monitoring

State, anomalies, and response are more important than analysis depth.

Best for: infrastructure, devices, security, trading risk, service operations.

```text
┌──────────────────────────────────────────────────────────────┐
│ Global Status: Health / Incidents / SLA / Refresh            │
├───────────────┬──────────────────────────────┬───────────────┤
│ Status Matrix │ Topology / Live Trend        │ Alert Queue   │
│ Thresholds    │ Current Load / Hotspots      │ Incident SLA  │
├───────────────┴──────────────────────────────┴───────────────┤
│ Live Log / Event Stream / Recent Changes                      │
└──────────────────────────────────────────────────────────────┘
```

Strength: operationally useful.
Risk: can become noisy without severity hierarchy.

## 9. Presentation

Visual narrative and first-glance clarity matter more than analytic depth.

Best for: leadership reporting, exhibition, brand display, achievements.

```text
┌──────────────────────────────────────────────────────────────┐
│ Large Title / Date / Organization                            │
├──────────────────────────────┬───────────────────────────────┤
│ Hero Number / Main Visual    │ Supporting Highlights          │
│ Big Chart / Illustration     │ KPI Stories / Milestones       │
├──────────────────────────────┴───────────────────────────────┤
│ Short Trend / Key Achievements / Footer Notes                 │
└──────────────────────────────────────────────────────────────┘
```

Strength: memorable and easy to explain.
Risk: not suitable for dense monitoring or operational response.

## 10. Editorial Story

Staged explanation with a clear sequence.

Best for: exhibition narratives, data stories, annual achievements, guided briefings.

```text
┌──────────────────────────────────────────────────────────────┐
│ Title / Scene Progress / Source                              │
├──────────────────────────────────────────────┬───────────────┤
│ Story Stage: Claim + Main Evidence           │ Scene Notes   │
│ Chart / Map / Visual State                   │ Key Callouts  │
├──────────────────────────────────────────────┴───────────────┤
│ Stepper / Timeline / Scene Controls / Caveats                 │
└──────────────────────────────────────────────────────────────┘
```

Strength: strong reading path.
Risk: weak for open-ended monitoring or dense operational response.

## 11. Immersive Stage

The scene or substrate is the main evidence surface.

Best for: spatial operations, flow, topology, geospatial status, 3D facility, exhibition immersion.

```text
┌──────────────────────────────────────────────────────────────┐
│ Title / Global Status / Scene Mode / Time                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│        Immersive Scene: Map / 3D / Topology / Flow           │
│        Floating KPIs / Labels / Alerts / Legend              │
│                                                              │
├──────────────────────────────┬───────────────────────────────┤
│ Scene Controls / Fallback    │ Details / Events / Source     │
└──────────────────────────────┴───────────────────────────────┘
```

Strength: high orientation and visual impact when the substrate carries meaning.
Risk: can become decorative if effects are not tied to data or state.

## Layout Rules

- Use stable grid tracks and explicit dimensions for major regions.
- Make the selected layout type visible in `DASHBOARD.md`.
- Put the ASCII diagram before panel detail.
- Define a reading path: first scan, second scan, and on-demand detail.
- Keep legends, filters, scene controls, source status, and active caveats near the evidence they affect.
- Avoid nested cards.
- Align panel edges on a shared grid.
- Reserve enough room for legends, axis labels, and long values.
- Keep the main visual larger than supporting panels unless using Card Matrix.
- For `1920x1080`, use consistent margins and gaps, usually 16-24px.
- Narrow fallback can stack panels, but large-screen layout is the primary design.
- Mobile or narrow fallback is secondary unless requested; do not make it drive the large-screen composition.
