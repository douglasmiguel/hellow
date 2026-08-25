---
name: hellow-design-system
description: Apply and review the Hellow Chrome extension visual system. Use for Hellow UI, CSS, logos, icons, favicons, screenshots, brand colors, component styling, or any design-facing change in this repository; do not use for behavior-only changes with no presentation impact.
---

# Hellow Design System

Use the checked-in design system as the source of truth for every visual decision.

## Start with the live sources

Before changing a visual asset or interface:

1. Read `design-system/README.md` for brand intent, logo rules, component guidance, and accessibility constraints.
2. Read `design-system/tokens.css` when editing CSS and `design-system/tokens.json` when another format needs portable values.
3. Inspect the current implementation rather than assuming the guide reflects every component already present.

Resolve those paths from the repository root. Keep the design package and implementation aligned when a user explicitly changes the brand direction.

## Preserve these invariants

- Proposal 2's connected geometric `H` is the approved mark.
- Ocean tones anchor surfaces; cyan communicates interaction; lime is reserved for selected, active, or signature brand moments.
- Keep primary text white over photography. Never use lime for paragraphs or small labels.
- Keep the photo-first, calm new-tab composition. Brand color should clarify hierarchy, not wash over the photographs.
- Reuse tokens instead of adding near-duplicate hard-coded colors.
- Maintain visible keyboard focus, non-color selection cues, responsive behavior, and reduced-motion support.

## Work with brand assets

- Use `design-system/assets/hellow-mark-master.png` as the approved raster source.
- Use `design-system/assets/hellow-mark.svg` or `assets/icon.svg` for scalable contexts.
- Chrome exports belong in `public/icons/` at 16, 32, 48, and 128 px.
- Keep `public/favicon.png`, `public/favicon.svg`, the HTML favicon links, and manifest icons consistent.
- Export non-destructively from the master; do not upscale a small icon or add a tile, border, shadow, or new color.

## Implement and verify

- Import `design-system/tokens.css` into product CSS and map raw brand tokens to semantic component variables where useful.
- Check both the photo canvas and the open settings panel. Exercise focus, hover, selected, disabled, error, and empty states relevant to the change.
- Review at desktop and narrow widths; verify the mark at toolbar/favicon scale.
- Run `npm run check` after implementation. For visual changes, inspect the built page in a browser and capture evidence when available.

When handing off, identify the tokens and assets changed, note any deliberate exceptions, and report the verification performed.
