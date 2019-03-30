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
  onCellClick,
  setCellValue,
  removeColorWrongInput,
  getSquareValue,
  removeHighlight,
  colorRandomWrongCell,
  disableReset,
  removeInlineStyledColor,
  hasMorethanOneValue,
  enableReset
} from './js/views/puzzleView';
import {
  showBadgeCount,
  getNumpadValue,
  setNumpadValue,
  resetNumpad,
  setEditMode
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
  elements.grid.addEventListener('click', onCellClick);

  //*3 Settings button listeners
  elements.newGame.addEventListener('click', newGame);
  elements.reset.addEventListener('click', reset);
  elements.check.addEventListener('click', check);
  elements.solve.addEventListener('click', solve);

  //*4 Numpad listeners
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

  //3* Create puzzle as per level
  state.puzzle.setBoard();

  //*4. Render puzzle board on screen
  makeBoard(state.puzzle.board);

  //*4 Calculate numpad badge values
  badgeCounter();
  showBadgeCount();

  //*5 Parse puzzle array for feeding into solver
  state.puzzle.parsePuzzle();

  //*6 Solve Puzzle and get array
  state.solvedValArray = Object.values(state.puzzle.solvePuzzle());

  //*7 remove any user chosen colors on cells
  removeInlineStyledColor();

  //*
  setEditMode(false);
  enableReset();
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
        //*If confirmed
        //*Load New Game modal for setting levels
        loadModal();
      }
    }
  });

}

//*get value from numpad and set it to currently
//highlighted cell

function inputValue() {
  //*1 Get clicked numpad value
  const value = getNumpadValue();

  //*2 if a digit has been clicked
  if (value !== 0 && !isNaN(value)) {
    setCellValue(value);
  } else if (value === 'clear') {
    setCellValue('');
  } else return;
  resetNumpad();
}

//? When user enters a value
export function onCellChange(cell, value) {
  if (cell) {
    if (checkValidity(value, cell)) {
      removeColorWrongInput(cell)

      //*Check if puzzle completed without any error - if yes show win alert
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

//*Check if entered value is as per the rules
function checkValidity(value, cell) {
  const peers = findPeers(cell);
  let matched = [cell];

  for (const peer of peers) {
    //* Cant allow a value which already
    //*exists amongst the cell's peers
    if (value === getSquareValue(peer)) {
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

//*Update badge on the numpad digits
export function badgeCounter() {
  const digits = new Map();

  for (let i = 1; i < 10; i++) {
    digits.set(i, 0);
  }

  for (const square of squares) {
    if (!hasMorethanOneValue(square)) {
      const digit = getSquareValue(square);
      if (digit && digits.has(digit)) {
        let count = digits.get(digit)
        count = count + 1;
        digits.set(digit, count);
      }
    }
  }
  return digits;
}

//* reset the board to original state
function reset() {
  currentBoard();
  makeBoard(state.puzzle.board);
  badgeCounter();
  showBadgeCount();
  $('.toast.puzzle-reset').toast('show');
}

//*User has option to undo (go back to previous board state)
//*after doing reset
export function undo() {
  for (let index = 0; index < squares.length; index++) {
    const square = squares[index];

    if (!getSquareValue(square) && state.currentBoard[index]) {
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
    current.push(getSquareValue(square));
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

    if (!isNaN(value) && value !== parseInt(solved[index]) && !hasMorethanOneValue(squares[index])) {
      wrongCells.push(squares[index]);
    }
  }

  if (wrongCells.length === 0) {
    //*there are no errors
    return true;
  } else {
    //*highlight one of the wrongcells if user chooses
    //* hint option
    colorRandomWrongCell(wrongCells);
    return false;
  }
}

//*Solve the entire puzzle
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
        disableReset();

      }
    }
  });

}

function onWin() {
  showWinAlert();
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, loadModal));

setupListeners();