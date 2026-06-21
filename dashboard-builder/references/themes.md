# Themes

Use this file during Phase 4: Screen Design.

## Built-In Directions

Operations Dark:

- Dark operational surface, low glare, high contrast.
- Use cyan/blue accents sparingly with amber and red status colors.

Executive Light:

- Light dashboard for management reporting.
- Use restrained color, clear typography, and less decoration.

Command Center:

- Strong hierarchy, central situation view, alerts, and live status.
- Use dark background, luminous accents, and controlled motion.

Industrial Tech:

- Equipment, energy, factory, park, logistics, or IoT dashboards.
- Use steel neutrals, green/amber/red status, and structured panels.

Medical / Public Service:

- Clinical, regulatory, government, or public-service contexts.
- Use trustworthy blue/teal, moderate contrast, and restrained effects.

Finance / Risk:

- Dense metrics, risk, portfolio, transaction, or trading surfaces.
- Use precise typography, red/green semantics carefully, and compact tables.

Custom Reference:

- Use user-provided screenshots, brand colors, URLs, or style descriptions.
- Extract only the relevant design language; do not clone unrelated product chrome.

Presentation / Exhibition:

- Larger hero evidence, lower data density, stronger first-glance message.
- Use motion and emphasis only to support the message or venue behavior.

Editorial Story:

- Claim-led scenes, annotations, direct labels, and restrained supporting panels.
- Use scene transitions, stepper, or autoplay only when they improve the story sequence.

Immersive Spatial:

- Map, topology, 3D, or flow scene as the primary surface.
- Keep labels, legends, and overlays editable and data-bound; do not bake factual values into raster backgrounds.

## Token Checklist

Define:

- Background.
- Surface/panel color.
- Border color.
- Primary accent.
- Secondary accent.
- Success, warning, danger, offline, muted.
- Text primary, secondary, tertiary.
- Chart categorical palette.

## Color-Role Ledger

Define roles before exact colors:

- Neutral context.
- Primary focal accent.
- Secondary comparison accent.
- Ordered magnitude.
- Positive and negative change.
- Warning, danger, offline, stale, partial.
- Selected or focused state.
- Hover or preview state.
- Disabled or muted state.
- Missing or uncertain state.

Do not overload one hue with unrelated meanings. If a color means selected, avoid also using it for forecast, safe state, current period, and above target in the same screen.

## Chart Palette Rules

- Choose a palette policy before coding: single-root for simple repeated charts, two-root for binary/signed/focal comparisons, multi-category only when category identity matters.
- Do not rely on color alone. Pair color with direct labels, ordering, line style, open fill, marker shape, or clear grouping.
- Avoid redundant legends that repeat axis labels.
- Use neutral dark styling for target, benchmark, and reference lines.
- Avoid default green/red for signed values unless domain semantics require it; include zero-line context and signed labels.
- Keep color roles consistent between KPI cards, charts, alerts, scene overlays, and legends.

## Typography

- Use tabular numbers when available.
- Avoid viewport-scaled font sizes.
- Keep KPI numbers large but not oversized.
- Keep chart labels readable and short.

## Panel Style

Pick one:

- Solid panel: stable and enterprise.
- Glass panel: polished, but keep contrast high.
- Outline panel: lightweight, good for dense screens.
- Technical frame: use sparingly; avoid clutter.

## Advanced Visual Rules

- Every glow, pulse, halo, particle, scan, or scene transition needs a named meaning.
- If the effect only makes the dashboard look more energetic, remove it or demote it.
- Keep static and reduced-motion states visually coherent with the animated state.
- Avoid one-hue drama where every surface, mark, and glow comes from the same color family.
