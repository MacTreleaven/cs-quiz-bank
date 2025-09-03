document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

  // Search
  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('li').forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(term) ? 'list-item' : 'none';
    });
  });

  // Progress tracking (using localStorage)
  const progressSpan = document.getElementById('progress');
  const completed = localStorage.getItem('completedTopics') ? JSON.parse(localStorage.getItem('completedTopics')) : {};
  const totalTopics = document.querySelectorAll('a[href^="h446"]').length;
  const done = Object.keys(completed).length;
  progressSpan.textContent = `${done}/${totalTopics} topics completed`;

  // For quiz pages (if on a quiz page)
  if (document.querySelector('.quiz')) {
    shuffleQuiz();
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let score = 0;
      document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        if (input.dataset.correct) score++;
      });
      const percent = (score / document.querySelectorAll('.question').length) * 100;
      alert(`Score: ${score} (${percent}%)`);
      // Save progress
      const topic = window.location.pathname.split('/').pop().replace('.html', '');
      completed[topic] = percent;
      localStorage.setItem('completedTopics', JSON.stringify(completed));
    });

    // Toggle explanations
    document.querySelectorAll('.show-exp').forEach(btn => {
      btn.addEventListener('click', () => btn.nextElementSibling.style.display = 'block');
    });

    // Reshuffle button
    const reshuffleBtn = document.createElement('button');
    reshuffleBtn.textContent = 'Reshuffle';
    reshuffleBtn.addEventListener('click', shuffleQuiz);
    document.body.appendChild(reshuffleBtn);
  }
});

function shuffleQuiz() {
  // Shuffle questions
  const quiz = document.querySelector('.quiz');
  const questions = Array.from(quiz.children);
  questions.sort(() => Math.random() - 0.5);
  questions.forEach(q => quiz.appendChild(q));

  // Shuffle answers per question
  questions.forEach(q => {
    const answers = Array.from(q.querySelectorAll('label'));
    answers.sort(() => Math.random() - 0.5);
    const ol = q.querySelector('ol');
    answers.forEach(a => ol.appendChild(a.parentNode)); // Assuming li > label
  });
}