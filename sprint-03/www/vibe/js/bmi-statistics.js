const table = document.getElementById('bmi-statistics-table');

const data = getBmiStatistics();
const statistics = data.statistics;

// Build tbody
const tbody = document.createElement('tbody');

statistics.forEach((entry) => {
  const tr = document.createElement('tr');

  const tdName = document.createElement('td');
  tdName.textContent = entry.name;
  tr.appendChild(tdName);

  const tdIso = document.createElement('td');
  tdIso.textContent = entry.iso3166;
  tr.appendChild(tdIso);

  const tdRank = document.createElement('td');
  tdRank.textContent = entry.rank !== null && entry.rank !== undefined ? String(entry.rank) : '';
  tr.appendChild(tdRank);

  const tdTotal = document.createElement('td');
  tdTotal.textContent = entry.total !== null && entry.total !== undefined ? String(entry.total) : '';
  tr.appendChild(tdTotal);

  const tdMale = document.createElement('td');
  tdMale.textContent = entry.male !== null && entry.male !== undefined ? String(entry.male) : '';
  tr.appendChild(tdMale);

  const tdFemale = document.createElement('td');
  tdFemale.textContent = entry.female !== null && entry.female !== undefined ? String(entry.female) : '';
  tr.appendChild(tdFemale);

  tbody.appendChild(tr);
});

table.appendChild(tbody);
