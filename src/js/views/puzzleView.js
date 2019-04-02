import { findPeers, squares } from "../vendor/sudoku";
import { onCellChange, state, badgeCounter } from "../..";
import { elements } from "./base";
import { showBadgeCount } from "./numpadView";
import { hasMorethanOneValue } from "./cellView";

export function makeBoard(puzzle) {
  //*1. At the onset remove any highlights from all the cells
  //so as to have a fresh board
  removeHighlightsAll(
    "highlight-clicked",
    "highlight-peers",
    "highlight-same",
    "highlight-same-squares",
    "wrong-input",
    "solved",
    "unsolved"
  );

  for (let index = 0; index < puzzle.length; index++) {
    const getSquareValue = puzzle[index];
    if (index < 9) {
      helper("A", index, getSquareValue);
    } else if (index > 8 && index < 18) {
      helper("B", index - 9, getSquareValue);
    } else if (index > 17 && index < 27) {
      helper("C", index - 18, getSquareValue);
    } else if (index > 26 && index < 36) {
      helper("D", index - 27, getSquareValue);
    } else if (index > 35 && index < 45) {
      helper("E", index - 36, getSquareValue);
    } else if (index > 44 && index < 54) {
      helper("F", index - 45, getSquareValue);
    } else if (index > 53 && index < 63) {
      helper("G", index - 54, getSquareValue);
    } else if (index > 62 && index < 72) {
      helper("H", index - 63, getSquareValue);
    } else if (index > 71 && index < 81) {
      helper("I", index - 72, getSquareValue);
    }
  }

  function helper(row, index, value) {
    let square = document.querySelector(`.${row}${index + 1}`);
    if (value !== null) {
      square.textContent = value;
      square.classList.add("solved");
    } else {
      square.classList.add("unsolved");
      square.textContent = "";
    }
  }
}

//*Whats the value in the cell
export function getSquareValue(cell) {
  const square = document.querySelector(`.${cell}`);
  return parseInt(square.innerText);
}

//* highlights an array of cells with given color
export function highlightCells(cellsArr, clazz) {
  for (const cell of cellsArr) {
    document.querySelector(`.${cell}`).classList.add(`${clazz}`);
  }
}


export function removeHighlightsAll(...clazz) {
  for (const classs of clazz) {
    let cells = document.querySelectorAll(`.${classs}`);

    for (const cell of cells) {
      if (cell) cell.classList.remove(`${classs}`);
    }
  }
}

export function removeHighlight(cells, clazz) {
  for (const cell of cells) {
    if (cell) {
      document.querySelector(`#${cell}`).classList.remove(`${clazz}`);
    }
  }
}



export function sameSquares(cell) {
  let sameSquares = [];
  if (!hasMorethanOneValue(cell)) sameSquares.push(cell);
  const value = getSquareValue(cell);
  for (const square of squares) {
    const digit = getSquareValue(square);
    if (value === digit && !hasMorethanOneValue(square)) {
      sameSquares.push(square);
    }
  }
  highlightCells(sameSquares, "highlight-same-squares");
  return sameSquares;
}

/* export function colorRandomWrongCell(wrongCells) {
  let count = wrongCells.length;
  while (count > 0) {
    const pick = wrongCells[Math.floor(Math.random() * wrongCells.length)];

    if (document.querySelector(`#${pick}`).classList.contains("wrong-input")) {
      count--;
      const index = wrongCells.indexOf(pick);
      if (index !== -1) wrongCells.splice(index, 1);
      continue;
    } else {
      colorWrongInput(pick);
      break;
    }
  }
} */


