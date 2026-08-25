# Hellow Design System

This package defines the visual system selected from logo Proposal 2: a geometric, connected `H` moving from deep ocean through cyan to electric lime.

## Brand idea

Hellow should feel calm, capable, and quietly optimistic. The photo remains the emotional center of the new tab; the brand system brings recognition and structure without competing with it.

- **Connected:** the diagonal bridge in the `H` suggests places, people, and moments joined across timezones.
- **Clear:** restrained surfaces, large type, and strong focus states keep the interface immediately understandable.
- **Alive:** cyan and lime create energy, but are concentrated in the logo, actions, focus, and selection states.

## Logo

The official mark is the geometric prism `H` in `assets/hellow-mark-master.png`. `assets/hellow-mark.svg` is the simplified, small-size production companion.

- Keep clear space around the mark equal to at least one quarter of its width.
- Prefer the full gradient on transparent, deep ocean, black, or white backgrounds.
- Do not recolor individual pieces, add a container, rotate, outline, stretch, or add a drop shadow to exported logo files.
- At 16–32 px, use the supplied exports rather than recreating the mark.
- The lowercase wordmark is `hellow`, set in the product sans-serif stack at 650 weight with tight tracking.

## Color

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Foundation | Ocean 950 | `#031F29` | deepest background and high-contrast text |
| Surface | Ocean 900 | `#052C39` | settings and glass surfaces |
| Support | Ocean 700 | `#006B87` | gradient anchor and secondary brand color |
| Connection | Teal 500 | `#00B8B8` | supporting brand moments |
| Interaction | Cyan 400 | `#00DCE6` | focus, links, hover, and primary emphasis |
| Highlight | Cyan 300 | `#61F1F2` | readable cyan on dark surfaces |
| Active | Lime 400 | `#C8FF00` | selected and active states; use sparingly |
| Foreground | Hellow White | `#F7FFFE` | primary text over photography and dark surfaces |
| Destructive | Danger 400 | `#FF9B86` | errors and remove actions only |

The canonical brand gradient is Ocean 700 → Cyan 400 → Lime 400 at `120deg`. Do not use lime for paragraphs or small text. White remains the primary text color over photography.

## Typography

Use `Inter`, followed by the native UI sans-serif stack. The time is the main visual gesture: very light weight, tabular numerals, tight tracking. Headings use 600–750 weights; supporting copy uses 400–600. Uppercase eyebrows are small, cyan, and widely tracked.

## Surfaces and components

- **Photo canvas:** retain the bundled photograph at full bleed with a deep-ocean legibility shade.
- **Glass cards:** use translucent Ocean 900, a faint cyan border, 14 px radius, and subtle blur.
- **Settings panel:** use an almost-opaque Ocean 950/900 surface. It should feel quieter than the photo canvas.
- **Primary action:** use the brand gradient with Ocean 950 text.
- **Selection:** use a lime border and low-opacity lime ring.
- **Focus:** use a 2 px cyan outline plus clear offset; never remove keyboard focus.
- **Destructive action:** use Danger 400, never lime or cyan.

## Spacing, radius, and motion

Use the existing fluid layout and an 8 px rhythm. Controls use 11 px radii, cards use 14 px, and circular icon buttons remain circular. Small interactions run at 160 ms; the settings panel runs at 260 ms. Respect `prefers-reduced-motion`.

## Accessibility

- Preserve white text and the ocean shade over every background photograph.
- Use Cyan 300 rather than Cyan 400 for small text on Ocean 900 when needed.
- Never rely on color alone for selection: keep borders, labels, and `aria-pressed` state.
- Check the closed page and open settings panel at desktop and narrow widths.

## Project application review

The original proposal already had the right product structure: a calm photo-first new tab, a restrained clock hierarchy, local-only privacy, and a focused settings drawer. The visual mismatch was the warm amber accent and circular placeholder mark. The current implementation keeps the strong layout and behavior while replacing that mismatch with the selected geometric `H`, ocean-tinted surfaces, cyan interaction states, lime selection, and a matching favicon/icon family.

## Files

- `tokens.css` — CSS custom properties consumed by the extension.
- `tokens.json` — portable design-token source.
- `assets/hellow-mark-master.png` — approved high-resolution raster mark.
- `assets/hellow-mark.svg` — simplified vector companion for scalable use.
- `../public/icons/` — Chrome extension icon exports.
- `../public/favicon.png` and `../public/favicon.svg` — browser favicon assets.
- `../.agents/skills/hellow-design-system/` — reusable Codex project skill.
