export async function fetchLaptops() {
  try {
    const res = await fetch('data/laptops.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw new Error(`Could not load laptops (${err.message}). Run the site with Live Server.`);
  }
}

export const findById = (laptops, id) => laptops.find((l) => l.id === Number(id));
