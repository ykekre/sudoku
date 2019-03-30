import {
  findPeers,
  squares
} from '../vendor/sudoku';
import {
  onCellChange,
  state
} from '../..';
import {
  elements
} from './base';

export function makeBoard(puzzle) {

  //*1. At the onset remove any highlights from all the cells
  //so as to have a fresh board
  removeHighlightsAll('highlight-clicked', 'highlight-peers', 'highlight-same', 'highlight-same-squares', 'wrong-input', 'solved', 'unsolved');

  for (let index = 0; index < puzzle.length; index++) {
    const getSquareValue = puzzle[index];

    if (index < 9) {
      helper('A', index, getSquareValue)
    } else if (index > 8 && index < 18) {
      helper('B', index - 9, getSquareValue)
    } else if (index > 17 && index < 27) {
      helper('C', index - 18, getSquareValue);
    } else if (index > 26 && index < 36) {
      helper('D', index - 27, getSquareValue);
    } else if (index > 35 && index < 45) {
      helper('E', index - 36, getSquareValue);
    } else if (index > 44 && index < 54) {
      helper('F', index - 45, getSquareValue);
    } else if (index > 53 && index < 63) {
      helper('G', index - 54, getSquareValue);
    } else if (index > 62 && index < 72) {
      helper('H', index - 63, getSquareValue);
    } else if (index > 71 && index < 81) {
      helper('I', index - 72, getSquareValue);
    }
  }

  function helper(row, index, value) {

    let square = document.querySelector(`.${row}${index+1}`);

    if (value !== null) {
      square.textContent = value;
      square.classList.add('solved');
    } else {
      square.classList.add('unsolved');
      square.textContent = '';
    }
  }
}

//*Whats the value in the cell
export function getSquareValue(cell) {
  const square = document.querySelector(`.${cell}`)
  return parseInt(square.innerText);

}


//* highlights an array of cells with given color
export function highlightCells(cellsArr, clazz) {

  for (const cell of cellsArr) {
    document.querySelector(`.${cell}`).classList.add(`${clazz}`);

  }
}

export function onCellClick(e) {

  let cell = '';
  const clicked = e.target.closest('.col-1-of-9');
  if (clicked) {
    cell = clicked.id;
    state.currentCell = cell;
  } else {
    return;
  }

  //* if the clicked cell is prefilled (non input cell)- fade the numpad
  if (document.querySelector(`.${cell}`).classList.contains('unsolved')) {
    elements.numpad.classList.remove('halffade');
  } else {
    elements.numpad.classList.add('halffade');
  }

  removeHighlightsAll('highlight-clicked', 'highlight-peers', 'highlight-same', 'highlight-same-squares');

  //*1.if cell has some value, calculate squares which have same cell value
  if (getSquareValue(cell)) {
    sameSquares(cell)
  }

  //*2. highlight clicked cell
  highlightCells([cell], 'highlight-clicked');

  //*3. find peers and higlight them
  const peers = findPeers(cell);
  highlightCells(peers, 'highlight-peers');

}

export function setCellValue(value) {

  removeHighlightsAll('highlight-same', 'highlight-same-squares');
  const cell = state.currentCell;

  const thisCell = document.querySelector(`.${cell}`);

  const peers = findPeers(cell);
  highlightCells(peers, 'highlight-peers');

  if (thisCell.classList.contains('unsolved')) {

    if (state.puzzle.editMode && value != '') {
      let editValues = [];

      if (thisCell.childNodes.length > 0 && thisCell.childNodes[0].nodeName == '#text') {

        const val = getSquareValue(cell).toString();
        editValues.push(val);
        thisCell.textContent = '';

        thisCell.insertAdjacentHTML('afterbegin',
          `<div class='edit'  id='digit${val}'>${val.toString()}</div>`);
      }
      editMode(cell, value.toString(), editValues);
      thisCell.classList.add('justify-content-between');
      thisCell.style.color = state.currentColor;
      return;
    } else {
      thisCell.textContent = value;
    }
    thisCell.style.color = state.currentColor;
    onCellChange(cell, value);
    sameSquares(cell);
    return;
  } else return;

}

function editMode(cell, value, editValues) {

  let edits = document.querySelectorAll(`div.${cell}> div`);

  for (const element of edits) {

    if (!editValues.includes(element.textContent)) {
      editValues.push(element.textContent);
    }
  }

  if (!editValues.includes(value)) {
    const markup = `<div class='edit' id='digit${value}' >${value}</div>`;
    document.querySelector(`.${cell}`).innerHTML += markup;
    editValues.push(value);
  }

  //*pop off this value from the cell, since its already present
  else {

    const toDelete = document.querySelector(`div.${cell} > #digit${value}`);
    toDelete.parentNode.removeChild(toDelete);
  }


  edits = document.querySelectorAll(`div.${cell}> div`);

  if (editValues.length > 1 && editValues.length < 4) {
    for (const element of edits) {
      element.classList.add('three');
      element.classList.remove('six', 'nine');
    }
  } else if (editValues.length >= 4 && editValues.length <= 6) {
    for (const element of edits) {
      element.classList.add('six');
      element.classList.remove('three', 'nine');
    }
  } else if (editValues.length > 6) {
    for (const element of edits) {
      element.classList.add('nine');
      element.classList.remove('six', 'three');
    }
  }
}

function removeHighlightsAll(...clazz) {

  for (const classs of clazz) {
    let cells = document.querySelectorAll(`.${classs}`);

    for (const cell of cells) {
      if (cell)
        cell.classList.remove(`${classs}`)
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

export function colorWrongInput(cell) {
  let square = document.querySelector(`#${cell}`);

  if (square) {
    square.style.color = null;
    square.classList.add('wrong-input');
  }
}

export function removeColorWrongInput(cell) {
  let square = document.querySelector(`#${cell}`);

  if (square) {
    if (square.classList.contains('wrong-input'))
      square.classList.remove('wrong-input');
  }

}

function sameSquares(cell) {
  let sameSquares = [cell];
  const value = getSquareValue(cell);
  for (const square of squares) {
    const digit = getSquareValue(square);
    if (value === digit) {
      sameSquares.push(square);
    }
  }
  highlightCells(sameSquares, 'highlight-same-squares');
  return sameSquares;

}

export function colorRandomWrongCell(wrongCells) {

  let count = wrongCells.length
  while (count > 0) {
    const pick = wrongCells[Math.floor(Math.random() * (wrongCells.length))];
    console.log(pick);
    console.log(wrongCells);
    if (document.querySelector(`#${pick}`).classList.contains('wrong-input')) {
      count--;
      const index = wrongCells.indexOf(pick);
      if (index !== -1) wrongCells.splice(index, 1);
      continue;
    } else {
      colorWrongInput(pick);
      break;
    }
  }
}

export function disable(id) {

  document.querySelector(`#${id}`).setAttribute('disabled', '');
  document.querySelector(`#${id}`).classList.add('disabled');
}

export function removeInlineStyledColor() {

  for (const square of squares) {
    document.querySelector(`.${square}`).style.color = null;
  }

}