import { isFavorite, toggleFavorite, getTheme, setTheme } from './storage.js';

export const money = (n) => `EGP${n.toLocaleString('en-US')}`;

export const favButton = (id, remove = false) =>
  `<button type="button" data-fav="${id}" ${remove ? 'data-remove="1"' : ''} aria-pressed="${isFavorite(id)}" class="btn-ghost">${
    remove ? '✕ Remove' : isFavorite(id) ? '♥ Saved' : '♡ Save'}</button>`;

export const renderCard = (l, { remove = false } = {}) => `
  <article class="laptop-card">
    <a href="details.html?id=${l.id}"><img src="${l.image}" alt="${l.name}" loading="lazy" class="h-40 w-full rounded-lg bg-bg object-contain"></a>
    <p class="mt-3 text-xs uppercase tracking-wide text-muted">${l.brand} · ${l.category}</p>
    <h3 class="font-semibold"><a href="details.html?id=${l.id}" class="transition hover:text-accent">${l.name}</a></h3>
    <p class="mt-1 text-2xl font-bold text-accent">${money(l.price)}</p>
    <ul class="mt-2 grid grid-cols-2 gap-1 text-sm text-muted">
      <li>${l.ramGB} GB RAM</li><li>${l.storageGB} GB SSD</li>
      <li>${l.batteryHours} h battery</li><li>${l.weightKg} kg</li>
    </ul>
    <div class="mt-auto flex gap-2 pt-4">
      <a class="btn-action flex-1" href="details.html?id=${l.id}">Details</a>${favButton(l.id, remove)}
    </div>
  </article>`;

export const skeletonCards = (n = 6) =>
  Array.from({ length: n }, () => `
  <div class="laptop-card animate-pulse" aria-hidden="true">
    <div class="h-40 rounded-lg bg-line"></div><div class="mt-3 h-3 w-1/3 rounded bg-line"></div>
    <div class="mt-2 h-5 w-3/4 rounded bg-line"></div><div class="mt-2 h-7 w-1/2 rounded bg-line"></div>
    <div class="mt-3 h-12 rounded bg-line"></div><div class="mt-4 h-10 rounded bg-line"></div>
  </div>`).join('');

export const showError = (el, msg) => {
  el.innerHTML = `<div role="alert" class="rounded-xl border border-red-500 bg-red-500/10 p-4 text-ink">⚠ ${msg}</div>`;
};

export const showMessage = (el, msg) => {
  el.innerHTML = `<p class="rounded-xl border border-line bg-surface p-6 text-center text-muted">${msg}</p>`;
};

export function watchFavorites(container, onChange) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    const saved = toggleFavorite(Number(btn.dataset.fav));
    if (!btn.dataset.remove) {
      btn.textContent = saved ? '♥ Saved' : '♡ Save';
      btn.setAttribute('aria-pressed', String(saved));
    }
    onChange?.();
  });
}

export function renderLayout(active) {
  const links = [['index.html', 'Home'], ['laptops.html', 'Laptops'], ['favorites.html', 'Favorites'], ['compare.html', 'Compare']];
  const nav = links.map(([href, text]) =>
    `<a href="${href}" class="rounded-lg px-3 py-2 transition hover:bg-bg ${href === active ? 'font-semibold text-accent' : ''}">${text}</a>`).join('');
  document.getElementById('site-header').innerHTML = `
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
      <a href="index.html" class="text-lg font-bold text-accent">💻 Laptop Finder</a>
      <button id="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" class="btn-ghost md:hidden">☰ Menu</button>
      <nav id="nav-menu" class="hidden w-full flex-col gap-1 md:flex md:w-auto md:flex-row md:items-center">
        ${nav}<button id="theme-switch" type="button" class="btn-ghost"></button>
      </nav>
    </div>`;
  const menu = document.getElementById('nav-menu');
  const toggle = document.getElementById('nav-toggle');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('flex');
    menu.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  const sw = document.getElementById('theme-switch');
  const label = () => { sw.textContent = getTheme() === 'performance' ? '🔋 Battery Saver' : '⚡ Performance'; };
  label();
  sw.addEventListener('click', () => { setTheme(getTheme() === 'performance' ? 'battery' : 'performance'); label(); });
}
