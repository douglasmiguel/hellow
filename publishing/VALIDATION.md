# Store screenshot validation — 0.3.0

Prepared on 8 October 2026:

- `publishing/assets/v0.3.0/screenshot-new-tab.png`: three world clocks and three currency cards with flags, two-decimal rates, and the separator.
- `publishing/assets/v0.3.0/screenshot-settings.png`: currency amount and selectors, Add conversion, and all three configured rows fully visible.
- Both images are 1280 × 800, 24-bit RGB PNGs without transparency, captured directly from the built v0.3.0 page in isolated Chrome and visually reviewed.
- Demonstration name Alex and example settings; clock fixed to 8 October 2026 at 10:40 Europe/London. Conversion values came from live Frankfurter responses.
- `npm run check`: 23 tests passed; TypeScript and Vite build passed. Screenshot browser reported no page errors.
- Existing design tokens, logo, and bundled Alpine reflection photograph reused.
- `release/hellow-0.3.0-store-images.zip` contains both PNGs. The extension ZIP is unchanged.

# Privacy deployment verification — 0.3.0

Verified on 8 October 2026 after the user ran the BeeDev deployment:

- Public HTTPS page: https://douglasmiguel.com.br/hellow/privacy/
- Live HTML exactly matches the prepared v0.3.0 privacy page, including currency-rate disclosures.
- SHA-256: `f8416a2a0d214fe3df710aa4f3bd3b4e8396a7d77052915905fa0f9503acb51c`.

Chrome Web Store listing verified on 8 October 2026: [Hellow](https://chromewebstore.google.com/detail/hellow/kjilebcanpkngggadopfplifnbmanhhj) is live at version 0.2.1, updated 7 October 2026. Version 0.3.0 is packaged locally; its submission and publication have not been verified.

# Release validation — 0.2.1

Validated on 5 October 2026:

- `npm run release`: 14 tests passed; TypeScript check and Vite build passed.
- ZIP integrity passed; 208 built files; Hellow manifest version 0.2.1 matches package version.
- `npm audit --audit-level=high`: no known vulnerabilities reported.
- Built new-tab page opened in an isolated headless Chrome profile without page errors.
- Demonstration preferences persisted through a page reload using the browser preview's localStorage fallback.
- Main view, settings panel, small promotional tile, and narrow settings layout visually inspected.
- Store screenshots: 1280 × 800; small tile: 440 × 280; marquee: 1400 × 560; icon: 128 × 128.
- Approved logo and existing brand colors reused; design tokens unchanged.

Still required: real extension checks for chrome.storage.local, new-tab replacement, first-run setup, browser-restart persistence, and offline operation; developer-dashboard upload, certifications, and Google review.

No personal Chrome profile or saved preferences were accessed. Artwork contains fictional demonstration data. Nothing has been committed, pushed, or submitted to the Chrome Web Store.

Privacy page published at https://douglasmiguel.com.br/hellow/privacy/ and verified over HTTPS on 5 October 2026. Live HTML matches the local page SHA-256 checksum.
