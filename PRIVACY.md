# Hellow privacy policy

Effective date: 8 October 2026

Hellow replaces Chrome's new-tab page with a local clock, optional personal greeting, world clocks, optional currency conversions, and bundled backgrounds.

## Information handled on your device

If you provide a name, Hellow uses it only to display your greeting. Hellow also stores your chosen world-clock labels and time zones, background preference, clock font, currency pairs and amounts, cached exchange rates, and setup status. These settings are stored in `chrome.storage.local` in the current Chrome profile. Hellow does not use Chrome's storage sync service. Its development browser preview uses localStorage instead.

Hellow uses your device's current date, time, and time zone to display the clock and choose the daily background. It does not request GPS or location permission.

## Collection and sharing

Hellow does not transmit your name, conversion amounts, or other personal settings. It has no accounts, analytics, advertising, Hellow backend, or remotely loaded executable code. Photos, thumbnails, icons, styles, and scripts are included in the extension. It does not read your browsing history or the contents of other websites.

Currency conversions are optional and disabled until you add a card. When enabled, Hellow sends the configured source and target currency codes to `https://api.frankfurter.dev` to fetch daily reference rates. Requests omit credentials and referrers; conversion amounts are calculated on your device. The service necessarily receives connection information such as your IP address. See [Frankfurter’s privacy information](https://frankfurter.dev/#faq). Rates are cached locally for offline use. Hellow requests fresh rates each time you open a new tab, on manual refresh, and when reconnecting. Tabs left open also check for updates after six hours. Removing all conversion cards stops further rate requests; requests already in flight may finish.

Photo-credit links open external Wikimedia Commons pages only when you click them. Those sites handle that visit under their own privacy policies.

Hellow does not sell or share user data. Local information is used only to provide the features described above. Hellow's use of user data complies with the Chrome Web Store User Data Policy, including its Limited Use requirements.

## Retention and control

Settings remain in your Chrome profile until you change them or remove the extension. You can clear your greeting by deleting the name in settings and remove individual world clocks and currency conversions. Uninstalling Hellow removes its extension storage. Installing a separate copy of Hellow does not automatically transfer these preferences.

## Contact and changes

For privacy questions, open an issue at https://github.com/douglasmiguel/hellow/issues. Do not include your personal settings or other private information in a public issue. Changes to this policy will be published here with an updated effective date.
