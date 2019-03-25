import {badgeCounter as digitsMap} from '../../index';

let clickedNumpad = 0;
export function showBadgeCount() {

  for (let index = 1; index < 10; index++) {

const digits = digitsMap();

document.querySelector(`.count-${index}`).textContent= digits.get(index);

  }
}


export function setNumpadValue(e) {

  const cell = e.target.closest('.list-group-item');

    if(cell.id !== 'numpad-clear') {

      clickedNumpad = parseInt(cell.textContent.charAt(1));

    } else {

      clickedNumpad = 'clear';
    }
}

export function getNumpadValue() {

  return clickedNumpad;
}

export function resetNumpad() {

  clickedNumpad = 0;
}