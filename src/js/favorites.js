import { fetchLaptops } from './api.js';
import { getFavorites, clearFavorites } from './storage.js';
import { renderLayout, renderCard, skeletonCards, showError, showMessage, watchFavorites, money } from './ui.js';

renderLayout('favorites.html');
const grid = document.getElementById('grid'), totals = document.getElementById('totals');
let all = [];

function render() {
  const saved = all.filter((l) => getFavorites().includes(l.id));

  const total = saved.reduce((sum, l) => sum + l.price, 0);
  const avg = saved.length ? Math.round(total / saved.length) : 0;
  totals.textContent = `${saved.length} saved · Total ${money(total)} · Average ${money(avg)}`;
  document.getElementById('clear').disabled = saved.length === 0;
  if (!saved.length) {
    grid.className = '';
    return showMessage(grid, 'No favorites yet. <a class="text-accent underline" href="laptops.html">Browse laptops</a> and tap ♡ Save.');
  }
  grid.className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';
  grid.innerHTML = saved.map((l) => renderCard(l, { remove: true })).join('');
}

grid.innerHTML = skeletonCards(3);
try {
  all = await fetchLaptops();
  watchFavorites(grid, render);
  document.getElementById('clear').addEventListener('click', () => { clearFavorites(); render(); });
  render();
} catch (err) {
  showError(grid, err.message);
}
