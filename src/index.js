import "./main.scss";
import {elements} from './js/views/base';
import Puzzle from './js/models/Puzzle';
import {setLevel, getLevel } from './js/views/modalView';
import {makeBoard, highlightCells, onCellClicked, colorWrongInput, removeColorWrongInput, squareValue, removeHighlight} from './js/views/puzzleView';
import {getUnitList, getUnits, findPeers, squares } from './js/vendor/sudoku';
import { showBadgeCount } from "./js/views/numpadView";

//?Keep track of game state: Puzzle
const state = {};

getUnitList();
 getUnits();
function setupListeners() {

  //*1. modal button listeners
    for (const btn of elements.level) {
      btn.addEventListener('click',setLevel);
      // btn.addEventListener('click', controlPuzzle);
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


$('.toast').on('show.bs.toast', function () {

  let level = getLevel();
  if(!level) level =  'Easy';
document.querySelector('.toast-body').textContent = `Game started with ${level} level`;

})

//?Puzzle board related stuff
 function controlPuzzle() {

  $('.toast').toast('show');

  //*2. get difficulty level selected by user
    const difficulty = getLevel();

  //*2. get difficulty level selected by user
    if(difficulty) {
      state.puzzle = new Puzzle(difficulty);
    }
    else state.puzzle = new Puzzle('easy');

    state.board =  state.puzzle.setBoard();


    //*3. Render puzzle board
      makeBoard(state.board);


    //*4 Calculate numpad badge values
      badgeCounter();
      showBadgeCount();

    //*5 Parse puzzle array into string
     state.puzzle.parsePuzzle(state.board);

    //*6 Solve Puzzle
   state.solved =  Object.values(state.puzzle.solvePuzzle());
   console.log(state.solved);

}

 //? When user enters a value
function onCellChange(e) {
  const square = e.target.closest('div.unsolved > input');

  if(square) {
    const value = parseInt(square.value)

    if(!checkValidity(value, square.id)) {
      // colorWrongInput(square.id);
    }
    else{
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
  const puzzle = state.board;

 makeBoard(puzzle);

}

function check() {
  const solved = state.solved;

  const inputValues = [];

  for (const square of squares) {
    inputValues.push(squareValue(square));
  }

  for (let index = 0; index < inputValues.length; index++) {
    const input = inputValues[index];

    if(!isNaN(input)) {

      if(input !== parseInt(solved[index])) {
          colorWrongInput(squares[index]);
      }
    }
  }
}

function solve() {
    makeBoard(state.solved);
}


['hashchange', 'load'].forEach(event => window.addEventListener(event, loadModal));

setupListeners();


