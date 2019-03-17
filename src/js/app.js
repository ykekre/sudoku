// import Puzzle from './js/models/Puzzle';
const axios = require('axios');
const sudoku = require('sudoku');
var puzzle     = sudoku.makepuzzle();
var solution   = sudoku.solvepuzzle(puzzle);
var difficulty = sudoku.ratepuzzle(puzzle, 4);
var data       = {puzzle:puzzle, solution:solution};

console.log('DATA:');
console.log(JSON.stringify(data));
console.log('PUZZLE:');
// console.log(printboard(puzzle));
console.log('SOLUTION:');
// console.log(printboard(solution));
console.log('RATING:', difficulty);
/* const state = {};

async function controlPuzzle () {
  state.puzzle = new Puzzle('easy');

  try {
    await state.puzzle.getPuzzle();

    console.log(state.puzzle.puzzleBoard);
    //  console.log(JSON.stringify(state.puzzle.puzzleBoard));


  }
  catch(error) {
    console.log(`Something went wrong while fetching puzzle: ${error}`);
  }

  try {
    await state.puzzle.getSolution();


  //  console.log(`Solution: ${state.puzzle.solvedBoard}`);
// console.log(state.puzzle.solvedBoard);
  }
  catch(error) {
    console.log(`Something went wrong while fetching solution: ${error}`);
  }
}


controlPuzzle(); */