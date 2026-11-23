import { fetchLaptops } from './api.js';
import { getFavorites } from './storage.js';
import { renderLayout, money, showError } from './ui.js';

renderLayout('index.html');
const stats = document.getElementById('stats');

try {
  const laptops = await fetchLaptops();

  const lowest = laptops.reduce((min, l) => Math.min(min, l.price), Infinity);
  const avgBattery = laptops.reduce((sum, l) => sum + l.batteryHours, 0) / laptops.length;
  const items = [['Laptops', laptops.length], ['Lowest price', money(lowest)], ['Avg battery', `${avgBattery.toFixed(1)} h`], ['Saved favorites', getFavorites().length]];
  stats.innerHTML = items.map(([label, value]) => `
    <div class="laptop-card text-center"><p class="text-3xl font-extrabold text-accent">${value}</p><p class="text-sm text-muted">${label}</p></div>`).join('');
} catch (err) {
  showError(stats, err.message);
}
