# Hellow Chrome Web Store submission

Live listing: [Hellow](https://chromewebstore.google.com/detail/hellow/kjilebcanpkngggadopfplifnbmanhhj). Extension ID: `kjilebcanpkngggadopfplifnbmanhhj`. Verified on 8 October 2026: version 0.2.1 is published, with a store update date of 7 October 2026. Version 0.3.0 is the prepared currency-conversion update.

## Upload package

Run `npm run release` from the repository root. Upload `release/hellow-0.3.0.zip`, not the old beta archive or the source folder. The ZIP contains only the built extension, including a root-level manifest, and no saved browser preferences.

Prepared version: 0.3.0. Name: Hellow. Language: English. Current store category: Tools. Upload this release to the existing Hellow listing.

## Short description

A calm new tab with your clock, greeting, world clocks, currency conversions, and 100 beautiful background choices.

## Detailed description

Make every new tab a quiet moment with Hellow.

See the time clearly, enjoy a beautiful background, and keep the places that matter to you in view.

• A large local clock, date, and optional personal greeting.
• Up to five world clocks with custom labels and simple reordering.
• Optional configurable currency cards with daily reference rates and an offline cache.
• 100 background choices: 99 bundled photos plus Daily mix.
• 10 clock font choices to make your new tab yours.
• Locally bundled backgrounds and fonts that work without an internet connection.
• Preferences saved in your current Chrome profile.

Hellow has no accounts, analytics, ads, or Hellow backend. Your greeting and conversion amounts stay on your device. Storage remembers settings and cached rates; access to api.frankfurter.dev fetches rates only when currency cards are configured.

Hellow replaces Chrome's new-tab page. You can customize it using the settings button in the bottom-right corner.

## Privacy practices

Single purpose: Replace Chrome's new-tab page with a customizable clock, greeting, world clocks, optional currency conversions, and bundled backgrounds.

Storage permission justification: Save the user's optional greeting name, world-clock labels and time zones, background preference, clock font, currency pairs and amounts, cached rates, and setup status in chrome.storage.local, so preferences persist between new tabs and browser restarts.

Host permission justification: `https://api.frankfurter.dev/*` retrieves daily reference rates for configured currency pairs. Only currency codes are sent, with no credentials or referrer. No requests are made when no conversions are configured.

Remote code: No. All executable code is bundled in the upload. Photo-credit links are ordinary user-initiated external navigation.

Data handling: The optional name is personally identifiable information and clock labels are user-entered content; both are handled locally only. Disclose this local handling in the dashboard using its current field wording. If the dashboard asks which types are handled, disclose these types; if it specifically asks about transmission or collection outside the device, explain that names and amounts stay local, while optional currency requests transmit currency codes and connection information to Frankfurter. Do not claim that Hellow never handles personal information. Certify that data is not sold, used for unrelated purposes, or used for creditworthiness/lending decisions.

Privacy policy URL: https://douglasmiguel.com.br/hellow/privacy/ — currency disclosures published and verified over HTTPS on 8 October 2026; live HTML matches the prepared v0.3.0 policy. Source: ../PRIVACY.md; branded web page: privacy/index.html. BeeDev SSH deployment instructions: [deploy/README.md](deploy/README.md).

Support URL: https://github.com/douglasmiguel/hellow/issues — verify public access first.

## Artwork

- assets/store-icon-128.png: store icon.
- assets/v0.3.0/screenshot-new-tab.png: main view with world clocks and currency cards, 1280 × 800.
- assets/v0.3.0/screenshot-settings.png: currency Settings controls and configured conversions, 1280 × 800.
- assets/promo-small.png: small promotional tile, 440 × 280.
- assets/promo-marquee.png: optional marquee tile, 1400 × 560.

The v0.3.0 screenshots are 24-bit RGB PNGs without transparency, captured from the built page on 8 October 2026. They use fictional demonstration settings in an isolated browser profile and actual rates returned by Frankfurter. The existing icon and promotional banners retain the approved branding. Both new screenshots are also bundled in `release/hellow-0.3.0-store-images.zip`; extract them and upload the individual PNGs to the Store listing.

## Final dashboard steps

1. Load the fresh dist folder in Chrome and confirm new-tab replacement, first-run setup, preference persistence after a browser restart, world-clock ordering, and offline operation. Automated preview checks do not replace this extension-specific check.
2. In the developer dashboard, open the existing Hellow item (`kjilebcanpkngggadopfplifnbmanhhj`) and upload the fresh v0.3.0 ZIP.
3. Paste the listing copy and upload the supplied images. Confirm language, category, regions, visibility, and your developer support/contact details.
4. Supply a publicly accessible privacy-policy URL and complete the privacy disclosures and certifications accurately.
5. Submit for review. When approved, install from the store link. Record or migrate your existing settings before removing the unpacked installation; storage belongs to each extension installation.

Version 0.2.1 is live. Review and publication of the prepared v0.3.0 update have not been verified.

References: https://developer.chrome.com/docs/webstore/prepare ; https://developer.chrome.com/docs/webstore/cws-dashboard-listing ; https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
