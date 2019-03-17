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
      btn.addEventListener('click', controlPuzzle);
      }

  //*2. Board cell listeners
    //! When user enters value in any cell
    elements.board.addEventListener('input', onCellChange)

    //!When user clicks on a cell
    elements.board.addEventListener('click', onCellClicked)


  }

//? Load difficulty level modal
function loadModal() {
  $('#levelModal').modal();
}

//?Puzzle board related stuff
function controlPuzzle() {
  //*1. Hide modal
    $('#levelModal').modal('hide');

  //*2. get difficulty level selected by user
    const difficulty = getLevel();

    if(difficulty) {
      state.puzzle = new Puzzle(difficulty);
      const puzzleBoard =  state.puzzle.setBoard();

    //*3. Render puzzle board
      makeBoard(puzzleBoard);

    //*4 Calculate numpad badge values
      badgeCounter();
      showBadgeCount();
    }
}

 //? When user enters a value
function onCellChange(e) {
  const square = e.target.closest('div.unsolved > input');

  if(square) {
    const value = parseInt(square.value)

    if(!checkValidity(value, square.id)) {
      colorWrongInput(square.id);
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
      highlightCells(matched, 'highlight-same');
    removeHighlight(matched, 'highlight-peers');
    }

  }
  if(matched.length > 1)
    return false
  else
    return true;
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



['hashchange', 'load'].forEach(event => window.addEventListener(event, loadModal));
// controlPuzzle();
setupListeners();


