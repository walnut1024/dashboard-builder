# Chart Map Rules

Use this reference when choosing, specifying, implementing, or reviewing dashboard charts.

## Chart Map Entry Template

Before implementing chart-heavy panels, define a compact `Chart Map` entry in `DASHBOARD.md`. This reference defines chart rules; it does not create a separate output file.

- Analytical question:
- One-sentence takeaway:
- Chart family and concrete variant:
- Surface: large-screen dashboard, prototype HTML, React/ECharts, or existing project surface.
- Data grain and expected row count:
- Fields: dimensions, measures, units, denominators, timestamps, filters, and sample size when relevant.
- Data sufficiency: enough points/categories/observations for the selected chart, or fallback choice.
- Palette policy: single-root, two-root, or multi-category.
- Non-color distinction: direct labels, ordering, line style, open fill, marker fill, faceting, or shape.
- Final-context QA: viewport, panel size, label fit, legend fit, tooltip behavior, and screenshot/inspection target.
- Reading-path role: first scan, second scan, or on-demand detail.

## Chart Selection

- Trend over time: line. Use area only when filled magnitude helps. Use sparkline only inside dense KPI cards.
- Composition over time: stacked area when parts should read as one total; use lines when comparing component trajectories matters more.
- Comparison across categories: bar. Use horizontal bars for long labels and sort when order is not semantic.
- Ranking or top-N: compact leaderboard or ranked bar. Default to 5-6 visible rows in small dashboard cards.
- Part-to-whole: stacked bar or 100% stacked bar. Use ring/pie only for rough composition with few slices.
- Distribution: histogram for numeric shape; box plot when comparing group medians and spread.
- Relationship between two numeric variables: scatter at one meaningful observation grain.
- Dense matrix or cohort pattern: heatmap.
- Additive bridge from start to end: waterfall only when drivers sum cleanly.
- Ordered stage progression: funnel only for ordered single-series stages; prefer stage bars when funnel geometry would distort comparison.
- Exact lookup or audit: table.

## Data Sufficiency Guardrails

- Do not ship underpowered trend charts. Aim for at least 8-12 temporal points; otherwise query a finer grain, extend the lookback, add a meaningful comparator, or switch to KPI cards, grouped bars, slope charts, tables, or callouts.
- Do not ship underpowered scatter charts. Aim for at least 12-20 meaningful observations; fewer than 8 points usually belongs in a bar, dot/lollipop, table, or labeled comparison.
- Do not mix totals, averages, and detail rows in one scatter. Keep all plotted rows at the same grain.
- Do not combine unrelated metrics in one chart unless the reader needs a direct comparison and the units, denominator, date range, and filters are compatible.
- Include volume, denominator, sample size, or cohort context when omission could mislead.

## Misuse Guardrails

- Do not choose line merely because the prompt says "trend"; decide whether the reader needs status, movement, variance, mix, drivers, progression, or distribution.
- Do not add a color or legend that duplicates the x-axis category.
- Do not rank KPI definitions or time-window definitions against each other; use KPI cards, compact tables, ratio charts, or trend views.
- Do not default to pie, bubble, waterfall, or funnel charts. Use them only when their structure fits the analytical question.
- Do not use bubble size unless the third variable materially changes interpretation.
- Use charts for shape and comparison; use tables for exact lookup.

## Palette And Encoding

- Choose a palette policy before implementation:
  - `single-root`: one non-neutral root plus neutrals for simple trends, ranks, distributions, relationships, and repeated panels.
  - `two-root`: at most two non-neutral roots plus neutrals for binary, signed, focal-vs-context, comparator, benchmark, or waterfall views.
  - `multi-category`: up to five category colors when category identity matters. If more are needed, group to top-N plus Other or change forms.
- Do not rely on color alone. Use tone, open fill, marker fill, line style, direct labels, ordering, faceting, or shape.
- For signed values, avoid default green/red unless domain semantics require it. Use zero-line context and signed labels.
- Keep benchmark, target, and reference lines in neutral dark styling.
- Prefer direct labels when they reduce legend lookup. Use compact legends only when labels would clutter.
- Keep labels, legends, and keys near the marks they explain.

## Final-Context QA

Inspect the chart in the dashboard container readers will use:

- Title and subtitle fit the panel and state metric, unit, time window, denominator, or source context when needed.
- Labels, ticks, legends, tooltips, annotations, and direct values do not collide, clip, or detach from the evidence.
- Long labels, negative values, outside-end labels, and zero-line context have enough space.
- Multi-series marks remain distinguishable without relying on color alone.
- Comparable charts use consistent scales, date windows, filters, units, and palette treatment.
- The chart answers the stated analytical question at the target resolution before handoff.
