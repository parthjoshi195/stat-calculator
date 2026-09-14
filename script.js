let currentStdDev = null;

function fmt(x) {
  if (Array.isArray(x)) {
    return x.map(v => Math.round(v * 100) / 100).join(', ');
  }
  return Math.round(x * 100) / 100;
}

document.getElementById('calcBtn').addEventListener('click', function () {
  const raw = document.getElementById('nums').value;
  const err1 = document.getElementById('err1');
  const stepsEl = document.getElementById('steps');
  const checkSection = document.getElementById('checkSection');
  const checkResult = document.getElementById('checkResult');

  checkResult.style.display = 'none';
  document.getElementById('userAnswer').value = '';

  const numbers = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

  if (numbers.length < 2) {
    err1.textContent = 'Enter at least two valid numbers, separated by commas.';
    err1.style.display = 'block';
    stepsEl.style.display = 'none';
    checkSection.style.display = 'none';
    return;
  }
  err1.style.display = 'none';

  const n = numbers.length;
  const mean = numbers.reduce((a, b) => a + b, 0) / n;
  const deviations = numbers.map(x => x - mean);
  const squared = deviations.map(d => d * d);
  const sumSquared = squared.reduce((a, b) => a + b, 0);
  const variance = sumSquared / n;
  const stdDev = Math.sqrt(variance);
  currentStdDev = stdDev;

  const steps = [
    {
      label: 'Step 1: find the mean',
      formula: '(' + numbers.join(' + ') + ') / ' + n,
      result: fmt(mean)
    },
    {
      label: 'Step 2: subtract the mean from each value',
      formula: '',
      result: fmt(deviations)
    },
    {
      label: 'Step 3: square each deviation',
      formula: '',
      result: fmt(squared)
    },
    {
      label: 'Step 4: sum the squared deviations',
      formula: squared.map(v => fmt(v)).join(' + '),
      result: fmt(sumSquared)
    },
    {
      label: 'Step 5: divide by n (number of values)',
      formula: fmt(sumSquared) + ' / ' + n,
      result: fmt(variance)
    },
    {
      label: 'Step 6: take the square root',
      formula: 'sqrt(' + fmt(variance) + ')',
      result: fmt(stdDev)
    }
  ];

  let html = '';
  steps.forEach(function (s) {
    html += '<div class="step-card">';
    html += '<p class="step-label">' + s.label + '</p>';
    if (s.formula) {
      html += '<p class="step-formula">' + s.formula + '</p>';
    }
    html += '<p class="step-result">' + s.result + '</p>';
    html += '</div>';
  });
  html += '<p class="plain-english">In plain English: your data typically varies about ' +
    fmt(stdDev) + ' points from the average.</p>';

  stepsEl.innerHTML = html;
  stepsEl.style.display = 'block';
  checkSection.style.display = 'block';
});

document.getElementById('checkBtn').addEventListener('click', function () {
  const err2 = document.getElementById('err2');
  const checkResult = document.getElementById('checkResult');
  const val = document.getElementById('userAnswer').value.trim();
  const userNum = parseFloat(val);

  if (val === '' || isNaN(userNum)) {
    err2.textContent = 'Enter a number first.';
    err2.style.display = 'block';
    checkResult.style.display = 'none';
    return;
  }
  err2.style.display = 'none';

  const diff = Math.abs(userNum - currentStdDev);
  if (diff < 0.1) {
    checkResult.style.color = '#1e8e3e';
    checkResult.textContent = 'Correct. That matches ' + fmt(currentStdDev) + '.';
  } else {
    checkResult.style.color = '#c0392b';
    checkResult.textContent = 'Not quite. The correct answer is ' + fmt(currentStdDev) +
      '. Check step 1 first, since a wrong mean throws off every step after it.';
  }
  checkResult.style.display = 'block';
});
