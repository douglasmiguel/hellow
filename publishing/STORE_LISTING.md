# Hellow Chrome Web Store submission

## Upload package

Run `npm run release` from the repository root. Upload `release/hellow-0.2.1.zip`, not the old beta archive or the source folder. The ZIP contains only the built extension, including a root-level manifest, and no saved browser preferences.

Version: 0.2.1. Name: Hellow. Language: English. Suggested category: Productivity. Recommended initial visibility: Unlisted (anyone with the store link can install).

## Short description

A calm, private new tab with your clock, greeting, world clocks, and 100 beautiful background choices.

## Detailed description

Make every new tab a quiet moment with Hellow.

See the time clearly, enjoy a beautiful background, and keep the places that matter to you in view.

• A large local clock, date, and optional personal greeting.
• Up to five world clocks with custom labels and simple reordering.
• 100 background choices: 99 bundled photos plus Daily mix.
• 10 clock font choices to make your new tab yours.
• Locally bundled backgrounds and fonts that work without an internet connection.
• Preferences saved in your current Chrome profile.

Hellow has no accounts, analytics, ads, or backend. Your greeting and preferences stay on your device. The only requested permission is storage, used to remember your settings.

Hellow replaces Chrome's new-tab page. You can customize it using the settings button in the bottom-right corner.

## Privacy practices

Single purpose: Replace Chrome's new-tab page with a customizable local clock, greeting, world clocks, and bundled backgrounds.

Storage permission justification: Save the user's optional greeting name, world-clock labels and time zones, background preference, clock font, and setup status in chrome.storage.local, so preferences persist between new tabs and browser restarts.

Remote code: No. All executable code is bundled in the upload. Photo-credit links are ordinary user-initiated external navigation.

Data handling: The optional name is personally identifiable information and clock labels are user-entered content; both are handled locally only. Disclose this local handling in the dashboard using its current field wording. If the dashboard asks which types are handled, disclose these types; if it specifically asks about transmission or collection outside the device, explain that none occurs. Do not claim that Hellow never handles personal information. Certify that data is not sold, used for unrelated purposes, or used for creditworthiness/lending decisions.

Privacy policy URL: https://douglasmiguel.com.br/hellow/privacy/ — published and verified over HTTPS on 5 October 2026. Source: ../PRIVACY.md; branded web page: privacy/index.html.

Support URL: https://github.com/douglasmiguel/hellow/issues — verify public access first.

## Artwork

- assets/store-icon-128.png: store icon.
- assets/screenshot-new-tab.png: main view, 1280 × 800.
- assets/screenshot-settings.png: customization view, 1280 × 800.
- assets/promo-small.png: small promotional tile, 440 × 280.
- assets/promo-marquee.png: optional marquee tile, 1400 × 560.

Screenshots use fictional demonstration settings in an isolated browser profile, not the developer's personal configuration.

## Final dashboard steps

1. Load the fresh dist folder in Chrome and confirm new-tab replacement, first-run setup, preference persistence after a browser restart, world-clock ordering, and offline operation. Automated preview checks do not replace this extension-specific check.
2. In the developer dashboard, create a new item or update the existing Hellow item, then upload the fresh ZIP.
3. Paste the listing copy and upload the supplied images. Confirm language, category, regions, visibility, and your developer support/contact details.
4. Supply a publicly accessible privacy-policy URL and complete the privacy disclosures and certifications accurately.
5. Submit for review. When approved, install from the store link. Record or migrate your existing settings before removing the unpacked installation; storage belongs to each extension installation.

All visibility options require Google's review. Store approval and listing publication have not been performed by the local release workflow.

References: https://developer.chrome.com/docs/webstore/prepare ; https://developer.chrome.com/docs/webstore/cws-dashboard-listing ; https://developer.chrome.com/docs/webstore/program-policies/user-data-faq
