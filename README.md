<p align="center">
  <img src="design-system/assets/hellow-mark.svg" alt="Hellow geometric H logo" width="160">
</p>

# Hellow

**Beta release: 0.2.0-beta.1**

Hellow is a private, fully local Chrome new-tab extension with a large clock, 10 clock font choices, a personal greeting, 20 bundled background choices, and up to five reorderable world clocks.

It has no accounts, analytics, backend, API keys, or recurring hosting costs. Settings are stored in the current Chrome profile with `chrome.storage.local`.

## Build

```sh
npm install
npm run check
```

The unpacked extension is generated in `dist/`.

## Install in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project's `dist` directory.
5. Open a new tab.

After changing the code, run `npm run build` and click **Reload** on Hellow's card in `chrome://extensions`.

## Development

```sh
npm run dev
```

The browser preview uses `localStorage` as a development fallback. The built Chrome extension uses `chrome.storage.local`.

## Project structure

- `newtab.html` — extension page and settings interface
- `src/main.ts` — storage, clock, timezone, and background behaviour
- `src/styles.css` — complete responsive interface
- `design-system/` — Hellow brand guide, design tokens, and approved logo assets
- `.agents/skills/hellow-design-system/` — repository-scoped Codex design-system skill
- `public/manifest.json` — Manifest V3 configuration
- `public/backgrounds/` — locally bundled CC0 photos
- `public/backgrounds/thumbs/` — lightweight previews for the settings panel
- `tests/` — behaviour, timezone, ordering, and background-catalog tests

Photo sources and licensing are documented in [PHOTO_CREDITS.md](PHOTO_CREDITS.md).
