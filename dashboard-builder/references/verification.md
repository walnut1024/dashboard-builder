# Verification

Use this file before claiming the dashboard is ready.

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
- Loading, empty, error, stale, and refresh states exist for production.

## Design Document Checks

Before implementation, verify `DASHBOARD.md`:

- Exists at the agreed path.
- Has YAML frontmatter with only `name`, `resolution`, and `description`.
- Uses a dashboard design structure, not the seven workflow steps as headings.
- Has a `Layout` section with an ASCII structure diagram.
- Describes each major screen region by purpose, content, visualization/component, visual treatment, data behavior, and interaction.
- Has acceptance criteria that can be checked after implementation.

## Scripted Inspection

Use:

```bash
node scripts/inspect-dashboard.mjs --file path/to/dashboard.html --viewport 1920x1080 --out report.json --screenshot screenshot.png
```

or:

```bash
node scripts/inspect-dashboard.mjs --url http://localhost:5173 --viewport 1920x1080 --out report.json --screenshot screenshot.png
```

The script needs Playwright available in the project or current runtime.

## Quality Gates

Treat these as hard failures:

- Page cannot load.
- Main content is blank.
- Severe console errors.
- Horizontal overflow at target viewport.
- Large panel overlap.
- Chart containers are zero-size.
- Required production states are absent.

Treat these as warnings:

- Minor alignment variance.
- Small text count above threshold.
- Many one-off colors.
- Noncritical console warnings.
- Missing screenshot due to environment constraints.
