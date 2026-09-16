// Prediction Interactive Handler for Srivilliputhur Municipal Drainage System

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('prediction-form');
  const resultCard = document.getElementById('prediction-result-card');
  const predictBtn = document.getElementById('predict-btn');

  // Input elements
  const pipelineSelect = document.getElementById('pipeline_type');
  const blockageContainer = document.getElementById('blockage-container');
  const blockageInput = document.getElementById('blockage_percent');

  // Handle pipeline change (show/hide blockage input and show leakage notice)
  pipelineSelect?.addEventListener('change', function () {
    const isLeakage = this.value === 'leakage';
    if (isLeakage) {
      blockageContainer.classList.remove('opacity-50');
      blockageInput.removeAttribute('disabled');
      document.getElementById('leakage-warning-banner').classList.remove('hidden');
    } else {
      blockageContainer.classList.add('opacity-50');
      blockageInput.setAttribute('disabled', 'disabled');
      document.getElementById('leakage-warning-banner').classList.add('hidden');
    }
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Running Inference...';

    const formData = new FormData(form);
    const payload = {
      model_type: formData.get('model_type'),
      pipeline_type: formData.get('pipeline_type'),
      rainfall_mm_7day: formData.get('rainfall_mm_7day'),
      rainfall_mm_30day: formData.get('rainfall_mm_30day'),
      plastic_accumulation_score: formData.get('plastic_accumulation_score'),
      drain_width_m: formData.get('drain_width_m'),
      drain_depth_m: formData.get('drain_depth_m'),
      drain_type: formData.get('drain_type'),
      days_since_cleaning: formData.get('days_since_cleaning'),
      previous_overflow_count_1yr: formData.get('previous_overflow_count_1yr'),
      water_level_cm: formData.get('water_level_cm'),
      blockage_percent: formData.get('blockage_percent') || 0
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 'success') {
        renderPredictionResult(data);
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        alert('Prediction error: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Inference request failed.');
    } finally {
      predictBtn.disabled = false;
      predictBtn.innerHTML = '<i class="fa-solid fa-calculator mr-1"></i> Calculate Drainage Overflow Risk';
    }
  });

  function renderPredictionResult(data) {
    resultCard.classList.remove('hidden');

    const badgeContainer = document.getElementById('result-badge');
    const labelText = data.predicted_risk_label;

    if (labelText === 'LOW') {
      badgeContainer.className = 'badge-risk-low text-base px-3 py-1';
      badgeContainer.innerHTML = '<i class="fa-solid fa-circle-check"></i> LOW RISK';
    } else if (labelText === 'MEDIUM') {
      badgeContainer.className = 'badge-risk-medium text-base px-3 py-1';
      badgeContainer.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> MEDIUM RISK';
    } else {
      badgeContainer.className = 'badge-risk-high text-base px-3 py-1';
      badgeContainer.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> HIGH RISK';
    }

    document.getElementById('result-confidence').innerText = `${data.confidence_percent}% Confidence`;
    document.getElementById('result-model-name').innerText = data.model_used;

    // Probabilities
    document.getElementById('prob-low-bar').style.width = `${data.probabilities.LOW}%`;
    document.getElementById('prob-low-val').innerText = `${data.probabilities.LOW}%`;

    document.getElementById('prob-med-bar').style.width = `${data.probabilities.MEDIUM}%`;
    document.getElementById('prob-med-val').innerText = `${data.probabilities.MEDIUM}%`;

    document.getElementById('prob-high-bar').style.width = '0%';
    document.getElementById('prob-high-val').innerText = '0.0% (No HIGH training samples)';

    document.getElementById('result-mandatory-disclaimer').innerText = data.disclaimer;
    document.getElementById('result-scope-notice').innerText = data.high_risk_notice;
  }
});
