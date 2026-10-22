<p align="center">
  <img src="design-system/assets/hellow-mark.svg" alt="Hellow geometric H logo" width="160">
</p>

# Hellow

**Live store version: 0.3.0** (shown in the Chrome Web Store screenshot supplied on 22 October 2026; store update date: 11 October 2026)

[Install Hellow from the Chrome Web Store](https://chromewebstore.google.com/detail/hellow/kjilebcanpkngggadopfplifnbmanhhj)

Hellow is a private Chrome new-tab extension with a large clock, 10 clock font choices, a personal greeting, 100 bundled background choices, up to five reorderable world clocks, and optional currency conversions.

It has no accounts, analytics, Hellow backend, API keys, or recurring hosting costs. Settings are stored in the current Chrome profile with `chrome.storage.local`.

## Build

```sh
npm install
npm run check
```

The unpacked extension is generated in `dist/`.

## Install in Chrome

Use the Chrome Web Store link above for the published version. To try the current source build locally, load the unpacked extension:

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

## Currency conversions

In Settings → Currencies, add up to five conversions with an amount, source currency, and target currency. Edit, reorder, or remove cards in Settings; removing all cards disables rate requests.

Rates come from [Frankfurter](https://frankfurter.dev) and update daily. Hellow requests fresh rates whenever you open a new tab and caches them locally for offline use. Tabs left open also check for updates after six hours. Cards show converted values to two decimal places. A saved rate remains visible if a refresh fails; **Refresh rates** retries immediately with a loading spinner. These are reference rates, so banks and card providers may quote different amounts. Currency conversion is optional and starts with no cards. Only currency codes are sent to the API; amounts are calculated locally.

## Project structure

- `newtab.html` — extension page and settings interface
- `src/main.ts` — storage, clock, timezone, and background behaviour
- `src/currency.ts` and `src/currency-ui.ts` — currency settings, validation, cached rates, and cards
- `src/styles.css` — complete responsive interface
- `design-system/` — Hellow brand guide, design tokens, and approved logo assets
- `.agents/skills/hellow-design-system/` — repository-scoped Codex design-system skill
- `public/manifest.json` — Manifest V3 configuration
- `public/backgrounds/` — locally bundled CC0 photos
- `public/backgrounds/thumbs/` — lightweight previews for the settings panel
- `tests/` — behaviour, timezone, ordering, and background-catalog tests

Photo sources and licensing are documented in [PHOTO_CREDITS.md](PHOTO_CREDITS.md).

## Chrome Web Store release

Run `npm run release` to test, build, and create a ZIP for the version in `package.json`. Version 0.3.0 is already published; prepare a higher version before any future store update. See [publishing/STORE_LISTING.md](publishing/STORE_LISTING.md) for the 0.3.0 listing materials and future submission steps.

`dist/` and newly generated release ZIPs are ignored by Git. The historical beta ZIP remains tracked. Browser preferences live in the Chrome profile, not this repository.
