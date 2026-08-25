import "./styles.css";
import { moveItem } from "./order";
import { photos, type Photo } from "./photos";
import {
  dailyIndex,
  formatDate,
  formatShortDate,
  formatTime,
  greetingFor,
  isValidTimeZone,
  labelForTimeZone,
} from "./time";

type WorldClock = {
  id: string;
  label: string;
  timeZone: string;
};

type Settings = {
  displayName: string;
  clocks: WorldClock[];
  background: "daily" | string;
  hasOnboarded: boolean;
};

const STORAGE_KEY = "hellowSettings";
const MAX_CLOCKS = 5;

const fallbackTimeZones = [
  "UTC",
  "Africa/Johannesburg",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Melbourne",
  "Australia/Sydney",
  "Europe/Berlin",
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Paris",
  "Pacific/Auckland",
];

const defaultSettings: Settings = {
  displayName: "",
  clocks: [],
  background: "daily",
  hasOnboarded: false,
};

let settings: Settings = { ...defaultSettings };
let activePhoto = photos[0];
let previouslyFocused: HTMLElement | null = null;
let saveNameTimer: number | undefined;

function requiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
}

const background = requiredElement<HTMLDivElement>("#background");
const localTime = requiredElement<HTMLTimeElement>("#local-time");
const localDate = requiredElement<HTMLParagraphElement>("#local-date");
const greeting = requiredElement<HTMLHeadingElement>("#greeting");
const worldClockList = requiredElement<HTMLDivElement>("#world-clock-list");
const photoCredit = requiredElement<HTMLAnchorElement>("#photo-credit");
const settingsPanel = requiredElement<HTMLElement>("#settings-panel");
const settingsBackdrop = requiredElement<HTMLDivElement>("#settings-backdrop");
const displayNameInput = requiredElement<HTMLInputElement>("#display-name");
const backgroundOptions = requiredElement<HTMLDivElement>("#background-options");
const clockForm = requiredElement<HTMLFormElement>("#clock-form");
const timezoneInput = requiredElement<HTMLInputElement>("#timezone-input");
const timezoneOptions = requiredElement<HTMLDataListElement>("#timezone-options");
const clockLabelInput = requiredElement<HTMLInputElement>("#clock-label");
const clockError = requiredElement<HTMLParagraphElement>("#clock-error");
const configuredClocks = requiredElement<HTMLDivElement>("#configured-clocks");
const clockOrderHint = requiredElement<HTMLParagraphElement>("#clock-order-hint");
const clockCount = requiredElement<HTMLSpanElement>("#clock-count");
const addClockButton = requiredElement<HTMLButtonElement>("#add-clock");

function assetUrl(path: string): string {
  if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
    return chrome.runtime.getURL(path);
  }
  return `/${path}`;
}

function sanitizeSettings(value: unknown): Settings {
  if (!value || typeof value !== "object") return { ...defaultSettings };
  const candidate = value as Partial<Settings>;
  const clocks = Array.isArray(candidate.clocks)
    ? candidate.clocks
        .filter(
          (clock): clock is WorldClock =>
            Boolean(clock) &&
            typeof clock.id === "string" &&
            typeof clock.label === "string" &&
            typeof clock.timeZone === "string" &&
            isValidTimeZone(clock.timeZone),
        )
        .slice(0, MAX_CLOCKS)
    : [];
  const selectedBackground =
    typeof candidate.background === "string" &&
    (candidate.background === "daily" || photos.some((photo) => photo.id === candidate.background))
      ? candidate.background
      : "daily";

  return {
    displayName: typeof candidate.displayName === "string" ? candidate.displayName.slice(0, 40) : "",
    clocks,
    background: selectedBackground,
    hasOnboarded: candidate.hasOnboarded === true,
  };
}

async function loadSettings(): Promise<Settings> {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return sanitizeSettings(stored[STORAGE_KEY]);
  }

  try {
    return sanitizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return { ...defaultSettings };
  }
}

async function saveSettings(): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    await chrome.storage.local.set({ [STORAGE_KEY]: settings });
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function dailyPhoto(date = new Date()): Photo {
  return photos[dailyIndex(date, photos.length)];
}

function currentPhoto(): Photo {
  if (settings.background === "daily") return dailyPhoto();
  return photos.find((photo) => photo.id === settings.background) ?? photos[0];
}

