import { fetchLaptops } from './api.js';
import { renderLayout, renderCard, skeletonCards, showError, showMessage, watchFavorites } from './ui.js';

renderLayout('laptops.html');
const $ = (id) => document.getElementById(id);
const grid = $('grid'), count = $('count');
const controls = { q: $('search'), cat: $('category'), price: $('max-price'), ram: $('min-ram'), sort: $('sort') };

const sorters = {
  'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price,
  'battery-asc': (a, b) => a.batteryHours - b.batteryHours, 'battery-desc': (a, b) => b.batteryHours - a.batteryHours,
  'weight-asc': (a, b) => a.weightKg - b.weightKg, 'weight-desc': (a, b) => b.weightKg - a.weightKg,
};
let all = [];

function update() {
  const q = controls.q.value.trim().toLowerCase();
  const maxPrice = Number(controls.price.value) || Infinity;
  const minRam = Number(controls.ram.value) || 0;
  let list = all.filter((l) =>
    `${l.name} ${l.brand}`.toLowerCase().includes(q) &&
    (controls.cat.value === 'all' || l.category === controls.cat.value) &&
    l.price <= maxPrice && l.ramGB >= minRam);
  if (sorters[controls.sort.value]) list = [...list].sort(sorters[controls.sort.value]); // sort a copy
  count.textContent = `${list.length} laptop${list.length === 1 ? '' : 's'} found`;
  if (list.length === 0) return showMessage(grid, 'No laptop matches your search. Try changing the filters.');
  grid.className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';
  grid.innerHTML = list.map((l) => renderCard(l)).join('');
}

grid.innerHTML = skeletonCards(6);
try {
  all = await fetchLaptops();
  Object.values(controls).forEach((c) => c.addEventListener('input', update));
  watchFavorites(grid);
  update();
} catch (err) {
  count.textContent = '';
  showError(grid, err.message);
}
