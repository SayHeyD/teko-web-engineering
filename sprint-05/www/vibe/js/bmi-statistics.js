async function loadAndRenderBmiStatistics() {
  const accordionContainer = document.getElementById('bmi-statistics-accordion');
  if (!accordionContainer) {
    return;
  }

  try {
    const data = await getBmiStatistics();
    const statistics = data.statistics;

    if (!statistics) {
      return;
    }

    accordionContainer.innerHTML = '';

    statistics.forEach((entry, index) => {
      const headerId = `stat-header-${index}`;
      const collapseId = `stat-collapse-${index}`;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'accordion-item';

      const rankText = entry.rank !== null && entry.rank !== undefined ? `#${entry.rank}` : 'Unranked';
      const totalText = entry.total !== null && entry.total !== undefined ? `${entry.total}` : 'N/A';
      const maleText = entry.male !== null && entry.male !== undefined ? `${entry.male}` : 'N/A';
      const femaleText = entry.female !== null && entry.female !== undefined ? `${entry.female}` : 'N/A';

      itemDiv.innerHTML = `
        <h2 class="accordion-header" id="${headerId}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
            <div class="d-flex align-items-center justify-content-between w-100 me-3 flex-wrap gap-2">
              <div>
                <span class="fs-5">${entry.name}</span>
                <span class="badge bg-secondary ms-2">${entry.iso3166}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge ${entry.rank ? 'bg-primary' : 'bg-light text-muted border'}">${rankText}</span>
                <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle">Avg: ${totalText}</span>
              </div>
            </div>
          </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#bmi-statistics-accordion">
          <div class="accordion-body bg-white p-4">
            <div class="row g-3">
              <div class="col-sm-6 col-md-3">
                <div class="p-3 bg-light rounded-3 text-center border">
                  <small class="text-muted d-block fw-semibold mb-1">Global Rank</small>
                  <span class="fs-4 fw-bold text-primary">${rankText}</span>
                </div>
              </div>
              <div class="col-sm-6 col-md-3">
                <div class="p-3 bg-light rounded-3 text-center border">
                  <small class="text-muted d-block fw-semibold mb-1">Total Average</small>
                  <span class="fs-4 fw-bold text-dark">${totalText}</span>
                </div>
              </div>
              <div class="col-sm-6 col-md-3">
                <div class="p-3 bg-light rounded-3 text-center border">
                  <small class="text-muted d-block fw-semibold mb-1">Male Average</small>
                  <span class="fs-4 fw-bold text-info">${maleText}</span>
                </div>
              </div>
              <div class="col-sm-6 col-md-3">
                <div class="p-3 bg-light rounded-3 text-center border">
                  <small class="text-muted d-block fw-semibold mb-1">Female Average</small>
                  <span class="fs-4 fw-bold text-danger-emphasis">${femaleText}</span>
                </div>
              </div>
            </div>
            <div class="mt-3 text-end">
              <small class="text-muted">ISO 3166 Country Code: <strong>${entry.iso3166}</strong></small>
            </div>
          </div>
        </div>
      `;

      accordionContainer.appendChild(itemDiv);
    });
  } catch (error) {
    console.error('Error loading BMI statistics:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadAndRenderBmiStatistics);
