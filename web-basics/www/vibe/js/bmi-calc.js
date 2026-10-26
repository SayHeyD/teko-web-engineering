document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bmi-form');
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const resultDiv = document.getElementById('result');

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const heightCm = parseFloat(heightInput.value);
    const weightKg = parseFloat(weightInput.value);

    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
      resultDiv.innerHTML = '<p style="color: red;">Please provide valid positive values for height and weight.</p>';
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    resultDiv.innerHTML = `<p>Your calculated BMI is <strong>${bmi.toFixed(2)}</strong>.</p>`;
  });
});
