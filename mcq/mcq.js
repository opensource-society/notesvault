// Render quiz cards on front page
function renderQuizCards() {
  const quizCards = document.getElementById('quizCards');
  if (!quizCards) return;
  if (mcqs.length === 0) {
    quizCards.innerHTML = `<div class="quiz-card">
      <span class="quiz-lock"><i class="fas fa-lock"></i></span>
      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" class="quiz-image" alt="Quiz" />
      <div class="quiz-title">Untitled Quiz</div>
      <div class="quiz-meta">
        <span class="quiz-date">${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span class="quiz-views"><i class="fas fa-eye"></i> 0</span>
        <span class="quiz-count"><i class="fas fa-list"></i> 0</span>
      </div>
    </div>`;
    return;
  }
  quizCards.innerHTML = mcqs.map((q, i) => `
    <div class="quiz-card">
      <span class="quiz-lock"><i class="fas fa-lock"></i></span>
      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" class="quiz-image" alt="Quiz" />
      <div class="quiz-title">${q.question.substring(0, 30) || 'Untitled Quiz'}</div>
      <div class="quiz-meta">
        <span class="quiz-date">${new Date().toLocaleString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span class="quiz-views"><i class="fas fa-eye"></i> 1</span>
        <span class="quiz-count"><i class="fas fa-list"></i> 1</span>
      </div>
    </div>
  `).join('');
}

// Show quiz creation form when Create a Quiz is clicked
const createQuizBtn = document.getElementById('createQuizBtn');
const mcqFront = document.querySelector('.mcq-front');
const mcqContainer = document.querySelector('.mcq-container');
if (createQuizBtn && mcqFront && mcqContainer) {
  createQuizBtn.onclick = function() {
    mcqFront.style.display = 'none';
    mcqContainer.style.display = '';
    document.getElementById('mcqForm').style.display = '';
    document.getElementById('mcqList').style.display = 'none';
  };
}

// Initial render
renderQuizCards();
// UI logic for Add/Practice buttons
const showAddMcqBtn = document.getElementById('showAddMcqBtn');
const showPracticeBtn = document.getElementById('showPracticeBtn');
const mcqForm = document.getElementById('mcqForm');
const mcqList = document.getElementById('mcqList');

if (showAddMcqBtn && showPracticeBtn && mcqForm && mcqList) {
  showAddMcqBtn.onclick = function() {
    mcqForm.style.display = '';
    mcqList.style.display = 'none';
  };
  showPracticeBtn.onclick = function() {
    mcqForm.style.display = 'none';
    mcqList.style.display = '';
    renderMCQs();
  };
}
// MCQ Logic
let mcqs = JSON.parse(localStorage.getItem('notesvault-mcqs')) || [];

function saveMCQs() {
  localStorage.setItem('notesvault-mcqs', JSON.stringify(mcqs));
}

function renderMCQs() {
  const list = document.getElementById('mcqList');
  if (!list) return;
  if (mcqs.length === 0) {
    list.innerHTML = '<p>No MCQs yet. Add your first!</p>';
    return;
  }
  list.innerHTML = mcqs.map((q, i) => `
    <div class="mcq-item">
      <strong>Q${i+1}:</strong> ${q.question}<br>
      <span>A: ${q.options.A}</span> | <span>B: ${q.options.B}</span> | <span>C: ${q.options.C}</span> | <span>D: ${q.options.D}</span>
      <span class="correct">Correct: ${q.correct}</span>
    </div>
  `).join('');
}

mcqForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const question = document.getElementById('questionInput').value.trim();
  const options = {
    A: document.getElementById('optionA').value.trim(),
    B: document.getElementById('optionB').value.trim(),
    C: document.getElementById('optionC').value.trim(),
    D: document.getElementById('optionD').value.trim()
  };
  const correct = document.getElementById('correctOption').value;
  if (!question || !options.A || !options.B || !options.C || !options.D || !correct) return;
  mcqs.push({ question, options, correct });
  saveMCQs();
  this.reset();
  mcqForm.style.display = 'none';
  mcqList.style.display = '';
  renderMCQs();
});

// Show MCQ list by default
mcqForm.style.display = 'none';
mcqList.style.display = '';
renderMCQs();

document.getElementById('weeklyQuizBtn').addEventListener('click', function() {
  if (mcqs.length === 0) return;
  const quizSection = document.getElementById('quizSection');
  let score = 0;
  let quizHtml = '<h2>Weekly Quiz</h2>';
  mcqs.forEach((q, i) => {
    quizHtml += `<div class="quiz-item">
      <strong>Q${i+1}:</strong> ${q.question}<br>
      <label><input type="radio" name="quiz${i}" value="A"> A: ${q.options.A}</label>
      <label><input type="radio" name="quiz${i}" value="B"> B: ${q.options.B}</label>
      <label><input type="radio" name="quiz${i}" value="C"> C: ${q.options.C}</label>
      <label><input type="radio" name="quiz${i}" value="D"> D: ${q.options.D}</label>
    </div>`;
  });
  quizHtml += '<button id="submitQuiz">Submit Quiz</button>';
  quizSection.innerHTML = quizHtml;
  document.getElementById('submitQuiz').onclick = function() {
    score = 0;
    mcqs.forEach((q, i) => {
      const selected = document.querySelector(`input[name='quiz${i}']:checked`);
      if (selected && selected.value === q.correct) score++;
    });
    quizSection.innerHTML += `<p>Your Score: ${score} / ${mcqs.length}</p>`;
  };
});
