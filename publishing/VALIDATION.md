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
