const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("save-score-btn");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const finalScore = document.getElementById("final-score");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value
  };

  highScores.push(score);

  highScores.sort((a, b) => b.score - a.score);

  highScores.splice(MAX_HIGH_SCORES); // Keep only the top MAX_HIGH_SCORES scores.

  console.log(highScores);

  username.value = "";

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("../front page/index.html");

  // Remove the click event listener after saving the score
  saveScoreBtn.removeEventListener("click", saveHighScore);

};

saveScoreBtn.addEventListener("click", saveHighScore);
