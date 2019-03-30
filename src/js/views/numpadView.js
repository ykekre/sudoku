import {
  badgeCounter as digitsMap,
  state
} from '../../index';

import {
  elements
} from './base';

let clickedNumpad = 0;
const inputBlue = '#4c3b78cc';
const second = '#60A36C';
const third = '#D4847E';

//*show value on the badge for each digit
export function showBadgeCount() {
  for (let index = 1; index < 10; index++) {
    const digits = digitsMap();
    document.querySelector(`.count-${index}`).textContent = digits.get(index);
  }
}

//* What is the numpad cell which user clicked
export function setNumpadValue(e) {
  const cell = e.target.closest('.numpad-item');

  if (cell.id === 'numpad-clear') {

    clickedNumpad = 'clear';

  } else if (cell.id === 'numpad-draft') {

    if (!state.puzzle.editMode) {
      setEditMode(true);
    } else {
      setEditMode(false);
    }

  } else if (cell.id === 'numpad-color') {
    changeColor();

  } else {
    clickedNumpad = parseInt(cell.textContent.charAt(1));
  }
}

export function getNumpadValue() {
  return clickedNumpad;
}


//*After setting the value in cell reset it to zero
export function resetNumpad() {
  clickedNumpad = 0;
}

function changeColor() {

  if (elements.numpad.classList.contains('default-blue')) {
    elements.numpad.classList.add('second');
    elements.numpad.classList.remove('default-blue');

    state.currentColor = second;

  } else if (elements.numpad.classList.contains('second')) {
    elements.numpad.classList.add('third');
    elements.numpad.classList.remove('second');
    state.currentColor = third;
  } else {
    elements.numpad.classList.add('default-blue');
    elements.numpad.classList.remove('third');
    state.currentColor = inputBlue;
  }

}

export function setEditMode(option) {
  if (option) {
    state.puzzle.editMode = true;
    document.querySelector('i.fa-ban').classList.add('fade');
  } else {
    state.puzzle.editMode = false;
    document.querySelector('i.fa-ban').classList.remove('fade');
  }
}