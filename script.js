// Questions data - Expanded with 1.1.3 from Quizizz
const questions = {
  '1.1.1': [
    { question: 'Which register holds the address of the next instruction?', options: ['Program Counter (PC)', 'MDR', 'ACC', 'CIR'], correct: 0, explanation: 'The Program Counter (PC) holds the address of the next instruction to be fetched in the Fetch-Decode-Execute cycle.' },
    { question: 'The MDR temporarily holds:', options: ['Data being transferred to/from memory', 'The address of the next instruction', 'Results of arithmetic only', 'Microcode'], correct: 0, explanation: 'The Memory Data Register (MDR) holds data or instructions moving between memory and the CPU.' },
    { question: 'Which factor does NOT directly affect CPU performance?', options: ['Number of USB ports', 'Clock speed', 'Number of cores', 'Cache size'], correct: 0, explanation: 'Clock speed, cores, and cache affect performance; USB ports are I/O and don\'t directly impact CPU speed.' },
    { question: 'During the Fetch stage, what is the correct sequence?', options: ['MAR ← PC; Memory → MDR; CIR ← MDR', 'MDR ← PC; MAR ← Memory; CIR ← ACC', 'PC ← MDR; MAR ← CIR; ACC ← PC', 'CIR ← PC; MDR ← MAR; PC ← ACC'], correct: 0, explanation: 'The Fetch stage involves copying the PC to MAR, reading memory into MDR, then transferring to CIR.' },
    { question: 'What is the role of the ALU?', options: ['Performs arithmetic and logical operations', 'Stores the next instruction address', 'Manages memory allocation', 'Decodes instructions'], correct: 0, explanation: 'The Arithmetic Logic Unit (ALU) handles computations like addition and logical AND/OR.' }
  ],
  '1.1.2': [
    { question: 'Which is a characteristic of RISC processors?', options: ['Simple instructions executing in one cycle', 'Complex instructions for reduced code size', 'Reliance on microcode for execution', 'Limited register set'], correct: 0, explanation: 'RISC uses simple instructions for faster execution and pipelining.' },
    { question: 'What is a primary use of GPUs?', options: ['Parallel processing for graphics and AI', 'Sequential instruction execution', 'Memory management in OS', 'Input device control'], correct: 0, explanation: 'GPUs handle parallel tasks like rendering or machine learning.' },
    { question: 'In multicore systems, what improves performance?', options: ['Dividing tasks across cores', 'Increasing single-core clock speed only', 'Using CISC exclusively', 'Reducing cache levels'], correct: 0, explanation: 'Multicore allows parallel execution of threads.' },
    { question: 'What is the difference between CISC and RISC?', options: ['CISC has complex instructions, RISC has simple ones', 'RISC uses more memory for code', 'CISC cannot be pipelined', 'RISC has fewer registers'], correct: 0, explanation: 'CISC aims for fewer instructions per program, RISC for faster per-instruction time.' },
    { question: 'What is an example of a parallel system?', options: ['Supercomputer with multiple processors', 'Single-core CPU', 'Harvard architecture alone', 'Virtual memory setup'], correct: 0, explanation: 'Parallel systems process multiple instructions simultaneously.' }
  ],
  '1.1.3': [
    { question: 'Keyboard', options: ['Input', 'Output', 'Storage', 'None of the Above'], correct: 0, explanation: 'Keyboard is an input device for entering data.' },
    { question: 'USB Stick', options: ['Input', 'Output', 'Storage', 'None of the Above'], correct: 2, explanation: 'USB Stick is a storage device for saving data.' },
    { question: 'Mouse', options: ['Input', 'Output', 'Storage', 'None of the Above'], correct: 0, explanation: 'Mouse is an input device for pointing and clicking.' },
    { question: 'Speaker', options: ['Input', 'Output', 'Storage', 'None of the Above'], correct: 1, explanation: 'Speaker is an output device for sound.' },
    { question: 'CPU', options: ['Input', 'Output', 'Storage', 'None of the Above'], correct: 3, explanation: 'CPU is a processing unit, not I/O or storage.' },
    { question: 'Foot pedal', options: ['Input', 'Output', 'Storage', 'None of the Above'], correct: 0, explanation: 'Foot pedal is an input device for control.' },
    { question: 'Braille Printer', options: ['Input', 'Output', 'Storage', 'None of the Above'], correct: 1, explanation: 'Braille Printer is an output device for tactile printing.' }
  ]
  // Add more topics with [] or questions as available
};

// Local storage for progress
const progress = JSON.parse(localStorage.getItem('quizProgress')) || {};

