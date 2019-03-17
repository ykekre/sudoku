
import {badgeCounter as digitsMap} from '../../index';


export function showBadgeCount() {

  for (let index = 1; index < 10; index++) {

const digits = digitsMap();

document.querySelector(`.count-${index}`).textContent= digits.get(index);

  }
}


