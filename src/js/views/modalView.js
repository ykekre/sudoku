import { controlPuzzle, undo } from "../../index";
import { elements } from "./base";
import "../../resources/sounds/button-click.mp3";
let level;

//? Load difficulty level modal
export function loadModal() {
  $("#levelModal").modal();
}

export function setLevel(e) {
  if (e.target.closest("button.level")) {
    level = e.target.dataset.level;

    //*1. Hide modal
    $("#levelModal").modal("hide");

    controlPuzzle();
  }
}

export function getLevel() {
  if (level) {
    return level;
  }
}

// //? Show puzzle on modal hide
//$("#levelModal").on("hide.bs.modal", controlPuzzle);

//?Show notification after game start
$(".toast.puzzle-load").on("show.bs.toast", function() {
  let level = getLevel();
  if (!level) level = "Easy";
  document.querySelector(
    ".puzzle-load .toast-body"
  ).textContent = `Game started with ${level} level`;
});

//?Show undo messgae after reset
$(".toast.puzzle-reset").on("show.bs.toast", function() {
  document.querySelector(
    ".puzzle-reset .toast-body"
  ).innerHTML = `Puzzle has been reset. <a href="javascript:;" class="undo" role="button">Undo</a>`;

  document.querySelector("a.undo").addEventListener("click", undo);
});

export function showWinAlert() {
  const markup = `<div class="alert alert-success fade show alert-dismissible" role="alert">
                    <h4 class="alert-heading">Well done!</h4>
                    <p>You have successfully completed this puzzle</p>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true"><i class="fas fa-window-close"></i></span>
                  </button>
                    <p class="mb-0">Solve another puzzle?</p>
                    <div class="btn-level-group mx-auto">
                      <button type="button" class="btn btn-primary rounded btn-lg level " data-level='easy' data-dismiss="alert">Easy</button>
                      <button type="button" class="btn btn-primary rounded btn-lg level" data-level='medium' data-dismiss="alert">Medium</button>
                      <button type="button" class="btn btn-primary rounded btn-lg level" data-level='hard' data-dismiss="alert">Hard</button>
                    </div>
                  </div>`;

  elements["alert-container"].insertAdjacentHTML("afterbegin", markup);
}
