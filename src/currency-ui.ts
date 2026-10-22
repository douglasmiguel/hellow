import {
  currencyCodes, currencyFlags, fetchRate, formatCurrencyAmount, isFreshRate, MAX_CONVERSIONS,
  pairKey, sanitizeRateCache, validAmount, validCurrency, type Conversion, type RateCache,
} from "./currency";
import { moveItem } from "./order";

const CACHE_KEY = "hellowCurrencyRates";

function flagFor(code: string): HTMLSpanElement {
  const flag = document.createElement("span");
  flag.className = "currency-flag";
  flag.setAttribute("aria-hidden", "true");
  flag.textContent = validCurrency(code) ? currencyFlags[code] : "";
  return flag;
}

export async function initializeCurrencies(getConversions: () => Conversion[], save: (items: Conversion[]) => void): Promise<void> {
  const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const section = element<HTMLElement>("currencies");
  const cards = element<HTMLDivElement>("currency-list");
  const rows = element<HTMLDivElement>("configured-currencies");
  const form = element<HTMLFormElement>("currency-form");
  const amount = element<HTMLInputElement>("currency-amount");
  const from = element<HTMLSelectElement>("currency-from");
  const to = element<HTMLSelectElement>("currency-to");
  const error = element<HTMLParagraphElement>("currency-error");
  const submit = element<HTMLButtonElement>("add-currency");
  const cancel = element<HTMLButtonElement>("cancel-currency");
  const refresh = element<HTMLButtonElement>("refresh-currencies");
  let editingId: string | null = null;
  let cache: RateCache = {};
  const pending = new Set<string>();
  const attempted = new Map<string, number>();

  try {
    const stored = typeof chrome !== "undefined" && chrome.storage?.local
      ? (await chrome.storage.local.get(CACHE_KEY))[CACHE_KEY]
      : JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    cache = sanitizeRateCache(stored);
  } catch { /* Rates can still load if local storage is unavailable. */ }

  const names = new Intl.DisplayNames(undefined, { type: "currency" });
  for (const code of currencyCodes) {
    for (const select of [from, to]) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${currencyFlags[code]} ${code} · ${names.of(code) ?? code}`;
      select.append(option);
    }
  }
  from.value = "";
  to.value = "";

  function renderCards(): void {
    const items = getConversions();
    section.hidden = items.length === 0;
    cards.replaceChildren();
    const loading = items.some((item) => pending.has(pairKey(item)));
    refresh.disabled = loading;
    refresh.classList.toggle("is-loading", loading);
    refresh.setAttribute("aria-busy", String(loading));
    element("refresh-currencies-label").textContent = loading ? "Refreshing…" : "Refresh rates";
    cards.setAttribute("aria-busy", String(loading));
    for (const item of items) {
      const key = pairKey(item);
      const rate = cache[key];
      const card = document.createElement("article");
      card.className = "currency-card";
      const label = document.createElement("p");
      label.className = "currency-label";
      label.textContent = `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(item.amount)} ${item.from} → ${item.to}`;
      label.title = label.textContent;
      label.prepend(flagFor(item.from), " ");
      const value = document.createElement("p");
      value.className = "currency-value";
      value.textContent = rate ? formatCurrencyAmount(item.amount * rate.rate, item.to) : "—";
      value.title = value.textContent;
      value.prepend(flagFor(item.to), " ");
      card.append(label, value);
      if (!rate) {
        const status = document.createElement("p");
        status.className = "currency-status";
        status.textContent = pending.has(key) ? "Loading rate…" : "Rate unavailable";
        card.append(status);
      }
      cards.append(card);
    }
  }

  async function updateRates(force = false): Promise<void> {
    const pairs = getConversions().filter((item) => {
      const key = pairKey(item);
      return !pending.has(key) && (force || (!isFreshRate(cache[key]) && Date.now() - (attempted.get(key) ?? 0) >= 60_000));
    });
    for (const item of pairs) {
      const key = pairKey(item);
      pending.add(key);
      attempted.set(key, Date.now());
    }
    renderCards();
    await Promise.all(pairs.map(async (item) => {
      const key = pairKey(item);
      try {
        cache[key] = await fetchRate(item.from, item.to);
      } catch { /* Keep the saved rate available offline. */ }
      finally { pending.delete(key); renderCards(); }
    }));
    if (pairs.length) {
      // Retain only configured pairs; removing cards also removes their cached data.
      cache = Object.fromEntries(getConversions().flatMap((item) => cache[pairKey(item)] ? [[pairKey(item), cache[pairKey(item)]]] : []));
      try {
        if (typeof chrome !== "undefined" && chrome.storage?.local) await chrome.storage.local.set({ [CACHE_KEY]: cache });
        else localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch { /* Keep the in-memory rates when storage is unavailable. */ }
    }
  }

  function resetForm(): void {
    editingId = null;
    amount.value = "1";
    from.value = "";
    to.value = "";
    error.textContent = "";
    renderRows();
  }

  function commit(items: Conversion[]): void {
    save(items);
    renderRows();
    void updateRates();
  }

  function renderRows(): void {
    const items = getConversions();
    rows.replaceChildren();
    element("currency-count").textContent = `${items.length} / ${MAX_CONVERSIONS}`;
    element("currency-empty").hidden = items.length > 0;
    const atLimit = items.length >= MAX_CONVERSIONS && !editingId;
    for (const control of [amount, from, to, submit]) control.disabled = atLimit;
    submit.textContent = editingId ? "Save conversion" : "Add conversion";
    cancel.hidden = !editingId;

    items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "configured-clock configured-currency";
      row.classList.toggle("is-editing", editingId === item.id);
      const label = document.createElement("strong");
      label.textContent = `${item.amount} ${item.from} → ${item.to}`;
      const actions = document.createElement("div");
      actions.className = "clock-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "pagination-button currency-edit";
      edit.textContent = "Edit";
      edit.setAttribute("aria-label", `Edit ${item.from} to ${item.to}`);
      edit.addEventListener("click", () => {
        editingId = item.id;
        renderRows();
        amount.value = String(item.amount);
        from.value = item.from;
        to.value = item.to;
        error.textContent = "";
        amount.focus();
      });
      actions.append(edit);
      for (const offset of [-1, 1] as const) {
        const move = document.createElement("button");
        move.type = "button";
        move.className = "move-button";
        move.textContent = offset === -1 ? "↑" : "↓";
        move.setAttribute("aria-label", `Move ${item.from} to ${item.to} ${offset === -1 ? "up" : "down"}`);
        move.disabled = index + offset < 0 || index + offset >= items.length;
        move.addEventListener("click", () => {
          commit(moveItem(items, index, offset));
          rows.children[index + offset]?.querySelector<HTMLButtonElement>("button")?.focus();
        });
        actions.append(move);
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${item.from} to ${item.to}`);
      remove.addEventListener("click", () => {
        if (editingId === item.id) editingId = null;
        error.textContent = "";
        delete cache[pairKey(item)];
        commit(items.filter((saved) => saved.id !== item.id));
        if (typeof chrome !== "undefined" && chrome.storage?.local) void chrome.storage.local.set({ [CACHE_KEY]: cache }).catch(() => {});
        else { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* Best effort. */ } }
        amount.focus();
      });
      actions.append(remove);
      row.append(label, actions);
      rows.append(row);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    const items = getConversions();
    const value = amount.valueAsNumber;
    if (!validAmount(value)) { error.textContent = "Enter an amount greater than 0 and no more than 1 billion."; return; }
    if (from.value === to.value) { error.textContent = "Choose two different currencies."; to.focus(); return; }
    if (items.some((item) => item.id !== editingId && item.from === from.value && item.to === to.value)) {
      error.textContent = "That currency pair is already on your dashboard."; return;
    }
    if (!editingId && items.length >= MAX_CONVERSIONS) return;
    const item = { id: editingId ?? crypto.randomUUID(), amount: value, from: from.value, to: to.value };
    const updated = editingId ? items.map((saved) => saved.id === editingId ? item : saved) : [...items, item];
    editingId = null;
    commit(updated);
    resetForm();
    (amount.disabled ? rows.querySelector<HTMLButtonElement>("button") : amount)?.focus();
  });
  cancel.addEventListener("click", () => { resetForm(); (amount.disabled ? rows.querySelector<HTMLButtonElement>("button") : amount)?.focus(); });
  refresh.addEventListener("click", () => void updateRates(true));
  window.addEventListener("online", () => void updateRates(true));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void updateRates(); });
  window.setInterval(() => { if (!document.hidden) void updateRates(); }, 15 * 60_000);
  renderRows();
  void updateRates(true);
}
