const form = document.getElementById('bmi-form');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const heightVal = parseFloat(heightInput.value.trim());
  const weightVal = parseFloat(weightInput.value.trim());

  if (isNaN(heightVal) || isNaN(weightVal) || heightVal <= 0 || weightVal <= 0) {
    resultDiv.className = '';
    resultDiv.innerHTML = '<p style="color: red;">Please provide valid positive values for height and weight.</p>';
    return;
  }

  const heightM = heightVal / 100;
  const bmi = weightVal / (heightM * heightM);

  let bmiClass = '';
  let bmiCategory = '';

  if (bmi < 16) {
    bmiClass = 'severe-underweight';
    bmiCategory = 'Severely underweight';
  } else if (bmi < 18.5) {
    bmiClass = 'underweight';
    bmiCategory = 'Underweight';
  } else if (bmi < 25) {
    bmiClass = 'normal';
    bmiCategory = 'Normal weight';
  } else if (bmi < 30) {
    bmiClass = 'overweight';
    bmiCategory = 'Overweight';
  } else if (bmi < 35) {
    bmiClass = 'obese';
    bmiCategory = 'Obese';
  } else {
    bmiClass = 'severe-obesity';
    bmiCategory = 'Severely obese';
  }

  resultDiv.className = `bmi-result ${bmiClass}`;
  resultDiv.innerHTML = `
    <p>Your calculated BMI is <strong>${bmi.toFixed(2)}</strong>.</p>
    <p>Category: <strong>${bmiCategory}</strong>.</p>
  `;
});
