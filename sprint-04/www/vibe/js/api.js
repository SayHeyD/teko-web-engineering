async function getBmiCategories() {
  const response = await fetch('/vibe/api/bmi-categories.json');
  if (!response.ok) {
    throw new Error(`HTTP error fetching categories: ${response.status}`);
  }
  return await response.json();
}

async function getBmiStatistics() {
  const response = await fetch('/vibe/api/bmi-statistics.json');
  if (!response.ok) {
    throw new Error(`HTTP error fetching statistics: ${response.status}`);
  }
  return await response.json();
}
