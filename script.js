function fmt(x) {
  if (Array.isArray(x)) {
    return x.map(v => Math.round(v * 100) / 100).join(', ');
  }
  return Math.round(x * 100) / 100;
}

function parseNums(raw) {
  return raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
}

function renderSteps(container, steps) {
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
  container.innerHTML = html;
  container.style.display = 'block';
}

document.querySelectorAll('.tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab + '-panel').classList.add('active');
  });
});

let currentStdDev = null;

document.getElementById('calcBtn-stddev').addEventListener('click', function () {
  const raw = document.getElementById('nums-stddev').value;
  const err = document.getElementById('err-stddev');
  const stepsEl = document.getElementById('steps-stddev');
  const checkBox = document.getElementById('check-stddev');
  document.getElementById('checkResult-stddev').style.display = 'none';
  document.getElementById('userAnswer-stddev').value = '';

  const numbers = parseNums(raw);
  if (numbers.length < 2) {
    err.textContent = 'Enter at least two valid numbers, separated by commas.';
    err.style.display = 'block';
    stepsEl.style.display = 'none';
    checkBox.style.display = 'none';
    return;
  }
  err.style.display = 'none';

  const n = numbers.length;
  const mean = numbers.reduce((a, b) => a + b, 0) / n;
  const deviations = numbers.map(x => x - mean);
  const squared = deviations.map(d => d * d);
  const sumSquared = squared.reduce((a, b) => a + b, 0);
  const variance = sumSquared / n;
  const stdDev = Math.sqrt(variance);
  currentStdDev = stdDev;

  const steps = [
    { label: 'Step 1: find the mean', formula: '(' + numbers.join(' + ') + ') / ' + n, result: fmt(mean) },
    { label: 'Step 2: subtract the mean from each value', formula: '', result: fmt(deviations) },
    { label: 'Step 3: square each deviation', formula: '', result: fmt(squared) },
    { label: 'Step 4: sum the squared deviations', formula: squared.map(v => fmt(v)).join(' + '), result: fmt(sumSquared) },
    { label: 'Step 5: divide by n (number of values)', formula: fmt(sumSquared) + ' / ' + n, result: fmt(variance) },
    { label: 'Step 6: take the square root', formula: 'sqrt(' + fmt(variance) + ')', result: fmt(stdDev) }
  ];

  renderSteps(stepsEl, steps);
  stepsEl.innerHTML += '<p class="plain-english">In plain English: your data typically varies about ' + fmt(stdDev) + ' points from the average.</p>';
  checkBox.style.display = 'block';
});

document.getElementById('checkBtn-stddev').addEventListener('click', function () {
  const err = document.getElementById('checkErr-stddev');
  const result = document.getElementById('checkResult-stddev');
  const val = document.getElementById('userAnswer-stddev').value.trim();
  const userNum = parseFloat(val);

  if (val === '' || isNaN(userNum)) {
    err.textContent = 'Enter a number first.';
    err.style.display = 'block';
    result.style.display = 'none';
    return;
  }
  err.style.display = 'none';

  const diff = Math.abs(userNum - currentStdDev);
  if (diff < 0.1) {
    result.style.color = '#1e8e3e';
    result.textContent = 'Correct. That matches ' + fmt(currentStdDev) + '.';
  } else {
    result.style.color = '#c0392b';
    result.textContent = 'Not quite. The correct answer is ' + fmt(currentStdDev) + '. Check step 1 first, since a wrong mean throws off every step after it.';
  }
  result.style.display = 'block';
});

document.getElementById('calcBtn-meanmed').addEventListener('click', function () {
  const raw = document.getElementById('nums-meanmed').value;
  const err = document.getElementById('err-meanmed');
  const stepsEl = document.getElementById('steps-meanmed');

  const numbers = parseNums(raw);
  if (numbers.length < 1) {
    err.textContent = 'Enter at least one valid number.';
    err.style.display = 'block';
    stepsEl.style.display = 'none';
    return;
  }
  err.style.display = 'none';

  const n = numbers.length;
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const freq = {};
  numbers.forEach(x => freq[x] = (freq[x] || 0) + 1);
  let maxFreq = 0;
  Object.values(freq).forEach(f => { if (f > maxFreq) maxFreq = f; });
  const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
  const modeStr = maxFreq <= 1 ? 'no repeated value' : modes.map(m => fmt(parseFloat(m))).join(', ');

  const steps = [
    { label: 'Step 1: sort the numbers', formula: '', result: fmt(sorted) },
    { label: 'Step 2: find the mean (average)', formula: '(' + numbers.join(' + ') + ') / ' + n, result: fmt(mean) },
    { label: 'Step 3: find the median (middle value)', formula: n % 2 === 0 ? 'average of the two middle numbers' : 'the middle number', result: fmt(median) },
    { label: 'Step 4: find the mode (most frequent value)', formula: '', result: modeStr }
  ];

  renderSteps(stepsEl, steps);
});

document.getElementById('calcBtn-zscore').addEventListener('click', function () {
  const err = document.getElementById('err-zscore');
  const stepsEl = document.getElementById('steps-zscore');

  const x = parseFloat(document.getElementById('zscore-x').value);
  const mean = parseFloat(document.getElementById('zscore-mean').value);
  const sd = parseFloat(document.getElementById('zscore-sd').value);

  if (isNaN(x) || isNaN(mean) || isNaN(sd) || sd === 0) {
    err.textContent = 'Fill in all three fields with valid numbers (std deviation cannot be 0).';
    err.style.display = 'block';
    stepsEl.style.display = 'none';
    return;
  }
  err.style.display = 'none';

  const diff = x - mean;
  const z = diff / sd;

  const steps = [
    { label: 'Step 1: subtract the mean from the value', formula: fmt(x) + ' - ' + fmt(mean), result: fmt(diff) },
    { label: 'Step 2: divide by the standard deviation', formula: fmt(diff) + ' / ' + fmt(sd), result: fmt(z) }
  ];

  renderSteps(stepsEl, steps);
  const direction = z >= 0 ? 'above' : 'below';
  stepsEl.innerHTML += '<p class="plain-english">In plain English: this value is ' + fmt(Math.abs(z)) + ' standard deviations ' + direction + ' the mean.</p>';
});

function setupPhotoScan(fileInputId, statusId, textareaId) {
  const fileInput = document.getElementById(fileInputId);
  const status = document.getElementById(statusId);
  const textarea = document.getElementById(textareaId);

  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (!file) return;

    status.style.display = 'block';
    status.textContent = 'Reading numbers from photo... this can take 10-20 seconds.';

    Tesseract.recognize(file, 'eng')
      .then(function (result) {
        const text = result.data.text;
        const matches = text.match(/-?\d+(\.\d+)?/g);
        if (!matches || matches.length === 0) {
          status.textContent = 'Could not find any numbers in that photo. Try a clearer picture.';
          return;
        }
        textarea.value = matches.join(', ');
        status.textContent = 'Found ' + matches.length + ' number(s). Check they look right, then tap "Show steps".';
      })
      .catch(function () {
        status.textContent = 'Something went wrong reading that photo. Try again with a clearer picture.';
      });
  });
}

setupPhotoScan('photo-stddev', 'scanStatus-stddev', 'nums-stddev');
setupPhotoScan('photo-meanmed', 'scanStatus-meanmed', 'nums-meanmed');