function applyBackground(photo: Photo): void {
  activePhoto = photo;
  const imageUrl = assetUrl(photo.file);
  const preload = new Image();

  preload.addEventListener("load", () => {
    background.style.backgroundImage = `url("${imageUrl}")`;
    background.classList.remove("is-changing");
    void background.offsetWidth;
    background.classList.add("is-changing");
    document.documentElement.style.setProperty("--photo-color", photo.color);
  });
  preload.src = imageUrl;

  photoCredit.textContent = `Photo by ${photo.author} · Wikimedia Commons · CC0`;
  photoCredit.href = photo.source;
}

function renderClocks(date = new Date()): void {
  localTime.textContent = formatTime(date);
  localTime.dateTime = date.toISOString();
  localDate.textContent = formatDate(date);
  greeting.textContent = greetingFor(date, settings.displayName);
  document.title = `${formatTime(date)} · Hellow`;

  worldClockList.replaceChildren();
  if (settings.clocks.length === 0) {
    return;
  }

  for (const clock of settings.clocks) {
    const item = document.createElement("article");
    item.className = "world-clock";

    const location = document.createElement("p");
    location.className = "world-clock-location";
    location.textContent = clock.label;

    const time = document.createElement("time");
    time.className = "world-clock-time";
    time.textContent = formatTime(date, clock.timeZone);
    time.dateTime = date.toISOString();

    const dateText = document.createElement("p");
    dateText.className = "world-clock-date";
    dateText.textContent = formatShortDate(date, clock.timeZone);

    item.append(location, time, dateText);
    worldClockList.append(item);
  }
}

function renderBackgroundOptions(): void {
  backgroundOptions.replaceChildren();
  const choices: Array<{ id: string; label: string; photo: Photo }> = [
    { id: "daily", label: "Daily mix", photo: dailyPhoto() },
    ...photos.map((photo) => ({ id: photo.id, label: photo.name, photo })),
  ];

  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "background-choice";
    button.classList.toggle("is-selected", settings.background === choice.id);
    button.setAttribute("aria-pressed", String(settings.background === choice.id));
    button.style.backgroundImage = `linear-gradient(180deg, transparent 25%, rgba(7, 12, 20, .78)), url("${assetUrl(`backgrounds/thumbs/${choice.photo.id}.jpg`)}")`;

    const label = document.createElement("span");
    label.textContent = choice.label;
    button.append(label);

    button.addEventListener("click", () => {
      settings.background = choice.id;
      void saveSettings();
      applyBackground(currentPhoto());
      renderBackgroundOptions();
    });
    backgroundOptions.append(button);
  }
}

