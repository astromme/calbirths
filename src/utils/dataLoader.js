export async function loadCountyData(countySlug) {
  const response = await fetch(`/calbirths/data/${countySlug}-births.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data for ${countySlug}`);
  }
  return response.json();
}

export async function loadAggregateData() {
  const response = await fetch('/calbirths/data/california-total-births.json');
  if (!response.ok) {
    throw new Error('Failed to load aggregate data');
  }
  return response.json();
}

export function slugToCountyName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
