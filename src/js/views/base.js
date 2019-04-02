export const elements = {
  grid: document.querySelector(".grid"),
  level: document.querySelectorAll(".level"),
  "alert-container": document.querySelector("#alert-container"),
  squares: document.querySelectorAll("div.unsolved > input"),
  container: document.querySelector(".container"),
  numpad: document.querySelector(".numpad"),
  reset: document.querySelector("#btn-reset"),
  check: document.querySelector("#btn-checkErrors"),
  hint: document.querySelector("#btn-hint"),
  solve: document.querySelector("#btn-solve"),
  newGame: document.querySelector("#btn-newGame"),
  undo: document.querySelector(".undo"),
  alertlevels: document.querySelectorAll("div.alert > button")
};

export const DOMStrings = {
  checkErrorBtn: "btn-checkErrors",
  badgeErrorCount: "badge-error",
  resetBtn: "btn-reset",
  hintBtn: "btn-hint",
  badgeHintCount: "badge-hint"
};
