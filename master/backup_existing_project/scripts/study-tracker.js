const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const subjectSelect = document.getElementById('subject-select');
const exportBtn = document.getElementById('export-json');
const chartCtx = document.getElementById('progressChart').getContext('2d');

let sessionData = JSON.parse(localStorage.getItem('studySessions')) || [];
let currentSession = null;
let chartUpdatePending = false;

const progressChart = new Chart(chartCtx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Minutes Studied',
      data: [],
      backgroundColor: '#0288d1'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Batch chart updates to improve performance
function updateChart() {
  if (chartUpdatePending) return;
  
  chartUpdatePending = true;
  requestAnimationFrame(() => {
    const subjectMap = {};
    sessionData.forEach(({ subject, duration }) => {
      subjectMap[subject] = (subjectMap[subject] || 0) + duration;
    });

    progressChart.data.labels = Object.keys(subjectMap);
    progressChart.data.datasets[0].data = Object.values(subjectMap);
    progressChart.update();
    chartUpdatePending = false;
  });
}

startBtn.onclick = () => {
  const subject = subjectSelect.value;
  if (!subject) return alert('Please select a subject');
  currentSession = { subject, startTime: Date.now() };
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  if (!currentSession) return;
  const duration = Math.round((Date.now() - currentSession.startTime) / 60000);
  sessionData.push({ subject: currentSession.subject, duration });
  localStorage.setItem('studySessions', JSON.stringify(sessionData));
  currentSession = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  updateChart();
};

exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'study_sessions.json';
  a.click();
  URL.revokeObjectURL(url);
};

updateChart();