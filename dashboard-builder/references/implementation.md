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

## Hybrid

Default:

- React + TypeScript + ECharts for new projects.
- Mock data behind a data adapter shaped like the future API.
- View models separated from raw mock/API response.

Deliver:

- Components or page.
- Mock API contract.
- Adapter/service boundary.
- Clear note on how to replace mock data with real API.

## Production

Default:

- React + TypeScript + ECharts for new projects.
- Real API calls in service/adapter layer.
- Loading, empty, error, stale, refresh, and partial-failure states.

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
