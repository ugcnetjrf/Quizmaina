const quizData = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Earth", "Mars", "Venus", "Jupiter"],
    correctAnswer: "Mars"
  },
  // Add more questions here
];

const quizContainer = document.getElementById('quiz');
const questionContainer = document.getElementById('question');
const choicesContainer = document.getElementById('choices');
const submitButton = document.getElementById('submit');
const feedbackContainer = document.getElementById('feedback');

let currentQuestion = 0;
let score = 0;

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
}

function selectAnswer(event) {
  const selectedChoice = event.target.textContent;
  const currentQuizData = quizData[currentQuestion];

  if (selectedChoice === currentQuizData.correctAnswer) {
    score++;
  }

  currentQuestion++;

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

displayQuestion();
submitButton.addEventListener('click', showResults);
