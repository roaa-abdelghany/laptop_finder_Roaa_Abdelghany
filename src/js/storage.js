const FAV = 'lf_favorites', CMP = 'lf_compare', THEME = 'lf_theme';

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? []; } catch { return []; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getFavorites = () => read(FAV);
export const isFavorite = (id) => getFavorites().includes(id);
export const clearFavorites = () => { write(FAV, []); write(CMP, []); };

export function toggleFavorite(id) {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
  write(FAV, next);
  write(CMP, read(CMP).filter((x) => next.includes(x))); // compare only uses favorites
  return next.includes(id);
}

export const getCompare = () => read(CMP);
export const setCompare = (ids) => write(CMP, ids);

export const getTheme = () => localStorage.getItem(THEME) ?? 'performance';
export const applyTheme = (t = getTheme()) => { document.documentElement.dataset.theme = t; };
export function setTheme(t) { localStorage.setItem(THEME, t); applyTheme(t); }

applyTheme();
