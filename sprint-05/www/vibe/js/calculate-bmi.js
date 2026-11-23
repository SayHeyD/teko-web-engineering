function initCalculateBmi() {
  const form = document.getElementById('bmi-form');
  if (!form) {
    return;
  }

  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const resultDiv = document.getElementById('result');

  if (form.dataset.initialized === 'true') {
    return;
  }
  form.dataset.initialized = 'true';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const heightVal = parseFloat(heightInput.value.trim());
    const weightVal = parseFloat(weightInput.value.trim());

    if (isNaN(heightVal) || isNaN(weightVal) || heightVal <= 0 || weightVal <= 0) {
      resultDiv.className = 'mt-4';
      resultDiv.innerHTML = `
        <div class="alert alert-danger d-flex align-items-center mb-0" role="alert">
          <div>Please provide valid positive values for height and weight.</div>
        </div>
      `;
      return;
    }

    const heightM = heightVal / 100;
    const bmi = weightVal / (heightM * heightM);

    let bmiClass = '';
    let bmiCategory = '';
    let alertClass = '';

    if (bmi < 16) {
      bmiClass = 'severe-underweight';
      bmiCategory = 'Severely underweight';
      alertClass = 'alert-danger';
    } else if (bmi < 18.5) {
      bmiClass = 'underweight';
      bmiCategory = 'Underweight';
      alertClass = 'alert-warning';
    } else if (bmi < 25) {
      bmiClass = 'normal';
      bmiCategory = 'Normal weight';
      alertClass = 'alert-success';
    } else if (bmi < 30) {
      bmiClass = 'overweight';
      bmiCategory = 'Overweight';
      alertClass = 'alert-warning';
    } else if (bmi < 35) {
      bmiClass = 'obese';
      bmiCategory = 'Obese';
      alertClass = 'alert-danger';
    } else {
      bmiClass = 'severe-obesity';
      bmiCategory = 'Severely obese';
      alertClass = 'alert-danger';
    }

    resultDiv.className = `mt-4 bmi-result ${bmiClass}`;
    resultDiv.innerHTML = `
      <div class="alert ${alertClass} bmi-result-card p-3 shadow-sm mb-0">
        <h5 class="alert-heading fw-bold mb-2">Result</h5>
        <p class="mb-1">Your calculated BMI is <strong class="fs-5">${bmi.toFixed(2)}</strong>.</p>
        <p class="mb-0">Category: <strong class="badge bg-dark fs-6">${bmiCategory}</strong></p>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', initCalculateBmi);
