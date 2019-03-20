
let level;
export  function setLevel() {

   level = this.dataset.level;
//*1. Hide modal
 $('#levelModal').modal('hide');


}

export function getLevel () {

  if(level) {

    return level;
  }
}