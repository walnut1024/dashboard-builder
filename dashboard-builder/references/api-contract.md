# API Contract

Use this reference when delivery mode is `hybrid` or `production`, or when the user provides API details for the dashboard.

## Goal

Create or adopt a dashboard-specific OpenAPI Specification file named `DASHBOARD_API.yaml` before implementation. Default to the current project root unless the project already has a clear docs/specs convention. Ask before overwriting an existing API contract.

`DASHBOARD_API.yaml` is the source of truth for backend data shape. `DASHBOARD.md` should reference it but should not duplicate full endpoint schemas.

Use two passes:

- First pass during Data Contract: capture known or intended endpoints so screen design can stay realistic.
- Final pass during Design Freeze: reconcile the confirmed sections and API-backed panels against `DASHBOARD_API.yaml`.

## Source Access Guardrail

Before drafting or implementing a `production` dashboard, determine whether the dashboard requires real backend APIs as the source of truth.

- If real API details, access, or OAS documentation are required but unavailable, stop the production path and ask for them.
- Do not substitute mock, sample, scratch, or partially blocked data for production data unless the user explicitly changes the mode to `prototype` or `hybrid`.
- If a missing source is optional enrichment rather than a core dashboard dependency, continue with the strongest available contract and label the gap in `DASHBOARD.md`.
- For `hybrid`, it is acceptable for the backend not to exist yet, but `DASHBOARD_API.yaml` must still describe the intended future contract.

## Inputs To Accept

The user may provide:

- Existing OpenAPI Specification YAML or JSON.
- Endpoint lists with method, path, params, and examples.
- Backend controller/service code.
- curl examples.
- Tables or prose describing interfaces.
- Partial details plus assumptions.

If the input already follows OAS, preserve it and only normalize naming or missing dashboard-specific metadata when necessary. If it does not follow OAS, draft `DASHBOARD_API.yaml` from the supplied information and clearly mark assumptions for confirmation.

## Required OAS Shape

`DASHBOARD_API.yaml` must include at least:

```yaml
openapi: 3.0.3
info:
  title: Dashboard API
  version: 0.1.0
servers:
  - url: https://api.example.com
    description: Replace with the confirmed dashboard API base URL.
paths: {}
components:
  schemas: {}
```

For every endpoint known in the first pass, define as much as the user can confirm:

- HTTP method and path.
- Purpose in the dashboard.
- Query/path/body parameters.
- Auth requirements, if known.
- Response schema under `components.schemas`.
- Error responses, at least common `400`, `401`, `403`, `404`, and `500` where relevant.
- Units, timestamp format, timezone, enum values, and nullable fields.
- Pagination, sorting, filtering, or range parameters.
- Refresh expectations: static, manual, polling interval, stream, or real time.
- Runtime state fields or conventions for delayed, stale, partial, offline, reconnecting, and last-known-good behavior when the dashboard depends on live or remote data.

If the base URL is unknown during `hybrid`, keep a placeholder server URL and label it as an assumption. For `production`, do not implement API calls until the server URL or runtime proxy path is confirmed.

## Lightweight Validation

Run the bundled validator before asking the user to confirm the first-pass contract and again after Design Freeze reconciliation:

```bash
node path/to/dashboard-builder/scripts/validate-dashboard-api.mjs DASHBOARD_API.yaml
```

This script checks basic OAS structure and common dashboard contract omissions. It is not a replacement for a full OpenAPI linter in projects that already provide one.

## Hybrid Mode

For `hybrid`, `DASHBOARD_API.yaml` defines the future API shape even if no backend exists yet.

Implementation should:

- Generate mock responses that conform to `DASHBOARD_API.yaml`.
- Put mock data behind an adapter/service boundary.
- Map raw API-shaped responses into chart-ready view models.
- Keep replacement with real API calls obvious.

## Production Mode

For `production`, `DASHBOARD_API.yaml` should describe real backend APIs.

Implementation should:

- Use the confirmed endpoints in the service/adapter layer.
- Implement loading, empty, error, stale, refresh, delayed, offline, reconnecting, and partial-failure states when relevant.
- Avoid inventing undocumented fields without updating `DASHBOARD_API.yaml` and asking for confirmation.

## Confirmation Checklist

During the first pass, ask the user to confirm:

- Field names, meanings, units, and examples are correct.
- Timestamp formats and timezone are correct.
- Auth, headers, cookies, tokens, or proxy requirements are correct.
- Refresh behavior and polling intervals are acceptable.
- Error, empty, stale, and partial data behavior is defined.
- Last-known-good behavior is defined for live or remote data.
- Mock data in hybrid mode is allowed to follow this contract.

During Design Freeze, also confirm:

- Endpoint coverage matches every API-backed dashboard panel.
- Each section that needs backend data maps to a path and response schema.
- Any missing optional source is labeled in `DASHBOARD.md`.

Do not proceed to implementation until the user confirms `DASHBOARD_API.yaml` or explicitly accepts the listed assumptions.
