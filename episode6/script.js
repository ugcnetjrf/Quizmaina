const quizContainer = document.getElementById('quiz');
const questionContainer = document.getElementById('question');
const choicesContainer = document.getElementById('choices');
const questionPaletteContainer = document.getElementById('questionPalette');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const markForReviewButton = document.getElementById('mark-for-review');
const submitButton = document.getElementById('submit');
const feedbackContainer = document.getElementById('feedback');

let currentQuestion = 0;
let score = 0;
let quizData = [];
let userAnswers = new Array(); // Array to store user's answers
let questionsForReview = new Set(); // Set to store questions marked for review

// Fetch quiz data from JSON file
fetch('quiz_questions.json')
  .then(response => response.json())
  .then(data => {
    quizData = data;
    displayQuestion();
    displayQuestionPalette();
    updateButtons();
  })
  .catch(error => console.error('Error fetching quiz data:', error));

function displayQuestion() {
  const currentQuizData = quizData[currentQuestion];
  questionContainer.textContent = currentQuizData.question;
  choicesContainer.innerHTML = '';

  currentQuizData.choices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.classList.add('choice');
    button.addEventListener('click', selectAnswer);
    choicesContainer.appendChild(button);
  });

  // If the user has previously attempted this question, mark it as green
  if (userAnswers[currentQuestion] !== undefined) {
    questionPaletteContainer.children[currentQuestion].classList.add('attempted');
  }

  // If the question is marked for review, mark it as yellow
  if (questionsForReview.has(currentQuestion)) {
    questionPaletteContainer.children[currentQuestion].classList.add('review');
  }
}

function selectAnswer(event) {
  const selectedChoice = event.target.textContent;

  // Store the user's answer
  userAnswers[currentQuestion] = selectedChoice;

  // Mark the question in the palette as attempted (green)
  questionPaletteContainer.children[currentQuestion].classList.add('attempted');

  const currentQuizData = quizData[currentQuestion];

  // If the question is marked for review, remove the mark
  if (questionsForReview.has(currentQuestion)) {
    questionsForReview.delete(currentQuestion);
    questionPaletteContainer.children[currentQuestion].classList.remove('review');
  }

  if (selectedChoice === currentQuizData.correctAnswer) {
    score += 3; // Award 3 marks for correct answer
  } else {
    score -= 1; // Deduct 1 mark for wrong answer
  }

  currentQuestion++;
  updateButtons();

  if (currentQuestion < quizData.length) {
    displayQuestion();
  } else {
    showResults();
  }
}

function markForReview() {
  if (questionsForReview.has(currentQuestion)) {
    // If already marked for review, unmark it
    questionsForReview.delete(currentQuestion);
    questionPaletteContainer.children[currentQuestion].classList.remove('review');
  } else {
    // Mark the question for review
    questionsForReview.add(currentQuestion);
    questionPaletteContainer.children[currentQuestion].classList.add('review');
  }
}

function showResults() {
  quizContainer.style.display = 'none';

  // Ensure score is not negative
  score = Math.max(score, 0);

  feedbackContainer.textContent = `Your net score: ${score}`;
  feedbackContainer.style.display = 'block';
}

function updateButtons() {
  prevButton.disabled = currentQuestion === 0;
  nextButton.disabled = currentQuestion === quizData.length;
  markForReviewButton.textContent = questionsForReview.has(currentQuestion) ? 'Unmark for Review' : 'Mark for Review';
  submitButton.style.display = currentQuestion === quizData.length ? 'none' : 'block';
}

function displayQuestionPalette() {
  quizData.forEach((question, index) => {
    const button = document.createElement('button');
    button.textContent = index + 1;
    button.classList.add('palette-button');
    button.addEventListener('click', () => navigateToQuestion(index));

    // Mark questions not yet attempted as red
    if (userAnswers[index] === undefined) {
      button.classList.add('unattempted');
    }

    // If the question is marked for review, mark it as yellow
    if (questionsForReview.has(index)) {
      button.classList.add('review');
    }

    questionPaletteContainer.appendChild(button);
  });
}

function navigateToQuestion(index) {
  currentQuestion = index;
  displayQuestion();
  updateButtons();
}

prevButton.addEventListener('click', () => {
  currentQuestion--;
  displayQuestion();
  updateButtons();
});

nextButton.addEventListener('click', () => {
  currentQuestion++;
  displayQuestion();
  updateButtons();
});

markForReviewButton.addEventListener('click', markForReview);
