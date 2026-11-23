import { fetchLaptops, findById } from './api.js';
import { renderLayout, favButton, money, showError, showMessage, watchFavorites } from './ui.js';
import { SPEC_ROWS, addToComparison } from './compare.js';

renderLayout('laptops.html');
const box = document.getElementById('detail');
const id = new URLSearchParams(location.search).get('id');

try {
  const laptops = await fetchLaptops();
  const l = id ? findById(laptops, id) : null;
  if (!l) {
    showMessage(box, 'Laptop not found. <a class="text-accent underline" href="laptops.html">Back to the catalogue</a>');
  } else {
    document.title = `${l.name} – Student Laptop Finder`;
    const rows = SPEC_ROWS.map((r) => `<tr class="border-b border-line"><th scope="row" class="w-1/3 py-2 pr-4 text-left font-medium text-muted">${r.label}</th><td class="py-2">${r.fmt ? r.fmt(l[r.key]) : l[r.key]}</td></tr>`).join('');
    box.innerHTML = `
      <div class="grid gap-8 md:grid-cols-2">
        <img src="${l.image}" alt="${l.name}" class="w-full rounded-xl border border-line bg-surface object-contain p-4">
        <div>
          <p class="text-sm uppercase tracking-wide text-muted">${l.brand} · ${l.category}</p>
          <h1 class="mt-1 text-3xl font-bold">${l.name}</h1>
          <p class="mt-2 text-3xl font-extrabold text-accent">${money(l.price)}</p>
          <p class="mt-4 text-muted">${l.description}</p>
          <div class="mt-5 flex flex-wrap gap-2">${favButton(l.id)}<button id="cmp" type="button" class="btn-action">⚖ Add to comparison</button></div>
          <p id="msg" role="status" class="mt-3 text-sm text-accent"></p>
        </div>
      </div>
      <h2 class="mt-10 mb-2 text-xl font-bold">Full specifications</h2>
      <div class="overflow-x-auto rounded-xl border border-line bg-surface px-4"><table class="w-full">${rows}</table></div>`;
    watchFavorites(box);
    document.getElementById('cmp').addEventListener('click', () => {
      document.getElementById('msg').textContent = addToComparison(l.id).message;
      const b = box.querySelector('[data-fav]'); b.textContent = '♥ Saved'; b.setAttribute('aria-pressed', 'true');
    });
  }
} catch (err) {
  showError(box, err.message);
}
