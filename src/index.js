import "./main.scss";
import {elements} from './js/views/base';
import Puzzle from './js/models/Puzzle';
import {setLevel, getLevel } from './js/views/modalView';
import {makeBoard, highlightCells, onCellClicked, colorWrongInput, removeColorWrongInput, squareValue, removeHighlight} from './js/views/puzzleView';
import { findPeers, squares } from './js/vendor/sudoku';
import { showBadgeCount } from "./js/views/numpadView";

//?Keep track of game state: Puzzle
const state = {};


function setupListeners() {

  //*1. modal button listeners
    for (const btn of elements.level) {
      btn.addEventListener('click',setLevel);

      }

  //*2. Board cell listeners
    //!When user clicks on a cell
    elements.board.addEventListener('click', onCellClicked)

    //! When user enters value in any cell
    elements.board.addEventListener('beforeinput', onCellClicked)
    elements.board.addEventListener('input', onCellChange)

  //*3 Settings button listeners
    elements.reset.addEventListener('click', reset);
    elements.check.addEventListener('click', check);
    elements.solve.addEventListener('click', solve);

  }

//? Load difficulty level modal
function loadModal() {
  $('#levelModal').modal();
}

$('#levelModal').on('hide.bs.modal', controlPuzzle)

$('.toast.puzzle-load').on('show.bs.toast', function () {

  let level = getLevel();
  if(!level) level =  'Easy';
document.querySelector('.puzzle-load .toast-body').textContent = `Game started with ${level} level`;

});

$('.toast.puzzle-reset').on('show.bs.toast', function () {

document.querySelector('.puzzle-reset .toast-body').innerHTML = `Puzzle has been reset. <a href="javascript:;" class="undo" role="button">Undo</a>`;

document.querySelector('a.undo').addEventListener('click', undo)
// document.querySelector('.puzzle-reset .toast-body').innerHTML = `Puzzle has been reset`;

});
//?Puzzle board related stuff
 function controlPuzzle() {

  //*1. Show game started notification
    $('.toast.puzzle-load').toast('show');

  //*2. get difficulty level selected by user
    const difficulty = getLevel();
    if(difficulty) {
      state.puzzle = new Puzzle(difficulty);
    }
    else state.puzzle = new Puzzle('easy');

    state.Originalboard =  state.puzzle.setBoard();


  //*3. Render puzzle board
    makeBoard(state.Originalboard);


  //*4 Calculate numpad badge values
    badgeCounter();
    showBadgeCount();

  //*5 Parse puzzle array into string
    state.puzzle.parsePuzzle(state.Originalboard);

  //*6 Solve Puzzle
    state.solvedValArray =  Object.values(state.puzzle.solvePuzzle());

}

//? When user enters a value
function onCellChange(e) {
  const square = e.target.closest('div.unsolved > input');

  if(square) {
    const value = parseInt(square.value)
    if(checkValidity(value, square.id)) {
      removeColorWrongInput(square.id)
    }

    //*update badges in numpad
    badgeCounter();
    showBadgeCount();
  }
}

function checkValidity(value, cell) {
  const peers = findPeers(cell);
  let matched = [cell];

  for (const peer of peers) {
    if(value === squareValue(peer)) {
      matched.push(peer);
    }
  }

  if(matched.length > 1) {
    highlightCells(matched, 'highlight-same');
    removeHighlight(matched, 'highlight-peers');
    return false
  }
  else {
    highlightCells(matched, 'highlight-peers')
    removeHighlight(matched, 'highlight-same');
    return true;
  }

}

export function badgeCounter() {
  const digits = new Map();
    digits.set(1,0)
    digits.set(2,0)
    digits.set(3,0)
    digits.set(4,0)
    digits.set(5,0)
    digits.set(6,0)
    digits.set(7,0)
    digits.set(8,0)
    digits.set(9,0)

  for (const square of squares) {
    const digit = squareValue(square);
    if(digit) {
      if(digits.has(digit)) {
        let count = digits.get(digit)
        count = count +1 ;
        digits.set(digit, count);
      }
    }
  }
  return digits;
}

function reset() {
  currentBoard();
  const puzzle = state.Originalboard;
  makeBoard(puzzle);
  badgeCounter();
  showBadgeCount();
  $('.toast.puzzle-reset').toast('show');
}

function undo() {

  for (let index = 0; index < squares.length; index++) {
    const square = squares[index];

    if(!squareValue(square) && state.currentBoard[index]){
      document.querySelector(`.unsolved > #${square}`).value = state.currentBoard[index]
    }
  }

}

function currentBoard() {
  const current =[]
  for (const square of squares) {
    current.push(squareValue(square));
  }
  state.currentBoard = current;

  return current;

}

function check() {
  const solved = state.solvedValArray;
  const cur = currentBoard();
  const wrongCells = [];

  for (let index = 0; index < cur.length; index++) {
    const value = cur[index];
    if(!isNaN(value)) {
      if(value !== parseInt(solved[index])) {
        wrongCells.push(squares[index]);
      }
    }
  }

  let count = wrongCells.length
   while(count>0) {
      const pick = wrongCells[Math.floor(Math.random()*(wrongCells.length) )];

      if(document.querySelector(`#${pick}`).classList.contains('wrong-input')) {
        count--;
        continue;
      }
      else {
        colorWrongInput(pick);
        break;
      }
   }
}

function solve() {

    makeBoard(state.solvedValArray);
    badgeCounter();
    showBadgeCount();
}



['hashchange', 'load'].forEach(event => window.addEventListener(event, loadModal));

setupListeners();


