const win = new Audio("victory-sound.mp3");

export function playWinningSound() {
  return win.play();
}

export function stopWinningSound() {
  win.pause();
  win.currentTime = 0;
}
