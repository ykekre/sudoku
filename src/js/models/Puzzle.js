
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

      if(this.getRating(test) < 1 ) {

         this.board = test;
         return;
      }
    }
  }

  getMedium(){
    while(true) {
    let  test = this.getPuzzle();
    let rating = this.getRating(test);
      if(rating > 1 && rating < 3 ) {

         this.board = test;
         return;
      }
    }
  }

  getHard(){
    while(true) {
    let  test = this.getPuzzle();
    let rating = this.getRating(test);
      if(rating > 3  ) {

         this.board = test;
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

    if(!this.board.includes(9)) {

      let alteredBoard = [];
      alteredBoard =  this.board.map( (el) => {
          return el===0 ? 9 : el;
      } )

      return alteredBoard;

    }
    return this.board;
  }
}







