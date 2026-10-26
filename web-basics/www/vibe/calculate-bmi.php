<?php
$bmi = null;
$error = null;
$heightInput = '';
$weightInput = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' || isset($_GET['height'], $_GET['weight'])) {
    $params = $_SERVER['REQUEST_METHOD'] === 'POST' ? $_POST : $_GET;
    $heightInput = isset($params['height']) ? trim((string)$params['height']) : '';
    $weightInput = isset($params['weight']) ? trim((string)$params['weight']) : '';

    if ($heightInput !== '' && $weightInput !== '') {
        $heightCm = filter_var($heightInput, FILTER_VALIDATE_FLOAT);
        $weightKg = filter_var($weightInput, FILTER_VALIDATE_FLOAT);

        if ($heightCm !== false && $weightKg !== false && $heightCm > 0 && $weightKg > 0) {
            $heightM = $heightCm / 100;
            $bmi = $weightKg / ($heightM * $heightM);
        } else {
            $error = 'Please provide valid positive values for height and weight.';
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="/vibe/css/main.css">
  <title>VIBE - Calculate BMI</title>
</head>
<body>
<h1>VIBE</h1>

<p>
  Calculate your BMI!
</p>

<hr>

<nav>
  <ul>
    <li><a href="/vibe/">Home</a></li>
    <li><a href="#" onclick="return false;">Calculate BMI</a></li>
    <li><a href="/vibe/bmi-statistics.html">BMI Statistics</a></li>
    <li><a href="/vibe/bmi-category.html">BMI Categories</a></li>
  </ul>
</nav>

<hr>

<main>
  <h2>Calculate Your BMI</h2>
  <form id="bmi-form" method="post" action="/vibe/calculate-bmi.php">
    <div>
      <label for="height">Height (cm):</label>
      <input type="number" id="height" name="height" step="any" min="1" required placeholder="e.g. 175" value="<?= htmlspecialchars($heightInput, ENT_QUOTES, 'UTF-8') ?>">
    </div>
    <div>
      <label for="weight">Weight (kg):</label>
      <input type="number" id="weight" name="weight" step="any" min="1" required placeholder="e.g. 70" value="<?= htmlspecialchars($weightInput, ENT_QUOTES, 'UTF-8') ?>">
    </div>
    <button type="submit" id="calculate-btn">Calculate BMI</button>
  </form>

  <div id="result" aria-live="polite">
    <?php if ($bmi !== null): ?>
      <p>Your calculated BMI is <strong><?= number_format($bmi, 2) ?></strong>.</p>
    <?php elseif ($error !== null): ?>
      <p style="color: red;"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>
  </div>
</main>
</body>
</html>
