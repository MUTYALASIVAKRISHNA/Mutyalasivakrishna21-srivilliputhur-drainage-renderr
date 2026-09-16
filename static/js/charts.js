// Charts JavaScript for Analytics & ML Diagnostics

document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Risk Distribution Chart
  const riskCtx = document.getElementById('riskChart')?.getContext('2d');
  if (riskCtx) {
    new Chart(riskCtx, {
      type: 'doughnut',
      data: {
        labels: ['LOW Risk (32)', 'MEDIUM Risk (18)', 'HIGH Risk (0)'],
        datasets: [{
          data: [32, 18, 0],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }

  // 2. Historical Incidents Year-wise
  const incCtx = document.getElementById('incidentsYearChart')?.getContext('2d');
  if (incCtx) {
    new Chart(incCtx, {
      type: 'bar',
      data: {
        labels: ['2019–2021', '2021', '2022', '2023', '2024', '2026'],
        datasets: [{
          label: 'Documented Incidents',
          data: [1, 4, 1, 2, 3, 1],
          backgroundColor: '#0284c7',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 3. Plastic Level Breakdown in Synthetic Dataset
  const plasticCtx = document.getElementById('plasticDistChart')?.getContext('2d');
  if (plasticCtx) {
    new Chart(plasticCtx, {
      type: 'bar',
      data: {
        labels: ['NONE (0)', 'LOW (1)', 'MEDIUM (2)', 'HIGH (3)'],
        datasets: [{
          label: 'Drain Records',
          data: [6, 12, 19, 13],
          backgroundColor: ['#94a3b8', '#34d399', '#fbbf24', '#f87171'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 2 } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 4. Field Survey Completion
  const surveyCtx = document.getElementById('surveyStatusChart')?.getContext('2d');
  if (surveyCtx) {
    new Chart(surveyCtx, {
      type: 'doughnut',
      data: {
        labels: ['Planned / Field Data Required (25)', 'Completed Real Observations (0)'],
        datasets: [{
          data: [25, 0],
          backgroundColor: ['#ea580c', '#0d9488'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }

});
