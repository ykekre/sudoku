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
    const squareValue = puzzle[index];

    if (index < 9) {
      helper('A', index, squareValue)
    } else if (index > 8 && index < 18) {
      helper('B', index - 9, squareValue)
    } else if (index > 17 && index < 27) {
      helper('C', index - 18, squareValue);
    } else if (index > 26 && index < 36) {
      helper('D', index - 27, squareValue);
    } else if (index > 35 && index < 45) {
      helper('E', index - 36, squareValue);
    } else if (index > 44 && index < 54) {
      helper('F', index - 45, squareValue);
    } else if (index > 53 && index < 63) {
      helper('G', index - 54, squareValue);
    } else if (index > 62 && index < 72) {
      helper('H', index - 63, squareValue);
    } else if (index > 71 && index < 81) {
      helper('I', index - 72, squareValue);
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
export function squareValue(cell) {
  const square = document.querySelector(`.${cell}`)
  return parseInt(square.innerText);

}


//* highlights an array of cells with given color
export function highlightCells(cellsArr, clazz) {

  for (const cell of cellsArr) {
    document.querySelector(`.${cell}`).classList.add(`${clazz}`);

  }
}

export function onCellClicked(e) {

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
  if (squareValue(cell)) {
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
        thisCell.classList.add('justify-content-between');
        const val = squareValue(cell).toString();
        editValues.push(val);
        thisCell.textContent = '';

        thisCell.insertAdjacentHTML('afterbegin',
          `<div class='edit'  id='digit${val}'>${val.toString()}</div>`);
      }
      editMode(cell, value.toString(), editValues);
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

  if (editValues.length < 4) {
    for (const element of edits) {
      element.classList.add('three');
    }
  } else if (editValues.length <= 6) {
    for (const element of edits) {
      element.classList.add('six');
    }
  } else if (editValues.length > 6) {
    for (const element of edits) {
      element.classList.add('nine');
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
      const nodes = document.querySelectorAll(`#${cell}`)
      for (const node of nodes) {
        node.classList.remove(`${clazz}`);
      }
    }
  }
}

export function colorWrongInput(cell) {
  let cells = document.querySelectorAll(`#${cell}`);
  for (const cell of cells) {
    if (cell)
      cell.classList.add('wrong-input');

  }
}

export function removeColorWrongInput(cell) {
  let cells = document.querySelectorAll(`#${cell}`);
  for (const cell of cells) {
    if (cell) {
      if (cell.classList.contains('wrong-input'))
        cell.classList.remove('wrong-input');
    }
  }
}

function sameSquares(cell) {
  let sameSquares = [cell];
  const value = squareValue(cell);
  for (const square of squares) {
    const digit = squareValue(square);
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

    if (document.querySelector(`#${pick}`).classList.contains('wrong-input')) {
      count--;
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