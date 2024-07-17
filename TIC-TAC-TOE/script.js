const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAIButton = document.getElementById('player-vs-ai');
const modeSelection = document.getElementById('mode-selection');

let oTurn;
let aiOpponent = false;

playerVsPlayerButton.addEventListener('click', () => startGame(false));
playerVsAIButton.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', () => startGame(aiOpponent));

function startGame(ai) {
    aiOpponent = ai;
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    messageElement.innerText = '';
    restartButton.style.display = 'block';
    modeSelection.style.display = 'none';
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (aiOpponent && !oTurn) {
            setTimeout(makeAIMove, 500); // Adding a slight delay for AI move to feel more natural
        }
    }
}

function makeAIMove() {
    const availableCells = [...cellElements].filter(cell => 
        !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.click();
}

function endGame(draw) {
    if (draw) {
        messageElement.innerText = 'Draw!';
    } else {
        messageElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
    }
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase();
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
