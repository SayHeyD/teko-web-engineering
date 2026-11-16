async function loadAndRenderBmiCategories() {
  const table = document.getElementById('bmi-category-table');
  if (!table) {
    return;
  }

  try {
    const data = await getBmiCategories();
    const categories = data.categories;

    // Build tbody
    const tbody = document.createElement('tbody');

    categories.forEach((category) => {
      const rowCount = category.items.length;

      category.items.forEach((item, index) => {
        const tr = document.createElement('tr');

        // General category column (with rowspan)
        if (index === 0) {
          const tdGeneral = document.createElement('td');
          tdGeneral.className = 'fw-bold text-capitalize ps-3 align-middle bg-body-tertiary';
          tdGeneral.textContent = category.name.toLowerCase();
          if (rowCount > 1) {
            tdGeneral.setAttribute('rowspan', String(rowCount));
          }
          tr.appendChild(tdGeneral);
        }

        // Specific column
        const tdSpecific = document.createElement('td');
        tdSpecific.textContent = item.specific || '';
        tr.appendChild(tdSpecific);

        // Minimal column
        const tdMinimal = document.createElement('td');
        tdMinimal.className = 'text-center font-monospace';
        tdMinimal.textContent = item.minimal !== null && item.minimal !== undefined ? String(item.minimal) : '';
        tr.appendChild(tdMinimal);

        // Maximal column
        const tdMaximal = document.createElement('td');
        tdMaximal.className = 'text-center font-monospace';
        if (item.maximal !== null && item.maximal !== undefined) {
          tdMaximal.innerHTML = item.maximal.replace('<', '&#60; ');
        }
        tr.appendChild(tdMaximal);

        tbody.appendChild(tr);
      });
    });

    table.appendChild(tbody);
  } catch (error) {
    console.error('Error loading BMI categories:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadAndRenderBmiCategories);
