const quizContainer = document.getElementById('quiz');
const questionContainer = document.getElementById('question');
const choicesContainer = document.getElementById('choices');
const questionPaletteContainer = document.getElementById('questionPalette');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const submitButton = document.getElementById('submit');
const feedbackContainer = document.getElementById('feedback');

let currentQuestion = 0;
let score = 0;
let quizData = [];
let userAnswers = new Array(); // Array to store user's answers

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
}

function selectAnswer(event) {
  const selectedChoice = event.target.textContent;

  // Store the user's answer
  userAnswers[currentQuestion] = selectedChoice;

  // Mark the question in the palette as attempted (green)
  questionPaletteContainer.children[currentQuestion].classList.add('attempted');

  const currentQuizData = quizData[currentQuestion];

  if (selectedChoice === currentQuizData.correctAnswer) {
    score++;
  }

  currentQuestion++;
  updateButtons();

  if (currentQuestion < quizData.length) {
    displayQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizContainer.style.display = 'none';
  feedbackContainer.textContent = `You scored ${score} out of ${quizData.length}`;
  feedbackContainer.style.display = 'block';
}

function updateButtons() {
  prevButton.disabled = currentQuestion === 0;
  nextButton.disabled = currentQuestion === quizData.length;
  submitButton.style.display = currentQuestion === quizData.length ? 'block' : 'none';
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

submitButton.addEventListener('click', showResults);