function renderConfiguredClocks(): void {
  configuredClocks.replaceChildren();
  clockCount.textContent = `${settings.clocks.length} / ${MAX_CLOCKS}`;
  clockOrderHint.hidden = settings.clocks.length < 2;
  const atLimit = settings.clocks.length >= MAX_CLOCKS;
  addClockButton.disabled = atLimit;
  timezoneInput.disabled = atLimit;
  clockLabelInput.disabled = atLimit;

  settings.clocks.forEach((clock, index) => {
    const row = document.createElement("div");
    row.className = "configured-clock";

    const copy = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = clock.label;
    const zone = document.createElement("span");
    zone.textContent = clock.timeZone;
    copy.append(label, zone);

    const actions = document.createElement("div");
    actions.className = "clock-actions";

    const createMoveButton = (offset: -1 | 1): HTMLButtonElement => {
      const move = document.createElement("button");
      const direction = offset === -1 ? "up" : "down";
      move.type = "button";
      move.className = "move-button";
      move.disabled = index + offset < 0 || index + offset >= settings.clocks.length;
      move.dataset.clockId = clock.id;
      move.dataset.offset = String(offset);
      move.title = `Move ${direction}`;
      move.setAttribute("aria-label", `Move ${clock.label} ${direction} in the clock order`);
      move.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${
        offset === -1 ? "m7 14 5-5 5 5" : "m7 10 5 5 5-5"
      }" /></svg>`;
      move.addEventListener("click", () => {
        settings.clocks = moveItem(settings.clocks, index, offset);
        void saveSettings();
        renderClocks();
        renderConfiguredClocks();

        const movedIndex = index + offset;
        const preferredOffset = movedIndex === 0 ? 1 : movedIndex === settings.clocks.length - 1 ? -1 : offset;
        const nextFocus = [...configuredClocks.querySelectorAll<HTMLButtonElement>(".move-button")].find(
          (button) => button.dataset.clockId === clock.id && button.dataset.offset === String(preferredOffset),
        );
        nextFocus?.focus();
      });
      return move;
    };

    actions.append(createMoveButton(-1), createMoveButton(1));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${clock.label}`);
    remove.addEventListener("click", () => {
      settings.clocks = settings.clocks.filter((item) => item.id !== clock.id);
      void saveSettings();
      renderClocks();
      renderConfiguredClocks();
      clockError.textContent = "";
    });

    actions.append(remove);
    row.append(copy, actions);
    configuredClocks.append(row);
  });
}

function renderSettings(): void {
  displayNameInput.value = settings.displayName;
  renderBackgroundOptions();
  renderConfiguredClocks();
}

function openSettings(focusClock = false): void {
  previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  settingsBackdrop.hidden = false;
  settingsPanel.inert = false;
  settingsPanel.classList.add("is-open");
  settingsPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("settings-open");
  window.setTimeout(() => (focusClock ? timezoneInput : displayNameInput).focus(), 80);
}

function closeSettings(): void {
  settingsPanel.classList.remove("is-open");
  settingsPanel.setAttribute("aria-hidden", "true");
  settingsPanel.inert = true;
  document.body.classList.remove("settings-open");
  settings.hasOnboarded = true;
  void saveSettings();
  previouslyFocused?.focus();
  window.setTimeout(() => {
    settingsBackdrop.hidden = true;
  }, 260);
}

function nextBackground(): void {
  const currentIndex = photos.findIndex((photo) => photo.id === activePhoto.id);
  const next = photos[(currentIndex + 1) % photos.length];
  settings.background = next.id;
  void saveSettings();
  applyBackground(next);
  renderBackgroundOptions();
}

function availableTimeZones(): string[] {
  const intlWithValues = Intl as typeof Intl & {
    supportedValuesOf?: (key: "timeZone") => string[];
  };
  const supported = intlWithValues.supportedValuesOf?.("timeZone") ?? fallbackTimeZones;
  return [...new Set(["UTC", ...supported])];
}

const timeZones = availableTimeZones();

function populateTimeZones(): void {
  const fragment = document.createDocumentFragment();
  for (const timeZone of timeZones) {
    const option = document.createElement("option");
    option.value = timeZone;
    fragment.append(option);
  }
  timezoneOptions.append(fragment);
}

function resolveTimeZone(input: string): string | null {
  const trimmed = input.trim();
  const known = timeZones.find((timeZone) => timeZone.toLowerCase() === trimmed.toLowerCase());
  if (known) return known;
  return isValidTimeZone(trimmed) ? trimmed : null;
}

function bindEvents(): void {
  requiredElement<HTMLButtonElement>("#open-settings").addEventListener("click", () => openSettings());
  requiredElement<HTMLButtonElement>("#close-settings").addEventListener("click", closeSettings);
  requiredElement<HTMLButtonElement>("#next-background").addEventListener("click", nextBackground);
  settingsBackdrop.addEventListener("click", closeSettings);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && settingsPanel.classList.contains("is-open")) closeSettings();
  });

  displayNameInput.addEventListener("input", () => {
    settings.displayName = displayNameInput.value;
    renderClocks();
    window.clearTimeout(saveNameTimer);
    saveNameTimer = window.setTimeout(() => void saveSettings(), 250);
  });

  clockForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clockError.textContent = "";

    if (settings.clocks.length >= MAX_CLOCKS) {
      clockError.textContent = "You can add up to five clocks.";
      return;
    }

    const timeZone = resolveTimeZone(timezoneInput.value);
    if (!timeZone) {
      clockError.textContent = "Choose a valid timezone, such as Europe/London.";
      timezoneInput.focus();
      return;
    }

    if (settings.clocks.some((clock) => clock.timeZone === timeZone)) {
      clockError.textContent = "That timezone is already on your dashboard.";
      return;
    }

    settings.clocks.push({
      id: crypto.randomUUID(),
      label: clockLabelInput.value.trim() || labelForTimeZone(timeZone),
      timeZone,
    });
    timezoneInput.value = "";
    clockLabelInput.value = "";
    void saveSettings();
    renderClocks();
    renderConfiguredClocks();
    timezoneInput.focus();
  });
}

async function initialize(): Promise<void> {
  settings = await loadSettings();
  populateTimeZones();
  bindEvents();
  renderSettings();
  applyBackground(currentPhoto());
  renderClocks();
  window.setInterval(() => renderClocks(), 1_000);

  if (!settings.hasOnboarded) {
    window.setTimeout(() => openSettings(), 350);
  }
}

void initialize();
