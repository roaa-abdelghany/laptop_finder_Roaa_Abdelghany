import { getCompare, setCompare, getFavorites, toggleFavorite, isFavorite } from './storage.js';

export const MAX = 4;
export const MIN = 2;

export const SPEC_ROWS = [
  { key: 'brand', label: 'Brand' },
  { key: 'category', label: 'Category' },
  { key: 'cpu', label: 'CPU' },
  { key: 'price', label: 'Price', best: 'min', fmt: (v) => `EGP${v.toLocaleString('en-US')}` },
  { key: 'ramGB', label: 'RAM', best: 'max', fmt: (v) => `${v} GB` },
  { key: 'storageGB', label: 'Storage', best: 'max', fmt: (v) => `${v} GB` },
  { key: 'batteryHours', label: 'Battery', best: 'max', fmt: (v) => `${v} h` },
  { key: 'weightKg', label: 'Weight', best: 'min', fmt: (v) => `${v} kg` },
  { key: 'screenInches', label: 'Screen', fmt: (v) => `${v}"` },
];

export const bestValue = (laptops, row) => {
  const values = laptops.map((l) => l[row.key]);
  return row.best === 'min' ? Math.min(...values) : Math.max(...values);
};

export function toggleCompare(id) {
  const ids = getCompare();
  if (ids.includes(id)) { setCompare(ids.filter((x) => x !== id)); return { ok: true }; }
  if (ids.length >= MAX) return { ok: false, message: `You can compare at most ${MAX} laptops. Remove one first.` };
  setCompare([...ids, id]);
  return { ok: true };
}

export function addToComparison(id) {
  if (!isFavorite(id)) toggleFavorite(id);
  const res = toggleCompare(id);
  if (res.ok && !getCompare().includes(id)) return { ok: true, message: 'Removed from comparison.' };
  return res.ok ? { ok: true, message: 'Added to comparison (and favorites).' } : res;
}

export const getSelected = () => getCompare().filter((id) => getFavorites().includes(id));
