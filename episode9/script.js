const quizContainer = document.getElementById('quiz');
const questionContainer = document.getElementById('question');
const choicesContainer = document.getElementById('choices');
const questionPaletteContainer = document.getElementById('questionPalette');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const markForReviewButton = document.getElementById('mark-for-review');
const submitButton = document.getElementById('submit');

let currentQuestion = 0;
let score = 0;
let totalCorrectAnswers = 0;
let totalIncorrectAnswers = 0;
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

  currentQuizData.choices.forEach((choice, index) => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'choice';
    input.id = `choice${index}`;
    input.value = choice;
    input.addEventListener('change', () => selectAnswer(index));

    const label = document.createElement('label');
    label.textContent = choice;
    label.setAttribute('for', `choice${index}`);

    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    
    choicesContainer.appendChild(wrapper);
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

function selectAnswer(index) {
  // Store the user's answer
  userAnswers[currentQuestion] = index;

  // Mark the question in the palette as attempted (green)
  questionPaletteContainer.children[currentQuestion].classList.add('attempted');

  // If the question is marked for review, remove the mark
  if (questionsForReview.has(currentQuestion)) {
    questionsForReview.delete(currentQuestion);
    questionPaletteContainer.children[currentQuestion].classList.remove('review');
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

function confirmSubmission() {
  const confirmation = confirm("Are you sure you want to submit?");
  if (confirmation) {
    showResults();
  }
}

submitButton.addEventListener('click', function(event) {
  event.preventDefault();
  confirmSubmission();
});

function showResults() {
  // Calculate total correct and incorrect answers
  userAnswers.forEach((answer, index) => {
    if (answer !== undefined && quizData[index].correctAnswer === quizData[index].choices[answer]) {
      totalCorrectAnswers++;
    } else if (answer !== undefined) {
      totalIncorrectAnswers++;
    }
  });

  // Calculate score
  score = totalCorrectAnswers * 2 - totalIncorrectAnswers*0;

  // Ensure score is not negative
  score = Math.max(score, 0);

  // Construct feedback message
  const feedbackMessage = getFeedbackMessage(score);

  // Create dialog box
  const dialogBox = document.createElement('div');
  dialogBox.classList.add('dialog-box');
  dialogBox.innerHTML = `
    <h2>Quiz Results</h2>
    <p>Your total score: ${score}</p>
    <p>Total correct answers: ${totalCorrectAnswers}</p>
    <p>Total incorrect answers: ${totalIncorrectAnswers}</p>
    <p>${feedbackMessage}</p>
    <button id="close-dialog">Close</button>
  `;
  
  // Append dialog box to body
  document.body.appendChild(dialogBox);

  // Add event listener to close dialog box
  const closeButton = document.getElementById('close-dialog');
  closeButton.addEventListener('click', function() {
    dialogBox.remove();
  });
}

function getFeedbackMessage(score) {
  if (score === 0) {
    return "You scored zero. Better luck next time!";
  } else if (score < 4) {
    return "You need more practice. Keep trying!";
  } else if (score < 6) {
    return "You're getting there. Keep up the good work!";
  } else {
    return "Congratulations! You did great!";
  }
}

function updateButtons() {
  prevButton.disabled = currentQuestion === 0;
  nextButton.disabled = currentQuestion === quizData.length - 1;
  markForReviewButton.style.display = currentQuestion !== quizData.length - 1 ? 'block' : 'none';
  submitButton.style.display = currentQuestion === quizData.length - 1 ? 'block' : 'none';
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
