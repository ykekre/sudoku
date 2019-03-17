
let level;
export function setLevel() {

   level = this.dataset.level;

}

export function getLevel () {

  if(level) {

    return level;
  }
}