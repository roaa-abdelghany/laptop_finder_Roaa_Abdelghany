import { fetchLaptops } from './api.js';
import { getFavorites } from './storage.js';
import { renderLayout, showError, showMessage } from './ui.js';
import { SPEC_ROWS, MIN, MAX, bestValue, toggleCompare, getSelected } from './compare.js';

renderLayout('compare.html');
const picker = document.getElementById('picker'), table = document.getElementById('table'), msg = document.getElementById('msg');
let all = [];

function render() {
  const favs = all.filter((l) => getFavorites().includes(l.id));
  if (!favs.length) {
    picker.innerHTML = ''; table.innerHTML = '';
    return showMessage(table, 'Save some laptops as favorites first, then come back to compare them.');
  }
  const selected = getSelected();
  picker.innerHTML = favs.map((l) => {
    const on = selected.includes(l.id);
    return `<button type="button" data-id="${l.id}" aria-pressed="${on}" class="${on ? 'btn-action' : 'btn-ghost'}">${on ? '✓ ' : ''}${l.name}</button>`;
  }).join('');
  const chosen = all.filter((l) => selected.includes(l.id));
  if (chosen.length < MIN) return showMessage(table, `Select at least ${MIN} favorites (up to ${MAX}) to compare.`);
  const head = chosen.map((l) => `<th scope="col" class="min-w-40 p-3 text-left"><a class="hover:text-accent" href="details.html?id=${l.id}">${l.name}</a></th>`).join('');
  const body = SPEC_ROWS.map((row) => {
    const best = row.best ? bestValue(chosen, row) : null; // best value for this row
    const cells = chosen.map((l) => {
      const win = row.best && l[row.key] === best;
      return `<td class="p-3 ${win ? 'bg-accent font-bold text-accent-ink' : ''}">${row.fmt ? row.fmt(l[row.key]) : l[row.key]}</td>`;
    }).join('');
    return `<tr class="border-t border-line"><th scope="row" class="p-3 text-left text-muted">${row.label}</th>${cells}</tr>`;
  }).join('');
  table.innerHTML = `<div class="overflow-x-auto rounded-xl border border-line bg-surface"><table class="w-full min-w-max"><thead><tr><th class="p-3"></th>${head}</tr></thead><tbody>${body}</tbody></table></div>
    <p class="mt-2 text-sm text-muted">Highlighted = best value in the row (lowest price/weight, highest RAM/storage/battery).</p>`;
}

picker.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-id]');
  if (!btn) return;
  const res = toggleCompare(Number(btn.dataset.id));
  msg.textContent = res.ok ? '' : res.message;
  render();
});

try { all = await fetchLaptops(); render(); } catch (err) { showError(table, err.message); }
