import './favicons';
import "./main.scss";
import {
  elements
} from './js/views/base';
import Puzzle from './js/models/Puzzle';
import {
  findPeers,
  squares
} from './js/vendor/sudoku';
import {
  loadModal,
  setLevel,
  getLevel,
  showWinAlert
} from './js/views/modalView';
import {
  makeBoard,
  highlightCells,
  onCellClicked,
  setCellValue,
  removeColorWrongInput,
  squareValue,
  removeHighlight,
  colorRandomError,
  disable
} from './js/views/puzzleView';
import {
  showBadgeCount,
  getNumpadValue,
  setNumpadValue,
  resetNumpad
} from "./js/views/numpadView";

//?Keep track of game state: Puzzle
export const state = {};



function setupListeners() {

  //*1. modal button listeners
  for (const btn of elements.level) {
    btn.addEventListener('click', setLevel);

  }

  //*2. Board cell listeners
  //!When user clicks on a cell
  elements.grid.addEventListener('click', onCellClicked)


  //! When user enters value in any cell
  elements.grid.addEventListener('beforeinput', onCellClicked)
  elements.grid.addEventListener('input', onCellChange)

  //*3 Settings button listeners
  elements.newGame.addEventListener('click', newGame);
  elements.reset.addEventListener('click', reset);
  elements.check.addEventListener('click', check);
  elements.solve.addEventListener('click', solve);

  //*4 Numpad listener
  elements.numpad.addEventListener('click', setNumpadValue);
  elements.numpad.addEventListener('click', inputValue);
}


//?Puzzle board related stuff
export function controlPuzzle() {


  //*1. Show game started notification
  $('.toast.puzzle-load').toast('show');

  //*2. get difficulty level selected by user
  const difficulty = getLevel();
  if (difficulty) {
    state.puzzle = new Puzzle(difficulty);
  } else state.puzzle = new Puzzle('easy');

  state.puzzle.setBoard();

  //*3. Render puzzle board
  makeBoard(state.puzzle.board);

  //*4 Calculate numpad badge values
  badgeCounter();
  showBadgeCount();

  //*5 Parse puzzle array into string
  state.puzzle.parsePuzzle();

  //*6 Solve Puzzle
  state.solvedValArray = Object.values(state.puzzle.solvePuzzle());

}

function newGame() {
  bootbox.confirm({
    message: "Are you sure you want to start a new game?",
    buttons: {
      confirm: {
        label: 'Yes',
        className: 'btn-success'
      },
      cancel: {
        label: 'No',
        className: 'btn-danger'
      }
    },
    callback: function (result) {
      if (result) {
        loadModal();

      }
    }
  });

}

function inputValue() {

  //*1 Find cell which is in focus
  const value = getNumpadValue();

  if (value !== 0 && !isNaN(value)) {

    setCellValue(value);
  } else if (value === 'clear') {
    setCellValue('');
  }

  resetNumpad();
}


//? When user enters a value
export function onCellChange(cell, value) {

  if (cell) {

    if (checkValidity(value, cell)) {
      removeColorWrongInput(cell)

      //*Check if puzzle completed - if yes show win alert
      if (!currentBoard().includes(NaN) && check()) {
        onWin();

      }
    }

    //*update badges in numpad
    badgeCounter();
    showBadgeCount();
    currentBoard();
  }
}

function checkValidity(value, cell) {
  const peers = findPeers(cell);
  let matched = [cell];

  for (const peer of peers) {
    if (value === squareValue(peer)) {
      matched.push(peer);
    }
  }

  if (matched.length > 1) {
    highlightCells(matched, 'highlight-same');
    removeHighlight(matched, 'highlight-peers');
    return false
  } else {
    highlightCells(matched, 'highlight-peers')
    removeHighlight(matched, 'highlight-same');
    return true;
  }

}

export function badgeCounter() {
  const digits = new Map();
  digits.set(1, 0)
  digits.set(2, 0)
  digits.set(3, 0)
  digits.set(4, 0)
  digits.set(5, 0)
  digits.set(6, 0)
  digits.set(7, 0)
  digits.set(8, 0)
  digits.set(9, 0)

  for (const square of squares) {
    const digit = squareValue(square);
    if (digit) {
      if (digits.has(digit)) {
        let count = digits.get(digit)
        count = count + 1;
        digits.set(digit, count);
      }
    }
  }
  return digits;
}

function reset() {
  currentBoard();

  makeBoard(state.puzzle.board);
  badgeCounter();
  showBadgeCount();
  $('.toast.puzzle-reset').toast('show');
}

export function undo() {
  for (let index = 0; index < squares.length; index++) {
    const square = squares[index];

    if (!squareValue(square) && state.currentBoard[index]) {
      document.querySelector(`.unsolved#${square}`).textContent = state.currentBoard[index]
    }
  }
  badgeCounter();
  showBadgeCount();
}

//*Calculate current state of the board
function currentBoard() {
  const current = []
  for (const square of squares) {
    current.push(squareValue(square));
  }
  state.currentBoard = current;

  return current;

}


//? Check errors and give hints to user
function check() {
  const solved = state.solvedValArray;
  const cur = currentBoard();
  const wrongCells = [];

  for (let index = 0; index < cur.length; index++) {
    const value = cur[index];
    if (!isNaN(value)) {
      if (value !== parseInt(solved[index])) {
        wrongCells.push(squares[index]);
      }
    }
  }
  if (wrongCells.length === 0) {
    return true;
  } else {

    colorRandomError(wrongCells);
    return false;
  }
}

function solve() {

  bootbox.confirm({
    message: "Are you sure you want to solve the entire puzzle? This will end the game.",
    buttons: {
      confirm: {
        label: 'Yes',
        className: 'btn-success'
      },
      cancel: {
        label: 'No',
        className: 'btn-danger'
      }
    },
    callback: function (result) {
      if (result) {
        currentBoard();
        makeBoard(state.solvedValArray);
        badgeCounter();
        showBadgeCount();
        disable('btn-reset');

      }
    }
  });

}

function onWin() {

  showWinAlert();

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, loadModal));

setupListeners();