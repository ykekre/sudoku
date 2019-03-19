import { isNull } from 'util';
import {solve} from '../vendor/sudoku'

const sudoku = require('sudoku');

export default class Puzzle {
  constructor (difficulty) {
    this.difficulty = difficulty;
  }

  getPuzzle () {
    return sudoku.makepuzzle();
  }

  getRating(puzzle) {
    return sudoku.ratepuzzle(puzzle, 4);
  }

  getDifficulty() {
    return this.difficulty;
  }

  getEasy(){
    while(true) {
    let  test = this.getPuzzle();

      if(this.getRating(test) < 0.5 ) {
         this.board = test.map(el =>  el === null ? null : el+1)
         return;
         }
      }
    }


  getMedium(){
    while(true) {
    let  test = this.getPuzzle();
    let rating = this.getRating(test);
      if(rating > 0.75 && rating < 2 ) {

        this.board = test.map(el =>  el === null ? null : el+1)
         return;
      }
    }
  }

  getHard(){
    while(true) {
    let  test = this.getPuzzle();
    let rating = this.getRating(test);
      if(rating > 2.5  ) {

        this.board = test.map(el =>  el === null ? null : el+1)
         return;
      }
    }
  }
  setBoard () {
    switch (this.difficulty) {
      default:
      case 'easy':
        this.getEasy();
        break;

      case 'medium' :
        this.getMedium();
        break;

      case 'hard':
      this.getHard();
      break;
    }

    return this.board;
  }

  parsePuzzle(puzzle) {
    this.puzzleString =  puzzle.map( cell =>  (isNull(cell))? 0 : cell ).join('');

   }

   solvePuzzle () {
     this.solvedPuzzle = solve(this.puzzleString);

     return this.solvedPuzzle
   }

}





