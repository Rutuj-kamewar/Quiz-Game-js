const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCountertext = document.getElementById("question-counter");
const scoreText = document.getElementById("score");

const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch(
  'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
)
  .then((res) => {
      return res.json();
  })
  .then((loadedQuestions) => {
      questions = loadedQuestions.results.map((loadedQuestion) => {
          const formattedQuestion = {
              question: loadedQuestion.question,
          };

          const answerChoices = [...loadedQuestion.incorrect_answers];
          formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
          answerChoices.splice(
              formattedQuestion.answer - 1,
              0,
              loadedQuestion.correct_answer
          );

          answerChoices.forEach((choice, index) => {
              formattedQuestion['choice' + (index + 1)] = choice;
          });

          return formattedQuestion;
      });

      startGame();
  })
  .catch((err) => {
      console.error(err);
  });

// constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  console.log(availableQuestions);
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');

  
};

// Update progress bar
function updateProgressBar() {
  const progress = (questionCounter / MAX_QUESTIONS) * 100;
  document.getElementById('progress').style.width = progress + '%';
}

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore" , score)
    //go to end page
    return window.location.assign("/end page/end.html");
  }
  questionCounter++;
  questionCountertext.innerText = questionCounter + "/" + MAX_QUESTIONS;
  const questionindex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionindex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionindex, 1);
  acceptAnswers = true;
  updateProgressBar();
};
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptAnswers) {
      return;
    }
    acceptAnswers = false;
    const selectechoice = e.target;
    const selectedAnswer = selectechoice.dataset["number"];
    const classtoapply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    selectechoice.parentElement.classList.add(classtoapply);
    if (classtoapply == "correct") {
      incrementScore(CORRECT_BONUS);
    }

    setTimeout(() => {
      selectechoice.parentElement.classList.remove(classtoapply);
      getNewQuestion();
    }, 1000);
  });
});
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};


