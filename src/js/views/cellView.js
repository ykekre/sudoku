import { findPeers, squares } from "../vendor/sudoku";
import { onCellChange, state, badgeCounter } from "../..";
import { elements } from "./base";
import { showBadgeCount } from "./numpadView";
import { removeHighlightsAll, getSquareValue, sameSquares, highlightCells } from "./puzzleView";



export function onCellClick(e) {
  let cell = "";
  const clicked = e.target.closest(".col-1-of-9");

  if (clicked) {
    cell = clicked.id;
    state.currentCell = cell;
  } else {
    return;
  }

  //* if the clicked cell is prefilled (non input cell)- fade the numpad
  if (document.querySelector(`.${cell}`).classList.contains("unsolved")) {
    elements.numpad.classList.remove("halffade");
  } else {
    elements.numpad.classList.add("halffade");
  }

  removeHighlightsAll(
    "highlight-clicked",
    "highlight-peers",
    "highlight-same",
    "highlight-same-squares"
  );

  //*1.if cell has some value, calculate squares which have same cell value
  if (getSquareValue(cell) && !hasMorethanOneValue(cell)) {
    sameSquares(cell);
  }

  //*2. highlight clicked cell
  highlightCells([cell], "highlight-clicked");

  //*3. find peers and higlight them
  const peers = findPeers(cell);
  highlightCells(peers, "highlight-peers");
}

export function setCellValue(value) {
  const cell = state.currentCell;
  const thisCell = document.querySelector(`.${cell}`);
  const peers = findPeers(cell);

  removeHighlightsAll("highlight-same", "highlight-same-squares");
  highlightCells(peers, "highlight-peers");

  if (thisCell.classList.contains("unsolved")) {
    if (state.puzzle.editMode && value != "") {
      let editValues = [];

      if (
        thisCell.childNodes.length > 0 &&
        thisCell.childNodes[0].nodeName == "#text"
      ) {
        const val = getSquareValue(cell).toString();
        editValues.push(val);
        thisCell.textContent = "";
        thisCell.insertAdjacentHTML(
          "afterbegin",
          `<div class='edit'  id='digit${val}'>${val.toString()}</div>`
        );
      }

      editMode(cell, value.toString(), editValues);

      if (thisCell.childNodes.length > 1) {
        thisCell.classList.add("justify-content-between");
        removeColorWrongInput(cell);
      } else {
        thisCell.classList.remove("justify-content-between");
        sameSquares(cell);
      }

      badgeCounter();
      showBadgeCount();
      thisCell.style.color = state.currentColor;
      return;
    } else {
      thisCell.textContent = value;
    }

    thisCell.classList.remove("justify-content-between");
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
    editValues.splice(editValues.indexOf(value), 1);
  }

  edits = document.querySelectorAll(`div.${cell}> div`);

  if (editValues.length > 1 && editValues.length < 4) {
    for (const element of edits) {
      element.classList.add("three");
      element.classList.remove("six", "nine");
    }
  } else if (editValues.length >= 4 && editValues.length <= 6) {
    for (const element of edits) {
      element.classList.add("six");
      element.classList.remove("three", "nine");
    }
  } else if (editValues.length > 6) {
    for (const element of edits) {
      element.classList.add("nine");
      element.classList.remove("six", "three");
    }
  } else {
    for (const element of edits) {
      element.classList.remove("six", "three", "nine");
    }
  }
}

export function colorWrongInput(cell) {
  let square = document.querySelector(`#${cell}`);

  if (square) {
    square.style.color = null;
    square.classList.add("wrong-input");
  }
}

export function removeColorWrongInput(cell) {
  let square = document.querySelector(`#${cell}`);
  if (square) {
    if (square.classList.contains("wrong-input"))
      square.classList.remove("wrong-input");
  }
}

export function removeInlineStyledColor() {
  for (const square of squares) {
    document.querySelector(`.${square}`).style.color = null;
  }
}

export function hasMorethanOneValue(square) {
  const cell = document.querySelector(`.${square}`);

  if (cell.childNodes.length > 1) return true;
  else return false;
}