// Update progress badges
function updateProgressBadges() {
  document.querySelectorAll('.topic-card').forEach(card => {
    const topic = card.dataset.topic;
    const badge = card.querySelector('.progress-badge');
    const topicProgress = progress[topic] || 0;
    badge.textContent = `${topicProgress}% Complete`;
    badge.classList.toggle('bg-success', topicProgress === 100);
    badge.classList.toggle('bg-warning', topicProgress > 0 && topicProgress < 100);
    badge.classList.toggle('bg-secondary', topicProgress === 0);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateProgressBadges();

  // Dark mode
  const body = document.body;
  if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
  document.getElementById('theme-toggle').addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  // Search
  document.getElementById('search-bar').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.topic-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });

  // Quiz logic
  const topicSelection = document.getElementById('topic-selection');
  const quizContainer = document.getElementById('quiz-container');
  const resultsContainer = document.getElementById('results-container');
  const quizTitle = document.getElementById('quiz-title');
  const questionContainer = document.getElementById('question-container');
  const nextBtn = document.getElementById('next-btn');
  const feedback = document.getElementById('feedback');
  const explanationDiv = document.getElementById('explanation');
  const progressFill = document.getElementById('progress-fill');
  const quizModeSelect = document.getElementById('quiz-mode');
  const reshuffleBtn = document.getElementById('reshuffle-btn');
  const backBtn = document.getElementById('back-to-topics');
  const retakeBtn = document.getElementById('retake-btn');
  const backFromResults = document.getElementById('back-from-results');

  let currentTopic = '';
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let mode = 'study';

  document.querySelectorAll('.start-quiz:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTopic = btn.closest('.topic-card').dataset.topic;
      currentQuestions = shuffle([...questions[currentTopic]]);
      currentIndex = 0;
      score = 0;
      mode = quizModeSelect.value;
      quizTitle.textContent = `Quiz: ${btn.previousElementSibling.textContent}`;
      topicSelection.classList.add('hidden');
      quizContainer.classList.remove('hidden');
      loadQuestion();
    });
  });

  backBtn.addEventListener('click', resetToTopics);
  backFromResults.addEventListener('click', resetToTopics);
  retakeBtn.addEventListener('click', () => {
    resultsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    currentIndex = 0;
    score = 0;
    currentQuestions = shuffle(currentQuestions);
    loadQuestion();
  });

  reshuffleBtn.addEventListener('click', () => {
    currentQuestions = shuffle(currentQuestions);
    currentIndex = 0;
    score = 0;
    loadQuestion();
  });

  function loadQuestion() {
    if (currentIndex >= currentQuestions.length) {
      endQuiz();
      return;
    }
    const q = currentQuestions[currentIndex];
    questionContainer.innerHTML = `
      <p class="fs-5">${q.question}</p>
      ${q.options.map((opt, i) => `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="answer" id="opt${i}" value="${i}">
          <label class="form-check-label" for="opt${i}">${opt}</label>
        </div>
      `).join('')}
    `;
    nextBtn.disabled = true;
    feedback.textContent = '';
    explanationDiv.classList.add('hidden');
    updateProgress();
    document.querySelectorAll('input[name="answer"]').forEach(input => {
      input.addEventListener('change', () => nextBtn.disabled = false);
    });
  }

  nextBtn.addEventListener('click', () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return;
    const answer = parseInt(selected.value);
    const q = currentQuestions[currentIndex];
    const isCorrect = answer === q.correct;
    if (isCorrect) score++;
    feedback.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
    feedback.classList.toggle('correct', isCorrect);
    feedback.classList.toggle('incorrect', !isCorrect);
    explanationDiv.textContent = q.explanation;
    explanationDiv.classList.remove('hidden');
    if (mode === 'test') {
      currentIndex++;
      loadQuestion();
    } else {
      setTimeout(() => {
        currentIndex++;
        loadQuestion();
      }, 1500);
    }
  });

  function updateProgress() {
    const percent = (currentIndex / currentQuestions.length) * 100;
    progressFill.style.width = `${percent}%`;
  }

  function endQuiz() {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    document.getElementById('score-display').textContent = `Score: ${score} / ${currentQuestions.length} (${Math.round((score / currentQuestions.length) * 100)}%)`;
    let detailsHtml = '';
    currentQuestions.forEach((q, i) => {
      detailsHtml += `
        <div class="card mb-3">
          <div class="card-body">
            <p><strong>Question ${i+1}:</strong> ${q.question}</p>
            <p><strong>Correct Answer:</strong> ${q.options[q.correct]}</p>
            <p><strong>Explanation:</strong> ${q.explanation}</p>
          </div>
        </div>
      `;
    });
    document.getElementById('results-details').innerHTML = detailsHtml;

    // Update progress
    const completion = Math.round((score / currentQuestions.length) * 100);
    progress[currentTopic] = Math.max(progress[currentTopic] || 0, completion);
    localStorage.setItem('quizProgress', JSON.stringify(progress));
    updateProgressBadges();
  }

  function resetToTopics() {
    resultsContainer.classList.add('hidden');
    topicSelection.classList.remove('hidden');
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
});