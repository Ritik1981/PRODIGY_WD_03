const cells = document.querySelectorAll(".cell");
const statusDisplay = document.querySelector(".status");
const resetBtn = document.querySelector(".reset-btn");
const aiCheckbox = document.querySelector("#ai-checkbox");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let playWithAI = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCell(clickedCell, clickedCellIndex);
  handleResultValidation();

  if (playWithAI && gameActive && currentPlayer === "X") {
    handleAIMove();
    handleResultValidation();
  }
}

function handleCell(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function handleResetGame() {
  currentPlayer = "X";
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach((cell) => (cell.textContent = ""));

  if (playWithAI && currentPlayer === "X") {
    handleAIMove();
    currentPlayer = "O";
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function handleAIMove() {
  const emptyCells = gameState.reduce((acc, cell, index) => {
    if (cell === "") {
      acc.push(index);
    }
    return acc;
  }, []);

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const moveIndex = emptyCells[randomIndex];
  const moveCell = cells[moveIndex];

  handleCell(moveCell, moveIndex);
}

function handleAICheckboxChange() {
  playWithAI = aiCheckbox.checked;
  if (playWithAI) {
    handleResetGame();
    handleAIMove();
    currentPlayer = "X";
  } else {
    handleResetGame();
  }
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", handleResetGame);
aiCheckbox.addEventListener("change", handleAICheckboxChange);
